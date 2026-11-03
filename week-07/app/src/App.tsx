import { useMemo, useState } from 'react';
import {
  Building2,
  CalendarCheck,
  CalendarClock,
  CalendarX,
  CheckCircle2,
  Clock,
  DoorClosed,
  Info,
  Users,
  XCircle,
} from 'lucide-react';
import {
  formatInterval,
  MAX_BOOKING_MINUTES,
  MINUTES_PER_DAY,
  minutesToTime,
  timeToMinutes,
} from '@/bookingLogic';
import { evaluateBooking } from '@/bookingLogic';
import { SAMPLE_BOOKINGS, SAMPLE_ROOMS } from '@/data';
import type { Decision } from '@/types';

const CURRENT_TIME_DEFAULT = '13:30';

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

export default function App() {
  const [bookings] = useState(SAMPLE_BOOKINGS);

  const [roomId, setRoomId] = useState<string>(SAMPLE_ROOMS[0].id);
  const [startTime, setStartTime] = useState<string>('14:00');
  const [endTime, setEndTime] = useState<string>('15:00');
  const [currentTime, setCurrentTime] = useState<string>(CURRENT_TIME_DEFAULT);

  const nowMinutes = timeToMinutes(currentTime) ?? 0;
  const selectedRoom =
    SAMPLE_ROOMS.find((r) => r.id === roomId) ?? SAMPLE_ROOMS[0];

  const startMin = timeToMinutes(startTime);
  const endMin = timeToMinutes(endTime);

  const decision: Decision | null = useMemo(() => {
    if (startMin === null || endMin === null) return null;
    return evaluateBooking(
      { start: startMin, end: endMin },
      selectedRoom,
      bookings,
      nowMinutes
    );
  }, [startMin, endMin, selectedRoom, bookings, nowMinutes]);

  const roomBookings = bookings
    .filter((b) => b.roomId === selectedRoom.id)
    .sort((a, b) => a.start - b.start);

  const nowClock = useMemo(() => {
    const h = Math.floor(nowMinutes / 60);
    const m = nowMinutes % 60;
    return `${pad(h)}:${pad(m)}`;
  }, [nowMinutes]);

  const inputBase =
    'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 text-sm shadow-sm transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 focus:outline-none';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        {/* Header */}
        <header className="mb-8 sm:mb-12">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-sky-600 text-white shadow-lg shadow-sky-600/20">
              <CalendarCheck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Smart Campus Room Availability
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Check whether a campus room is available for your requested time.
              </p>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Checker panel */}
          <section className="lg:col-span-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-slate-800">
              <Clock className="h-5 w-5 text-sky-600" />
              Request a room
            </h2>

            <div className="grid gap-5">
              {/* Room picker */}
              <div>
                <label
                  htmlFor="room"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Room
                </label>
                <select
                  id="room"
                  className={inputBase}
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                >
                  {SAMPLE_ROOMS.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name} — {room.building}
                      {room.blocked ? ' (blocked)' : ''}
                    </option>
                  ))}
                </select>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5" /> {selectedRoom.building}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" /> Seats {selectedRoom.capacity}
                  </span>
                  {selectedRoom.blocked && (
                    <span className="inline-flex items-center gap-1 font-medium text-rose-600">
                      <DoorClosed className="h-3.5 w-3.5" /> Blocked
                    </span>
                  )}
                </div>
              </div>

              {/* Times */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label
                    htmlFor="start"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Start time
                  </label>
                  <input
                    id="start"
                    type="time"
                    className={inputBase}
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="end"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    End time
                  </label>
                  <input
                    id="end"
                    type="time"
                    className={inputBase}
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="now"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Current time
                  </label>
                  <input
                    id="now"
                    type="time"
                    className={inputBase}
                    value={currentTime}
                    onChange={(e) => setCurrentTime(e.target.value)}
                  />
                </div>
              </div>

              {/* Duration hint */}
              <div className="flex items-start gap-2 rounded-xl bg-sky-50 px-3.5 py-2.5 text-xs text-sky-800">
                <Info className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  Day runs 00:00–24:00 ({MINUTES_PER_DAY} min). Bookings may last up to{' '}
                  {MAX_BOOKING_MINUTES} minutes and must start after the current time
                  ({nowClock}). Touching endpoints are allowed.
                </span>
              </div>

              {/* Decision */}
              <DecisionCard
                decision={decision}
                roomName={selectedRoom.name}
                interval={
                  startMin !== null && endMin !== null
                    ? formatInterval({ start: startMin, end: endMin })
                    : null
                }
              />
            </div>
          </section>

          {/* Side panel: existing bookings */}
          <aside className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-800">
              <CalendarClock className="h-5 w-5 text-sky-600" />
              {selectedRoom.name} — today's bookings
            </h2>

            {roomBookings.length === 0 ? (
              <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3.5 py-3 text-sm text-slate-500">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                No existing bookings for this room.
              </div>
            ) : (
              <ul className="space-y-2.5">
                {roomBookings.map((b) => (
                  <li
                    key={b.id}
                    className="rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-sm font-medium text-slate-800">
                        {formatInterval({ start: b.start, end: b.end })}
                      </span>
                      <span className="text-xs text-slate-400">
                        {b.end - b.start} min
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      {b.bookedBy} — {b.purpose}
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 px-3.5 py-2.5 text-xs text-amber-800">
              <Info className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                Availability checks do not create or change any booking — your
                existing data stays untouched.
              </span>
            </div>
          </aside>
        </div>

        <footer className="mt-10 text-center text-xs text-slate-400">
          Smart Campus Availability Checker · Fictional sample data · For demonstration only
        </footer>
      </div>
    </div>
  );
}

function DecisionCard({
  decision,
  roomName,
  interval,
}: {
  decision: Decision | null;
  roomName: string;
  interval: string | null;
}) {
  if (decision === null) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
        <Info className="h-4 w-4" />
        Enter valid start and end times to see an availability decision.
      </div>
    );
  }

  if (decision.kind === 'available') {
    return (
      <div
        role="status"
        className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3.5"
      >
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
        <div>
          <p className="font-semibold text-emerald-800">
            Available — {roomName}
            {interval ? ` · ${interval}` : ''}
          </p>
          <p className="mt-0.5 text-sm text-emerald-700">
            This slot is free and satisfies all booking rules.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3.5"
    >
      <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
      <div>
        <p className="font-semibold text-rose-800">
          Unavailable — {roomName}
          {interval ? ` · ${interval}` : ''}
        </p>
        <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm text-rose-700">
          {decision.reasons.map((reason, idx) => (
            <li key={idx}>{reason}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
