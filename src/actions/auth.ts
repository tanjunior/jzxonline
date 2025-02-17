"use server";
import { eq } from "drizzle-orm";
import { CredentialsSignin } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect, RedirectType } from "next/navigation";
import { type z, ZodError } from "zod";
import { signIn as naSignIn, signOut as naSignOut } from "~/server/auth";
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
    if (isRedirectError(error)) {
      throw error;
    } else if (error instanceof CredentialsSignin) {
      return error.cause;
    } else if (error instanceof ZodError) {
      return error.message;
    } else if (error instanceof Error) {
      console.log(error);
      return error.message;
    } else if (typeof error === "string") {
      return error;
    } else {
      return "something went wrong";
    }
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

  if (!user) {
    const [newUser] = await db
      .insert(users)
      .values(values)
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
    .set({ password: values.password })
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
