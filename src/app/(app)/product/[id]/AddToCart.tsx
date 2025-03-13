"use client";

import React from "react";
import { Button } from "~/components/ui/button";
import { useCart } from "~/hooks/useCart";
import type { ProductSelect } from "~/server/db/schema";

export default function AddToCart(product: ProductSelect) {
  const { addItem, updateItemQuantity, isLoading, items } = useCart();
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
    <Button size="lg" onClick={handleAddToCart} disabled={isLoading}>
      {isLoading
        ? "Adding..."
        : cartItem
          ? `Add (${cartItem.quantity})`
          : "Add to Cart"}
    </Button>
  );
}
