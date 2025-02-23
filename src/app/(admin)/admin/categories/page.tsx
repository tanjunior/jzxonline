import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import { redirect } from "next/navigation";
import AdminCategoriesPage from "./table";
// import { Suspense } from "react";

export default async function Home() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  void api.category.getAllCategories.prefetch();

  return (
    <HydrateClient>
      {/* <Suspense fallback={<div>Loading...</div>}> */}
      <AdminCategoriesPage />
      {/* </Suspense> */}
    </HydrateClient>
  );
}
