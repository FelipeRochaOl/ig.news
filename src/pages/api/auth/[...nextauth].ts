import { query as q } from "faunadb";
import type { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

import { faunaDB } from "../../../services/fauna";

const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
      // @ts-ignore
      scope: "read:user",
    }),
  ],
  callbacks: {
    async session({ session }) {
      let userActiveSubscription = null;
      try {
        userActiveSubscription = await faunaDB.query(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index("subscription_by_user_ref"),
                // get ref
                q.Select(
                  "ref",
                  q.Get(
                    q.Match(
                      q.Index("user_by_email"),
                      q.Casefold(session.user?.email ?? "")
                    )
                  )
                )
              ),
              q.Match(q.Index("subscription_by_status"), "active"),
            ])
          )
        );
      } catch {}

      return {
        ...session,
        activeSubscription: userActiveSubscription,
      };
    },
    async signIn({ user: { email } }) {
      try {
        await faunaDB.query(
          q.If(
            // conditional
            q.Not(
              q.Exists(
                q.Match(q.Index("user_by_email"), q.Casefold(email ?? ""))
              )
            ),
            // then
            q.Create(q.Collection("users"), { data: { email } }),
            // else
            q.Get(q.Match(q.Index("user_by_email"), q.Casefold(email ?? "")))
          )
        );
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
  },
};

export default async function auth(
  request: NextApiRequest,
  response: NextApiResponse
) {
  return await NextAuth(request, response, authOptions);
}
