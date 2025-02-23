"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CategoryBox } from "~/components/admin/CategoryBox";
import {
  productInsertSchema,
  type ProductInsertSchemaType,
} from "~/server/db/schema";

export default function CreateProductPage() {
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();
  const form = useForm<ProductInsertSchemaType>({
    resolver: zodResolver(productInsertSchema),
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
      price: "",
    },
  });

  const createProduct = api.product.createProduct.useMutation({
    onSuccess: () => {
      router.push("/admin/products");
    },
  });

  const onSubmit = async (data: ProductInsertSchemaType) => {
    console.log(data);
    setIsCreating(true);
    await createProduct.mutateAsync(data);
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Create New Product</h1>
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
          <Button type="submit" disabled={isCreating}>
            {isCreating ? "Creating..." : "Create Product"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
