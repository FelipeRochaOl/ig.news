import Stripe from "stripe";
import packjson from "../../package.json";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2022-08-01",
  appInfo: {
    name: "Ig.news",
    version: packjson.version,
  },
});
