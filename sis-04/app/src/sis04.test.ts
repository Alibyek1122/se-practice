import { describe, expect, test } from 'vitest';
import { filterRooms } from './filter';
import { canBook, checkRoom } from './booking';

const rooms = [
  {
    id: 'r1',
    name: 'Atlas Room',
    capacity: 30,
    equipment: ['projector', 'whiteboard'],
    blocked: false,
    bookings: [{ start: 600, end: 660 }],
  },
  {
    id: 'r2',
    name: 'Borealis Lab',
    capacity: 12,
    equipment: ['whiteboard'],
    blocked: false,
    bookings: [],
  },
  {
    id: 'r3',
    name: 'Cedar Hall',
    capacity: 8,
    equipment: ['projector', 'camera'],
    blocked: true,
    bookings: [],
  },
  {
    id: 'r4',
    name: 'Delta Studio',
    capacity: 20,
    equipment: ['projector', 'whiteboard', 'camera'],
    blocked: false,
    bookings: [{ start: 720, end: 780 }],
  },
];

describe('SIS 04 room filtering', () => {
  test('F1 capacity filter keeps rooms with enough seats', () => {
    const result = filterRooms(rooms, {
      attendees: 20,
      equipment: [],
    });

    expect(result.map((room) => room.id)).toEqual(['r1', 'r4']);
  });

  test('F2 equipment filter requires ALL selected equipment', () => {
    const result = filterRooms(rooms, {
      attendees: 1,
      equipment: ['projector', 'whiteboard'],
    });

    expect(result.map((room) => room.id)).toEqual(['r1', 'r4']);
  });

  test('B5 capacity equal to attendees stays in the result', () => {
    const result = filterRooms(rooms, {
      attendees: 12,
      equipment: [],
    });

    expect(result.map((room) => room.id)).toContain('r2');
  });

  test('B6 capacity one below attendees is filtered out', () => {
    const result = filterRooms(rooms, {
      attendees: 13,
      equipment: [],
    });

    expect(result.map((room) => room.id)).not.toContain('r2');
  });
});

describe('SIS 04 room availability', () => {
  test('F3 blocked room is never reported available', () => {
    const result = checkRoom(rooms, 'r3', {
      start: 900,
      end: 960,
      now: 800,
    });

    expect(result).toBe(false);
  });

  test('F5 changing selected room uses THAT room bookings', () => {
    const firstRoom = checkRoom(rooms, 'r1', {
      start: 600,
      end: 660,
      now: 500,
    });

    const secondRoom = checkRoom(rooms, 'r2', {
      start: 600,
      end: 660,
      now: 500,
    });

    expect(firstRoom).toBe(false);
    expect(secondRoom).toBe(true);
  });
});

describe('SIS 04 booking boundaries and integration', () => {
  test('B1 exactly 120 minutes returns true', () => {
    expect(
      canBook({
        start: 600,
        end: 720,
        now: 500,
        blocked: false,
        bookings: [],
      })
    ).toBe(true);
  });

  test('B2 121 minutes returns false', () => {
    expect(
      canBook({
        start: 600,
        end: 721,
        now: 500,
        blocked: false,
        bookings: [],
      })
    ).toBe(false);
  });

  test('B3 touching an existing booking returns true', () => {
    expect(
      canBook({
        start: 660,
        end: 720,
        now: 500,
        blocked: false,
        bookings: [{ start: 600, end: 660 }],
      })
    ).toBe(true);
  });

  test('B4 overlapping an existing booking returns false', () => {
    expect(
      canBook({
        start: 650,
        end: 700,
        now: 500,
        blocked: false,
        bookings: [{ start: 600, end: 660 }],
      })
    ).toBe(false);
  });

  test('INT filterRooms then checkRoom uses a returned room', () => {
    const matchedRooms = filterRooms(rooms, {
      attendees: 20,
      equipment: ['projector', 'whiteboard'],
    });

    expect(matchedRooms.map((room) => room.id)).toEqual(['r1', 'r4']);

    const available = checkRoom(matchedRooms, 'r4', {
      start: 600,
      end: 660,
      now: 500,
    });

    expect(available).toBe(true);
  });
});

test('F4 no matching rooms returns an empty result', () => {
  const result = filterRooms(rooms, {
    attendees: 100,
    equipment: ['projector'],
  });

  expect(result).toEqual([]);
});
