import { NextResponse, type NextRequest } from "next/server";
import { getCars } from "@/lib/carsStore";
import { createPayPalOrder } from "@/lib/paypal";
import { calcDays, MIN_BOOKING_DAYS } from "@/lib/dateRange";
import { requireCustomerOrThrow } from "@/lib/customerAuthServer";

export const runtime = "nodejs";

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function POST(req: NextRequest) {
  try {
    await requireCustomerOrThrow();
  } catch {
    return NextResponse.json({ error: "Login required." }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as
    | {
        carId?: string;
        days?: number;
        startDate?: string;
        endDate?: string;
        pickupLocation?: string;
        dropOffLocation?: string;
      }
    | null;
  if (!body?.carId) return badRequest("Missing carId.");
  const pickupLocation = body.pickupLocation?.trim() ?? "";
  const dropOffLocation = body.dropOffLocation?.trim() ?? "";
  if (!pickupLocation || !dropOffLocation) {
    return badRequest("Pick-up and drop-off locations are required.");
  }
  const computedDays =
    body.startDate && body.endDate ? calcDays(body.startDate, body.endDate) : 0;
  const days = Math.max(1, computedDays || Number(body.days ?? 1));
  if (days < MIN_BOOKING_DAYS) {
    return badRequest(`Minimum booking is ${MIN_BOOKING_DAYS} days.`);
  }

  const cars = await getCars();
  const car = cars.find((c) => c.id === body.carId);
  if (!car) return badRequest("Car not found.");

  const amount = car.pricePerDay * days;
  const id = await createPayPalOrder({
    amount,
    currency: car.currency,
    carName: car.name,
    carId: car.id,
    days,
    pickupLocation,
    dropOffLocation
  });
  return NextResponse.json({ id });
}

