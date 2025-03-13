import {
  type InferInsertModel,
  type InferSelectModel,
  relations,
  sql,
} from "drizzle-orm";
import {
  index,
  integer,
  json,
  numeric,
  pgEnum,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { type AdapterAccount } from "next-auth/adapters";
import { z } from "zod";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `jzxonline_${name}`);

export const users = createTable("user", {
  id: varchar("id", { length: 36 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("email_verified", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
  password: varchar("password", { length: 44 }),
  salt: varchar("salt", { length: 32 }),
  role: text("role").default("user").notNull(),
  defaultPaymentMethodId: integer("default_payment_method_id"),
  defaultShippingAddressId: integer("default_shipping_address_id"),
});

export const posts = createTable(
  "post",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    name: varchar("name", { length: 256 }),
    createdById: varchar("created_by", { length: 36 })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (example) => [
    index("created_by_idx").on(example.createdById),
    index("name_idx").on(example.name),
  ],
);

export const paymentMethods = createTable("payment_methods", {
  id: integer("id").primaryKey().notNull().generatedByDefaultAsIdentity(),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  methodType: text("method_type").notNull(), // e.g., 'credit_card', 'paypal', etc.
  cardNumber: text("card_number"), // Store securely or use tokenization
  expirationDate: text("expiration_date"),
  billingAddress: json("billing_address").$type<{
    name: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
  }>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const paymentMethodsRelations = relations(paymentMethods, ({ one }) => ({
  user: one(users, {
    fields: [paymentMethods.userId],
    references: [users.id],
  }),
}));

export const shippingAddresses = createTable("shipping_addresses", {
  id: integer("id").primaryKey().notNull().generatedByDefaultAsIdentity(),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  street: text("street").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  postalCode: text("postal_code").notNull(),
  country: text("country").notNull(),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

// Define relations
export const shippingAddressesRelations = relations(
  shippingAddresses,
  ({ one }) => ({
    user: one(users, {
      fields: [shippingAddresses.userId],
      references: [users.id],
    }),
  }),
);

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  cartItems: many(cartItems),
  orders: many(orders),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"] | "credentials">()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => [
    primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    index("account_user_id_idx").on(account.userId),
  ],
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("session_token", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (session) => [index("session_user_id_idx").on(session.userId)],
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (vt) => [primaryKey({ columns: [vt.identifier, vt.token] })],
);

export const categories = createTable("categories", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const products = createTable(
  "products",
  {
    id: integer("id").primaryKey().notNull().generatedByDefaultAsIdentity(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    price: numeric("price").notNull().$type<number>(),
    imageUrl: text("image_url"),
    categoryId: integer("category_id").references(() => categories.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("product_category_idx").on(table.categoryId)],
);

export const productRelations = relations(products, ({ one }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
}));

export const categoryRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

// Order status enum
export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
]);

// Payment status enum
export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "paid",
  "failed",
  "refunded",
]);

export const orders = createTable(
  "orders",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id),
    orderDate: timestamp("order_date").defaultNow(),
    status: orderStatusEnum("status").notNull().default("pending"),
    paymentStatus: paymentStatusEnum("payment_status")
      .notNull()
      .default("pending"),
    subtotal: numeric("subtotal").notNull().$type<number>(),
    shipping: numeric("shipping").notNull().$type<number>(),
    total: numeric("total").notNull().$type<number>(),
    shippingAddressId: integer("shipping_address_id")
      .notNull()
      .references(() => shippingAddresses.id),
    paymentMethodId: integer("payment_method_id")
      .notNull()
      .references(() => paymentMethods.id),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("order_user_idx").on(table.userId),
    index("order_shipping_address_idx").on(table.shippingAddressId),
    index("order_payment_method_idx").on(table.paymentMethodId),
  ],
);

// Cart items (active shopping cart)
export const cartItems = createTable(
  "cart_items",
  {
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id),
    quantity: integer("quantity").notNull().default(1),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return [primaryKey({ columns: [table.userId, table.productId] })];
  },
);

// Define relations
export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  user: one(users, {
    fields: [cartItems.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}));

export const orderItems = createTable(
  "order_items",
  {
    orderId: integer("order_id")
      .notNull()
      .references(() => orders.id),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id),
    quantity: integer("quantity").notNull(),
    price: numeric("price").notNull().$type<number>(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [primaryKey({ columns: [table.orderId, table.productId] })],
);

export const orderRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  orderItems: many(orderItems),
  shippingAddress: one(shippingAddresses, {
    fields: [orders.shippingAddressId],
    references: [shippingAddresses.id],
  }),
  paymentMethod: one(paymentMethods, {
    fields: [orders.paymentMethodId],
    references: [paymentMethods.id],
  }),
}));

