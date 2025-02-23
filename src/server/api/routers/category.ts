// src/server/api/routers/category.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { db } from "~/server/db";
import { categories } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const categoryRouter = createTRPCRouter({
  getAllCategories: publicProcedure.query(async () => {
    return await db.select().from(categories);
  }),

  getCategoryById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await db.query.categories.findFirst({
        where(fields, operators) {
          return operators.eq(fields.id, input.id);
        },
      });
    }),

  createCategory: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input }) => {
      return await db.insert(categories).values(input);
    }),

  updateCategory: publicProcedure
    .input(z.object({ id: z.number(), name: z.string() }))
    .mutation(async ({ input }) => {
      const { id, name } = input;
      return await db
        .update(categories)
        .set({ name })
        .where(eq(categories.id, id));
    }),

  deleteCategory: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return await db.delete(categories).where(eq(categories.id, input.id));
    }),
});
