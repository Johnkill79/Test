"use client";

import {
  BOOKING_LOCATION_OPTIONS,
  type BookingLocationOption
} from "@/lib/bookingLocations";

const selectClass =
  "input-field appearance-none bg-[length:1rem] bg-[right_0.75rem_center] bg-no-repeat pr-10";

export function BookingLocationFields({
  label,
  option,
  detail,
  onOptionChange,
  onDetailChange
}: {
  label: string;
  option: BookingLocationOption;
  detail: string;
  onOptionChange: (v: BookingLocationOption) => void;
  onDetailChange: (v: string) => void;
}) {
  const needsDetail = option === "hotel" || option === "other";

  return (
    <div className="block sm:col-span-2">
      <label className="block">
        <span className="text-xs text-neutral-600 dark:text-white/70">{label}</span>
        <select
          className={selectClass}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`
          }}
          value={option}
          onChange={(e) => onOptionChange(e.target.value as BookingLocationOption)}
        >
          {BOOKING_LOCATION_OPTIONS.map((o) => (
            <option
              key={o.value}
              value={o.value}
              className="bg-white text-neutral-900 dark:bg-neutral-900 dark:text-white"
            >
              {o.label}
            </option>
          ))}
        </select>
      </label>
      {needsDetail ? (
        <label className="mt-3 block">
          <span className="text-xs text-neutral-600 dark:text-white/70">
            {option === "hotel" ? "Hotel name or address" : "Specify location"}
          </span>
          <input
            className="input-field"
            type="text"
            autoComplete="off"
            placeholder={
              option === "hotel" ? "e.g. Hue Hotels / Astoria Palawan..." : "Address or landmark..."
            }
            value={detail}
            onChange={(e) => onDetailChange(e.target.value)}
          />
        </label>
      ) : null}
    </div>
  );
}
