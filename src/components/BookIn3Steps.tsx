import Link from "next/link";
import { CarFront, CreditCard, KeyRound } from "lucide-react";

const steps = [
  {
    step: 1,
    title: "Choose your car",
    description:
      "Browse the fleet below, open a vehicle, then pick your dates and pick-up / drop-off locations.",
    icon: CarFront
  },
  {
    step: 2,
    title: "Book & pay",
    description:
      "Complete checkout with card or PayPal, or tap Book on WhatsApp—we’ll get your details instantly.",
    icon: CreditCard
  },
  {
    step: 3,
    title: "Pick up & drive",
    description:
      "Meet us at Puerto Princesa Airport, our office, your hotel, or another agreed spot—then enjoy the ride.",
    icon: KeyRound
  }
] as const;

export function BookIn3Steps() {
  return (
    <section className="container-page py-12 md:py-16" aria-labelledby="book-3-steps-heading">
      <div className="mx-auto max-w-2xl text-center">
        <div className="badge mx-auto w-fit">How it works</div>
        <h2
          id="book-3-steps-heading"
          className="mt-3 text-xl font-semibold uppercase tracking-wide text-neutral-900 dark:text-white sm:text-2xl md:text-3xl"
        >
          Book in 3 simple steps
        </h2>
        <p className="mt-2 text-sm text-neutral-600 dark:text-white/70">
          From choosing a car to driving away—no guesswork.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {steps.map(({ step, title, description, icon: Icon }) => (
          <div
            key={step}
            className="card-surface relative flex flex-col p-6 text-left md:pt-8"
          >
            <span className="absolute right-5 top-5 text-4xl font-semibold tabular-nums text-gold-500/35 dark:text-gold-500/25">
              {step}
            </span>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-100 ring-1 ring-neutral-200 dark:bg-white/5 dark:ring-white/10">
              <Icon className="h-5 w-5 text-gold-500" aria-hidden />
            </span>
            <h3 className="mt-4 text-base font-semibold tracking-tight text-neutral-900 dark:text-white">
              {title}
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-600 dark:text-white/70">
              {description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Link href="#fleet" className="btn btn-primary">
          Start with the fleet
        </Link>
      </div>
    </section>
  );
}
