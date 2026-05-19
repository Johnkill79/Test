"use client";

import { useState, useTransition } from "react";
import { customerRegisterAction } from "@/app/register/actions";

export function CustomerRegisterForm({ nextPath }: { nextPath: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      action={(formData) => {
        setError(null);
        startTransition(async () => {
          const res = await customerRegisterAction(formData);
          if (res && !res.ok) setError(res.message);
        });
      }}
      className="space-y-3"
    >
      <input type="hidden" name="next" value={nextPath} />
      <label className="block">
        <span className="text-xs text-neutral-600 dark:text-white/70">Full name</span>
        <input
          type="text"
          name="fullName"
          required
          className="input-field"
          placeholder="Your full name"
        />
      </label>

      <label className="block">
        <span className="text-xs text-neutral-600 dark:text-white/70">Email</span>
        <input
          type="email"
          name="email"
          required
          className="input-field"
          placeholder="you@example.com"
        />
      </label>

      <label className="block">
        <span className="text-xs text-neutral-600 dark:text-white/70">Password</span>
        <input
          type="password"
          name="password"
          required
          minLength={6}
          className="input-field"
          placeholder="At least 6 characters"
        />
      </label>

      {error ? (
        <div className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-800 ring-1 ring-red-500/30 dark:text-red-200">
          {error}
        </div>
      ) : null}

      <button type="submit" className="btn btn-primary w-full" disabled={pending}>
        {pending ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
