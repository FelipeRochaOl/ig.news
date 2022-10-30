import { Client } from "faunadb";

export const faunaDB = new Client({
  secret: process.env.FAUNA_SECRET ?? "",
});
