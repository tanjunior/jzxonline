import {
  CredentialsSignin,
  type User,
  type DefaultSession,
  type NextAuthConfig,
} from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import DiscordProvider from "next-auth/providers/discord";
import CredentialsProvider from "next-auth/providers/credentials";
import { encode as defaultEncode } from "next-auth/jwt";
import { env } from "~/env";
import { db, drizzleAdapter } from "~/server/db";
import { v4 as uuid } from "uuid";
import { userLoginForm } from "~/server/db/schema";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */

declare module "next-auth" {
  interface Session {
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
    id: string;
    role: string;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  // session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
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
    jwt: async ({ token, account, user, session }) => {
      console.log(
        `[callbacks][jwt][session]: ${JSON.stringify(session, null, 2)}`,
      );
      console.log(`[callbacks][jwt][user]: ${JSON.stringify(user, null, 2)}`);
      console.log(`[callbacks][jwt][token]: ${JSON.stringify(token, null, 2)}`);
      console.log(
        `[callbacks][jwt][account]: ${JSON.stringify(account, null, 2)}`,
      );

      if (account?.type == "credentials") {
        const sessionToken = uuid();
        const session = await drizzleAdapter.createSession!({
          userId: user.id || token.sub || account.providerAccountId,
          sessionToken: sessionToken,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        });

        if (!session) throw new Error("session not created");
        token.sessionToken = session.sessionToken;
        token.role = user.role
      }

      return token;
    },
    session: ({ session, user, token }) => {
      console.log(
        `[callbacks][session][session]: ${JSON.stringify(session, null, 2)}`,
      );
      console.log(
        `[callbacks][session][user]: ${JSON.stringify(user, null, 2)}`,
      );
      console.log(
        `[callbacks][session][token]: ${JSON.stringify(token, null, 2)}`,
      );
      return {
        ...session,
        user: {
          ...session.user,
          id: user ? user.id : token.sub,
          role: user ? user.role : token.role,
        },
      };
    },
    // authorized: async ({ auth, request }) => {
    //   // const url = request.nextUrl;

    //   // const req = await request.json()
    //   // console.log(`[callbacks][authorized][req]: ${JSON.stringify(req, null, 2)}`);
    //   console.log(`[callbacks][authorized][auth]: ${JSON.stringify(auth, null, 2)}`);

    //   return true;
    // },
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 30,
    encode: async (params) => {
      console.log(`[jwt][encode][params]: ${JSON.stringify(params, null, 2)}`);
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
  secret: env.AUTH_SECRET,
  // debug: true,
} satisfies NextAuthConfig;
