"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authenticateCustomer } from "@/lib/customerStore";
import { createCustomerSessionCookieValue, CUSTOMER_COOKIE_NAME } from "@/lib/customerSession";

export async function customerLoginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/");

  const customer = await authenticateCustomer(email, password);
  if (!customer) return { ok: false as const, message: "Invalid email or password." };

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

export async function customerLogoutAction() {
  const c = await cookies();
  c.set(CUSTOMER_COOKIE_NAME, "", { path: "/", maxAge: 0 });
  redirect("/");
}
