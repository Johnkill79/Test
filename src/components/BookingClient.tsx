"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Car } from "@/lib/types";
import { calcDays, defaultRange, MIN_BOOKING_DAYS } from "@/lib/dateRange";
import {
  DEFAULT_BOOKING_LOCATION_OPTION,
  formatBookingLocation,
  isBookingLocationComplete,
  type BookingLocationOption
} from "@/lib/bookingLocations";
import { formatMoney } from "@/lib/money";
import { getWhatsAppHref } from "@/lib/whatsapp";
import { BookingLocationFields } from "@/components/BookingLocationFields";
import { CreditCard, MessageCircle } from "lucide-react";

export function BookingClient({ car }: { car: Car }) {
  const defaults = useMemo(() => defaultRange(), []);
  const [startDate, setStartDate] = useState(defaults.startDate);
  const [endDate, setEndDate] = useState(defaults.endDate);
  const [pickupOption, setPickupOption] =
    useState<BookingLocationOption>(DEFAULT_BOOKING_LOCATION_OPTION);
  const [pickupDetail, setPickupDetail] = useState("");
  const [dropOffOption, setDropOffOption] =
    useState<BookingLocationOption>(DEFAULT_BOOKING_LOCATION_OPTION);
  const [dropOffDetail, setDropOffDetail] = useState("");

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
  const canProceed = isValidRange && pickupOk && dropOffOk;
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

  const checkoutHref = `/checkout?carId=${encodeURIComponent(car.id)}&startDate=${encodeURIComponent(
    startDate
  )}&endDate=${encodeURIComponent(endDate)}&pickupOpt=${encodeURIComponent(
    pickupOption
  )}&pickupDet=${encodeURIComponent(pickupDetail)}&dropOpt=${encodeURIComponent(
    dropOffOption
  )}&dropDet=${encodeURIComponent(dropOffDetail)}`;

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
            min={startDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
        <div className="text-sm text-neutral-600 dark:text-white/70 sm:text-right">
          Days: <span className="font-semibold text-neutral-900 dark:text-white">{billableDays}</span>
          <div className="mt-1">
            Total:{" "}
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

      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          className={`btn btn-primary w-full ${!canProceed ? "pointer-events-none opacity-50" : ""}`}
          href={checkoutHref}
          aria-disabled={!canProceed}
        >
          <CreditCard className="h-4 w-4" />
          Proceed to payment
        </Link>
        <a
          className={`btn btn-ghost w-full ${!canProceed ? "pointer-events-none opacity-50" : ""}`}
          href={waHref}
          target="_blank"
          rel="noreferrer"
          aria-disabled={!canProceed}
        >
          <MessageCircle className="h-4 w-4" />
          Book on WhatsApp
        </a>
      </div>
    </div>
  );
}
