import { Star } from "lucide-react";
import { getReviews } from "@/lib/reviewsStore";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="inline-flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? "text-gold-500" : "text-neutral-300 dark:text-white/15"}`}
        />
      ))}
    </div>
  );
}

export async function ReviewsSection() {
  const reviews = await getReviews();
  const top = reviews.slice(0, 6);

  return (
    <section className="container-page pb-20">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="badge">Reviews</div>
          <h3 className="mt-3 text-xl font-semibold tracking-tight">Client reviews</h3>
          <p className="mt-1 text-sm text-neutral-600 dark:text-white/70">
            Real feedback from clients who booked with us.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {top.map((r) => (
          <div key={r.id} className="card-surface p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold">{r.name}</p>
                <p className="mt-1 text-xs text-neutral-500 dark:text-white/50">{r.date ?? "—"}</p>
              </div>
              <Stars rating={r.rating} />
            </div>
            <p className="mt-4 text-sm text-neutral-700 dark:text-white/75 leading-relaxed">“{r.text}”</p>
          </div>
        ))}
      </div>
    </section>
  );
}

