import type { Review } from "@/lib/types";
import { prisma } from "@/lib/prisma";

export async function getReviews(): Promise<Review[]> {
  const rows = await prisma.review.findMany({
    orderBy: { createdAt: "desc" }
  });

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    rating: r.rating as Review["rating"],
    text: r.text,
    date: r.date ?? undefined
  }));
}

export async function saveReviews(next: Review[]) {
  await prisma.$transaction(
    next.map((review) =>
      prisma.review.upsert({
        where: { id: review.id },
        create: {
          id: review.id,
          name: review.name,
          rating: review.rating,
          text: review.text,
          date: review.date ?? null
        },
        update: {
          name: review.name,
          rating: review.rating,
          text: review.text,
          date: review.date ?? null
        }
      })
    )
  );
}

export async function addReview(review: Review) {
  await prisma.review.upsert({
    where: { id: review.id },
    create: {
      id: review.id,
      name: review.name,
      rating: review.rating,
      text: review.text,
      date: review.date ?? null
    },
    update: {
      name: review.name,
      rating: review.rating,
      text: review.text,
      date: review.date ?? null
    }
  });

  return review;
}

export async function updateReview(id: string, patch: Partial<Review>) {
  const existing = await prisma.review.findUnique({ where: { id } });
  if (!existing) return null;

  const updated = await prisma.review.update({
    where: { id },
    data: {
      name: patch.name ?? existing.name,
      rating: (patch.rating ?? existing.rating) as number,
      text: patch.text ?? existing.text,
      date: patch.date ?? (existing.date ?? null)
    }
  });

  return {
    id: updated.id,
    name: updated.name,
    rating: updated.rating as Review["rating"],
    text: updated.text,
    date: updated.date ?? undefined
  } satisfies Review;
}

export async function deleteReview(id: string) {
  try {
    await prisma.review.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

