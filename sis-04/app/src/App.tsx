import { useEffect, useMemo, useState } from 'react';
import { ROOMS } from './rooms';
import { filterRooms } from './filter';
import { checkRoom } from './booking';
import { formatInterval, timeToMinutes } from './bookingLogic';

const ALL_EQUIPMENT = Array.from(
  new Set(ROOMS.flatMap((room) => room.equipment))
);

export default function App() {
  const [attendees, setAttendees] = useState(10);
  const [equipment, setEquipment] = useState<string[]>([]);
  const [roomId, setRoomId] = useState('');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('11:00');
  const [currentTime, setCurrentTime] = useState('08:00');

  const filteredRooms = useMemo(
    () => filterRooms(ROOMS, { attendees, equipment }),
    [attendees, equipment]
  );

  useEffect(() => {
    if (filteredRooms.length === 0) {
      setRoomId('');
      return;
    }

    const selectedStillExists = filteredRooms.some(
      (room) => room.id === roomId
    );

    if (!selectedStillExists) {
      setRoomId(filteredRooms[0].id);
    }
  }, [filteredRooms, roomId]);

  const selectedRoom =
    filteredRooms.find((room) => room.id === roomId) ?? null;

  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  const now = timeToMinutes(currentTime);

  const availability =
    selectedRoom && start !== null && end !== null && now !== null
      ? checkRoom(ROOMS, selectedRoom.id, { start, end, now })
      : null;

  function toggleEquipment(item: string) {
    setEquipment((current) =>
      current.includes(item)
        ? current.filter((value) => value !== item)
        : [...current, item]
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">
            Smart Campus Room Availability
          </h1>
          <p className="mt-2 text-slate-600">
            Filter rooms by capacity and equipment, then check availability.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-semibold">Room filters</h2>

            <label className="mb-2 block text-sm font-medium">
              Number of attendees
            </label>
            <input
              type="number"
              min="1"
              value={attendees}
              onChange={(event) =>
                setAttendees(Math.max(1, Number(event.target.value) || 1))
              }
              className="mb-5 w-full rounded-lg border border-slate-300 px-3 py-2"
            />

            <p className="mb-2 text-sm font-medium">Required equipment</p>

            <div className="mb-6 flex flex-wrap gap-3">
              {ALL_EQUIPMENT.map((item) => (
                <label
                  key={item}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2"
                >
                  <input
                    type="checkbox"
                    checked={equipment.includes(item)}
                    onChange={() => toggleEquipment(item)}
                  />
                  <span className="capitalize">{item}</span>
                </label>
              ))}
            </div>

            {filteredRooms.length === 0 ? (
              <div
                role="status"
                className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-900"
              >
                No rooms match the selected capacity and equipment.
              </div>
            ) : (
              <>
                <label
                  htmlFor="room"
                  className="mb-2 block text-sm font-medium"
                >
                  Matching room
                </label>

                <select
                  id="room"
                  value={roomId}
                  onChange={(event) => setRoomId(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                >
                  {filteredRooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name} — {room.capacity} seats
                      {room.blocked ? ' — blocked' : ''}
                    </option>
                  ))}
                </select>

                <div className="mt-4 grid gap-2 text-sm text-slate-600">
                  {filteredRooms.map((room) => (
                    <div
                      key={room.id}
                      className="rounded-lg border border-slate-200 p-3"
                    >
                      <strong>{room.name}</strong>
                      <div>Capacity: {room.capacity}</div>
                      <div>Equipment: {room.equipment.join(', ')}</div>
                      <div>
                        Status: {room.blocked ? 'Blocked' : 'Open'}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-semibold">
              Availability checker
            </h2>

            <div className="grid gap-4 sm:grid-cols-3">
              <label className="text-sm font-medium">
                Start
                <input
                  type="time"
                  value={startTime}
                  onChange={(event) => setStartTime(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </label>

              <label className="text-sm font-medium">
                End
                <input
                  type="time"
                  value={endTime}
                  onChange={(event) => setEndTime(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </label>

              <label className="text-sm font-medium">
                Current time
                <input
                  type="time"
                  value={currentTime}
                  onChange={(event) => setCurrentTime(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </label>
            </div>

            <div className="mt-6">
              {!selectedRoom ? (
                <div className="rounded-xl bg-slate-100 p-4 text-slate-600">
                  Select filters that return at least one room.
                </div>
              ) : availability ? (
                <div
                  role="status"
                  className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-900"
                >
                  <strong>Available — {selectedRoom.name}</strong>
                  <p className="mt-1 text-sm">
                    The selected room is available for this time.
                  </p>
                </div>
              ) : (
                <div
                  role="alert"
                  className="rounded-xl border border-rose-300 bg-rose-50 p-4 text-rose-900"
                >
                  <strong>Unavailable — {selectedRoom.name}</strong>
                  <p className="mt-1 text-sm">
                    The selected room does not satisfy the booking rules for
                    this time.
                  </p>
                </div>
              )}
            </div>

            {selectedRoom && (
              <div className="mt-6">
                <h3 className="mb-3 font-semibold">
                  {selectedRoom.name} bookings
                </h3>

                {selectedRoom.bookings.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No existing bookings.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {selectedRoom.bookings.map((booking, index) => (
                      <li
                        key={`${booking.start}-${booking.end}-${index}`}
                        className="rounded-lg bg-slate-100 px-3 py-2 text-sm"
                      >
                        {formatInterval(booking)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
