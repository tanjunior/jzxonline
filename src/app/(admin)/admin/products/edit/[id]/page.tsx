// src/app/(admin)/products/[id]/edit/page.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useRouter } from "next/navigation";
import { productCreateSchema, type ProductSchemaType } from "~/server/db/schema";
import { Form, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { CategoryBox } from "~/components/admin/CategoryBox";



interface Props {
  params: {
    id: string;
  };
}

export default function EditProductPage({ params }: Props) {
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();
  const { id } = params;
  const { data: product } = api.product.getProductById.useQuery({
    id: parseInt(id),
  });

  const form = useForm<ProductSchemaType>({
    resolver: zodResolver(productCreateSchema),
    defaultValues: {
      description: product?.description ?? undefined,
      imageUrl: product?.imageUrl ?? undefined,
      name: product?.name,
      price: product?.price,
      categoryId: product?.categoryId ?? undefined
    },
    values: {
      description: product?.description ?? undefined,
      imageUrl: product?.imageUrl ?? undefined,
      name: product?.name ?? "",
      price: product?.price ?? "",
      categoryId: product?.categoryId ?? undefined
    },
    mode: "onChange",
  });

  const updateProduct = api.product.updateProduct.useMutation({
    onSuccess: () => {
      router.push("/admin/products");
    },
  });

  const onSubmit = async (data: ProductSchemaType) => {
    setIsUpdating(true);
    await updateProduct.mutateAsync({ id: parseInt(id), ...data });
    setIsUpdating(false);
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="mb-4 text-3xl font-bold">Edit Product</h1>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Language</FormLabel>
              <CategoryBox form={form} field={field}/>
              <FormDescription>
                This is the language that will be used in the dashboard.
              </FormDescription>
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
            <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
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
            <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
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
            <p className="text-sm text-red-500">{form.formState.errors.price.message}</p>
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
            <p className="text-sm text-red-500">{form.formState.errors.imageUrl.message}</p>
          )}
        </div>
        <Button type="submit" disabled={isUpdating}>
          {isUpdating ? "Updating..." : "Update Product"}
        </Button>
      </form>
      </Form>
    </div>
  );
}
