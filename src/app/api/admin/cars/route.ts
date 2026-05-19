import { NextResponse, type NextRequest } from "next/server";
import { addCar, deleteCar, getCars, updateCar } from "@/lib/carsStore";
import type { Car } from "@/lib/types";
import { requireAdminOrThrow } from "@/lib/adminAuthServer";

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function GET() {
  await requireAdminOrThrow();
  const cars = await getCars();
  return NextResponse.json({ cars });
}

export async function POST(req: NextRequest) {
  await requireAdminOrThrow();
  const body = (await req.json().catch(() => null)) as Partial<Car> | null;
  if (!body) return badRequest("Invalid JSON.");
  if (!body.id || !body.name) return badRequest("Missing required fields.");

  const car: Car = {
    id: String(body.id),
    name: String(body.name),
    pricePerDay: Number(body.pricePerDay ?? 0),
    currency: String(body.currency ?? "AED"),
    seats: Number(body.seats ?? 5),
    transmission: (body.transmission ?? "Automatic") as Car["transmission"],
    image: body.image ? String(body.image) : undefined,
    featured: Boolean(body.featured)
  };

  await addCar(car);
  return NextResponse.json({ car });
}

export async function PUT(req: NextRequest) {
  await requireAdminOrThrow();
  const body = (await req.json().catch(() => null)) as
    | { id?: string; patch?: Partial<Car> }
    | null;
  if (!body?.id || !body.patch) return badRequest("Missing id/patch.");
  const updated = await updateCar(String(body.id), body.patch);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ car: updated });
}

export async function DELETE(req: NextRequest) {
  await requireAdminOrThrow();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return badRequest("Missing id.");
  const ok = await deleteCar(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}

