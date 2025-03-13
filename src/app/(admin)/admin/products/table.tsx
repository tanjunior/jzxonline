"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { api } from "~/trpc/react";
import { DataTable } from "~/components/ui/data-table";
import { productColumns } from "./productColumns";

export default function AdminProductsPage() {
  const [products] = api.product.getAllProducts.useSuspenseQuery({
    page: 1,
    pageSize: 20,
  });

  return (
    <div className="px-2">
      <h1 className="mb-4 text-3xl font-bold">Products</h1>
      <DataTable
        columns={productColumns}
        data={products.items}
        filterKey={"name"}
      >
        <Link href="/admin/products/create">
          <Button>Create New Product</Button>
        </Link>
      </DataTable>
    </div>
  );
}
