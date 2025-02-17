import {
  CredentialsSignin,
  type DefaultSession,
  type NextAuthConfig,
} from "next-auth";
import GitHubProvider from "next-auth/providers/github";
// import DiscordProvider from "next-auth/providers/discord";
import CredentialsProvider from "next-auth/providers/credentials";
import { decode, encode } from "next-auth/jwt";
import { env } from "~/env";
import { db, drizzleAdapter } from "~/server/db";
import { v4 as uuid } from "uuid";
import { userLoginForm } from "~/server/db/schema";
import { NextResponse } from "next/server";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    // ...other properties
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    // id: string;
    role: string;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  adapter: drizzleAdapter,
  providers: [
    // DiscordProvider,
    GitHubProvider({
      allowDangerousEmailAccountLinking: true
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { success, data, error } =
          await userLoginForm.safeParseAsync(credentials);
        if (!success) throw new Error(error.message);

        const user = await db.query.users.findFirst({
          where(users, { eq, and }) {
            return and(
              eq(users.email, data.email),
              eq(users.password, data.password),
            );
          },
          columns: {
            id: true,
            name: true,
            role: true,
            email: true,
            image: true,
          },
        });
        if (!user)
          throw new CredentialsSignin({ cause: "Invalid Email or Password" });

        // TODO: decrypt in trpc
        // if (!(await compare(credentials.password as string, user.password)))
        //   return null;

        // console.log("[CredentialsProvider][authorize]: "+JSON.stringify(user, null, 2));
        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // console.log(
      //   `[callbacks][jwt][session]: ${JSON.stringify(session, null, 2)}`,
      // );
      // console.log(`[callbacks][jwt][user]: ${JSON.stringify(user, null, 2)}`);
      // console.log(`[callbacks][jwt][token]: ${JSON.stringify(token, null, 2)}`);
      // console.log(`[callbacks][jwt][trigger]: ${JSON.stringify(trigger, null, 2)}`);
      // console.log(
      //   `[callbacks][jwt][account]: ${JSON.stringify(account, null, 2)}`,
      // );

      if (account?.type == "credentials") {
        const sessionToken = uuid();
        const session = await drizzleAdapter.createSession!({
          userId: token.sub!,
          sessionToken: sessionToken,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        });

        if (!session) throw new Error("session not created");
        token.sessionToken = session.sessionToken
      }

      return token;
    },
    async session({ session, user }) {
      // console.log(
      //   `[callbacks][session][session]: ${JSON.stringify(session, null, 2)}`,
      // );
      // console.log(
      //   `[callbacks][session][user]: ${JSON.stringify(user, null, 2)}`,
      // );
      // console.log(
      //   `[callbacks][session][token]: ${JSON.stringify(token, null, 2)}`,
      // );
      const userSession = {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          role: user.role,
        },
      };
      return userSession;
    },
  },
  jwt: {
    async encode(params) {
      if (params.token?.sessionToken) {
        return params.token.sessionToken as string
      }
      return encode(params)
    },
  },
  pages: {
    signIn: "/login", // Redirect here if not authenticated
    // signOut: "/", // Redirect here after signing out
    // error: "/auth/error", // Redirect here on error (e.g., failed login)
    // verifyRequest: "/auth/verify", // Redirect here for email verification
    // newUser: "/", // Redirect here after initial sign-up
  },
  // trustHost: true,
  secret: env.AUTH_SECRET,
  // debug: true,
} satisfies NextAuthConfig;
