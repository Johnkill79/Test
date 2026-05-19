import { NextResponse, type NextRequest } from "next/server";
import { capturePayPalOrder } from "@/lib/paypal";
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
    | { orderID?: string; carId?: string }
    | null;
  if (!body?.orderID) return badRequest("Missing orderID.");
  await capturePayPalOrder(String(body.orderID));
  return NextResponse.json({ ok: true, ref: String(body.orderID) });
}

