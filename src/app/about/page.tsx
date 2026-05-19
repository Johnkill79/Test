import Link from "next/link";
import { ShieldCheck, Sparkles, Clock } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container-page py-14">
      <div className="mx-auto max-w-4xl">
        <div className="badge">About us</div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">A premium rental experience</h1>
        <p className="mt-4 text-sm text-neutral-600 dark:text-white/70 leading-relaxed">
          Luxe Rentals is built around a simple idea: premium cars, clear pricing, and fast private
          booking. Choose a vehicle, select your dates, and proceed to payment or WhatsApp in a few
          clicks.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="card-surface p-5">
            <p className="inline-flex items-center gap-2 text-sm font-medium">
              <Sparkles className="h-4 w-4 text-gold-500" />
              Luxury-first
            </p>
            <p className="mt-2 text-sm text-neutral-600 dark:text-white/70">
              Curated vehicles with a high-end, consistent experience.
            </p>
          </div>
          <div className="card-surface p-5">
            <p className="inline-flex items-center gap-2 text-sm font-medium">
              <ShieldCheck className="h-4 w-4 text-gold-500" />
              Transparent pricing
            </p>
            <p className="mt-2 text-sm text-neutral-600 dark:text-white/70">
              See daily prices and totals before you commit.
            </p>
          </div>
          <div className="card-surface p-5">
            <p className="inline-flex items-center gap-2 text-sm font-medium">
              <Clock className="h-4 w-4 text-gold-500" />
              Fast booking
            </p>
            <p className="mt-2 text-sm text-neutral-600 dark:text-white/70">
              Pay online or message us instantly with pre-filled WhatsApp details.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href="/#fleet" className="btn btn-primary">
            Browse fleet
          </Link>
          <Link href="/contact" className="btn btn-ghost">
            Contact us
          </Link>
        </div>
      </div>
    </div>
  );
}

