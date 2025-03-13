"use client";

import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingCart, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CartItem } from "./CartItem";
import Link from "next/link";

export default function Cart() {
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative"
          aria-label="Open cart"
        >
          <ShoppingCart className="h-4 w-4" />
          {totalItems > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center p-0 text-xs"
            >
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col sm:max-w-md">
        <SheetHeader className="px-1">
          <SheetTitle className="flex items-center gap-2 text-xl">
            <ShoppingBag className="h-5 w-5" />
            Your Cart
          </SheetTitle>
          <SheetDescription>
            {items.length === 0
              ? "Your cart is empty."
              : `You have ${totalItems} item${totalItems !== 1 ? "s" : ""} in your cart.`}
          </SheetDescription>
        </SheetHeader>

        <Separator className="my-4" />

        {items.length > 0 ? (
          <>
            <ScrollArea className="-mr-4 flex-1 pr-4">
              <div className="space-y-4 pb-4">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </ScrollArea>

            <div className="mt-auto pt-4">
              <Separator className="mb-4" />
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <SheetFooter className="flex-col gap-2 pt-2 sm:flex-col">
                  <Button size="lg" className="w-full" asChild>
                    <Link href={"/checkout"}>Checkout</Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={clearCart}
                    className="w-full text-muted-foreground hover:border-destructive hover:text-destructive"
                  >
                    Clear Cart
                  </Button>
                </SheetFooter>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 py-12">
            <div className="rounded-full bg-muted p-6">
              <ShoppingCart className="h-10 w-10 text-muted-foreground" />
            </div>
            <div className="space-y-2 text-center">
              <h3 className="text-lg font-medium">Your cart is empty</h3>
              <p className="max-w-xs text-sm text-muted-foreground">
                Add some items to your cart.
              </p>
            </div>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setOpen(false)}
            >
              Continue Shopping
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