export const orderItemRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const userCreateSchema = createInsertSchema(users).pick({
  name: true,
  password: true,
  email: true,
});
export const userCreateForm = createInsertSchema(users, {
  name: z.string().min(1, "Name is required"),
  email: (schema) => schema.min(1, "Email is required"),
  password: z.string().min(6, "Password length must be at least 6"),
}).pick({
  name: true,
  email: true,
  password: true,
});

export const userLoginForm = createSelectSchema(users, {
  password: z.string().min(6),
}).pick({
  email: true,
  password: true,
});

export type ProductSelect = InferSelectModel<typeof products>;
export type ProductInsert = InferInsertModel<typeof products>;
export const productSelectSchema = createSelectSchema(products);
export const productInsertSchema = createInsertSchema(products)
  .omit({
    createdAt: true,
    updatedAt: true,
    id: true,
  })
  .extend({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    description: z.string(),
    price: z.string().regex(/^\d+(\.\d{1,2})?$/, {
      message: "Price must be a valid number.",
    }),
    imageUrl: z.string(),
    categoryId: z.number().optional(),
  });

export const productUpdateSchema = createUpdateSchema(products)
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    id: z.number().int().positive("ID is required"),
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    description: z.string().optional(),
    price: z.string().regex(/^\d+(\.\d{1,2})?$/, {
      message: "Price must be a valid number.",
    }),
    imageUrl: z.string().optional(),
    categoryId: z.number().optional(),
  });
export type ProductInsertSchemaType = z.infer<typeof productInsertSchema>;
export type ProductUpdateSchemaType = z.infer<typeof productUpdateSchema>;

export type CategorySelect = InferSelectModel<typeof categories>;
export type CategoryInsert = InferInsertModel<typeof categories>;
export const categorySelectSchema = createSelectSchema(categories);
export const categoryInsertSchema = createInsertSchema(categories)
  .omit({
    createdAt: true,
    updatedAt: true,
    id: true,
  })
  .extend({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
  });
export type CategorySchemaType = z.infer<typeof categoryInsertSchema>;

export type OrderSelect = InferSelectModel<typeof orders>;
export type OrderInsert = InferInsertModel<typeof orders>;
export const orderSelectSchema = createSelectSchema(orders);
export const orderInsertSchema = createInsertSchema(orders).omit({
  createdAt: true,
  updatedAt: true,
  id: true,
  status: true,
  paymentStatus: true,
});
export type OrderSchemaType = z.infer<typeof orderInsertSchema>;

export type OrderItemSelect = InferSelectModel<typeof orderItems>;
export type OrderItemInsert = InferInsertModel<typeof orderItems>;
export const orderItemSelectSchema = createSelectSchema(orderItems);
export const orderItemInsertSchema = createInsertSchema(orderItems)
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    productId: z.number().optional(),
    quantity: z.number().min(1, {
      message: "Quantity must be at least 1.",
    }),
  });
export type OrderItemSchemaType = z.infer<typeof orderItemInsertSchema>;

export type UserInsert = InferInsertModel<typeof users>;
export type UserSelect = InferSelectModel<typeof users>;
export const userSelectSchema = createSelectSchema(users).omit({
  password: true,
  salt: true,
});
export const userInsertSchema = createInsertSchema(users)
  .omit({
    id: true,
  })
  .extend({
    email: z.string().email({
      message: "Invalid email address.",
    }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
  });
export type UserSchemaType = z.infer<typeof userInsertSchema>;

export type SessionSelect = InferSelectModel<typeof sessions>;
export type SessionInsert = InferInsertModel<typeof sessions>;
export const sessionSelectSchema = createSelectSchema(sessions);
export const sessionInsertSchema = createInsertSchema(sessions);
export type SessionSchemaType = z.infer<typeof sessionInsertSchema>;

export type AccountSelect = InferSelectModel<typeof accounts>;
export type AccountInsert = InferInsertModel<typeof accounts>;
export const accountSelectSchema = createSelectSchema(accounts);
export const accountInsertSchema = createInsertSchema(accounts).extend({
  userId: z.string().min(1, "User ID is required"),
});
export type AccountSchemaType = z.infer<typeof accountInsertSchema>;

export type VerificationTokenSelect = InferSelectModel<
  typeof verificationTokens
>;
export type VerificationTokenInsert = InferInsertModel<
  typeof verificationTokens
>;
export const verificationTokenSelectSchema =
  createSelectSchema(verificationTokens);
export const verificationTokenInsertSchema =
  createInsertSchema(verificationTokens);
export type VerificationTokenSchemaType = z.infer<
  typeof verificationTokenInsertSchema
>;
