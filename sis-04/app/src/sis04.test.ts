import { describe, expect, test } from 'vitest';
import { filterRooms } from './filter';

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
