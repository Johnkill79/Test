"use client";

import { useMemo, useState } from "react";
import type { Car } from "@/lib/types";
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
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

export function AdminCarEditor({
  cars,
  onChange,
  onAfterSave
}: {
  cars: Car[];
  onChange: (cars: Car[]) => void;
  onAfterSave: () => void;
}) {
  const [draft, setDraft] = useState<Car>({
    id: "",
    name: "",
    pricePerDay: 0,
    currency: "AED",
    seats: 5,
    transmission: "Automatic",
    image: "/cars/your-car.jpg",
    featured: false
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ids = useMemo(() => new Set(cars.map((c) => c.id)), [cars]);

  async function add() {
    setError(null);
    setSaving(true);
    try {
      const id = draft.id || slugifyId(draft.name);
      if (!id) throw new Error("Please enter a name.");
      if (ids.has(id)) throw new Error("That ID already exists.");

      const payload: Car = { ...draft, id };
      await json<{ car: Car }>("/api/admin/cars", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload)
      });

      setDraft((d) => ({ ...d, id: "", name: "" }));
      onAfterSave();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add car.");
    } finally {
      setSaving(false);
    }
  }

  async function saveCar(id: string, patch: Partial<Car>) {
    setError(null);
    setSaving(true);
    try {
      const nextLocal = cars.map((c) => (c.id === id ? { ...c, ...patch } : c));
      onChange(nextLocal);
      await json<{ car: Car }>("/api/admin/cars", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, patch })
      });
      onAfterSave();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this car?")) return;
    setError(null);
    setSaving(true);
    try {
      await json<{ ok: true }>(`/api/admin/cars?id=${encodeURIComponent(id)}`, {
        method: "DELETE"
      });
      onAfterSave();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete car.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-neutral-100 dark:bg-white/5 p-4 ring-1 ring-neutral-200 dark:ring-white/10">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Add a new car</p>
          <span className="text-xs text-neutral-500 dark:text-white/60">
            Images live in <span className="font-medium text-neutral-900 dark:text-white">/public/cars</span>
          </span>
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-6">
          <input
            className="md:col-span-2 admin-field"
            placeholder="Car name (e.g. Bentley Continental)"
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          />
          <input
            className="md:col-span-1 admin-field"
            placeholder="Price/day"
            inputMode="numeric"
            value={String(draft.pricePerDay || "")}
            onChange={(e) =>
              setDraft({ ...draft, pricePerDay: Number(e.target.value || 0) })
            }
          />
          <input
            className="md:col-span-1 admin-field"
            placeholder="Seats"
            inputMode="numeric"
            value={String(draft.seats || "")}
            onChange={(e) => setDraft({ ...draft, seats: Number(e.target.value || 5) })}
          />
          <select
            className="md:col-span-1 admin-field"
            value={draft.transmission}
            onChange={(e) =>
              setDraft({ ...draft, transmission: e.target.value as Car["transmission"] })
            }
          >
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
          </select>
          <input
            className="md:col-span-1 admin-field"
            placeholder="Image path (e.g. /cars/g63.jpg)"
            value={draft.image ?? ""}
            onChange={(e) => setDraft({ ...draft, image: e.target.value })}
          />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <label className="inline-flex items-center gap-2 text-sm text-neutral-700 dark:text-white/80">
            <input
              type="checkbox"
              checked={Boolean(draft.featured)}
              onChange={(e) => setDraft({ ...draft, featured: e.target.checked })}
            />
            Featured
          </label>
          <button className="btn btn-primary" onClick={() => void add()} disabled={saving}>
            <Plus className="h-4 w-4" />
            Add car
          </button>
          {error ? <span className="text-sm text-red-200">{error}</span> : null}
        </div>
      </div>

      <div className="space-y-3">
        {cars.map((c) => (
          <div key={c.id} className="rounded-2xl bg-neutral-100 dark:bg-white/5 p-4 ring-1 ring-neutral-200 dark:ring-white/10">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-neutral-900 dark:text-white">{c.name}</p>
                <p className="mt-1 text-xs text-neutral-500 dark:text-white/60">ID: {c.id}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  className="btn btn-ghost"
                  onClick={() => void saveCar(c.id, { featured: !c.featured })}
                  disabled={saving}
                  title="Toggle featured"
                >
                  <Star className="h-4 w-4" />
                  {c.featured ? "Featured" : "Not featured"}
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={() => void saveCar(c.id, {})}
                  disabled={saving}
                  title="Save (no-op)"
                >
                  <Save className="h-4 w-4" />
                  Save
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={() => void remove(c.id)}
                  disabled={saving}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>

            <div className="mt-3 grid gap-3 md:grid-cols-6">
              <input
                className="md:col-span-2 admin-field"
                value={c.name}
                onChange={(e) =>
                  onChange(cars.map((x) => (x.id === c.id ? { ...x, name: e.target.value } : x)))
                }
                onBlur={(e) => void saveCar(c.id, { name: e.target.value })}
              />
              <input
                className="md:col-span-1 admin-field"
                value={String(c.pricePerDay ?? "")}
                inputMode="numeric"
                onChange={(e) =>
                  onChange(
                    cars.map((x) =>
                      x.id === c.id ? { ...x, pricePerDay: Number(e.target.value || 0) } : x
                    )
                  )
                }
                onBlur={(e) => void saveCar(c.id, { pricePerDay: Number(e.target.value || 0) })}
              />
              <input
                className="md:col-span-1 admin-field"
                value={String(c.seats ?? "")}
                inputMode="numeric"
                onChange={(e) =>
                  onChange(
                    cars.map((x) =>
                      x.id === c.id ? { ...x, seats: Number(e.target.value || 5) } : x
                    )
                  )
                }
                onBlur={(e) => void saveCar(c.id, { seats: Number(e.target.value || 5) })}
              />
              <select
                className="md:col-span-1 admin-field"
                value={c.transmission}
                onChange={(e) => {
                  const transmission = e.target.value as Car["transmission"];
                  onChange(cars.map((x) => (x.id === c.id ? { ...x, transmission } : x)));
                  void saveCar(c.id, { transmission });
                }}
              >
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
              <input
                className="md:col-span-1 admin-field"
                value={c.image ?? ""}
                onChange={(e) =>
                  onChange(cars.map((x) => (x.id === c.id ? { ...x, image: e.target.value } : x)))
                }
                onBlur={(e) => void saveCar(c.id, { image: e.target.value })}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

