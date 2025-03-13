import { api } from "~/trpc/server";
import BackButton from "./BackButton";
import Client from "./client";
import { Suspense } from "react";

// export const dynamic = 'force-static'
// export const dynamicParams = false

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  void api.product.getProductById.prefetch({ id: parseInt(id) });

  return (
    <div className="container mx-auto px-4 py-8">
      <Client id={parseInt(id)} />
      <Suspense>
        <BackButton />
      </Suspense>
    </div>
  );
}
