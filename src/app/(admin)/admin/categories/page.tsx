// src/app/(admin)/categories/page.tsx
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
import { type CategorySelect } from "~/server/db/schema";

const columns: ColumnDef<CategorySelect>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <Link href={`/admin/categories/edit/${row.original.id}`}>
        <Button>Edit</Button>
      </Link>
    ),
  },
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategorySelect[]>([])
  const { data } = api.category.getAllCategories.useQuery();

  useEffect(() => {
    if (!data) return
    setCategories(data)
  }, [data])
  

  const table = useReactTable({
    data: categories,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Categories</h1>
      <Link href="/admin/categories/create">
        <Button>Create New Category</Button>
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
