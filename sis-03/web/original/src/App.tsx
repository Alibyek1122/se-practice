import { useMemo, useState } from 'react';
import {
  DoorOpen,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  CalendarClock,
  Ban,
  Sparkles,
  Info,
} from 'lucide-react';

type Booking = {
  id: string;
  start: number; // minutes from 00:00
  end: number;
  label: string;
};

const CURRENT_TIME = 540; // 09:00 fixed for testing

const BASE_BOOKINGS: Booking[] = [
  { id: 'b1', start: 600, end: 660, label: '10:00–11:00' },
];

const EXTRA_BOOKING: Booking = {
  id: 'b2',
  start: 700,
  end: 760,
  label: '11:40–12:40',
};

const minutesToTime = (m: number): string => {
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
};

const timeToMinutes = (t: string): number | null => {
  const match = /^(\d{2}):(\d{2})$/.exec(t);
  if (!match) return null;
  const h = Number(match[1]);
  const min = Number(match[2]);
  if (h > 23 || min > 59) return null;
  return h * 60 + min;
};

type Result =
  | { kind: 'available'; start: number; end: number }
  | { kind: 'unavailable'; reason: string }
  | { kind: 'error'; reason: string };

function evaluate(
  start: number,
  end: number,
  blocked: boolean,
  bookings: Booking[]
): Result {
  if (!Number.isInteger(start) || start < 0 || start > 1440) {
    return { kind: 'error', reason: 'Start time must be between 00:00 and 24:00.' };
  }
  if (!Number.isInteger(end) || end < 0 || end > 1440) {
    return { kind: 'error', reason: 'End time must be between 00:00 and 24:00.' };
  }
  if (start >= end) {
    return { kind: 'error', reason: 'End time must be after the start time.' };
  }
  if (start <= CURRENT_TIME) {
    return {
      kind: 'error',
      reason: `Start time must be strictly after the current time (${minutesToTime(CURRENT_TIME)}).`,
    };
  }
  const duration = end - start;
  if (duration > 120) {
    return {
      kind: 'error',
      reason: `Booking duration is ${duration} minutes. Maximum allowed is 120 minutes.`,
    };
  }
  if (blocked) {
    return { kind: 'unavailable', reason: 'Room 101 is currently blocked.' };
  }
  const overlap = bookings.find(
    (b) => start < b.end && end > b.start
  );
  if (overlap) {
    return {
      kind: 'unavailable',
      reason: `Overlaps with an existing booking (${overlap.label}).`,
    };
  }
  return { kind: 'available', start, end };
}

