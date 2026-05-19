"use client";

import { useMemo, useState } from "react";
import type { Review } from "@/lib/types";
import { Plus, Save, Trash2, Star } from "lucide-react";

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

function slugifyId(name: string) {
  return (
    "rev-" +
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 50)
  );
}

export function AdminReviewsEditor({
  reviews,
  onChange,
  onAfterSave
}: {
  reviews: Review[];
  onChange: (next: Review[]) => void;
  onAfterSave: () => void;
}) {
  const [draft, setDraft] = useState<Review>({
    id: "",
    name: "",
    rating: 5,
    text: "",
    date: ""
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ids = useMemo(() => new Set(reviews.map((r) => r.id)), [reviews]);

  async function add() {
    setError(null);
    setSaving(true);
    try {
      const id = draft.id || slugifyId(draft.name || "client");
      if (ids.has(id)) throw new Error("That ID already exists.");
      if (!draft.name.trim()) throw new Error("Name is required.");
      if (!draft.text.trim()) throw new Error("Review text is required.");

      const payload: Review = {
        ...draft,
        id,
        rating: Number(draft.rating) as Review["rating"],
        date: draft.date?.trim() ? draft.date : undefined
      };
      await json<{ review: Review }>("/api/admin/reviews", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload)
      });
      setDraft({ id: "", name: "", rating: 5, text: "", date: "" });
      onAfterSave();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add review.");
    } finally {
      setSaving(false);
    }
  }

  async function saveReview(id: string, patch: Partial<Review>) {
    setError(null);
    setSaving(true);
    try {
      onChange(reviews.map((r) => (r.id === id ? { ...r, ...patch } : r)));
      await json<{ review: Review }>("/api/admin/reviews", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, patch })
      });
      onAfterSave();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save review.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this review?")) return;
    setError(null);
    setSaving(true);
    try {
      await json<{ ok: true }>(`/api/admin/reviews?id=${encodeURIComponent(id)}`, {
        method: "DELETE"
      });
      onAfterSave();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete review.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-neutral-100 dark:bg-white/5 p-4 ring-1 ring-neutral-200 dark:ring-white/10">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Add a review</p>
          <span className="text-xs text-neutral-500 dark:text-white/60">Shown on homepage</span>
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-6">
          <input
            className="md:col-span-2 admin-field"
            placeholder="Client name"
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          />
          <select
            className="md:col-span-1 admin-field"
            value={String(draft.rating)}
            onChange={(e) => setDraft({ ...draft, rating: Number(e.target.value) as Review["rating"] })}
          >
            <option value="5">5★</option>
            <option value="4">4★</option>
            <option value="3">3★</option>
            <option value="2">2★</option>
            <option value="1">1★</option>
          </select>
          <input
            className="md:col-span-3 admin-field"
            placeholder="Date (YYYY-MM-DD) optional"
            value={draft.date ?? ""}
            onChange={(e) => setDraft({ ...draft, date: e.target.value })}
          />
          <textarea
            className="md:col-span-6 min-h-[90px] admin-field"
            placeholder="Review text"
            value={draft.text}
            onChange={(e) => setDraft({ ...draft, text: e.target.value })}
          />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button className="btn btn-primary" onClick={() => void add()} disabled={saving}>
            <Plus className="h-4 w-4" />
            Add review
          </button>
          {error ? (
            <span className="text-sm text-red-700 dark:text-red-200">{error}</span>
          ) : null}
        </div>
      </div>

      <div className="space-y-3">
        {reviews.map((r) => (
          <div key={r.id} className="rounded-2xl bg-neutral-100 dark:bg-white/5 p-4 ring-1 ring-neutral-200 dark:ring-white/10">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-neutral-900 dark:text-white">{r.name}</p>
                <p className="mt-1 text-xs text-neutral-500 dark:text-white/60">ID: {r.id}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  className="btn btn-ghost"
                  onClick={() => void saveReview(r.id, {})}
                  disabled={saving}
                >
                  <Save className="h-4 w-4" />
                  Save
                </button>
                <button className="btn btn-ghost" onClick={() => void remove(r.id)} disabled={saving}>
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>

            <div className="mt-3 grid gap-3 md:grid-cols-6">
              <input
                className="md:col-span-2 admin-field"
                value={r.name}
                onChange={(e) =>
                  onChange(reviews.map((x) => (x.id === r.id ? { ...x, name: e.target.value } : x)))
                }
                onBlur={(e) => void saveReview(r.id, { name: e.target.value })}
              />
              <select
                className="md:col-span-1 admin-field"
                value={String(r.rating)}
                onChange={(e) => {
                  const rating = Number(e.target.value) as Review["rating"];
                  onChange(reviews.map((x) => (x.id === r.id ? { ...x, rating } : x)));
                  void saveReview(r.id, { rating });
                }}
              >
                <option value="5">5★</option>
                <option value="4">4★</option>
                <option value="3">3★</option>
                <option value="2">2★</option>
                <option value="1">1★</option>
              </select>
              <input
                className="md:col-span-3 admin-field"
                value={r.date ?? ""}
                placeholder="YYYY-MM-DD"
                onChange={(e) =>
                  onChange(reviews.map((x) => (x.id === r.id ? { ...x, date: e.target.value } : x)))
                }
                onBlur={(e) => void saveReview(r.id, { date: e.target.value })}
              />
              <textarea
                className="md:col-span-6 min-h-[90px] admin-field"
                value={r.text}
                onChange={(e) =>
                  onChange(reviews.map((x) => (x.id === r.id ? { ...x, text: e.target.value } : x)))
                }
                onBlur={(e) => void saveReview(r.id, { text: e.target.value })}
              />
            </div>

            <div className="mt-3 inline-flex items-center gap-1 text-neutral-600 dark:text-white/70">
              <Star className="h-4 w-4 text-gold-500" />
              <span className="text-sm">{r.rating}/5</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

