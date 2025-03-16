import { redirect } from "next/navigation";
import React from "react";
import { auth } from "~/server/auth";

export default async function page() {
  const session = await auth();
  if (!session) redirect("/login");
  return <div>page</div>;
}
