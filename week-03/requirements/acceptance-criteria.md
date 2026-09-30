# Acceptance criteria — three selected stories

Assumptions first, then the criteria. Each block names the story it belongs to. 3 to 5 criteria per
story, every one in Given / When / Then form, and every set covers a validation or error case — not
three happy paths.

---

## Assumptions

- **Overlap:** a booking that ends exactly when another begins is allowed under R3, because the time periods only touch at the boundary and do not overlap.
- **Duration:** a booking of exactly two hours is allowed under R2, because R2 says a booking lasts at most two hours.
- A Student may cancel only a booking that they made.
- Confirmation is provided only after a booking or cancellation completes successfully.

---

## US-02 — Book room

### AC-01 — Successful booking
- **Given** a room is available and not blocked, the booking starts in the future, lasts no more than two hours, and does not overlap another booking for the same room
- **When** the Student submits the booking request
- **Then** the booking is created for the selected room and time period

### AC-02 — Booking must start in the future
- **Given** the requested booking start time is not in the future
- **When** the Student attempts to book the room
- **Then** the booking is rejected

### AC-03 — Maximum duration
- **Given** the requested booking lasts more than two hours
- **When** the Student attempts to book the room
- **Then** the booking is rejected

### AC-04 — Exact two-hour boundary
- **Given** the requested booking lasts exactly two hours and satisfies the other booking rules
- **When** the Student attempts to book the room
- **Then** the booking is accepted

### AC-05 — Overlapping or blocked room
- **Given** the requested time overlaps another booking for the same room or the room is blocked
- **When** the Student attempts to book the room
- **Then** the booking is rejected

---

## US-03 — Cancel booking

### AC-06 — Successful cancellation
- **Given** the Student has an existing booking that they made
- **When** the Student cancels the booking
- **Then** the booking is cancelled and the room is released for that time period

### AC-07 — Booking made by another Student
- **Given** the booking was not made by the Student
- **When** the Student attempts to cancel the booking
- **Then** the booking is not cancelled

### AC-08 — No matching booking
- **Given** no matching booking made by the Student exists
- **When** the Student attempts to cancel the booking
- **Then** no booking is cancelled

---

## US-04 — Receive confirmation

### AC-09 — Booking confirmation
- **Given** a booking is successfully created
- **When** the booking operation completes
- **Then** the system provides confirmation of the successful booking

### AC-10 — Cancellation confirmation
- **Given** a booking is successfully cancelled
- **When** the cancellation operation completes
- **Then** the system provides confirmation of the successful cancellation

### AC-11 — Failed operation
- **Given** a booking or cancellation request fails
- **When** the operation is not completed successfully
- **Then** the system does not provide a successful confirmation