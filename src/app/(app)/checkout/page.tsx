"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import useCartStore from "@/stores/useCartStore";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { createInsertSchema } from "drizzle-zod";
import { orders } from "~/server/db/schema";

// Form schema
const checkoutFormSchema = createInsertSchema(orders)
  .pick({
    shippingAddressId: true,
    paymentMethodId: true,
    notes: true,
  })
  .extend({
    shippingAddressId: z
      .string()
      .min(1, { message: "Please select a shipping address" }),
    paymentMethodId: z
      .string()
      .min(1, { message: "Please select a payment method" }),
    notes: z.string().optional(),
  });

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export default function Checkout() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, totalItems, totalPrice } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch saved addresses and payment methods
  const { data: shippingAddresses } = api.user.getShippingAddresses.useQuery();
  const { data: paymentMethods } = api.user.getPaymentMethods.useQuery();

  // Initialize form
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      shippingAddressId: session?.user.defaultShippingAddressId?.toString(),
      paymentMethodId: session?.user.defaultPaymentMethodId?.toString(),
      notes: "",
    },
  });

  const checkout = api.order.checkout.useMutation({
    onSuccess: (data) => {
      setIsSubmitting(false);
      // Redirect to order confirmation page
      router.push(`/orders/${data.orderId}`);
    },
    onError: (error) => {
      setIsSubmitting(false);
      toast("Checkout failed", {
        description: error.message,
      });
    },
  });

  const onSubmit = (values: CheckoutFormValues) => {
    if (!session?.user) {
      toast("Authentication required", {
        description: "Please sign in to complete your purchase",
      });
      return;
    }

    if (items.length === 0) {
      toast("Empty cart", {
        description: "Your cart is empty",
      });
      return;
    }

    setIsSubmitting(true);

    checkout.mutate({
      shippingAddressId: parseInt(values.shippingAddressId),
      paymentMethodId: parseInt(values.paymentMethodId),
    });
  };

  if (items.length === 0) {
    return (
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle>Your Cart</CardTitle>
          <CardDescription>
            Your shopping cart is currently empty
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => router.push("/products")}>
            Continue Shopping
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Calculate totals
  const subtotal = totalPrice;
  //   const tax = totalPrice * 0.08;
  const shipping = totalPrice > 100 ? 0 : 10;
  const total = subtotal + shipping;

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-4">
      <h1 className="text-2xl font-bold">Checkout</h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
            <CardDescription>{totalItems} items in your cart</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between border-b py-2"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p>${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between py-1">
                <p>Subtotal</p>
                <p>${subtotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between py-1">
                <p>Shipping</p>
                <p>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</p>
              </div>
              <Separator />
              <div className="flex justify-between py-2 text-lg font-bold">
                <p>Total</p>
                <p>${total.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Checkout Form */}
        <Card>
          <CardHeader>
            <CardTitle>Complete Your Order</CardTitle>
            <CardDescription>
              Fill in the details to complete your purchase
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Shipping Information</h3>
                  <FormField
                    control={form.control}
                    name="shippingAddressId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Shipping Address</FormLabel>
                        <Select onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an address" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {shippingAddresses?.map((address) => (
                              <SelectItem
                                key={address.id}
                                value={address.id.toString()}
                              >
                                {address.name}, {address.street}, {address.city}
                                , {address.state}, {address.postalCode},{" "}
                                {address.country}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Payment Method</h3>
                  <FormField
                    control={form.control}
                    name="paymentMethodId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Method</FormLabel>
                        <Select onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a payment method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {paymentMethods?.map((method) => (
                              <SelectItem
                                key={method.id}
                                value={method.id.toString()}
                              >
                                {method.methodType}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order Notes (optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Special instructions for delivery, etc."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Add any special instructions for your order
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Complete Order"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
