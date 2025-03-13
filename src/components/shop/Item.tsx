"use client";

import Image from "next/image";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "~/hooks/useCart";
import type { ViewMode } from "~/lib/types";
import type { ProductSelect } from "~/server/db/schema";
import { unstable_ViewTransition as ViewTransition } from "react";

const productItemVariants = cva("", {
  variants: {
    view: {
      grid: "overflow-hidden flex flex-col h-full",
      list: "flex items-center w-full h-24",
    },
  },
  defaultVariants: {
    view: "grid",
  },
});

const imageVariants = cva("", {
  variants: {
    view: {
      grid: "aspect-square relative w-full h-48",
      list: "w-24 h-24 relative flex-shrink-0",
    },
  },
  defaultVariants: {
    view: "grid",
  },
});

const contentVariants = cva("", {
  variants: {
    view: {
      grid: "p-4 flex-grow flex flex-col",
      list: "flex-grow flex flex-row items-center justify-between p-4",
    },
  },
  defaultVariants: {
    view: "grid",
  },
});

type SearchParams = {
  search: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  view: ViewMode;
};

interface ProductItemProps extends VariantProps<typeof productItemVariants> {
  product: ProductSelect;
  searchParams: SearchParams;
}

export default function ProductItem({
  product,
  searchParams,
}: ProductItemProps) {
  const view = searchParams.view;
  const { addItem, updateItemQuantity, items, isLoading } = useCart();
  const cartItem = items.find((item) => item.id === product.id);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartItem) {
      void updateItemQuantity(product.id, cartItem.quantity + 1);
    } else {
      void addItem({ ...product, quantity: 1 }); // This now handles both local state and server sync
    }
  };

  return (
    <Card className={productItemVariants({ view })}>
      <Link
        href={{
          pathname: `/product/${product.id}`,
          query: { from: `/product?${new URLSearchParams(searchParams)}` },
        }}
        prefetch={true}
        className={
          view === "grid"
            ? "flex h-full flex-col"
            : "flex h-full w-full items-center"
        }
      >
        <div className={imageVariants({ view })}>
          <ViewTransition name={`item-${product.id}`}>
            <Image
              src={"/placeholder.png"}
              alt={product.name}
              fill
              className="object-cover"
            />
          </ViewTransition>
        </div>
        <CardContent className={contentVariants({ view })}>
          <div className={view === "grid" ? "" : "mr-4 flex-grow"}>
            <h2
              className={
                view === "grid"
                  ? "mb-2 line-clamp-1 text-lg font-semibold"
                  : "mb-0.5 line-clamp-1 text-base font-semibold"
              }
            >
              {product.name}
            </h2>
            <p
              className={`text-sm text-muted-foreground ${
                view === "grid" ? "mb-2 line-clamp-2" : "mb-0.5 line-clamp-1"
              }`}
            >
              {product.description}
            </p>
            <div className="mb-2 flex flex-wrap gap-1">
              <Badge variant="secondary" className="text-xs">
                {product.categoryId}
              </Badge>
              {/* <Badge variant="outline" className="text-xs">
                {product.subCategory}
              </Badge> */}
            </div>
          </div>
          {view === "grid" && (
            <div className="mt-auto flex items-center justify-between">
              <p className="text-lg font-bold text-primary">${product.price}</p>
              <Button size="sm" onClick={handleAddToCart} disabled={isLoading}>
                {isLoading
                  ? "Adding..."
                  : cartItem
                    ? `Add (${cartItem.quantity})`
                    : "Add to Cart"}
              </Button>
            </div>
          )}
          {view === "list" && (
            <div className="flex items-center space-x-2">
              <p className="text-base font-bold text-primary">
                ${product.price}
              </p>
              <Button size="sm" onClick={handleAddToCart} disabled={isLoading}>
                {isLoading
                  ? "Adding..."
                  : cartItem
                    ? `Add (${cartItem.quantity})`
                    : "Add to Cart"}
              </Button>
            </div>
          )}
        </CardContent>
      </Link>
    </Card>
  );
}
