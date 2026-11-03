export interface Room {
  id: string;
  name: string;
  building: string;
  capacity: number;
  blocked: boolean;
}

export interface Booking {
  id: string;
  roomId: string;
  start: number; // minutes from midnight
  end: number; // minutes from midnight
  bookedBy: string;
  purpose: string;
}

export interface Interval {
  start: number;
  end: number;
}

export type Decision =
  | { kind: 'available' }
  | { kind: 'unavailable'; reasons: string[] };
