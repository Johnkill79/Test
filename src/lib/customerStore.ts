import { randomUUID, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { prisma } from "@/lib/prisma";

const scrypt = promisify(scryptCb);

type PublicCustomer = {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

async function hashPassword(password: string) {
  const salt = randomUUID().replaceAll("-", "");
  const out = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt}:${out.toString("hex")}`;
}

async function verifyPassword(password: string, passwordHash: string) {
  const [salt, hashHex] = passwordHash.split(":");
  if (!salt || !hashHex) return false;
  const out = (await scrypt(password, salt, 64)) as Buffer;
  const expected = Buffer.from(hashHex, "hex");
  if (out.length !== expected.length) return false;
  return timingSafeEqual(out, expected);
}

export async function createCustomer(params: {
  fullName: string;
  email: string;
  password: string;
}): Promise<PublicCustomer | null> {
  const fullName = params.fullName.trim();
  const email = normalizeEmail(params.email);
  const password = params.password;
  if (!fullName || !email || password.length < 6) return null;

  const existing = await prisma.customer.findUnique({ where: { email } });
  if (existing) return null;

  const created = await prisma.customer.create({
    data: {
      id: randomUUID(),
      fullName,
      email,
      passwordHash: await hashPassword(password)
    }
  });

  return {
    id: created.id,
    fullName: created.fullName,
    email: created.email,
    createdAt: created.createdAt.toISOString()
  };
}

export async function authenticateCustomer(email: string, password: string): Promise<PublicCustomer | null> {
  const normalizedEmail = normalizeEmail(email);
  const customer = await prisma.customer.findUnique({ where: { email: normalizedEmail } });
  if (!customer) return null;
  const ok = await verifyPassword(password, customer.passwordHash);
  if (!ok) return null;

  return {
    id: customer.id,
    fullName: customer.fullName,
    email: customer.email,
    createdAt: customer.createdAt.toISOString()
  };
}

export async function getCustomerById(id: string): Promise<PublicCustomer | null> {
  if (!id) return null;
  const customer = await prisma.customer.findUnique({ where: { id } });
  if (!customer) return null;

  return {
    id: customer.id,
    fullName: customer.fullName,
    email: customer.email,
    createdAt: customer.createdAt.toISOString()
  };
}
