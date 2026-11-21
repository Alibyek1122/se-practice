import type { Booking, Decision, Interval, Room } from '@/types';
import {
  availabilityViolations,
  MAX_BOOKING_MINUTES,
  overlaps,
} from '@/availabilityRules';

export { MAX_BOOKING_MINUTES, MINUTES_PER_DAY } from '@/availabilityRules';

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

/** AC1–AC5: evaluate a candidate interval against the rules. */
export function evaluateBooking(
  candidate: Interval,
  room: Room,
  bookings: Booking[],
  nowMinutes: number
): Decision {
  const roomBookings = bookings.filter((b) => b.roomId === room.id);

  const violations = availabilityViolations({
    start: candidate.start,
    end: candidate.end,
    now: nowMinutes,
    blocked: room.blocked,
    bookings: roomBookings,
  });

  const reasons: string[] = [];

  for (const violation of violations) {
    switch (violation) {
      case 'invalid-number':
        reasons.push('Start, end, and current time must be valid numbers.');
        break;
      case 'start-before-day':
        reasons.push('Start time must not be before 00:00.');
        break;
      case 'end-after-day':
        reasons.push('End time must not be after 24:00.');
        break;
      case 'invalid-order':
        reasons.push('End time must be after the start time.');
        break;
      case 'not-future':
        reasons.push('Start time must be after the current time.');
        break;
      case 'too-long':
        reasons.push(
          `Bookings cannot exceed ${MAX_BOOKING_MINUTES} minutes (requested ${candidate.end - candidate.start} min).`
        );
        break;
      case 'blocked':
        reasons.push(`${room.name} is currently blocked for maintenance.`);
        break;
      case 'overlap': {
        const first = roomBookings.find((b) => overlaps(candidate, b));

        if (first) {
          reasons.push(
            `Overlaps existing booking by ${first.bookedBy} at ${formatInterval(first)} (${first.purpose}).`
          );
        }
        break;
      }
    }
  }

  return reasons.length === 0
    ? { kind: 'available' }
    : { kind: 'unavailable', reasons };
}
