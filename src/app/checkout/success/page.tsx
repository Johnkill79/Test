import Link from "next/link";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { getCars } from "@/lib/carsStore";
import { getWhatsAppHref } from "@/lib/whatsapp";

export default async function CheckoutSuccessPage({
  searchParams
}: {
  searchParams: Promise<{
    carId?: string;
    provider?: string;
    ref?: string;
    startDate?: string;
    endDate?: string;
    pickupLocation?: string;
    dropOffLocation?: string;
  }>;
}) {
  const { carId, provider, ref, startDate, endDate, pickupLocation, dropOffLocation } =
    await searchParams;
  const cars = await getCars();
  const car = carId ? cars.find((c) => c.id === carId) : undefined;

  const href = car
    ? getWhatsAppHref({
        car,
        days: 1,
        startDate,
        endDate,
        pickupLocation,
        dropOffLocation,
        messageFooter: `\n\nPayment: ${provider ?? "unknown"}\nReference: ${ref ?? "n/a"}`
      })
    : undefined;

  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-xl card-surface p-6 shadow-glow">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-1 h-6 w-6 text-gold-500" />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Payment received</h1>
            <p className="mt-2 text-sm text-neutral-600 dark:text-white/70">
              Thanks! If you’d like, send us the confirmation via WhatsApp to finalize booking
              details.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="btn btn-ghost w-full">
            Back to homepage
          </Link>
          {href ? (
            <a className="btn btn-primary w-full" target="_blank" rel="noreferrer" href={href}>
              <MessageCircle className="h-4 w-4" />
              WhatsApp confirmation
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

