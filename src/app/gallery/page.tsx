import Link from "next/link";
import { getCars } from "@/lib/carsStore";

export default async function GalleryPage() {
  const cars = await getCars();

  return (
    <div className="container-page py-14">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="badge">Gallery</div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Luxury fleet gallery</h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-white/70">
            Add your images in <span className="font-medium text-neutral-900 dark:text-white">/public/cars</span> and set the path
            in admin.
          </p>
        </div>
        <Link href="/#fleet" className="btn btn-ghost">
          Back to fleet
        </Link>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cars.map((car) => (
          <div key={car.id} className="card-surface overflow-hidden">
            <div className="relative aspect-[16/10] bg-neutral-200 dark:bg-ink-900">
              {car.image ? (
                <img
                  src={car.image}
                  alt={car.name}
                  className="absolute inset-0 h-full w-full object-cover opacity-90"
                  loading="lazy"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-sm text-neutral-500 dark:text-white/60">
                  No image
                </div>
              )}
            </div>
            <div className="p-5">
              <p className="text-sm font-semibold tracking-tight">{car.name}</p>
              <p className="mt-1 text-xs text-neutral-500 dark:text-white/60">
                {car.currency} {car.pricePerDay}/day • {car.seats} seats • {car.transmission}
              </p>
              <div className="mt-4">
                <Link href={`/book/${encodeURIComponent(car.id)}`} className="btn btn-primary w-full">
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

