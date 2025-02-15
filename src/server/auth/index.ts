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

const {
  auth: uncachedAuth,
  handlers,
  signIn,
  signOut,
} = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  //   session: { strategy: "jwt" },
  ...authConfig,
});

const auth = cache(uncachedAuth);

export { auth, handlers, signIn, signOut };
