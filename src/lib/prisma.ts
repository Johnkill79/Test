import path from "node:path";
import { PrismaClient } from "../../generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

// PrismaClient is expensive to create; reuse it in dev.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function sqliteUrlFromDatabaseUrl(databaseUrl: string) {
  // `DATABASE_URL` for Prisma SQLite is typically `file:./data/dev.db`
  const raw = databaseUrl.startsWith("file:") ? databaseUrl.slice("file:".length) : databaseUrl;
  if (raw.startsWith("./") || raw.startsWith(".\\")) return path.join(process.cwd(), raw);
  return raw;
}

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("Missing DATABASE_URL for Prisma.");

const adapter = new PrismaBetterSqlite3({ url: sqliteUrlFromDatabaseUrl(databaseUrl) });

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
