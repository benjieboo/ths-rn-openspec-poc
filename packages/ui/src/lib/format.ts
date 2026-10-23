const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_LONG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// Dates are calendar dates (YYYY-MM-DD) with no time zone; parse as UTC so they never shift a day.
function toDate(value: string | Date) {
  if (value instanceof Date) return value;
  const [y, m, d] = value.slice(0, 10).split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

const yy = (d: Date) => String(d.getUTCFullYear()).slice(2);

/** "20 – 27 Dec 26", "28 Dec 26 – 4 Jan 27". Pass `fullYear` for "24 Jun – 20 Jul 2026". */
export function formatDateRange(start: string | Date, end: string | Date, { fullYear = false } = {}) {
  const a = toDate(start);
  const b = toDate(end);
  const year = (d: Date) => (fullYear ? String(d.getUTCFullYear()) : yy(d));
  const day = (d: Date) => (fullYear ? String(d.getUTCDate()).padStart(2, '0') : String(d.getUTCDate()));
  const sameYear = a.getUTCFullYear() === b.getUTCFullYear();
  const sameMonth = sameYear && a.getUTCMonth() === b.getUTCMonth();
  if (sameMonth) return `${day(a)} – ${day(b)} ${MONTHS[b.getUTCMonth()]} ${year(b)}`;
  if (sameYear) return `${day(a)} ${MONTHS[a.getUTCMonth()]} – ${day(b)} ${MONTHS[b.getUTCMonth()]} ${year(b)}`;
  return `${day(a)} ${MONTHS[a.getUTCMonth()]} ${year(a)} – ${day(b)} ${MONTHS[b.getUTCMonth()]} ${year(b)}`;
}

/** Screen-reader form: "20 December to 27 December 2026". */
export function formatDateRangeSpoken(start: string | Date, end: string | Date) {
  const a = toDate(start);
  const b = toDate(end);
  const sameYear = a.getUTCFullYear() === b.getUTCFullYear();
  const first = `${a.getUTCDate()} ${MONTHS_LONG[a.getUTCMonth()]}${sameYear ? '' : ` ${a.getUTCFullYear()}`}`;
  return `${first} to ${b.getUTCDate()} ${MONTHS_LONG[b.getUTCMonth()]} ${b.getUTCFullYear()}`;
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join('');
}
