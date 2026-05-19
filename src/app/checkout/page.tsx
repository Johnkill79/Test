import { notFound } from "next/navigation";
import { getCars } from "@/lib/carsStore";
import { formatMoney } from "@/lib/money";
import { CheckoutClient } from "@/components/CheckoutClient";
import { requireCustomerOrRedirect } from "@/lib/customerAuthServer";

export default async function CheckoutPage({
  searchParams
}: {
  searchParams: Promise<{
    carId?: string;
    startDate?: string;
    endDate?: string;
    pickupOpt?: string;
    pickupDet?: string;
    dropOpt?: string;
    dropDet?: string;
    pickupLocation?: string;
    dropOffLocation?: string;
  }>;
}) {
  const {
    carId,
    startDate,
    endDate,
    pickupOpt,
    pickupDet,
    dropOpt,
    dropDet,
    pickupLocation,
    dropOffLocation
  } = await searchParams;
  if (!carId) notFound();
  const nextPath = `/checkout?carId=${encodeURIComponent(carId)}&startDate=${encodeURIComponent(
    startDate ?? ""
  )}&endDate=${encodeURIComponent(endDate ?? "")}&pickupOpt=${encodeURIComponent(
    pickupOpt ?? ""
  )}&pickupDet=${encodeURIComponent(pickupDet ?? "")}&dropOpt=${encodeURIComponent(
    dropOpt ?? ""
  )}&dropDet=${encodeURIComponent(dropDet ?? "")}&pickupLocation=${encodeURIComponent(
    pickupLocation ?? ""
  )}&dropOffLocation=${encodeURIComponent(dropOffLocation ?? "")}`;
  await requireCustomerOrRedirect(nextPath);

  const cars = await getCars();
  const car = cars.find((c) => c.id === carId);
  if (!car) notFound();

  return (
    <div className="container-page py-14">
      <div className="mx-auto max-w-3xl">
        <div className="card-surface p-6 shadow-glow">
          <h1 className="text-2xl font-semibold tracking-tight">Checkout</h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-white/70">
            Pay securely by card or PayPal. After payment, you’ll see a confirmation page.
          </p>

          <div className="mt-6 rounded-2xl bg-neutral-100 dark:bg-white/5 p-5 ring-1 ring-neutral-200 dark:ring-white/10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-neutral-600 dark:text-white/70">Car</p>
                <p className="mt-1 text-lg font-semibold">{car.name}</p>
                <p className="mt-1 text-sm text-neutral-600 dark:text-white/70">
                  {formatMoney(car.pricePerDay, car.currency)} / day • {car.seats} seats •{" "}
                  {car.transmission}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-neutral-600 dark:text-white/70">From</p>
                <p className="mt-1 text-lg font-semibold">
                  {formatMoney(car.pricePerDay, car.currency)}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <CheckoutClient
              car={car}
              initialStartDate={startDate}
              initialEndDate={endDate}
              initialPickupOpt={pickupOpt}
              initialPickupDet={pickupDet}
              initialDropOpt={dropOpt}
              initialDropDet={dropDet}
              initialPickupLocation={pickupLocation}
              initialDropOffLocation={dropOffLocation}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

