"use client";

import Script from "next/script";
import { useEffect, useMemo, useState } from "react";
import type { Car } from "@/lib/types";
import { formatMoney } from "@/lib/money";
import { CreditCard, MessageCircle } from "lucide-react";
import { calcDays, defaultRange, MIN_BOOKING_DAYS } from "@/lib/dateRange";
import {
  bookingLocationFromSearch,
  formatBookingLocation,
  isBookingLocationComplete,
  type BookingLocationOption
} from "@/lib/bookingLocations";
import { getWhatsAppHref } from "@/lib/whatsapp";
import { BookingLocationFields } from "@/components/BookingLocationFields";

declare global {
  interface Window {
    paypal?: {
      Buttons: (opts: unknown) => { render: (selector: string) => void };
    };
  }
}

async function json<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);
  const data = (await res.json().catch(() => ({}))) as T;
  if (!res.ok) {
    // @ts-expect-error - best-effort message extraction
    const msg = data?.error ?? "Request failed.";
    throw new Error(String(msg));
  }
  return data;
}

export function CheckoutClient({
  car,
  initialStartDate,
  initialEndDate,
  initialPickupOpt,
  initialPickupDet,
  initialDropOpt,
  initialDropDet,
  initialPickupLocation,
  initialDropOffLocation
}: {
  car: Car;
  initialStartDate?: string;
  initialEndDate?: string;
  initialPickupOpt?: string;
  initialPickupDet?: string;
  initialDropOpt?: string;
  initialDropDet?: string;
  /** Legacy composed location (URL/bookmarks before opt/det params). */
  initialPickupLocation?: string;
  initialDropOffLocation?: string;
}) {
  const defaults = useMemo(() => defaultRange(), []);

  const initialPickup = useMemo(
    () =>
      bookingLocationFromSearch(initialPickupOpt, initialPickupDet, initialPickupLocation),
    [initialPickupOpt, initialPickupDet, initialPickupLocation]
  );
  const initialDrop = useMemo(
    () => bookingLocationFromSearch(initialDropOpt, initialDropDet, initialDropOffLocation),
    [initialDropOpt, initialDropDet, initialDropOffLocation]
  );

  const [startDate, setStartDate] = useState(initialStartDate ?? defaults.startDate);
  const [endDate, setEndDate] = useState(initialEndDate ?? defaults.endDate);
  const [pickupOption, setPickupOption] = useState<BookingLocationOption>(initialPickup.option);
  const [pickupDetail, setPickupDetail] = useState(initialPickup.detail);
  const [dropOffOption, setDropOffOption] = useState<BookingLocationOption>(initialDrop.option);
  const [dropOffDetail, setDropOffDetail] = useState(initialDrop.detail);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  const pickupLocation = useMemo(
    () => formatBookingLocation(pickupOption, pickupDetail),
    [pickupOption, pickupDetail]
  );
  const dropOffLocation = useMemo(
    () => formatBookingLocation(dropOffOption, dropOffDetail),
    [dropOffOption, dropOffDetail]
  );

  const days = useMemo(() => calcDays(startDate, endDate), [startDate, endDate]);
  const isValidRange = days >= MIN_BOOKING_DAYS;
  const pickupOk = isBookingLocationComplete(pickupOption, pickupDetail);
  const dropOffOk = isBookingLocationComplete(dropOffOption, dropOffDetail);
  const canPay = isValidRange && pickupOk && dropOffOk;
  const billableDays = isValidRange ? days : MIN_BOOKING_DAYS;
  const total = useMemo(() => billableDays * car.pricePerDay, [billableDays, car.pricePerDay]);
  const waHref = useMemo(
    () =>
      getWhatsAppHref({
        car,
        days: billableDays,
        startDate,
        endDate,
        pickupLocation,
        dropOffLocation
      }),
    [car, billableDays, startDate, endDate, pickupLocation, dropOffLocation]
  );

  async function payByCard() {
    if (!canPay) {
      setError(
        !isValidRange
          ? `Minimum booking is ${MIN_BOOKING_DAYS} days.`
          : "Choose pick-up and drop-off locations and add details for Hotel or Other."
      );
      return;
    }
    setError(null);
    setBusy(true);
    try {
      const data = await json<{ url: string }>("/api/payments/stripe/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          carId: car.id,
          startDate,
          endDate,
          pickupLocation: pickupLocation.trim(),
          dropOffLocation: dropOffLocation.trim()
        })
      });
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Card payment failed.");
      setBusy(false);
    }
  }

  useEffect(() => {
    const containerId = "#paypal-buttons";
    const el = document.querySelector(containerId);
    if (!paypalClientId || !canPay) {
      if (el) el.innerHTML = "";
      return;
    }
    if (!window.paypal?.Buttons) return;
    if (!el) return;
    el.innerHTML = "";

    window.paypal.Buttons({
      createOrder: async () => {
        const data = await json<{ id: string }>("/api/payments/paypal/create-order", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            carId: car.id,
            startDate,
            endDate,
            pickupLocation: pickupLocation.trim(),
            dropOffLocation: dropOffLocation.trim()
          })
        });
        return data.id;
      },
      onApprove: async (data: { orderID: string }) => {
        await json<{ ok: true; ref: string }>("/api/payments/paypal/capture-order", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ orderID: data.orderID, carId: car.id })
        });
        window.location.href = `/checkout/success?provider=paypal&carId=${encodeURIComponent(
          car.id
        )}&ref=${encodeURIComponent(data.orderID)}&startDate=${encodeURIComponent(
          startDate
        )}&endDate=${encodeURIComponent(endDate)}&pickupLocation=${encodeURIComponent(
          pickupLocation.trim()
        )}&dropOffLocation=${encodeURIComponent(dropOffLocation.trim())}`;
      },
      onError: () => setError("PayPal payment failed. Please try again.")
    }).render(containerId);
  }, [car.id, startDate, endDate, pickupLocation, dropOffLocation, paypalClientId, canPay]);

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3 sm:items-end">
        <label className="block">
          <span className="text-xs text-neutral-600 dark:text-white/70">Start date</span>
          <input
            className="input-field"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="text-xs text-neutral-600 dark:text-white/70">End date</span>
          <input
            className="input-field"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate}
          />
        </label>
        <div className="text-sm text-neutral-600 dark:text-white/70 sm:text-right">
          Daily:{" "}
          <span className="font-semibold text-neutral-900 dark:text-white">
            {formatMoney(car.pricePerDay, car.currency)}
          </span>
          <div className="mt-1">
            Days: <span className="font-semibold text-neutral-900 dark:text-white">{billableDays}</span> • Total:{" "}
            <span className="font-semibold text-neutral-900 dark:text-white">{formatMoney(total, car.currency)}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <BookingLocationFields
          label="Pick-up location"
          option={pickupOption}
          detail={pickupDetail}
          onOptionChange={setPickupOption}
          onDetailChange={setPickupDetail}
        />
        <BookingLocationFields
          label="Drop-off location"
          option={dropOffOption}
          detail={dropOffDetail}
          onOptionChange={setDropOffOption}
          onDetailChange={setDropOffDetail}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <a
          className={`btn btn-ghost w-full ${!canPay ? "pointer-events-none opacity-50" : ""}`}
          href={waHref}
          target="_blank"
          rel="noreferrer"
          aria-disabled={!canPay}
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp this booking
        </a>
      </div>

      {!isValidRange ? (
        <div className="rounded-xl bg-neutral-100 dark:bg-white/5 px-4 py-3 text-sm text-neutral-600 dark:text-white/70 ring-1 ring-neutral-200 dark:ring-white/10">
          Minimum booking is <span className="font-semibold text-neutral-900 dark:text-white">{MIN_BOOKING_DAYS}</span>{" "}
          days. Please choose an end date at least {MIN_BOOKING_DAYS} days after the start date.
        </div>
      ) : null}

      {isValidRange && (!pickupOk || !dropOffOk) ? (
        <div className="rounded-xl bg-neutral-100 dark:bg-white/5 px-4 py-3 text-sm text-neutral-600 dark:text-white/70 ring-1 ring-neutral-200 dark:ring-white/10">
          Complete pick-up and drop-off: add hotel name or specified address when you choose Hotel or
          Other.
        </div>
      ) : null}

      {error ? (
        <div className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-800 ring-1 ring-red-500/30 dark:text-red-200">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-neutral-100 dark:bg-white/5 p-5 ring-1 ring-neutral-200 dark:ring-white/10">
          <p className="text-sm font-medium">Pay by card</p>
          <p className="mt-1 text-sm text-neutral-600 dark:text-white/70">
            Secure credit/debit card payment via Stripe Checkout.
          </p>
          <button
            className="btn btn-primary mt-4 w-full"
            onClick={() => void payByCard()}
            disabled={busy || !canPay}
          >
            <CreditCard className="h-4 w-4" />
            Pay with card
          </button>
          <p className="mt-3 text-xs text-neutral-500 dark:text-white/55">
            Requires <span className="font-medium text-neutral-900 dark:text-white">STRIPE_SECRET_KEY</span> in{" "}
            <span className="font-medium text-neutral-900 dark:text-white">.env.local</span>.
          </p>
        </div>

        <div className="rounded-2xl bg-neutral-100 dark:bg-white/5 p-5 ring-1 ring-neutral-200 dark:ring-white/10">
          <p className="text-sm font-medium">PayPal</p>
          <p className="mt-1 text-sm text-neutral-600 dark:text-white/70">Pay using PayPal balance or card via PayPal.</p>
          {paypalClientId ? (
            <>
              <Script
                src={`https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(
                  paypalClientId
                )}&currency=${encodeURIComponent(car.currency)}`}
                strategy="afterInteractive"
              />
              {canPay ? (
                <div className="mt-4" id="paypal-buttons" />
              ) : (
                <div className="mt-4 rounded-xl bg-neutral-100 dark:bg-white/5 px-4 py-3 text-sm text-neutral-600 dark:text-white/70 ring-1 ring-neutral-200 dark:ring-white/10">
                  Select valid dates and complete pick-up/drop-off (including Hotel or Other details)
                  to enable PayPal.
                </div>
              )}
            </>
          ) : (
            <div className="mt-4 rounded-xl bg-neutral-100 dark:bg-white/5 px-4 py-3 text-sm text-neutral-600 dark:text-white/70 ring-1 ring-neutral-200 dark:ring-white/10">
              Set <span className="font-medium text-neutral-900 dark:text-white">NEXT_PUBLIC_PAYPAL_CLIENT_ID</span> to enable PayPal.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
