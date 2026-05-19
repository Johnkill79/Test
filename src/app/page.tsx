import { Hero } from "@/components/Hero";
import { BookIn3Steps } from "@/components/BookIn3Steps";
import { CarGrid } from "@/components/CarGrid";
import { getCars } from "@/lib/carsStore";
import { ReviewsSection } from "@/components/ReviewsSection";

export default async function HomePage() {
  const cars = await getCars();
  const featured = cars.filter((c) => c.featured);
  const rest = cars.filter((c) => !c.featured);

  return (
    <div>
      <Hero />
      <BookIn3Steps />
      <section className="container-page -mt-4 pb-14 md:-mt-6">
        <div className="card-surface p-6 shadow-glow">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="badge">Premium fleet</div>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                Featured luxury cars
              </h2>
              <p className="mt-1 text-sm text-neutral-600 dark:text-white/70">
                Tap “Book” to open WhatsApp with a pre-filled message.
              </p>
            </div>
            <a href="#fleet" className="btn btn-ghost">
              View full fleet
            </a>
          </div>

          <div className="mt-6">
            <CarGrid cars={featured} />
          </div>
        </div>
      </section>

      <section id="fleet" className="container-page pb-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold tracking-tight">All cars</h3>
            <p className="mt-1 text-sm text-neutral-600 dark:text-white/70">
              Clean, private booking via WhatsApp.
            </p>
          </div>
        </div>
        <div className="mt-6">
          <CarGrid cars={rest} />
        </div>
      </section>

      <ReviewsSection />
    </div>
  );
}

