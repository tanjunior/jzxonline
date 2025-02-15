import NextAuth from "next-auth";
import { cache } from "react";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "~/server/db/schema";
import { authConfig } from "./config";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "~/server/db";
import { v4 as uuid } from "uuid";
import { encode as defaultEncode } from "next-auth/jwt";

const adapter = DrizzleAdapter(db, {
  usersTable: users,
  accountsTable: accounts,
  sessionsTable: sessions,
  verificationTokensTable: verificationTokens,
});


const {
  auth: uncachedAuth,
  handlers,
  signIn,
  signOut,
} = NextAuth({
  adapter: adapter,
//   session: { strategy: "database" },
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
        // role: user.role
      },
    }),
    jwt: ({ token, account }) => {
      console.log(`[config][jwt][token]: ${JSON.stringify(token, null, 2)}`)
      console.log(`[config][jwt][account]: ${JSON.stringify(account, null, 2)}`)
      if (account?.provider == "credentials") {
        token.credentials = true;
      }
      return token;
    },
  },
  jwt: {
    encode: async (params) => {
      console.log(`[config][encode][params]: ${JSON.stringify(params, null, 2)}`)
      if (params.token?.credentials) {
        if (!params.token.sub) {
          throw new Error("no sub");
        }

        const sessionToken = uuid();
        const session = await adapter.createSession!({
          userId: params.token.sub,
          sessionToken: sessionToken,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        });

        if (!session) throw new Error("session not created");
        return sessionToken;
      }
      return defaultEncode(params);
    },
  },
  pages: {
    signIn: "/login", // Redirect here if not authenticated
    // signOut: "/", // Redirect here after signing out
    // error: "/auth/error", // Redirect here on error (e.g., failed login)
    // verifyRequest: "/auth/verify", // Redirect here for email verification
    // newUser: "/", // Redirect here after initial sign-up
  },
  ...authConfig,
});

const auth = cache(uncachedAuth);

export { auth, handlers, signIn, signOut };
