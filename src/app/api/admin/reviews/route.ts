import { NextResponse, type NextRequest } from "next/server";
import { requireAdminOrThrow } from "@/lib/adminAuthServer";
import type { Review } from "@/lib/types";
import { addReview, deleteReview, getReviews, updateReview } from "@/lib/reviewsStore";

export const runtime = "nodejs";

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function GET() {
  await requireAdminOrThrow();
  const reviews = await getReviews();
  return NextResponse.json({ reviews });
}

export async function POST(req: NextRequest) {
  await requireAdminOrThrow();
  const body = (await req.json().catch(() => null)) as Partial<Review> | null;
  if (!body) return badRequest("Invalid JSON.");
  if (!body.id || !body.name || !body.text) return badRequest("Missing required fields.");
  const rating = Number(body.rating ?? 5);
  if (rating < 1 || rating > 5) return badRequest("Rating must be 1..5.");

  const review: Review = {
    id: String(body.id),
    name: String(body.name),
    text: String(body.text),
    rating: rating as Review["rating"],
    date: body.date ? String(body.date) : undefined
  };

  await addReview(review);
  return NextResponse.json({ review });
}

export async function PUT(req: NextRequest) {
  await requireAdminOrThrow();
  const body = (await req.json().catch(() => null)) as
    | { id?: string; patch?: Partial<Review> }
    | null;
  if (!body?.id || !body.patch) return badRequest("Missing id/patch.");
  const updated = await updateReview(String(body.id), body.patch);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ review: updated });
}

export async function DELETE(req: NextRequest) {
  await requireAdminOrThrow();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return badRequest("Missing id.");
  const ok = await deleteReview(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}

