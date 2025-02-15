"use server";
import { and, eq } from "drizzle-orm";
import { redirect } from 'next/navigation'
import { signIn as naSignIn, signOut as naSignOut } from "~/server/auth";
import { db } from "~/server/db";
import { user, users } from "~/server/db/schema";

export async function signIn(
  provider: string,
  credentials?: {
    email: string;
    password: string;
  },
) {
  await naSignIn(provider, { ...credentials, redirectTo: "/" });
}

export async function signOut() {
  await naSignOut();
}

export const register = async (values: user) => {
  const user = await db.query.users.findFirst({
    where: eq(users.email, values.email),
  });

  if (user && user.password != null) {
    return { error: "User already exists", success: false };
  } else if (user && user.password == null) {
    const [update] = await db
      .update(users)
      .set({ password: values.password })
      .where(eq(users.email, values.email))
      .returning({ id: users.id });
    if (!update) {
      throw new Error("Failed to update user");
    }
    return redirect("/login");
  }

  try {
    const [newUser] = await db
      .insert(users)
      .values(values)
      .returning({ id: users.id });
    if (!newUser) {
      throw new Error("Failed to create user");
    }
    return { id: newUser.id, success: true };
  } catch (error) {
    return { error: error, success: false };
  }
};
