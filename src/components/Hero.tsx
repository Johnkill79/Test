import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_60%_10%,rgba(214,177,94,0.18),transparent_60%)] dark:bg-[radial-gradient(80%_60%_at_60%_10%,rgba(214,177,94,0.22),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_20%_0%,rgba(255,255,255,0.35),transparent_55%)] dark:bg-[radial-gradient(80%_60%_at_20%_0%,rgba(255,255,255,0.10),transparent_55%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-100 via-stone-50 to-stone-200 dark:from-ink-950 dark:via-ink-950 dark:to-ink-900" />
      </div>

      <div className="container-page relative py-16 md:py-24">
        <div className="max-w-3xl">
          <div className="badge">
            <Sparkles className="h-3.5 w-3.5 text-gold-500" />
            Premium, clean, private booking
          </div>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-neutral-900 dark:text-white md:text-6xl">
            Luxury car rental, done right.
          </h1>
          <p className="mt-5 text-base text-neutral-700 dark:text-white/75 md:text-lg">
            A modern, high-end fleet with instant WhatsApp booking. Choose a car,
            tap “Book”, and message us in seconds.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#fleet" className="btn btn-primary">
              Book Now <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#fleet" className="btn btn-ghost">
              Explore cars
            </a>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:mt-14 md:grid-cols-3">
          <div className="card-surface p-5">
            <p className="text-sm font-medium text-neutral-900 dark:text-white">Luxury fleet</p>
            <p className="mt-1 text-sm text-neutral-600 dark:text-white/70">
              Curated, high-end vehicles with clear pricing.
            </p>
          </div>
          <div className="card-surface p-5">
            <p className="text-sm font-medium text-neutral-900 dark:text-white">WhatsApp booking</p>
            <p className="mt-1 text-sm text-neutral-600 dark:text-white/70">
              Each “Book” button opens a pre-filled message.
            </p>
          </div>
          <div className="card-surface p-5">
            <p className="text-sm font-medium text-neutral-900 dark:text-white">Admin dashboard</p>
            <p className="mt-1 text-sm text-neutral-600 dark:text-white/70">
              Manage your car list privately at{" "}
              <span className="font-medium text-neutral-900 dark:text-white">/admin</span>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
