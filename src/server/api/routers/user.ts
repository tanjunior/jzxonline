import { eq } from "drizzle-orm";
import {
  createTRPCRouter,
  protectedProcedure,
  // protectedProcedure,
  // publicProcedure,
} from "~/server/api/trpc";
import { paymentMethods, shippingAddresses } from "~/server/db/schema";

export const userRouter = createTRPCRouter({
  getShippingAddresses: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.shippingAddresses.findMany({
      where: eq(shippingAddresses.userId, ctx.session.user.id),
    });
  }),

  getPaymentMethods: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.paymentMethods.findMany({
      where: eq(paymentMethods.userId, ctx.session.user.id),
    });
  }),

  // create: publicProcedure
  //   .input(userCreateSchema)
  //   .mutation(async ({ ctx, input }) => {
  //     const user = await ctx.db.query.users.findFirst({
  //       where(users, { eq }) {
  //         return eq(users.email, input.email);
  //       },
  //     });
  //     if (!user) {
  //       const [newUser] = await ctx.db
  //         .insert(users)
  //         .values(input)
  //         .returning({ id: users.id });
  //       if (!newUser) {
  //         return {
  //           error: `Fail to register please try again.`,
  //           success: false,
  //         };
  //       }
  //       const [account] = await ctx.db.insert(accounts).values({
  //         userId: newUser.id,
  //         type: "credentials",
  //         provider: "credentials",
  //         providerAccountId: newUser.id,
  //       }).returning()
  //       if (!account) {
  //         return {
  //           error: `Fail to register please try again.`,
  //           success: false,
  //         };
  //       }
  //       return { id: newUser.id, success: true };
  //     }
  //     if (user.password != null) {
  //       return {
  //         error: `Account registered with ${input.email} already exist.`,
  //         success: false,
  //         redirect: "/login",
  //       };
  //     } else {
  //       const [update] = await ctx.db
  //         .update(users)
  //         .set({ password: input.password })
  //         .where(eq(users.email, input.email))
  //         .returning({ id: users.id });
  //       if (!update) {
  //         return { error: "Failed to update user", success: false };
  //       }
  //       const [account] = await ctx.db.insert(accounts).values({
  //         userId: user.id,
  //         type: "credentials",
  //         provider: "credentials",
  //         providerAccountId: user.id,
  //       }).returning()
  //       if (!account) {
  //         return {
  //           error: `Fail to link user to account, please try again.`,
  //           success: false,
  //         };
  //       }
  //       return { id: user.id, success: true };
  //     }
  //   }),
  // login: publicProcedure
  //   .input(userLoginForm)
  //   .mutation(async ({ ctx, input }) => {
  //     return await ctx.db.query.users.findFirst({
  //       where(users, { eq, and }) {
  //         return and(
  //           eq(users.email, input.email),
  //           eq(users.password, input.password),
  //         );
  //       },
  //       columns: {
  //         id: true,
  //         name: true,
  //         role: true,
  //         email: true,
  //         image: true,
  //       },
  //     });
  //   }),
});
