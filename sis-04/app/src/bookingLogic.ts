import type { Interval } from './types';

/** Convert "HH:MM" to minutes from midnight, or null when malformed. */
export function timeToMinutes(value: string): number | null {
  const match = /^([0-9]{2}):([0-9]{2})$/.exec(value.trim());

  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (hours > 23 || minutes > 59) return null;

  return hours * 60 + minutes;
}

/** Convert minutes from midnight to "HH:MM". */
export function minutesToTime(min: number): string {
  const normalized = ((min % 1440) + 1440) % 1440;
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

/** Format an interval for display. */
export function formatInterval(interval: Interval): string {
  return `${minutesToTime(interval.start)} – ${minutesToTime(interval.end)}`;
}