function Timeline({
  bookings,
  requested,
  result,
}: {
  bookings: Booking[];
  requested: { start: number; end: number } | null;
  result: Result | null;
}) {
  const pct = (m: number) => (m / 1440) * 100;
  const hours = Array.from({ length: 25 }, (_, i) => i);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
        <CalendarClock className="h-4 w-4 text-blue-600" />
        24-hour timeline
      </div>

      <div className="relative h-16 w-full select-none">
        {/* track */}
        <div className="absolute inset-x-0 top-1/2 h-10 -translate-y-1/2 rounded-lg bg-slate-100" />

        {/* existing bookings */}
        {bookings.map((b) => (
          <div
            key={b.id}
            className="absolute top-1/2 flex h-10 -translate-y-1/2 items-center justify-center rounded-lg bg-slate-700 text-[10px] font-medium text-white shadow-sm"
            style={{ left: `${pct(b.start)}%`, width: `${pct(b.end - b.start)}%` }}
            title={`Existing booking ${b.label}`}
          >
            <span className="truncate px-1">{b.label}</span>
          </div>
        ))}

        {/* requested slot */}
        {requested && result?.kind === 'available' && (
          <div
            className="absolute top-1/2 -translate-y-1/2 rounded-lg border-2 border-emerald-500 bg-emerald-400/30"
            style={{
              left: `${pct(requested.start)}%`,
              width: `${pct(requested.end - requested.start)}%`,
            }}
            title={`Requested ${minutesToTime(requested.start)}–${minutesToTime(requested.end)}`}
          />
        )}
        {requested && result?.kind === 'unavailable' && (
          <div
            className="absolute top-1/2 -translate-y-1/2 rounded-lg border-2 border-rose-500 bg-rose-400/30"
            style={{
              left: `${pct(requested.start)}%`,
              width: `${pct(requested.end - requested.start)}%`,
            }}
            title={`Requested ${minutesToTime(requested.start)}–${minutesToTime(requested.end)}`}
          />
        )}

        {/* current time marker */}
        <div
          className="absolute top-0 z-10 h-full"
          style={{ left: `${pct(CURRENT_TIME)}%` }}
        >
          <div className="h-full w-0.5 bg-blue-600" />
          <div className="absolute -left-7 -top-1 rounded bg-blue-600 px-1 py-0.5 text-[9px] font-semibold text-white">
            Now
          </div>
        </div>
      </div>

      {/* hour scale */}
      <div className="relative mt-1 h-4 w-full">
        {hours.map((h) => (
          <div
            key={h}
            className="absolute -translate-x-1/2 text-[9px] text-slate-400"
            style={{ left: `${pct(h * 60)}%` }}
          >
            {String(h).padStart(2, '0')}
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500">
        <span className="flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded bg-slate-700" /> Existing booking
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded border-2 border-emerald-500 bg-emerald-400/30" /> Available request
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded border-2 border-rose-500 bg-rose-400/30" /> Unavailable request
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2.5 w-0.5 bg-blue-600" /> Current time (09:00)
        </span>
      </div>
    </div>
  );
}

function App() {
  const [startTime, setStartTime] = useState('10:30');
  const [endTime, setEndTime] = useState('11:30');
  const [blocked, setBlocked] = useState(false);
  const [addExtra, setAddExtra] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [requested, setRequested] = useState<{ start: number; end: number } | null>(null);

  const bookings = useMemo<Booking[]>(() => {
    const list = [...BASE_BOOKINGS];
    if (addExtra) list.push(EXTRA_BOOKING);
    return list;
  }, [addExtra]);

  const handleCheck = () => {
    const s = timeToMinutes(startTime);
    const e = timeToMinutes(endTime);
    if (s === null || e === null) {
      setResult({ kind: 'error', reason: 'Please enter valid times in HH:MM format.' });
      setRequested(null);
      return;
    }
    setRequested({ start: s, end: e });
    setResult(evaluate(s, e, blocked, bookings));
  };

  const handleReset = () => {
    setResult(null);
    setRequested(null);
  };

  const statusBadge = () => {
    if (blocked) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
          <Ban className="h-3.5 w-3.5" /> Blocked
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
        <Sparkles className="h-3.5 w-3.5" /> Operational
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <header className="mb-6 text-center">
          <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/30">
            <DoorOpen className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Smart Campus Room Availability
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Check whether Room 101 is free for your requested time slot.
          </p>
        </header>

        {/* Room card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/50 sm:p-7">
          <div className="mb-5 flex items-center justify-between rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">
                101
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Room 101</p>
                <p className="text-xs text-slate-500">Lecture Hall · Capacity 40</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              {statusBadge()}
              <span className="flex items-center gap-1 text-[11px] text-slate-400">
                <Clock className="h-3 w-3" /> Current: {minutesToTime(CURRENT_TIME)}
              </span>
            </div>
          </div>

          {/* Existing bookings */}
          <div className="mb-5">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <Info className="h-3.5 w-3.5" /> Existing bookings
            </p>
            <div className="flex flex-wrap gap-2">
              {bookings.map((b) => (
                <span
                  key={b.id}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700"
                >
                  <span className="h-2 w-2 rounded-full bg-slate-700" />
                  {b.label}
                </span>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-6">
            <Timeline bookings={bookings} requested={requested} result={result} />
          </div>

          {/* Form */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">
                Start time
              </span>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">
                End time
              </span>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </label>
          </div>

          {/* Test controls */}
          <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Test controls
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex cursor-pointer items-center gap-3">
                <button
                  type="button"
                  role="switch"
                  aria-checked={blocked}
                  onClick={() => setBlocked((v) => !v)}
                  className={`relative h-6 w-11 rounded-full transition ${
                    blocked ? 'bg-rose-500' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                      blocked ? 'left-5' : 'left-0.5'
                    }`}
                  />
                </button>
                <span className="text-sm text-slate-700">Block Room 101</span>
              </label>
              <label className="flex cursor-pointer items-center gap-3">
                <button
                  type="button"
                  role="switch"
                  aria-checked={addExtra}
                  onClick={() => setAddExtra((v) => !v)}
                  className={`relative h-6 w-11 rounded-full transition ${
                    addExtra ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                      addExtra ? 'left-5' : 'left-0.5'
                    }`}
                  />
                </button>
                <span className="text-sm text-slate-700">
                  Add booking {EXTRA_BOOKING.label}
                </span>
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleCheck}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 active:scale-[0.99]"
            >
              <CheckCircle2 className="h-4 w-4" />
              Check Availability
            </button>
            <button
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-[0.99]"
            >
              Clear
            </button>
          </div>

          {/* Result */}
          {result && (
            <div className="mt-6">
              {result.kind === 'available' && (
                <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                  <div>
                    <p className="text-sm font-bold text-emerald-800">
                      Available
                    </p>
                    <p className="mt-0.5 text-sm text-emerald-700">
                      Room 101 is available from{' '}
                      <strong>{minutesToTime(result.start)}</strong> to{' '}
                      <strong>{minutesToTime(result.end)}</strong> ({result.end - result.start} min).
                    </p>
                  </div>
                </div>
              )}
              {result.kind === 'unavailable' && (
                <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4">
                  <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
                  <div>
                    <p className="text-sm font-bold text-rose-800">
                      Unavailable
                    </p>
                    <p className="mt-0.5 text-sm text-rose-700">{result.reason}</p>
                  </div>
                </div>
              )}
              {result.kind === 'error' && (
                <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                  <div>
                    <p className="text-sm font-bold text-amber-800">
                      Invalid input
                    </p>
                    <p className="mt-0.5 text-sm text-amber-700">{result.reason}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Rules */}
          <div className="mt-6 rounded-2xl bg-slate-50 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Booking rules
            </p>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li>• Times must be between 00:00 and 24:00, in whole minutes.</li>
              <li>• Start must be strictly after the current time (09:00) and before end.</li>
              <li>• Maximum booking duration is 120 minutes (exactly 120 is allowed).</li>
              <li>• Overlapping bookings are rejected; back-to-back bookings are allowed.</li>
              <li>• A blocked room is always unavailable.</li>
            </ul>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Demo only · No booking is created · Current time fixed at 09:00 for testing
        </p>
      </div>
    </div>
  );
}

export default App;
