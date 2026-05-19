import type { Car } from "@/lib/types";
import { CarCard } from "@/components/CarCard";

export function CarGrid({ cars }: { cars: Car[] }) {
  if (!cars.length) {
    return (
      <div className="card-surface p-6 text-sm text-neutral-600 dark:text-white/70">
        No cars yet. Add cars in <span className="font-medium text-neutral-900 dark:text-white">/admin</span>.
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {cars.map((car) => (
        <CarCard key={car.id} car={car} />
      ))}
    </div>
  );
}

