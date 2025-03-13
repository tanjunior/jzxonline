import React, { Suspense } from "react";
import { api, HydrateClient } from "~/trpc/server";
import List from "~/components/shop/List";

export default function page() {
  void api.product.getAllProducts.prefetch({ page: 9 });
  void api.category.getAllCategories.prefetch();
  return (
    <div>
      <HydrateClient>
        <Suspense>
          <List />
        </Suspense>
      </HydrateClient>
    </div>
  );
}
