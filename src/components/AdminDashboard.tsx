"use client";

import { useEffect, useMemo, useState } from "react";
import type { Car } from "@/lib/types";
import { AdminCarEditor } from "@/components/AdminCarEditor";
import type { Review } from "@/lib/types";
import { AdminReviewsEditor } from "@/components/AdminReviewsEditor";
import { BarChart3, CarFront, LogOut, MessageSquareText } from "lucide-react";
import { adminLogoutAction } from "@/app/admin/login/actions";

async function json<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);
  const data = (await res.json().catch(() => ({}))) as T;
  if (!res.ok) {
    // @ts-expect-error - best-effort message extraction
    const msg = data?.error ?? "Request failed.";
    throw new Error(String(msg));
  }
  return data;
}

export function AdminDashboard() {
  const [cars, setCars] = useState<Car[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    setError(null);
    setLoading(true);
    try {
      const data = await json<{ cars: Car[] }>("/api/admin/cars");
      setCars(data.cars);
      const r = await json<{ reviews: Review[] }>("/api/admin/reviews");
      setReviews(r.reviews);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  const stats = useMemo(() => {
    const total = cars.length;
    const featured = cars.filter((c) => c.featured).length;
    const avg =
      total === 0
        ? 0
        : Math.round(cars.reduce((sum, c) => sum + (c.pricePerDay || 0), 0) / total);
    return { total, featured, avg, reviews: reviews.length };
  }, [cars, reviews]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="badge">
            <BarChart3 className="h-3.5 w-3.5 text-gold-500" />
            Private dashboard
          </div>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight">Admin</h1>
          <p className="mt-1 text-sm text-neutral-600 dark:text-white/70">
            Manage your car list and view quick stats.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-ghost" onClick={() => void refresh()}>
            Refresh
          </button>
          <form action={adminLogoutAction}>
            <button className="btn btn-ghost" type="submit">
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </form>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="card-surface p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-neutral-600 dark:text-white/70">Total cars</p>
            <CarFront className="h-4 w-4 text-neutral-500 dark:text-white/60" />
          </div>
          <p className="mt-3 text-3xl font-semibold">{stats.total}</p>
        </div>
        <div className="card-surface p-5">
          <p className="text-sm text-neutral-600 dark:text-white/70">Featured cars</p>
          <p className="mt-3 text-3xl font-semibold">{stats.featured}</p>
        </div>
        <div className="card-surface p-5">
          <p className="text-sm text-neutral-600 dark:text-white/70">Avg price/day</p>
          <p className="mt-3 text-3xl font-semibold">
            {stats.avg ? `AED ${stats.avg}` : "—"}
          </p>
        </div>
        <div className="card-surface p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-neutral-600 dark:text-white/70">Client reviews</p>
            <MessageSquareText className="h-4 w-4 text-neutral-500 dark:text-white/60" />
          </div>
          <p className="mt-3 text-3xl font-semibold">{stats.reviews}</p>
        </div>
      </div>

      <div className="card-surface p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Car list</h2>
            <p className="mt-1 text-sm text-neutral-600 dark:text-white/70">
              These cars appear on the homepage.
            </p>
          </div>
        </div>

        {error ? (
          <div className="mt-4 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-800 ring-1 ring-red-500/30 dark:text-red-200">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="mt-4 text-sm text-neutral-600 dark:text-white/70">Loading…</div>
        ) : (
          <div className="mt-5">
            <AdminCarEditor
              cars={cars}
              onChange={setCars}
              onAfterSave={() => void refresh()}
            />
          </div>
        )}
      </div>

      <div className="card-surface p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Client reviews</h2>
            <p className="mt-1 text-sm text-neutral-600 dark:text-white/70">
              These reviews appear on the homepage.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="mt-4 text-sm text-neutral-600 dark:text-white/70">Loading…</div>
        ) : (
          <div className="mt-5">
            <AdminReviewsEditor
              reviews={reviews}
              onChange={setReviews}
              onAfterSave={() => void refresh()}
            />
          </div>
        )}
      </div>
    </div>
  );
}

