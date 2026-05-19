import Link from "next/link";
import { Settings2, Users, Tag, ArrowRight } from "lucide-react";
import type { Car } from "@/lib/types";

export function CarCard({ car }: { car: Car }) {
  return (
    <div className="group card-surface overflow-hidden">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-200 dark:bg-ink-900">
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_70%_30%,rgba(214,177,94,0.20),rgba(0,0,0,0)_60%)] opacity-70" />
        {car.image ? (
          <img
            src={car.image}
            alt={car.name}
            className="absolute inset-0 h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-[1.02]"
            loading="lazy"
          />
        ) : null}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h4 className="text-base font-semibold tracking-tight text-neutral-900 dark:text-white">
              {car.name}
            </h4>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="badge">
                <Tag className="h-3.5 w-3.5 text-gold-500" />
                {car.currency} {car.pricePerDay}/day
              </span>
              <span className="badge">
                <Users className="h-3.5 w-3.5" />
                {car.seats} seats
              </span>
              <span className="badge">
                <Settings2 className="h-3.5 w-3.5" />
                {car.transmission}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <Link href={`/book/${encodeURIComponent(car.id)}`} className="btn btn-primary w-full">
            Book Now <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

