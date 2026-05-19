"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createCustomer } from "@/lib/customerStore";
import { createCustomerSessionCookieValue, CUSTOMER_COOKIE_NAME } from "@/lib/customerSession";

export async function customerRegisterAction(formData: FormData) {
  const fullName = String(formData.get("fullName") ?? "");
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/");

  const customer = await createCustomer({ fullName, email, password });
  if (!customer) {
    return {
      ok: false as const,
      message: "Could not create account. Use a valid email and password (min 6 chars)."
    };
  }

  const c = await cookies();
  c.set(CUSTOMER_COOKIE_NAME, createCustomerSessionCookieValue(customer.id), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });

  redirect(next.startsWith("/") ? next : "/");
}
