import Stripe from "stripe";
import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";

import { stripe } from "../../services/stripe";
import { saveSubscription } from "./_lib/managerSubscription";

async function buffer(readable: Readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export const config = {
  api: {
    bodyParser: false,
  },
};

const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method === "POST") {
    const streamBuffer = await buffer(req);
    const secret = req.headers["stripe-signature"] as string;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;
    let event: Stripe.Event | undefined;

    try {
      event = stripe.webhooks.constructEvent(
        streamBuffer,
        secret,
        endpointSecret
      );
    } catch (err) {
      const error = err as Error;
      return res.status(400).send(`Webhook Error: ${error.message}.`);
    }

    if (!event) {
      return res.status(400).send("Stripe event is undefined.");
    }

    const {
      data: { object },
      type,
    } = event as Stripe.Event;

    try {
      if (relevantEvents.has(event.type)) {
        switch (type) {
          case "customer.subscription.updated":
          case "customer.subscription.deleted":
            console.log({ type });
            const subscription = object as Stripe.Subscription;
            await saveSubscription(
              subscription.id,
              subscription.customer.toString()
            );
            break;
          case "checkout.session.completed":
            const checkoutSessionCompleted = object as Stripe.Checkout.Session;
            const subscriptionId =
              checkoutSessionCompleted.subscription!.toString();
            const customerId = checkoutSessionCompleted.customer!.toString();
            await saveSubscription(subscriptionId, customerId, true);
            break;
          default:
            throw new Error("Unhandled event.");
        }
      }
    } catch (err) {
      console.error("webhook handler", err);
      return res.json({ error: "Webhook handler failed." });
    }
    return res.json({ received: true });
  }
  return res.status(405).send("Method Not Allowed");
}
