// Single-family app — everyone on the team is assumed to share one timezone,
// so "today" is computed against this constant rather than per-viewer device
// detection. Update this if the family's timezone changes.
export const CHILD_TIMEZONE = "America/Denver";

/**
 * Returns the UTC instants bounding "today" (midnight to midnight) in the
 * given IANA timezone, plus that day's Y-M-D as a string. Ignores DST
 * transition edge cases mid-day — acceptable for a daily reset boundary.
 */
export function getLocalDay(timeZone: string, now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(now);

  const get = (type: string) =>
    Number(parts.find((p) => p.type === type)?.value ?? "0");
  const y = get("year");
  const mo = get("month");
  const d = get("day");

  // Comparing the wall-clock reading (treated as UTC) against the real UTC
  // instant gives the timezone's current offset.
  const wallClockAsUtc = Date.UTC(
    y,
    mo - 1,
    d,
    get("hour"),
    get("minute"),
    get("second"),
  );
  const offsetMs = wallClockAsUtc - now.getTime();

  const startOfDayAsUtc = Date.UTC(y, mo - 1, d, 0, 0, 0);
  const start = new Date(startOfDayAsUtc - offsetMs);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  const dateString = `${y}-${String(mo).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  return { start, end, dateString };
}
