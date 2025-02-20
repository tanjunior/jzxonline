// src/app/(admin)/products/create/page.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useRouter } from "next/navigation";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { CategoryBox } from "~/components/admin/CategoryBox";
import { productCreateSchema, ProductSchemaType } from "~/server/db/schema";

export default function CreateProductPage() {
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();
  const form = useForm<ProductSchemaType>({
    resolver: zodResolver(productCreateSchema)
  });

  const createProduct = api.product.createProduct.useMutation({
    onSuccess: () => {
      router.push("/admin/products");
    },
  });

  const onSubmit = async (data: ProductSchemaType) => {
    setIsCreating(true);
    data.categoryId != null && (await createProduct.mutateAsync(data));

    setIsCreating(false);
  };

  return (
    <div>
      <h1 className="mb-4 text-3xl font-bold">Create New Product</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Category</FormLabel>
                <CategoryBox form={form} field={field} />
                <FormMessage />
              </FormItem>
            )}
          />
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
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <Input
              id="description"
              type="text"
              {...form.register("description")}
              className="mt-1 block w-full"
            />
            {form.formState.errors.description && (
              <p className="text-sm text-red-500">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Price
            </label>
            <Input
              id="price"
              type="text"
              {...form.register("price")}
              className="mt-1 block w-full"
            />
            {form.formState.errors.price && (
              <p className="text-sm text-red-500">
                {form.formState.errors.price.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="imageUrl"
              className="block text-sm font-medium text-gray-700"
            >
              Image URL
            </label>
            <Input
              id="imageUrl"
              type="text"
              {...form.register("imageUrl")}
              className="mt-1 block w-full"
            />
            {form.formState.errors.imageUrl && (
              <p className="text-sm text-red-500">
                {form.formState.errors.imageUrl.message}
              </p>
            )}
          </div>
          <Button type="submit" disabled={isCreating}>
            {isCreating ? "Creating..." : "Create Product"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
