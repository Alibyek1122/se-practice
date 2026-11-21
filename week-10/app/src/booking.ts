import { availabilityViolations } from './availabilityRules';

export function canBook({
  start,
  end,
  now,
  blocked,
  bookings,
}: {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: { start: number; end: number }[];
}): boolean {
  return availabilityViolations({
    start,
    end,
    now,
    blocked,
    bookings,
  }).length === 0;
}
