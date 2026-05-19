"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE_NAME, createAdminSessionCookieValue } from "@/lib/adminSession";

export async function adminLoginAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (!expected || password !== expected) {
    return { ok: false as const, message: "Invalid password." };
  }

  const c = await cookies();
  c.set(ADMIN_COOKIE_NAME, await createAdminSessionCookieValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });

  redirect("/admin");
}

export async function adminLogoutAction() {
  const c = await cookies();
  c.set(ADMIN_COOKIE_NAME, "", { path: "/", maxAge: 0 });
  redirect("/");
}

