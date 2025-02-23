import { faker } from "@faker-js/faker";
import type {
  OrderInsert,
  OrderItemInsert,
  ProductInsert,
} from "~/server/db/schema";

// Helper function to generate a random date within a range
function randomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}

// ---------------------- User Data ----------------------
export const mockUsers = Array.from({ length: 10 }).map(() => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  email_verified: faker.date.past(),
  image: faker.image.avatar(),
  password: faker.internet.password(),
  role: faker.helpers.arrayElement(["user", "admin"]),
}));

// ---------------------- Account Data ----------------------
export const mockAccounts = mockUsers.flatMap((user) =>
  Array.from({ length: faker.number.int({ min: 1, max: 3 }) }).map(() => ({
    userId: user.id,
    type: faker.helpers.arrayElement(["oauth", "credentials"]),
    provider: faker.helpers.arrayElement(["google", "github", "email"]),
    providerAccountId: faker.string.alphanumeric(20),
    refresh_token: faker.string.alphanumeric(40),
    access_token: faker.string.alphanumeric(40),
    expires_at: faker.date.future().getTime() / 1000, // Convert to seconds
    token_type: "bearer",
    scope: "openid profile email",
    id_token: faker.string.alphanumeric(40),
    session_state: faker.string.alphanumeric(20),
  })),
);

// ---------------------- Session Data ----------------------
export const mockSessions = mockUsers.map((user) => ({
  sessionToken: faker.string.uuid(),
  userId: user.id,
  expires: faker.date.future(),
}));

// ---------------------- Verification Token Data ----------------------
export const mockVerificationTokens = Array.from({ length: 5 }).map(() => ({
  identifier: faker.internet.email(),
  token: faker.string.uuid(),
  expires: faker.date.future(),
}));

// ---------------------- Category Data ----------------------
export const mockCategories = Array.from({ length: 5 }).map(() => ({
  // id: index + 1, // Ensure unique IDs
  name: faker.commerce.department(),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
}));

// ---------------------- Product Data ----------------------
export const mockProducts: ProductInsert[] = Array.from({ length: 20 }).map(
  () => {
    return {
      // id: index + 1, // Ensure unique product IDs, starting from 1
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      imageUrl: faker.image.url(),
      categoryId: faker.number.int({ min: 1, max: mockCategories.length }),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    };
  },
);

// // ---------------------- Order Data ----------------------
export const mockOrders: OrderInsert[] = Array.from({ length: 10 }).map(() => {
  const user = faker.helpers.arrayElement(mockUsers); // Select a random user
  return {
    userId: user.id, // Use the user's ID
    totalAmount: parseFloat(faker.commerce.price()),
    orderDate: faker.date.recent(),
    shippingAddress: faker.location.streetAddress(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  };
});

// ---------------------- Order Item Data ----------------------
export const mockOrderItems: OrderItemInsert[] = Array.from({ length: 10 }).map(
  () => {
    const order = faker.helpers.arrayElement(mockOrders); // Select a random user
    const product = faker.helpers.arrayElement(mockProducts);
    const quantity = faker.number.int({ min: 1, max: 3 });
    const price = parseFloat(product.price.toString()); // Ensure price is a number

    return {
      orderId: order.id!,
      productId: product.id!,
      quantity: quantity,
      price: price,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    };
  },
);

// ---------------------- Post Data ----------------------
// export const mockPosts: PostInsert[] = mockUsers.flatMap((user) =>
//   Array.from({ length: faker.number.int({ min: 0, max: 3 }) }).map(() => ({
//     id: faker.number.int({ min: 1, max: 100 }),
//     name: faker.lorem.sentence(),
//     created_by: user.id,
//     createdAt: faker.date.past(),
//     updatedAt: faker.date.recent(),
//   })),
// );
