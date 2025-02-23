import { z } from "zod";
import {
  mockUsers,
  mockAccounts,
  mockSessions,
  mockVerificationTokens,
  mockCategories,
  mockProducts,
  mockOrders,
  mockOrderItems,
} from "~/lib/mock";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import {
  accounts,
  categories,
  orderItems,
  orders,
  posts,
  products,
  sessions,
  users,
  verificationTokens,
} from "~/server/db/schema";

export const seedRouter = createTRPCRouter({
  seedDatabase: publicProcedure.mutation(async ({ ctx }) => {
    try {
      //   // Insert Users
      //   await ctx.db.insert(users).values(mockUsers);

      //   // Insert Accounts
      //   await ctx.db.insert(accounts).values(mockAccounts);

      //   // Insert Sessions
      //   await ctx.db.insert(sessions).values(mockSessions);

      //   // Insert Verification Tokens
      //   await ctx.db.insert(verificationTokens).values(mockVerificationTokens);

      // Insert Categories
      console.log(mockCategories);
      await ctx.db.insert(categories).values(mockCategories);

      // Insert Products
      await ctx.db.insert(products).values(mockProducts);

      // Insert Orders
      await ctx.db.insert(orders).values(mockOrders);

      // Insert Order Items
      await ctx.db.insert(orderItems).values(mockOrderItems);

      //   // Insert Posts
      //   await ctx.db.insert(posts).values(mockPosts);

      return { success: true, message: "Database seeded successfully!" };
    } catch (error) {
      console.error("Error seeding database:", error);
      return { success: false, message: "Failed to seed database." };
    }
  }),
});
