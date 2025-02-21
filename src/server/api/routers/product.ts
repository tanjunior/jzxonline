// src/server/api/routers/product.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { db } from "~/server/db";
import { products } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const productRouter = createTRPCRouter({
  getAllProducts: publicProcedure.query(async () => {
    return db.select().from(products).limit(10);
  }),

  getProductById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await db.query.products.findFirst({
        where(fields, _) {
          return eq(fields.id, input.id);
        },
      });
    }),

  createProduct: publicProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        price: z.string(),
        categoryId: z.number().optional(),
        imageUrl: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      // const price = parseFloat(input.price);
      return db.insert(products).values(input);
    }),

  updateProduct: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        price: z.string().optional(),
        categoryId: z.number().optional(),
        imageUrl: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      // const { id, ...rest } = input;
      // const price = rest.price ? parseFloat(rest.price) : undefined;
      return db
        .update(products)
        .set(input)
        .where(eq(products.id, input.id));
    }),

  deleteProduct: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return db.delete(products).where(eq(products.id, input.id));
    }),

  getProductsByCategory: publicProcedure
    .input(z.object({ categoryId: z.number() }))
    .query(async ({ input }) => {
      return db
        .select()
        .from(products)
        .where(eq(products.categoryId, input.categoryId));
    }),
});
