import { type DefaultSession, type NextAuthConfig } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import DiscordProvider from "next-auth/providers/discord";
import CredentialsProvider from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "~/server/db/schema";
import { env } from "~/env";

import { v4 as uuid } from "uuid";
import { encode as defaultEncode } from "next-auth/jwt";

import { db } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  type UserRole = "admin" | "user";

  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    // ...other properties
    // role: string;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    DiscordProvider,
    GitHubProvider({
      clientId: env.AUTH_GITHUB_ID,
      clientSecret: env.AUTH_GITHUB_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        if (!credentials.email || !credentials.password) return null;
        console.log(credentials);
        const user = await db.query.users.findFirst({
          where(users, { eq, and }) {
            return and(
              eq(users.email, credentials.email as string),
              eq(users.password, credentials.password as string),
            );
          },
        });
        if (!user) return null;

        // TODO: decrypt in trpc
        // if (!(await compare(credentials.password as string, user.password)))
        //   return null;

        // console.log("returning", user)
        return {
          email: user.email,
          name: user.name,
          id: user.id,
          role: user.role,
        };
      },
      type: "credentials",
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
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

        const adapter = DrizzleAdapter(db, {
          usersTable: users,
          accountsTable: accounts,
          sessionsTable: sessions,
          verificationTokensTable: verificationTokens,
        });

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
  // secret: env.AUTH_SECRET,
  debug: true,
  // debug: true
} satisfies NextAuthConfig;
