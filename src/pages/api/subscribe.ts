import { query as q } from "faunadb";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { faunaDB } from "../../services/fauna";
import { stripe } from "../../services/stripe";

type User = {
  ref: {
    id: string;
  };
  data: {
    stripe_customer_id: string;
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const session = await getSession({ req });
    const email = session?.user?.email ?? "";

    if (!email) {
      res.status(401).end("Unauthorized");
    }

    const user = await faunaDB.query<User>(
      q.Get(q.Match(q.Index("user_by_email"), q.Casefold(email)))
    );
    let stripeCustomerId = user.data.stripe_customer_id;

    if (!stripeCustomerId) {
      const stripeCustomer = await stripe.customers.create({
        email,
      });

      await faunaDB.query(
        q.Update(q.Ref(q.Collection("users"), user.ref.id), {
          data: {
            stripe_customer_id: stripeCustomer.id,
          },
        })
      );

      stripeCustomerId = stripeCustomer.id;
    }

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      billing_address_collection: "required",
      line_items: [
        {
          price: "price_1LwsM2AMjNtxbeO80ITWhvMF",
          quantity: 1,
        },
      ],
      mode: "subscription",
      allow_promotion_codes: true,
      cancel_url: `${req.headers.origin}${
        process.env.STRIPE_CANCEL_URL ?? "/"
      }`,
      success_url: `${req.headers.origin}${
        process.env.STRIPE_SUCCESS_URL ?? "/"
      }`,
    });

    return res.status(200).json({ sessionId: stripeCheckoutSession.id });
  }
  return res.status(405).end("Method Not Allowed");
}
