export type BookingInterval = {
  start: number;
  end: number;
};

export type Room = {
  id: string;
  name: string;
  capacity: number;
  equipment: string[];
  blocked: boolean;
  bookings: BookingInterval[];
};

export const ROOMS: Room[] = [
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
