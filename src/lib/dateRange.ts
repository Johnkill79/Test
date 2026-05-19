export type BookingRange = {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  days: number;
};

export const MIN_BOOKING_DAYS = 2;

function parseYmd(ymd: string) {
  // interpret as UTC midnight to avoid timezone shifting
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (!Number.isFinite(y) || !Number.isFinite(mo) || !Number.isFinite(d)) return null;
  return new Date(Date.UTC(y, mo - 1, d, 0, 0, 0, 0));
}

export function calcDays(startDate: string, endDate: string) {
  const a = parseYmd(startDate);
  const b = parseYmd(endDate);
  if (!a || !b) return 0;
  const diffMs = b.getTime() - a.getTime();
  const dayMs = 24 * 60 * 60 * 1000;
  const days = Math.round(diffMs / dayMs);
  // Common rental convention: end date is drop-off date (must be after start)
  return Math.max(0, days);
}

export function defaultRange() {
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const end = new Date(start.getTime() + MIN_BOOKING_DAYS * 24 * 60 * 60 * 1000);

  const toYmd = (d: Date) =>
    `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(
      d.getUTCDate()
    ).padStart(2, "0")}`;

  return {
    startDate: toYmd(start),
    endDate: toYmd(end)
  };
}

