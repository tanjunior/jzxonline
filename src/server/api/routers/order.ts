// server/api/routers/checkout.ts
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  cartItems,
  orderInsertSchema,
  orderItems,
  orders,
} from "~/server/db/schema";

export const orderRouter = createTRPCRouter({
  // Process checkout
  checkout: protectedProcedure
    .input(
      orderInsertSchema.pick({
        paymentMethodId: true,
        shippingAddressId: true,
        notes: true,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // 1. Get all cart items for the user with product details
      const cartItemsWithProducts = await ctx.db.query.cartItems.findMany({
        where: eq(cartItems.userId, userId),
        with: {
          product: true,
        },
      });

      if (cartItemsWithProducts.length === 0) {
        throw new Error("Cart is empty");
      }

      // 2. Calculate order totals
      const subtotal = cartItemsWithProducts.reduce(
        (sum, item) => sum + Number(item.product.price) * item.quantity,
        0,
      );

      // Calculate tax and shipping (simplified example)
      //   const taxRate = 0.08; // 8% tax
      //   const tax = subtotal * taxRate;
      const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
      const total = subtotal + shipping;

      // 3. Create the order
      //   const orderNumber = `ORD-${nanoid(10).toUpperCase()}`;

      const [order] = await ctx.db
        .insert(orders)
        .values({
          userId,
          subtotal,
          total,
          shipping,
          notes: input.notes,
          paymentMethodId: input.paymentMethodId,
          shippingAddressId: input.shippingAddressId,
          status: "pending",
          paymentStatus: "pending",
        })
        .returning();

      if (!order) {
        throw new Error("Failed to create order");
      }

      // 4. Create order items from cart items
      for (const item of cartItemsWithProducts) {
        await ctx.db.insert(orderItems).values({
          orderId: order.id,
          productId: item.productId,
          price: Number(item.product.price),
          quantity: item.quantity,
        });
      }

      // 5. Clear the cart
      await ctx.db.delete(cartItems).where(eq(cartItems.userId, userId));

      // 6. Return the created order
      return {
        orderId: order.id,
        total: order.total,
      };
    }),

  // Get user's orders
  getOrders: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const userOrders = await ctx.db.query.orders.findMany({
      where: eq(orders.userId, userId),
      orderBy: (orders, { desc }) => [desc(orders.createdAt)],
      with: {
        orderItems: true,
      },
    });

    return userOrders;
  }),

  // Get order details
  getOrderById: protectedProcedure
    .input(
      z.object({
        orderId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const order = await ctx.db.query.orders.findFirst({
        where: and(eq(orders.id, input.orderId), eq(orders.userId, userId)),
        with: {
          orderItems: true,
        },
      });

      if (!order) {
        throw new Error("Order not found");
      }

      return order;
    }),
});
