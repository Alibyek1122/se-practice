export const MINUTES_PER_DAY = 1440;
export const MAX_BOOKING_MINUTES = 120;

export interface IntervalLike {
  start: number;
  end: number;
}

export type AvailabilityViolation =
  | 'invalid-number'
  | 'start-before-day'
  | 'end-after-day'
  | 'invalid-order'
  | 'not-future'
  | 'too-long'
  | 'blocked'
  | 'overlap';

export function overlaps(a: IntervalLike, b: IntervalLike): boolean {
  return a.start < b.end && b.start < a.end;
}

export function availabilityViolations({
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
  bookings: IntervalLike[];
}): AvailabilityViolation[] {
  const violations: AvailabilityViolation[] = [];

  if (![start, end, now].every(Number.isFinite)) {
    violations.push('invalid-number');
    return violations;
  }

  if (start < 0) violations.push('start-before-day');
  if (end > MINUTES_PER_DAY) violations.push('end-after-day');
  if (start >= end) violations.push('invalid-order');
  if (start <= now) violations.push('not-future');
  if (end - start > MAX_BOOKING_MINUTES) violations.push('too-long');
  if (blocked) violations.push('blocked');
  if (bookings.some((booking) => overlaps({ start, end }, booking))) {
    violations.push('overlap');
  }

  return violations;
}
