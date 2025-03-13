// server/api/routers/cart.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { eq, and } from "drizzle-orm";
import { cartItems, products } from "~/server/db/schema";

// Define input schemas
const CartItemSchema = z.object({
  productId: z.number(),
  quantity: z.number().int().positive(),
});

export const cartRouter = createTRPCRouter({
  // Get user's cart
  getCart: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    // Get all cart items for the user with product details
    const items = await ctx.db.query.cartItems.findMany({
      where: eq(cartItems.userId, userId),
      with: {
        product: true,
      },
    });

    // Calculate totals
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0,
    );

    return {
      items: items.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        price: Number(item.product.price),
        quantity: item.quantity,
        image: item.product.imageUrl ?? undefined,
        description: item.product.description,
      })),
      totalItems,
      totalPrice,
    };
  }),

  // Add item to cart
  addItem: protectedProcedure
    .input(CartItemSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Verify product exists
      const product = await ctx.db.query.products.findFirst({
        where: eq(products.id, input.productId),
      });

      if (!product) {
        throw new Error("Product not found");
      }

      // Check if item already exists in user's cart
      const existingItem = await ctx.db.query.cartItems.findFirst({
        where: and(
          eq(cartItems.userId, userId),
          eq(cartItems.productId, input.productId),
        ),
      });

      if (existingItem) {
        // Update quantity
        await ctx.db
          .update(cartItems)
          .set({
            quantity: existingItem.quantity + input.quantity,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(cartItems.userId, userId),
              eq(cartItems.productId, input.productId),
            ),
          );
      } else {
        // Add new item
        await ctx.db.insert(cartItems).values({
          userId,
          productId: input.productId,
          quantity: input.quantity,
        });
      }

      return { success: true };
    }),

  // Update item quantity
  updateItemQuantity: protectedProcedure
    .input(
      z.object({
        productId: z.number(),
        quantity: z.number().int().positive(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Find the item
      const item = await ctx.db.query.cartItems.findFirst({
        where: and(
          eq(cartItems.userId, userId),
          eq(cartItems.productId, input.productId),
        ),
      });

      if (!item) {
        throw new Error("Item not found in cart");
      }

      // Update quantity
      await ctx.db
        .update(cartItems)
        .set({
          quantity: input.quantity,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(cartItems.userId, userId),
            eq(cartItems.productId, input.productId),
          ),
        );

      return { success: true };
    }),

  // Remove item from cart
  removeItem: protectedProcedure
    .input(
      z.object({
        productId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Delete the item
      await ctx.db
        .delete(cartItems)
        .where(
          and(
            eq(cartItems.userId, userId),
            eq(cartItems.productId, input.productId),
          ),
        );

      return { success: true };
    }),

  // Clear cart
  clearCart: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    // Delete all items for this user
    await ctx.db.delete(cartItems).where(eq(cartItems.userId, userId));

    return { success: true };
  }),
});
