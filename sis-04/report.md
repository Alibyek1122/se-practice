# SIS #04 — Report: Evolving the Smart Campus Room Availability Checker

<!-- The ONLY file you write prose in. Keep every numbered heading (## 1. … ## 10.), every
     ### sub-heading and every **Label:** word — the checker finds your answers by them.
     Replace every "(write here)" and "(paste here)". Delete these <!-- --> comments if you like. -->

## 1. Setup and starting point

<!-- Model: the exact model with its version, as the tool shows it ("ChatGPT" is a tool, not a
     model). If the tool does not show it, write: not displayed
     Starting point: week-08 | week-07 | sis-03 | starter   (README section 3)
     Baseline commit: the commit that brings your starting point into sis-04/app/ UNCHANGED —
     git rev-parse --short HEAD right after that commit. It is your "initial version". -->

| Item | Value |
| --- | --- |
| Assistant (tool) | ChatGPT |
| Assistant model | GPT-5.6 Sol |
| Starting point | week-08 |
| Baseline commit | c42f483  |
| Language (ts or js) | ts |
| Vitest version | v4.1.12 |
| Where I ran the tests | My computer (macOS terminal) |

### 1.1 Baseline run

<!-- Before you change anything: run the tests of your starting point inside app/ and paste the
     REAL output. No tests yet (starter, sis-03)? Paste the run anyway: Vitest prints
     "No test files found". That is your honest "original" number, 0/0. -->

```text
Test Files  1 passed (1)
Tests       27 passed (27)
```

## 2. Context for the assistant

### 2.1 Repository map

<!-- The concise map you gave the assistant: the files that matter and one line each on what
     they do. A tree is fine:  src/App.tsx — the page, holds the rooms and the form … -->

```text
src/App.tsx — React UI; selects a room, prepares booking input and renders availability feedback.
src/booking.ts — contains canBook(), the existing boolean AC1–AC5 booking rule.
src/bookingLogic.ts — time helpers, overlap logic, formatting and evaluateBooking().
src/data.ts — contains the current fictional rooms and bookings.
src/types.ts — contains Room, Booking, Interval and Decision types.
src/booking.test.ts — existing Vitest suite for the original booking rules.

```

### 2.2 The context message as sent

<!-- The whole first message of your analysis chat: the map, AC1–AC6, F1–F5 and the constraints
     (no login, payments, live APIs or database; fictional data only). Unedited. -->

```text
I am extending an existing Smart Campus Room Availability Checker for SIS #04.

Repository map:
- src/App.tsx — React UI.
- src/booking.ts — existing canBook() booking rule.
- src/bookingLogic.ts — validation messages and time/overlap helpers.
- src/data.ts — fictional room and booking data.
- src/types.ts — project types.
- src/booking.test.ts — existing Vitest suite.

Preserve AC1–AC6:
AC1 Reject start >= end and requests in the past.
AC2 Maximum duration is 120 minutes.
AC3 Reject a blocked room.
AC4 Reject overlaps; touching endpoints are allowed.
AC5 Do not mutate booking data.
AC6 Clear responsive feedback on desktop and mobile.

New requirements:
F1 capacity >= requested attendees.
F2 room contains ALL selected equipment.
F3 blocked room is never available.
F4 clear empty state when no rooms match.
F5 changing selected room refreshes the result and uses that room's own bookings.

Constraints:
- 4+ fictional rooms.
- No login, payments, live APIs, database or real personal data.
- Keep canBook compatible.
- Required modules: rooms.ts, filter.ts, booking.ts, App.tsx/components.
- Analyse first.
- Identify at least three maintainability risks.
- Give a numbered small-step plan.
- Do not write code yet.
```

## 3. Codebase analysis (Task 1)

### 3.1 Maintainability risks

<!-- At least three, found in YOUR starting code. "Where" names a file or a function(),
     e.g. src/App.tsx, check(). Evidence is what you saw, not what the assistant said.
     Priority: High / Medium / Low. -->

| # | Risk | Where | Evidence | Priority |
| --- | --- | --- | --- | --- |
| 1 | Booking validation is duplicated and may drift. | `src/booking.ts canBook()` and `src/bookingLogic.ts evaluateBooking()` | Both independently implement time, duration, blocked and overlap checks. | High |
| 2 | Current Room model does not contain equipment and room-owned bookings. | `src/types.ts`, `src/data.ts` | SIS #04 requires every room to have equipment and its own bookings. | High |
| 3 | UI contains application logic that should be outside presentation code. | `src/App.tsx` | App filters bookings, creates booking requests and calls multiple rule functions. | High |
| 4 | Room and booking data are split into separate collections. | `src/data.ts` | `SAMPLE_ROOMS` and `SAMPLE_BOOKINGS` require repeated roomId filtering. | Medium |

### 3.2 Improvement plan — before editing

<!-- Numbered, in the order you will do it, smallest safe step first. Written BEFORE you change
     code: the commit that adds this section comes before the commit that changes app/src. -->

1. Add tests for F1 and F2 first.
2. Create `src/rooms.ts` with 4+ complete fictional rooms.
3. Create `src/filter.ts` and implement `filterRooms()`.
4. Add tests for F3 and F5, then implement `checkRoom()` in `booking.ts`.
5. Add B1–B6 and INT tests.
6. Refactor duplicated booking validation while keeping AC1–AC6.
7. Update `App.tsx` so it imports room/filter/booking logic instead of implementing rules.
8. Add F4 empty state and responsive UI.
9. Capture five required screenshots.
10. Update before/after diagrams and run final quality checks.

### 3.3 One AI suggestion I rejected or modified

| Suggestion | Decision | Why |
| --- | --- | --- |
| Hide every blocked room inside `filterRooms()`. | Modified | I keep `filterRooms()` focused on F1 capacity and F2 equipment. A blocked room may remain visible with a blocked label, but `checkRoom()` and `canBook()` must always return false for it under F3 and AC3. |

## 4. Feature extension (Task 2)

### 4.1 What I added

<!-- Short: the catalog (how many rooms, which equipment), how the filter is chosen on the page,
     what the empty state says, what happens to an old result when the room changes. -->

(write here)

### 4.2 Demonstration

<!-- One row per screenshot in evidence/. Say what is on it: the filter values, the rooms shown,
     the room selected, the times entered and the result. -->

| Screenshot | What it shows |
| --- | --- |
| `evidence/filter-match.png` | (write here) |
| `evidence/filter-empty.png` | (write here) |
| `evidence/switch-a.png` | (write here) |
| `evidence/switch-b.png` | (write here) |
| `evidence/narrow.png` | (write here) |

## 5. Refactoring (Task 3)

<!-- The diagrams are diagrams/before.puml and diagrams/after.puml (README section 8). -->

### 5.1 Module responsibilities after

| Module or component | Responsibility |
| --- | --- |
| `src/rooms.ts` | (write here) |
| `src/booking.ts` | (write here) |
| `src/filter.ts` | (write here) |
| (write here) | (write here) |

### 5.2 Design decisions

<!-- At least two. The alternative is what you could have done instead (often what the assistant
     proposed). The why names an AC, an F-rule, a test or a risk from 3.1. -->

| Decision | Alternative I did not take | Why |
| --- | --- | --- |
| (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) |

### 5.3 Duplication removed

<!-- One row per duplicated location that is gone. Count what you can point at, nothing else. -->

| Before (file / function, what was repeated) | After (where it lives now) |
| --- | --- |
| (write here) | (write here) |

## 6. Automated tests (Task 4)

### 6.1 Test plan

<!-- One row per required ID. A test may carry several IDs in its title,
     e.g. test('T06 B1 AC2: exactly 120 minutes is available', …) covers B1 and AC2. -->

| ID | Test title (as in the file) | Input → expected |
| --- | --- | --- |
| AC1 | (write here) | (write here) |
| AC2 | (write here) | (write here) |
| AC3 | (write here) | (write here) |
| AC4 | (write here) | (write here) |
| AC5 | (write here) | (write here) |
| F1 | (write here) | (write here) |
| F2 | (write here) | (write here) |
| F3 | (write here) | (write here) |
| F4 | (write here) | (write here) |
| F5 | (write here) | (write here) |
| B1 | (write here) | (write here) |
| B2 | (write here) | (write here) |
| B3 | (write here) | (write here) |
| B4 | (write here) | (write here) |
| B5 | (write here) | (write here) |
| B6 | (write here) | (write here) |
| INT | (write here) | (write here) |

### 6.2 Commands

<!-- The commands exactly as you typed them, from app/. -->

```text
(paste here)
```

### 6.3 Final run

<!-- The REAL output of the full run on your final code. Every test passes, and the number of
     tests equals what your test files hold (R2). -->

```text
(paste here)
```

## 7. Quality evaluation (Task 5)

<!-- Original = your baseline commit. Final = what you submit. "How I obtained it" says how you
     measured, so someone else could repeat it: "1.1 and 6.3 runs", "counted in 5.3",
     "git ls-files app/src". Do not invent a metric. Tests: write passed/total, e.g. 19/19. -->

| Measure | Original | Final | How I obtained it |
| --- | --- | --- | --- |
| Automated tests passed / total | (write here) | (write here) | (write here) |
| Duplicated logic locations removed | (write here) | (write here) | (write here) |
| Code structure: modules and their responsibilities | (write here) | (write here) | (write here) |
| Remaining limitation | (write here) | (write here) | (write here) |

## 8. AI evidence appendix

<!-- At least three exchanges, one ### 8.N block each: the analysis (Task 1), the plan, and at
     least one implementation, refactoring or test exchange. Copy the block for more.
     The prompt as you sent it; the output may be cut to the part you used, with "[…]" where
     you cut. Verified by: the test, run, file or check that confirmed it — not "it looked right". -->

### 8.1 Exchange 1

**Tool and model:** (write here)
**Date:** (write here)
**Purpose:** (write here)

**Prompt:**

```text
(paste here)
```

**Output used:**

```text
(paste here)
```

**Problems found:** (write here)
**Changes made:** (write here)
**Verified by:** (write here)

### 8.2 Exchange 2

**Tool and model:** (write here)
**Date:** (write here)
**Purpose:** (write here)

**Prompt:**

```text
(paste here)
```

**Output used:**

```text
(paste here)
```

**Problems found:** (write here)
**Changes made:** (write here)
**Verified by:** (write here)

### 8.3 Exchange 3

**Tool and model:** (write here)
**Date:** (write here)
**Purpose:** (write here)

**Prompt:**

```text
(paste here)
```

**Output used:**

```text
(paste here)
```

**Problems found:** (write here)
**Changes made:** (write here)
**Verified by:** (write here)

## 9. Checker results and known fails

<!-- Every check still FAIL or ERROR in your last run of python tests/check_sis.py, and why.
     The same IDs go in submission.yml known_fails. None left? Write: none. -->

| Check | Why it still fails |
| --- | --- |
| (write here) | (write here) |

## 10. AI reflection (Task 6)

<!-- 200–300 words, your own words, no assistant. Answer all five:
     What context did you provide the AI assistant? Which generated suggestions were useful or
     incorrect? What did you personally verify? How did tests influence your engineering
     decisions? What would you improve next? -->

(write here)
