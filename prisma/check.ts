import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../generated/prisma/client";
import path from "node:path";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("Missing DATABASE_URL for Prisma.");

const raw = databaseUrl.startsWith("file:") ? databaseUrl.slice("file:".length) : databaseUrl;
const sqliteUrl = raw.startsWith("./") || raw.startsWith(".\\") ? path.join(process.cwd(), raw) : raw;

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: sqliteUrl })
});

const main = async () => {
  const [cars, reviews, customers] = await Promise.all([
    prisma.car.count(),
    prisma.review.count(),
    prisma.customer.count()
  ]);
  // eslint-disable-next-line no-console
  console.log(JSON.stringify({ cars, reviews, customers }, null, 2));
  await prisma.$disconnect();
};

main().catch(async (e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  try {
    await prisma.$disconnect();
  } catch {
    // ignore
  }
  process.exitCode = 1;
});

