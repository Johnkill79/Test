import { createHmac, timingSafeEqual } from "node:crypto";

export const CUSTOMER_COOKIE_NAME = "customer_session";

function secret() {
  return process.env.CUSTOMER_AUTH_SECRET ?? process.env.ADMIN_SECRET ?? "";
}

function sign(payload: string) {
  const s = secret();
  if (!s) return "";
  return createHmac("sha256", s).update(payload).digest("hex");
}

function safeEqualHex(aHex: string, bHex: string) {
  const a = Buffer.from(aHex, "hex");
  const b = Buffer.from(bHex, "hex");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function createCustomerSessionCookieValue(customerId: string) {
  const issuedAt = Date.now().toString();
  const payload = `${customerId}.${issuedAt}`;
  const sig = sign(payload);
  return `${payload}.${sig}`;
}

export function parseAndValidateCustomerSessionCookieValue(value: string | undefined | null) {
  if (!value) return null;
  const [customerId, issuedAt, sig] = value.split(".");
  if (!customerId || !issuedAt || !sig) return null;
  if (!secret()) return null;

  const expected = sign(`${customerId}.${issuedAt}`);
  if (!expected || !safeEqualHex(sig, expected)) return null;

  const ageMs = Date.now() - Number(issuedAt);
  const maxAgeMs = 1000 * 60 * 60 * 24 * 30;
  if (!Number.isFinite(ageMs) || ageMs < 0 || ageMs > maxAgeMs) return null;

  return { customerId };
}
