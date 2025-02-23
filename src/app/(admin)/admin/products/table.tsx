"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { api } from "~/trpc/react";
import { DataTable } from "~/components/ui/data-table";
import { productColumns } from "./productColumns";

export default function AdminProductsPage() {
  const [products] = api.product.getAllProducts.useSuspenseQuery();
  const { mutate: seed } = api.seed.seedDatabase.useMutation();
  const utils = api.useUtils();

  return (
    <div className="px-2">
      <h1 className="mb-4 text-3xl font-bold">Products</h1>
      <DataTable columns={productColumns} data={products} filterKey={"name"}>
        <Link href="/admin/products/create">
          <Button>Create New Product</Button>
        </Link>
      </DataTable>
      {products.length === 0 && (
        <div className="mt-4 text-center">
          <Button
            onClick={() =>
              seed(undefined, {
                onSuccess() {
                  void utils.product.invalidate();
                },
              })
            }
          >
            Seed Database
          </Button>
        </div>
      )}
    </div>
  );
}
