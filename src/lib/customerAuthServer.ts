import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CUSTOMER_COOKIE_NAME, parseAndValidateCustomerSessionCookieValue } from "@/lib/customerSession";
import { getCustomerById } from "@/lib/customerStore";

export async function getCurrentCustomer() {
  const c = await cookies();
  const raw = c.get(CUSTOMER_COOKIE_NAME)?.value;
  const session = parseAndValidateCustomerSessionCookieValue(raw);
  if (!session) return null;
  return getCustomerById(session.customerId);
}

export async function requireCustomerOrThrow() {
  const customer = await getCurrentCustomer();
  if (!customer) throw new Error("Unauthorized");
  return customer;
}

export async function requireCustomerOrRedirect(nextPath: string) {
  const customer = await getCurrentCustomer();
  if (customer) return customer;
  redirect(`/login?next=${encodeURIComponent(nextPath)}`);
}
