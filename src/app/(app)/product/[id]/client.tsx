"use client";

import React from "react";
import { api } from "~/trpc/react";
import Image from "next/image";
import { unstable_ViewTransition as ViewTransition } from "react";
import AddToCart from "./AddToCart";
import { Badge } from "~/components/ui/badge";

export default function client({ id }: { id: number }) {
  const [product] = api.product.getProductById.useSuspenseQuery({ id });

  if (!product) {
    return null;
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="relative aspect-square">
        <ViewTransition name={`item-${id}`}>
          <Image
            src={"/placeholder.png"}
            alt={product.name}
            fill
            priority
            className="rounded-lg object-cover"
            id={`item-${id}`}
          />
        </ViewTransition>
      </div>
      <div className="flex flex-col justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold">{product.name}</h1>
          <p className="mb-4 text-xl font-semibold text-primary">
            ${product.price}
          </p>
          <p className="mb-4 text-gray-600">{product.description}</p>
          <div className="mb-4 flex gap-2">
            <Badge variant="secondary">{product.categoryId}</Badge>
            {/* <Badge variant="outline">{product.subCategory}</Badge> */}
          </div>
        </div>
        <AddToCart {...product} />
      </div>
    </div>
  );
}
