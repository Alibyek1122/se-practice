import type { Booking, Room } from '@/types';

// Fictional sample data only.
export const SAMPLE_ROOMS: Room[] = [
  { id: 'r1', name: 'Atlas 101', building: 'Atlas Hall', capacity: 30, blocked: false },
  { id: 'r2', name: 'Borealis 220', building: 'Borealis Wing', capacity: 12, blocked: false },
  { id: 'r3', name: 'Cedar Loft 3', building: 'Cedar Pavilion', capacity: 8, blocked: true },
  { id: 'r4', name: 'Delta Lab 4', building: 'Delta Block', capacity: 24, blocked: false },
  { id: 'r5', name: 'Eos Seminar 7', building: 'Eos Center', capacity: 16, blocked: false },
];

export const SAMPLE_BOOKINGS: Booking[] = [
  { id: 'b1', roomId: 'r1', start: 540, end: 600, bookedBy: 'M. Okafor', purpose: 'Faculty sync' },
  { id: 'b2', roomId: 'r1', start: 780, end: 840, bookedBy: 'Study Group B', purpose: 'Capstone review' },
  { id: 'b3', roomId: 'r2', start: 600, end: 660, bookedBy: 'R. Lindqvist', purpose: 'Office hours' },
  { id: 'b4', roomId: 'r4', start: 900, end: 960, bookedBy: 'Robotics Club', purpose: 'Build session' },
  { id: 'b5', roomId: 'r5', start: 660, end: 720, bookedBy: 'Career Services', purpose: 'Mock interviews' },
];
