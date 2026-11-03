import { describe, expect, test } from 'vitest';
import { canBook } from '../../app/src/booking';

// Save as week-07/suites/first/booking.test.ts.
// Imports canBook from the supplied app/src/booking.ts module.
// No production implementation is copied, mocked, or changed.
// Run from week-07/app:
// npx vitest run --root .. suites/first/booking.test.ts
// AC mapping:
// AC1: T02, T03, T04, T05, X1, X2.
// AC2: T06, T07. AC3: T13.
// AC4: T01, T08, T09, T10, T11, T12, T14.
// AC5: dedicated AC5 test plus exact decisions and unchanged data in all tests.
// AC5's visible Available/Unavailable text requires a page-level check.
// AC6: requires browser/manual checks for desktop/mobile usability and feedback;
// it is not covered by these function tests. Viewports, expected validation copy,
// and observable usability criteria are not specified.

function freshRequest(start: number, end: number) {
  return {
    start,
    end,
    now: 540,
    blocked: false,
    bookings: [{ start: 600, end: 660 }],
  };
}

describe('canBook — reviewed booking cases', () => {
  test('T01 AC4: touching after is available', () => {
    const request = freshRequest(660, 720);
    const before = {
      ...request,
      bookings: request.bookings.map((booking) => ({ ...booking })),
    };

    const decision = canBook(request);

    expect(decision).toBe(true);
    expect(request.bookings).toStrictEqual(before.bookings);
    expect(request).toStrictEqual(before);
  });

  test('T02 AC1: starting now is unavailable', () => {
    const request = freshRequest(540, 570);
    const before = {
      ...request,
      bookings: request.bookings.map((booking) => ({ ...booking })),
    };

    const decision = canBook(request);

    expect(decision).toBe(false);
    expect(request.bookings).toStrictEqual(before.bookings);
    expect(request).toStrictEqual(before);
  });

  test('T03 AC1: zero duration is unavailable', () => {
    const request = freshRequest(720, 720);
    const before = {
      ...request,
      bookings: request.bookings.map((booking) => ({ ...booking })),
    };

    const decision = canBook(request);

    expect(decision).toBe(false);
    expect(request.bookings).toStrictEqual(before.bookings);
    expect(request).toStrictEqual(before);
  });

  test('T04 AC1: reversed interval is unavailable', () => {
    const request = freshRequest(750, 720);
    const before = {
      ...request,
      bookings: request.bookings.map((booking) => ({ ...booking })),
    };

    const decision = canBook(request);

    expect(decision).toBe(false);
    expect(request.bookings).toStrictEqual(before.bookings);
    expect(request).toStrictEqual(before);
  });

  test('T05 AC1: ending after day end is unavailable', () => {
    const request = freshRequest(1380, 1441);
    const before = {
      ...request,
      bookings: request.bookings.map((booking) => ({ ...booking })),
    };

    const decision = canBook(request);

    expect(decision).toBe(false);
    expect(request.bookings).toStrictEqual(before.bookings);
    expect(request).toStrictEqual(before);
  });

  test('T06 AC2: exactly 120 minutes is available', () => {
    const request = freshRequest(720, 840);
    const before = {
      ...request,
      bookings: request.bookings.map((booking) => ({ ...booking })),
    };

    const decision = canBook(request);

    expect(decision).toBe(true);
    expect(request.bookings).toStrictEqual(before.bookings);
    expect(request).toStrictEqual(before);
  });

  test('T07 AC2: 121 minutes is unavailable', () => {
    const request = freshRequest(720, 841);
    const before = {
      ...request,
      bookings: request.bookings.map((booking) => ({ ...booking })),
    };

    const decision = canBook(request);

    expect(decision).toBe(false);
    expect(request.bookings).toStrictEqual(before.bookings);
    expect(request).toStrictEqual(before);
  });

  test('T08 AC4: touching before is available', () => {
    const request = freshRequest(570, 600);
    const before = {
      ...request,
      bookings: request.bookings.map((booking) => ({ ...booking })),
    };

    const decision = canBook(request);

    expect(decision).toBe(true);
    expect(request.bookings).toStrictEqual(before.bookings);
    expect(request).toStrictEqual(before);
  });

  test('T09 AC4: partial overlap is unavailable', () => {
    const request = freshRequest(630, 690);
    const before = {
      ...request,
      bookings: request.bookings.map((booking) => ({ ...booking })),
    };

    const decision = canBook(request);

    expect(decision).toBe(false);
    expect(request.bookings).toStrictEqual(before.bookings);
    expect(request).toStrictEqual(before);
  });

  test('T10 AC4: containing an existing booking is unavailable', () => {
    const request = freshRequest(570, 690);
    const before = {
      ...request,
      bookings: request.bookings.map((booking) => ({ ...booking })),
    };

    const decision = canBook(request);

    expect(decision).toBe(false);
    expect(request.bookings).toStrictEqual(before.bookings);
    expect(request).toStrictEqual(before);
  });

  test('T11 AC4: inside an existing booking is unavailable', () => {
    const request = freshRequest(615, 645);
    const before = {
      ...request,
      bookings: request.bookings.map((booking) => ({ ...booking })),
    };

    const decision = canBook(request);

    expect(decision).toBe(false);
    expect(request.bookings).toStrictEqual(before.bookings);
    expect(request).toStrictEqual(before);
  });

  test('T12 AC4: identical interval is unavailable', () => {
    const request = freshRequest(600, 660);
    const before = {
      ...request,
      bookings: request.bookings.map((booking) => ({ ...booking })),
    };

    const decision = canBook(request);

    expect(decision).toBe(false);
    expect(request.bookings).toStrictEqual(before.bookings);
    expect(request).toStrictEqual(before);
  });

  test('T13 AC3: blocked request is unavailable', () => {
    const request = freshRequest(660, 720);
    request.blocked = true;
    const before = {
      ...request,
      bookings: request.bookings.map((booking) => ({ ...booking })),
    };

    const decision = canBook(request);

    expect(decision).toBe(false);
    expect(request.bookings).toStrictEqual(before.bookings);
    expect(request).toStrictEqual(before);
  });

  test('T14 AC4: empty bookings allow an otherwise valid request', () => {
    const request = freshRequest(630, 690);
    request.bookings = [];
    const before = {
      ...request,
      bookings: request.bookings.map((booking) => ({ ...booking })),
    };

    const decision = canBook(request);

    expect(decision).toBe(true);
    expect(request.bookings).toStrictEqual(before.bookings);
    expect(request).toStrictEqual(before);
  });

  test('AC5: available decision leaves bookings unchanged', () => {
    const request = freshRequest(660, 720);
    const before = {
      ...request,
      bookings: request.bookings.map((booking) => ({ ...booking })),
    };

    const decision = canBook(request);

    expect(decision).toBe(true);
    expect(request.bookings).toStrictEqual(before.bookings);
    expect(request).toStrictEqual(before);
  });

  test('X1 AC1: ending exactly at 1440 is available', () => {
    const request = freshRequest(1380, 1440);
    const before = {
      ...request,
      bookings: request.bookings.map((booking) => ({ ...booking })),
    };

    const decision = canBook(request);

    expect(decision).toBe(true);
    expect(request.bookings).toStrictEqual(before.bookings);
    expect(request).toStrictEqual(before);
  });

  test('X2 AC1: one minute starting after now is available', () => {
    const request = freshRequest(541, 542);
    const before = {
      ...request,
      bookings: request.bookings.map((booking) => ({ ...booking })),
    };

    const decision = canBook(request);

    expect(decision).toBe(true);
    expect(request.bookings).toStrictEqual(before.bookings);
    expect(request).toStrictEqual(before);
  });

});
