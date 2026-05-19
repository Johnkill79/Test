import { cookies } from "next/headers";
import { isValidAdminSessionCookieValue, ADMIN_COOKIE_NAME } from "@/lib/adminSession";

export async function requireAdminOrThrow() {
  const c = await cookies();
  const ok = await isValidAdminSessionCookieValue(c.get(ADMIN_COOKIE_NAME)?.value);
  if (!ok) throw new Error("Unauthorized");
}

