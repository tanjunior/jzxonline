// src/app/(admin)/products/[id]/edit/page.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useParams, useRouter } from "next/navigation";
import {
  productUpdateSchema,
  type ProductUpdateSchemaType,
} from "~/server/db/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { CategoryBox } from "~/components/admin/CategoryBox";

export default function EditProductPage() {
  const { id } = useParams();
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();
  const { data: product } = api.product.getProductById.useQuery({
    id: parseInt(id as string),
  });

  const form = useForm<ProductUpdateSchemaType>({
    resolver: zodResolver(productUpdateSchema),
    // defaultValues: {
    //   description: product?.description ?? undefined,
    //   imageUrl: product?.imageUrl ?? undefined,
    //   name: product?.name ?? "",
    //   price: product?.price.toString() || "",
    //   categoryId: product?.categoryId ?? undefined,
    //   id: id as string,
    // },
    values: {
      description: product?.description ?? "",
      imageUrl: product?.imageUrl ?? "",
      name: product?.name ?? "",
      price: product?.price.toString() ?? "",
      categoryId: product?.categoryId ?? undefined,
      id: parseInt(id as string),
    },
    mode: "onChange",
  });

  const updateProduct = api.product.updateProduct.useMutation({
    onSuccess: () => {
      router.push("/admin/products");
    },
  });

  const onSubmit = async (data: ProductUpdateSchemaType) => {
    setIsUpdating(true);
    await updateProduct.mutateAsync(data);
    setIsUpdating(false);
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Product</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <CategoryBox
                    field={field}
                    onSelectAction={(categoryId) =>
                      form.setValue("categoryId", categoryId)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input {...field} type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? "Updating..." : "Update Product"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
