import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { userCreateSchema, users } from "~/server/db/schema";

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(userCreateSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(users).values(input);
    }),
});
