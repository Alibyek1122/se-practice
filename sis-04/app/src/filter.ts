import type { Room } from './rooms';

export type RoomFilter = {
  attendees: number;
  equipment: string[];
};

export function filterRooms(
  rooms: Room[],
  { attendees, equipment }: RoomFilter
): Room[] {
  return rooms.filter(
    (room) =>
      room.capacity >= attendees &&
      equipment.every((item) => room.equipment.includes(item))
  );
}
