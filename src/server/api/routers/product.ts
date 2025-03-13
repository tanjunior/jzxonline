// src/server/api/routers/product.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import {
  productInsertSchema,
  products,
  productUpdateSchema,
} from "~/server/db/schema";
import {
  desc,
  eq,
  inArray,
  and,
  ilike,
  or,
  gte,
  type SQL,
  lte,
  count,
} from "drizzle-orm";

export const productRouter = createTRPCRouter({
  getAllProducts: publicProcedure
    .input(
      z.object({
        page: z.number().min(1),
        pageSize: z.number().default(9),
        category: z.number().array().optional(),
        search: z.string().optional().nullable(),
        priceRange: z
          .object({
            minPrice: z.number().optional(),
            maxPrice: z.number().optional(),
          })
          .optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { category, page, pageSize, search, priceRange } = input;
      const conditions: (SQL | undefined)[] = [];

      if (priceRange?.minPrice)
        conditions.push(gte(products.price, priceRange.minPrice));
      if (priceRange?.maxPrice)
        conditions.push(lte(products.price, priceRange.maxPrice));
      if (category?.length)
        conditions.push(inArray(products.categoryId, category));
      if (search) {
        conditions.push(
          or(
            ilike(products.name, `%${search}%`),
            ilike(products.description, `%${search}%search`),
          ),
        );
      }

      const items = await ctx.db.query.products.findMany({
        with: {
          category: {
            columns: {
              name: true,
            },
          },
        },
        orderBy: desc(products.createdAt),
        limit: pageSize,
        offset: (page - 1) * pageSize,
        where: and(...conditions),
      });

      const [totalCountResult] = await ctx.db
        .select({ count: count() })
        .from(products);
      const totalCount = totalCountResult?.count ?? 0;

      return {
        items,
        metadata: {
          totalCount,
          pageCount: Math.ceil(totalCount / pageSize),
          currentPage: page,
        },
      };
    }),

  getProductById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.products.findFirst({
        where(fields, _) {
          return eq(fields.id, input.id);
        },
      });
    }),

  createProduct: publicProcedure
    .input(productInsertSchema)
    .mutation(async ({ ctx, input }) => {
      const price = parseFloat(input.price);
      return ctx.db.insert(products).values({ ...input, price });
    }),

  updateProduct: publicProcedure
    .input(productUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      // const { id, ...rest } = input;
      // const price = rest.price ? parseFloat(rest.price) : undefined;
      const price = parseFloat(input.price);
      return ctx.db
        .update(products)
        .set({
          categoryId: input.categoryId,
          price,
          description: input.description,
          imageUrl: input.imageUrl,
          name: input.name,
        })
        .where(eq(products.id, input.id));
    }),

  deleteProduct: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.delete(products).where(eq(products.id, input.id));
    }),

  getProductsByCategory: publicProcedure
    .input(z.object({ categoryId: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db
        .select()
        .from(products)
        .where(eq(products.categoryId, input.categoryId));
    }),
});
