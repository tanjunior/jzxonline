import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import { env } from "~/env";
import * as schema from "./schema";
import { DrizzleAdapter } from "@auth/drizzle-adapter";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */

const client = neon(env.AUTH_DRIZZLE_URL);

export const db = drizzle(client, { schema });
export const drizzleAdapter = DrizzleAdapter(db, {
  usersTable: schema.users,
  accountsTable: schema.accounts,
  sessionsTable: schema.sessions,
  verificationTokensTable: schema.verificationTokens,
});
