export const BOOKING_LOCATION_OPTIONS = [
  { value: "puerto-princesa-airport", label: "Puerto Princesa Airport" },
  { value: "p-car-rental-office", label: "P Car Rental Office" },
  { value: "hotel", label: "Hotel" },
  { value: "other", label: "Other (specify)" }
] as const;

export type BookingLocationOption = (typeof BOOKING_LOCATION_OPTIONS)[number]["value"];

export const DEFAULT_BOOKING_LOCATION_OPTION: BookingLocationOption = "puerto-princesa-airport";

export function formatBookingLocation(option: BookingLocationOption, detail: string): string {
  const d = detail.trim();
  switch (option) {
    case "puerto-princesa-airport":
      return "Puerto Princesa Airport";
    case "p-car-rental-office":
      return "P Car Rental Office";
    case "hotel":
      return d ? `Hotel: ${d}` : "";
    case "other":
      return d;
  }
}

export function isBookingLocationComplete(option: BookingLocationOption, detail: string): boolean {
  return formatBookingLocation(option, detail).length > 0;
}

function isBookingLocationOption(v: string | undefined): v is BookingLocationOption {
  return BOOKING_LOCATION_OPTIONS.some((o) => o.value === v);
}

/** Restore pick/drop controls from URL params or legacy composed strings. */
export function bookingLocationFromSearch(
  opt: string | undefined,
  det: string | undefined,
  legacyComposed: string | undefined
): { option: BookingLocationOption; detail: string } {
  if (isBookingLocationOption(opt)) {
    return { option: opt, detail: det ?? "" };
  }
  const leg = legacyComposed?.trim();
  if (!leg) return { option: DEFAULT_BOOKING_LOCATION_OPTION, detail: "" };
  if (leg === "Puerto Princesa Airport") return { option: "puerto-princesa-airport", detail: "" };
  if (leg === "P Car Rental Office") return { option: "p-car-rental-office", detail: "" };
  if (leg.startsWith("Hotel:")) return { option: "hotel", detail: leg.slice(6).trim() };
  return { option: "other", detail: leg };
}
