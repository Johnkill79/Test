import { getSiteUrl } from "@/lib/siteUrl";

const API_BASE =
  process.env.PAYPAL_ENV === "live"
  ? "https://api-m.paypal.com"
  : "https://api-m.sandbox.paypal.com";

function creds() {
  const clientId = process.env.PAYPAL_CLIENT_ID ?? "";
  const secret = process.env.PAYPAL_CLIENT_SECRET ?? "";
  return { clientId, secret };
}

export async function getPayPalAccessToken() {
  const { clientId, secret } = creds();
  if (!clientId || !secret) throw new Error("Missing PayPal credentials.");
  const auth = Buffer.from(`${clientId}:${secret}`).toString("base64");

  const res = await fetch(`${API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      authorization: `Basic ${auth}`,
      "content-type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials"
  });
  if (!res.ok) throw new Error("Failed to authenticate with PayPal.");
  const json = (await res.json()) as { access_token?: string };
  if (!json.access_token) throw new Error("PayPal token missing.");
  return json.access_token;
}

export async function createPayPalOrder(params: {
  amount: number;
  currency: string;
  carName: string;
  carId: string;
  days: number;
  pickupLocation?: string;
  dropOffLocation?: string;
}) {
  const token = await getPayPalAccessToken();
  const siteUrl = getSiteUrl();

  const pickup = params.pickupLocation?.trim();
  const dropOff = params.dropOffLocation?.trim();
  const locationsId =
    pickup && dropOff ? `${pickup}|${dropOff}`.slice(0, 127) : undefined;

  const purchaseUnit: Record<string, unknown> = {
    reference_id: params.carId,
    description: `${params.carName} (${params.days} day${params.days === 1 ? "" : "s"})`,
    amount: {
      currency_code: params.currency,
      value: params.amount.toFixed(2)
    }
  };
  if (locationsId) purchaseUnit.custom_id = locationsId;

  const res = await fetch(`${API_BASE}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [purchaseUnit],
      application_context: {
        brand_name: "JP CAR RENTAL",
        landing_page: "BILLING",
        user_action: "PAY_NOW",
        return_url: `${siteUrl}/checkout/success?provider=paypal&carId=${encodeURIComponent(
          params.carId
        )}&ref=PAYPAL`,
        cancel_url: `${siteUrl}/checkout/cancel`
      }
    })
  });

  if (!res.ok) throw new Error("Failed to create PayPal order.");
  const json = (await res.json()) as { id?: string };
  if (!json.id) throw new Error("PayPal order id missing.");
  return json.id;
}

export async function capturePayPalOrder(orderID: string) {
  const token = await getPayPalAccessToken();
  const res = await fetch(`${API_BASE}/v2/checkout/orders/${encodeURIComponent(orderID)}/capture`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json"
    }
  });
  if (!res.ok) throw new Error("Failed to capture PayPal order.");
  return (await res.json()) as unknown;
}

