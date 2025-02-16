import NextAuth, { User } from "next-auth";
import { cache } from "react";
import { drizzleAdapter } from "~/server/db";
import { authConfig } from "./config";

const {
  auth: uncachedAuth,
  handlers,
  signIn,
  signOut,
} = NextAuth({
  adapter: drizzleAdapter,
  ...authConfig,
});

const auth = cache(uncachedAuth);

export { auth, handlers, signIn, signOut };
