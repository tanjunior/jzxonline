// src/app/(admin)/categories/create/page.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useRouter } from "next/navigation";
import {
  Form
} from "~/components/ui/form";
import { categoryInsertSchema, type CategorySchemaType } from "~/server/db/schema";

export default function CreateCategoryPage() {
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();
  const form = useForm<CategorySchemaType>({
    resolver: zodResolver(categoryInsertSchema)
  });

  const createCategory = api.category.createCategory.useMutation({
    onSuccess: () => {
      router.push("/admin/categories");
    },
  });

  const onSubmit = async (data: CategorySchemaType) => {
    setIsCreating(true);
    await createCategory.mutateAsync(data);

    setIsCreating(false);
  };

  return (
    <div>
      <h1 className="mb-4 text-3xl font-bold">Create New Category</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <Input
              id="name"
              type="text"
              {...form.register("name")}
              className="mt-1 block w-full"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>
          <Button type="submit" disabled={isCreating}>
            {isCreating ? "Creating..." : "Create Category"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
