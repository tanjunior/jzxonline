import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import AdminProductsPage from "./table";
import { redirect } from "next/navigation";
// import { Suspense } from "react";

export default async function Home() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  void api.product.getAllProducts.prefetch();

  return (
    <HydrateClient>
      {/* <Suspense fallback={<div>Loading...</div>}> */}
      <AdminProductsPage />
      {/* </Suspense> */}
    </HydrateClient>
  );
}
