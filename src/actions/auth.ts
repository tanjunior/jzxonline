"use server";
import { eq } from "drizzle-orm";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect, RedirectType } from "next/navigation";
import { type z } from "zod";
import { generateSalt, hashPassword } from "~/lib/utils";
import { signIn as naSignIn, signOut as naSignOut } from "~/server/auth";
import {
  CouldNotParseError,
  InvalidPasswordError,
  MemberNotActiveError,
  MemberNotFoundError,
} from "~/server/auth/config";
import { db } from "~/server/db";
import { accounts, type userLoginForm, users } from "~/server/db/schema";

export async function signIn(
  provider: string,
  credentials?: z.infer<typeof userLoginForm>,
) {
  try {
    await naSignIn(provider, {
      ...credentials,
      redirectTo: "/admin",
    });
  } catch (error) {
    // see https://github.com/vercel/next.js/issues/55586#issuecomment-1869024539
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof CouldNotParseError) {
      return "asd";
    }

    if (error instanceof MemberNotFoundError) {
      return "The email address you entered is not associated with an existing member account.";
    }

    if (error instanceof MemberNotActiveError) {
      return "Your account has not yet been approved or has been disabled. Please contact the administrators for more information.";
    }

    if (error instanceof InvalidPasswordError) {
      return "The password you entered is incorrect.";
    }

    return "Something went wrong while checking your credentials. Please try again later.";
  }
}

export async function signOut() {
  await naSignOut();
}

export const register = async (values: { email: string; password: string }) => {
  const user = await db.query.users.findFirst({
    where(users, { eq }) {
      return eq(users.email, values.email);
    },
  });
  const salt = await generateSalt();
  const password = await hashPassword(values.password, salt);

  if (!user) {
    const [newUser] = await db
      .insert(users)
      .values({ ...values, password, salt })
      .returning({ id: users.id });

    if (!newUser) {
      return {
        error: `Fail to register please try again.`,
        success: false,
      };
    }

    const [account] = await db
      .insert(accounts)
      .values({
        userId: newUser.id,
        type: "credentials",
        provider: "credentials",
        providerAccountId: newUser.id,
      })
      .returning();

    if (!account) {
      return {
        error: `Fail to register please try again.`,
        success: false,
      };
    }

    return { id: newUser.id, success: true };
  }

  if (user.password != null) {
    // return {
    //   error: `Account registered with ${values.email} already exist.`,
    //   success: false,
    //   redirect: "/login",
    // };
    return redirect("/login", RedirectType.replace);
  }

  const [update] = await db
    .update(users)
    .set({ password, salt })
    .where(eq(users.email, values.email))
    .returning({ id: users.id });
  if (!update) {
    return { error: "Failed to update user", success: false };
  }
  const [account] = await db
    .insert(accounts)
    .values({
      userId: user.id,
      type: "credentials",
      provider: "credentials",
      providerAccountId: user.id,
    })
    .returning();

  if (!account) {
    return {
      error: `Fail to link user to account, please try again.`,
      success: false,
    };
  }
  // return { id: user.id, success: true };
  return redirect("/login", RedirectType.replace);
};
