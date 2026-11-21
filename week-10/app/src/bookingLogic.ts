import type { Booking, Decision, Interval, Room } from '@/types';

export const MINUTES_PER_DAY = 1440;
export const MAX_BOOKING_MINUTES = 120;

/** Convert "HH:MM" to minutes from midnight, or null when malformed. */
export function timeToMinutes(value: string): number | null {
  const match = /^([0-9]{2}):([0-9]{2})$/.exec(value.trim());
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  return hours * 60 + minutes;
}

/** Convert minutes from midnight to "HH:MM" (24h). */
export function minutesToTime(min: number): string {
  const m = ((min % 1440) + 1440) % 1440;
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

/** Format an interval for display, e.g. "09:00 – 10:00". */
export function formatInterval(interval: Interval): string {
  return `${minutesToTime(interval.start)} – ${minutesToTime(interval.end)}`;
}

/** Two intervals overlap if one starts strictly before the other ends.
 *  Touching endpoints (end == start) are allowed. */
export function overlaps(a: Interval, b: Interval): boolean {
  return a.start < b.end && b.start < a.end;
}

/** AC1–AC5: evaluate a candidate interval against the rules. */
export function evaluateBooking(
  candidate: Interval,
  room: Room,
  bookings: Booking[],
  nowMinutes: number
): Decision {
  const reasons: string[] = [];

  // AC1: 0 <= start < end <= 1440 and start is strictly after the current time.
  if (candidate.start < 0) {
    reasons.push('Start time must not be before 00:00.');
  }
  if (candidate.end > MINUTES_PER_DAY) {
    reasons.push('End time must not be after 24:00.');
  }
  if (candidate.start >= candidate.end) {
    reasons.push('End time must be after the start time.');
  }
  if (candidate.start <= nowMinutes) {
    reasons.push('Start time must be after the current time.');
  }

  // AC2: no booking longer than 120 minutes.
  if (candidate.end - candidate.start > MAX_BOOKING_MINUTES) {
    reasons.push(
      `Bookings cannot exceed ${MAX_BOOKING_MINUTES} minutes (requested ${candidate.end - candidate.start} min).`
    );
  }

  // AC3: reject when the selected room is blocked.
  if (room.blocked) {
    reasons.push(`${room.name} is currently blocked for maintenance.`);
  }

  // AC4: reject overlapping existing bookings (touching endpoints allowed).
  const clashes = bookings.filter(
    (b) => b.roomId === room.id && overlaps(candidate, b)
  );
  if (clashes.length > 0) {
    const first = clashes[0];
    reasons.push(
      `Overlaps existing booking by ${first.bookedBy} at ${formatInterval(first)} (${first.purpose}).`
    );
  }

  return reasons.length === 0
    ? { kind: 'available' }
    : { kind: 'unavailable', reasons };
}
