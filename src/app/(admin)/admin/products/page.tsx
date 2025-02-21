// src/app/(admin)/products/page.tsx
"use client"
import { Button } from "~/components/ui/button";
import Link from "next/link";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { api } from "~/trpc/react";
import { useEffect, useState } from "react";
import { type ProductSelect } from "~/server/db/schema";

const columns: ColumnDef<ProductSelect>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <Link href={`/admin/products/edit/${row.original.id}`}>
        <Button>Edit</Button>
      </Link>
    ),
  },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductSelect[]>([])
  const { data } = api.product.getAllProducts.useQuery();

  useEffect(() => {
    if (!data) return
    setProducts(data)
  }, [data])
  

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Products</h1>
      <Link href="/admin/products/create">
        <Button>Create New Product</Button>
      </Link>
      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      className="px-4 py-2 font-medium text-left [&[data-state=active]]:bg-muted/50"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b last:border-0">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
