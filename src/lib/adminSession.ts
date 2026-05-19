export const ADMIN_COOKIE_NAME = "admin_session";

function secret() {
  return process.env.ADMIN_SECRET ?? "";
}

function toHex(bytes: ArrayBuffer) {
  const arr = new Uint8Array(bytes);
  let out = "";
  for (let i = 0; i < arr.length; i++) out += arr[i].toString(16).padStart(2, "0");
  return out;
}

function constantTimeEqualHex(aHex: string, bHex: string) {
  if (aHex.length !== bHex.length) return false;
  let diff = 0;
  for (let i = 0; i < aHex.length; i++) diff |= aHex.charCodeAt(i) ^ bHex.charCodeAt(i);
  return diff === 0;
}

async function hmacHex(payload: string) {
  const s = secret();
  if (!s) return "";
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(s),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return toHex(sig);
}

export async function createAdminSessionCookieValue() {
  const issuedAt = Date.now().toString();
  const sig = await hmacHex(issuedAt);
  return `${issuedAt}.${sig}`;
}

export async function isValidAdminSessionCookieValue(value: string | undefined | null) {
  if (!value) return false;
  const [issuedAt, sig] = value.split(".");
  if (!issuedAt || !sig) return false;
  if (!secret()) return false;
  const expected = await hmacHex(issuedAt);
  if (!expected) return false;
  if (!constantTimeEqualHex(sig, expected)) return false;

  const ageMs = Date.now() - Number(issuedAt);
  const maxAgeMs = 1000 * 60 * 60 * 24 * 7;
  if (!Number.isFinite(ageMs) || ageMs < 0 || ageMs > maxAgeMs) return false;
  return true;
}

