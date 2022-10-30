import { query as q } from "faunadb";
import { faunaDB } from "../../../services/fauna";
import { stripe } from "../../../services/stripe";

export async function saveSubscription(
  subscriptionId: string,
  customerId: string,
  createAction = false
) {
  try {
    const userRef = await faunaDB.query(
      q.Select(
        "ref",
        q.Get(q.Match(q.Index("user_by_stripe_customer_id"), customerId))
      )
    );
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const subscriptionData = {
      id: subscription.id,
      userId: userRef,
      status: subscription.status,
      price_id: subscription.items.data[0].price.id,
    };

    if (createAction) {
      await faunaDB.query(
        q.Create(q.Collection("subscriptions"), { data: subscriptionData })
      );
      return;
    }

    await faunaDB.query(
      q.Replace(
        q.Select(
          "ref",
          q.Get(q.Match(q.Index("subscription_by_user_ref"), userRef))
        ),
        { data: subscriptionData }
      )
    );
  } catch (err) {
    const error = err as Error;
    console.error(error.message);
  }
}
