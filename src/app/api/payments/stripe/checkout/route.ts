import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";
import { getCars } from "@/lib/carsStore";
import { getSiteUrl } from "@/lib/siteUrl";
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

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return badRequest("Missing STRIPE_SECRET_KEY.");

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

  const stripe = new Stripe(key, { apiVersion: "2025-08-27.basil" });
  const siteUrl = getSiteUrl();
  const total = Math.round(car.pricePerDay * days);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: car.currency.toLowerCase(),
          product_data: {
            name: `${car.name} (${days} day${days === 1 ? "" : "s"})`
          },
          unit_amount: Math.round(total * 100)
        },
        quantity: 1
      }
    ],
    success_url: `${siteUrl}/checkout/success?provider=stripe&carId=${encodeURIComponent(
      car.id
    )}&ref={CHECKOUT_SESSION_ID}&startDate=${encodeURIComponent(
      body.startDate ?? ""
    )}&endDate=${encodeURIComponent(body.endDate ?? "")}&pickupLocation=${encodeURIComponent(
      pickupLocation
    )}&dropOffLocation=${encodeURIComponent(dropOffLocation)}`,
    cancel_url: `${siteUrl}/checkout/cancel`,
    metadata: {
      carId: car.id,
      days: String(days),
      startDate: body.startDate ? String(body.startDate) : "",
      endDate: body.endDate ? String(body.endDate) : "",
      pickupLocation,
      dropOffLocation
    }
  });

  return NextResponse.json({ url: session.url });
}

