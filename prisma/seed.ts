import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "../generated/prisma/client";
import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { randomUUID, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const scrypt = promisify(scryptCb);

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

async function hashPassword(password: string) {
  const salt = randomUUID().replaceAll("-", "");
  const out = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt}:${out.toString("hex")}`;
}

async function parseJsonFile<T>(filePath: string): Promise<T> {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw) as T;
}

type CarJson = {
  id: string;
  name: string;
  pricePerDay: number;
  currency: string;
  seats: number;
  transmission: "Automatic" | "Manual";
  image?: string;
  featured?: boolean;
};

type ReviewJson = {
  id: string;
  name: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  date?: string;
};

type CustomerJson = {
  id?: string;
  fullName: string;
  email: string;
  passwordHash: string;
  createdAt?: string;
};

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("Missing DATABASE_URL for Prisma.");

  const raw = databaseUrl.startsWith("file:") ? databaseUrl.slice("file:".length) : databaseUrl;
  const sqliteUrl =
    raw.startsWith("./") || raw.startsWith(".\\") ? path.join(process.cwd(), raw) : raw;

  const prisma = new PrismaClient({
    adapter: new PrismaBetterSqlite3({ url: sqliteUrl })
  });

  try {
    const dataDir = path.join(__dirname, "..", "data");
    const carsPath = path.join(dataDir, "cars.json");
    const reviewsPath = path.join(dataDir, "reviews.json");
    const customersPath = path.join(dataDir, "customers.json");

    const [cars, reviews, customers] = await Promise.all([
      parseJsonFile<CarJson[]>(carsPath).catch(() => []),
      parseJsonFile<ReviewJson[]>(reviewsPath).catch(() => []),
      parseJsonFile<CustomerJson[]>(customersPath).catch(() => [])
    ]);

    const carsBaseMs = Date.UTC(2026, 0, 1, 0, 0, 0);
    const reviewsBaseMs = Date.UTC(2026, 0, 1, 0, 0, 0);
    const customersBaseMs = Date.UTC(2026, 0, 1, 0, 0, 0);

    await prisma.$transaction(async (tx) => {
      for (let i = 0; i < cars.length; i++) {
        const c = cars[i];
        const createdAt = new Date(carsBaseMs + (cars.length - i) * 1000);

        await tx.car.upsert({
          where: { id: String(c.id) },
          update: {
            name: String(c.name),
            pricePerDay: Number(c.pricePerDay),
            currency: String(c.currency ?? "AED"),
            seats: Number(c.seats ?? 5),
            transmission: c.transmission === "Manual" ? "Manual" : "Automatic",
            image: c.image ? String(c.image) : null,
            featured: Boolean(c.featured),
            createdAt
          },
          create: {
            id: String(c.id),
            name: String(c.name),
            pricePerDay: Number(c.pricePerDay),
            currency: String(c.currency ?? "AED"),
            seats: Number(c.seats ?? 5),
            transmission: c.transmission === "Manual" ? "Manual" : "Automatic",
            image: c.image ? String(c.image) : null,
            featured: Boolean(c.featured),
            createdAt
          }
        });
      }

      for (let i = 0; i < reviews.length; i++) {
        const r = reviews[i];
        const createdAt = new Date(reviewsBaseMs + (reviews.length - i) * 1000);

        await tx.review.upsert({
          where: { id: String(r.id) },
          update: {
            name: String(r.name),
            rating: Number(r.rating),
            text: String(r.text),
            date: r.date ? String(r.date) : null,
            createdAt
          },
          create: {
            id: String(r.id),
            name: String(r.name),
            rating: Number(r.rating),
            text: String(r.text),
            date: r.date ? String(r.date) : null,
            createdAt
          }
        });
      }

      for (let i = 0; i < customers.length; i++) {
        const cu = customers[i];
        const createdAt =
          cu.createdAt ? new Date(cu.createdAt) : new Date(customersBaseMs + (customers.length - i) * 1000);
        const id = cu.id ? String(cu.id) : randomUUID();
        const email = String(cu.email).trim().toLowerCase();

        // `Customer.email` is unique, so we upsert by email.
        await tx.customer.upsert({
          where: { email },
          update: {
            fullName: String(cu.fullName),
            passwordHash: String(cu.passwordHash),
            createdAt
          },
          create: {
            id,
            fullName: String(cu.fullName),
            email,
            passwordHash: String(cu.passwordHash),
            createdAt
          }
        });
      }

      const seedEmail = process.env.SEED_CUSTOMER_EMAIL;
      const seedFullName = process.env.SEED_CUSTOMER_FULL_NAME;
      const seedPassword = process.env.SEED_CUSTOMER_PASSWORD;
      if (seedEmail && seedFullName && seedPassword) {
        const email = normalizeEmail(seedEmail);
        const createdAt = new Date();
        const passwordHash = await hashPassword(seedPassword);
        await tx.customer.upsert({
          where: { email },
          update: {
            fullName: seedFullName,
            passwordHash,
            createdAt
          },
          create: {
            id: randomUUID(),
            fullName: seedFullName,
            email,
            passwordHash,
            createdAt
          }
        });
      }
    });
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exitCode = 1;
});

