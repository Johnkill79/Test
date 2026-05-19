import { notFound } from "next/navigation";
import { getCars } from "@/lib/carsStore";
import { formatMoney } from "@/lib/money";
import { BookingClient } from "@/components/BookingClient";
import { requireCustomerOrRedirect } from "@/lib/customerAuthServer";

export default async function BookCarPage({
  params
}: {
  params: Promise<{ carId: string }>;
}) {
  const { carId } = await params;
  await requireCustomerOrRedirect(`/book/${encodeURIComponent(carId)}`);
  const cars = await getCars();
  const car = cars.find((c) => c.id === carId);
  if (!car) notFound();

  return (
    <div className="container-page py-14">
      <div className="mx-auto max-w-3xl">
        <div className="card-surface p-6 shadow-glow">
          <h1 className="text-2xl font-semibold tracking-tight">Book {car.name}</h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-white/70">
            Select your dates, then proceed to payment (card/PayPal) or WhatsApp.
          </p>

          <div className="mt-6 rounded-2xl bg-neutral-100 dark:bg-white/5 p-5 ring-1 ring-neutral-200 dark:ring-white/10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-neutral-600 dark:text-white/70">Daily price</p>
                <p className="mt-1 text-lg font-semibold">
                  {formatMoney(car.pricePerDay, car.currency)} / day
                </p>
                <p className="mt-1 text-sm text-neutral-600 dark:text-white/70">
                  {car.seats} seats • {car.transmission}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <BookingClient car={car} />
          </div>
        </div>
      </div>
    </div>
  );
}

