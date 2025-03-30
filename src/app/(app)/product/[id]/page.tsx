import { api } from "~/trpc/server";
import BackButton from "./BackButton";
import Client from "./client";
import { Suspense } from "react";

export const dynamic = "force-static";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  void api.product.getProductById.prefetch({ id: parseInt(id) });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* <Client id={parseInt(id)} /> */}
      {id}
      <Suspense>
        <BackButton />
      </Suspense>
    </div>
  );
}
