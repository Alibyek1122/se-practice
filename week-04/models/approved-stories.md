# Approved stories — Smart Campus study room booking

**Source of this set:** My Week 03 stories, revised after review.

## Scenario

Students view room availability, book a room, and cancel their own bookings. Administrators block or unblock rooms and review usage.

- **R1** Future start, with duration greater than 0 and at most 2 hours.
- **R2** Active bookings for the same room cannot overlap.
- **R3** A blocked room cannot accept a new booking.
- **R4** A successful booking produces a confirmation.

## US-01 — View availability

**Story:** As a Student, I want to view room availability, so that I can choose a suitable room and time for study.

**Priority:** High

**Assumption:** Availability reflects existing bookings and blocked rooms.

## US-02 — Book room

**Story:** As a Student, I want to book an available room, so that I have a reserved space for individual or group study.

**Priority:** High

**Assumption:** The booking starts in the future, lasts no more than two hours, does not overlap another booking for the same room, and the room is not blocked.

## US-03 — Cancel booking

**Story:** As a Student, I want to cancel a booking that I made, so that the room becomes available when I no longer need it.

**Priority:** Medium

**Assumption:** The Student has an existing booking that they made.

## US-04 — Receive confirmation

**Story:** As a Student, I want to receive confirmation after a successful booking or cancellation, so that I know the requested action was completed.

**Priority:** Medium

**Assumption:** Confirmation is provided only after a booking or cancellation is completed successfully.

## US-05 — Block or unblock room

**Story:** As an Administrator, I want to block or unblock a study room, so that unavailable rooms cannot be booked and usable rooms can be returned to service.

**Priority:** High

**Assumption:** A blocked room cannot accept new bookings, and an unblocked room can become available for booking again.

## US-06 — Review usage

**Story:** As an Administrator, I want to review room usage over a period, so that I can understand how study rooms are being used.

**Priority:** Medium

**Assumption:** Usage is based on booking information over a selected period.

## Additional assumptions

- Touching bookings are allowed: if one booking ends at 12:00 and another starts at 12:00, they do not overlap.
- Blocking a room prevents new bookings but does not automatically cancel existing bookings.
- A booking lasting exactly two hours is allowed by R1.

**Out of scope:** payments, equipment in rooms, recurring bookings, waiting lists, notifications other than the booking confirmation, user registration.
