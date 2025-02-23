// src/server/api/routers/product.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { db } from "~/server/db";
import {
  productInsertSchema,
  products,
  productUpdateSchema,
} from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const productRouter = createTRPCRouter({
  getAllProducts: publicProcedure.query(async () => {
    return db.select().from(products);
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
    .input(productInsertSchema)
    .mutation(async ({ input }) => {
      const price = parseFloat(input.price);
      return db.insert(products).values({ ...input, price });
    }),

  updateProduct: publicProcedure
    .input(productUpdateSchema)
    .mutation(async ({ input }) => {
      // const { id, ...rest } = input;
      // const price = rest.price ? parseFloat(rest.price) : undefined;
      const price = parseFloat(input.price);
      const id = parseInt(input.id);
      return db
        .update(products)
        .set({
          categoryId: input.categoryId,
          price,
          description: input.description,
          imageUrl: input.imageUrl,
          name: input.name,
        })
        .where(eq(products.id, id));
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
