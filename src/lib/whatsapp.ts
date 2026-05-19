import type { Car } from "@/lib/types";

function getWhatsAppNumber() {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  return raw.replace(/[^\d]/g, "");
}

export function getWhatsAppHref(params: {
  car: Pick<Car, "name" | "pricePerDay" | "currency">;
  days?: number;
  startDate?: string;
  endDate?: string;
  pickupLocation?: string;
  dropOffLocation?: string;
  messageFooter?: string;
}) {
  const number = getWhatsAppNumber();
  const days = params.days ?? 1;
  const pickup = params.pickupLocation?.trim();
  const dropOff = params.dropOffLocation?.trim();
  const message = [
    "Hello, I’d like to book this car:",
    `Car: ${params.car.name}`,
    `Price: ${params.car.currency} ${params.car.pricePerDay}/day`,
    `Days: ${days}`,
    params.startDate ? `Start: ${params.startDate}` : null,
    params.endDate ? `End: ${params.endDate}` : null,
    pickup ? `Pick-up: ${pickup}` : null,
    dropOff ? `Drop-off: ${dropOff}` : null,
    params.messageFooter?.trim() ? params.messageFooter.trim() : null,
    "",
    "Please share availability and required documents."
  ]
    .filter(Boolean)
    .join("\n");

  const encoded = encodeURIComponent(message);
  if (!number) return `https://wa.me/?text=${encoded}`;
  return `https://wa.me/${number}?text=${encoded}`;
}

