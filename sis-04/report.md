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

I extended the Smart Campus checker with a room catalog and room filtering while preserving the original booking rules.

The new structure includes:

src/rooms.ts — contains the Room type and four fictional rooms. Each room has id, name, capacity, equipment, blocked, and its own bookings.

src/filter.ts — contains the pure filterRooms() function.

src/booking.ts — keeps the original canBook() function and adds checkRoom().

src/App.tsx — imports room data and rule functions instead of containing the rules itself.

Implemented feature rules:

F1: a room is included only when capacity >= attendees.

F2: a room must contain ALL selected equipment.

F3: a blocked room is never reported available.

F4: when no rooms match the filters, the UI shows a clear empty-state message.

F5: when the selected room changes, the availability result is recalculated using that room's own bookings.

I used a test-first workflow. I first added failing tests for the new behaviour, then implemented the smallest code change required to make them pass.

The final automated test run at this stage was:

Test Files  2 passed (2)
Tests       39 passed (39)

The production build also completed successfully with npm run build.

### 4.2 Demonstration

<!-- One row per screenshot in evidence/. Say what is on it: the filter values, the rooms shown,
     the room selected, the times entered and the result. -->

| Screenshot | What it shows |
| --- | --- |
| `evidence/filter-match.png` | Shows filters that return matching rooms. |
| `evidence/filter-empty.png` | Shows the F4 empty state when no room matches. |
| `evidence/switch-a.png` | Atlas Room at 10:00–11:00 is unavailable because its own booking overlaps. |
| `evidence/switch-b.png` | With the same times, Borealis Lab is available because it has different room-owned bookings. |
| `evidence/narrow.png` | Shows the application in a narrow phone-width portrait layout. |

## 5. Refactoring (Task 3)

<!-- The diagrams are diagrams/before.puml and diagrams/after.puml (README section 8). -->

### 5.1 Module responsibilities after

| Module or component | Responsibility |
| --- | --- |
| `src/rooms.ts` | Defines the Room data structure and stores the fictional room catalog. |
| `src/booking.ts` | Contains booking availability rules in canBook() and room-specific checking in checkRoom(). |
| `src/filter.ts` | Applies capacity and equipment filtering only. |
| `src/bookingLogic.ts` | Contains presentation helpers for converting and formatting time values. |
| `src/App.tsx` | Manages UI state and renders the interface by calling imported functions. |
| `src/sis04.test.ts` | Tests F1–F5, B1–B6 and INT behaviour using real modules. |
| `src/booking.test.ts` | Preserves the original AC1–AC5 regression coverage. |

### 5.2 Design decisions

<!-- At least two. The alternative is what you could have done instead (often what the assistant
     proposed). The why names an AC, an F-rule, a test or a risk from 3.1. -->

| Decision | Alternative I did not take | Why |
| --- | --- | --- |
| Keep `filterRooms()` responsible only for capacity and equipment filtering. | Put blocked-room and booking-time checks inside `filterRooms()`. | F1 and F2 are filtering rules, while AC1–AC4 and F3 are availability rules. Separating them makes each function easier to test and avoids mixing responsibilities. |
| Store bookings inside each `Room` and use `checkRoom()` for room-specific availability. | Keep a global bookings array and repeatedly filter it by `roomId` inside `App.tsx`. | F5 requires the result to use the selected room's own bookings. `checkRoom()` now passes that room's `blocked` state and `bookings` directly to `canBook()`. |

### 5.3 Duplication removed

<!-- One row per duplicated location that is gone. Count what you can point at, nothing else. -->

| Before (file / function, what was repeated) | After (where it lives now) |
| --- | --- |
| `src/booking.ts canBook()` and `src/bookingLogic.ts evaluateBooking()` both repeated time, duration, blocked-room, and overlap validation. | Booking availability rules now live only in `src/booking.ts canBook()`. |
| `src/App.tsx` repeatedly filtered the global booking list by selected `roomId`. | `src/booking.ts checkRoom()` now uses the selected room's own `bookings` from `src/rooms.ts`. |
| `src/App.tsx` directly handled booking and filtering orchestration. | `App.tsx` now calls imported `filterRooms()` and `checkRoom()` from dedicated modules. |

## 6. Automated tests (Task 4)

### 6.1 Test plan

<!-- One row per required ID. A test may carry several IDs in its title,
     e.g. test('T06 B1 AC2: exactly 120 minutes is available', …) covers B1 and AC2. -->

| ID | Test title (as in the file) | Input → expected |
| --- | --- | --- |
| AC1 | `T02 AC1: starting now is unavailable` | `start=540, now=540` → `false` |
| AC2 | `T06 AC2: exactly 120 minutes is available` | `720–840` = exactly 120 min → `true` |
| AC3 | `T13 AC3: blocked request is unavailable` | `blocked=true` → `false` |
| AC4 | `T01 AC4: touching after is available` | existing `600–660`, request `660–720` → `true` |
| AC5 | `AC5: available decision preserves multiple unsorted bookings` | valid request → `true`, original bookings remain unchanged |
| F1 | `F1 capacity filter keeps rooms with enough seats` | `attendees=20` → only rooms with capacity `>=20` remain |
| F2 | `F2 equipment filter requires ALL selected equipment` | `projector + whiteboard` → only rooms containing both remain |
| F3 | `F3 blocked room is never reported available` | blocked room `r3`, valid time → `false` |
| F4 | `F4 no matching rooms returns an empty result` | `attendees=100` → `[]` |
| F5 | `F5 changing selected room uses THAT room bookings` | same `600–660`: `r1` → `false`, `r2` → `true` |
| B1 | `B1 exactly 120 minutes returns true` | `600–720` → `true` |
| B2 | `B2 121 minutes returns false` | `600–721` → `false` |
| B3 | `B3 touching an existing booking returns true` | existing `600–660`, request `660–720` → `true` |
| B4 | `B4 overlapping an existing booking returns false` | existing `600–660`, request `650–700` → `false` |
| B5 | `B5 capacity equal to attendees stays in the result` | capacity `12`, attendees `12` → room included |
| B6 | `B6 capacity one below attendees is filtered out` | capacity `12`, attendees `13` → room excluded |
| INT | `INT filterRooms then checkRoom uses a returned room` | filter returns `r1,r4`; check `r4` at `600–660` → `true` |
### 6.2 Commands

<!-- The commands exactly as you typed them, from app/. -->

```text
cd ~/se-practice/sis-04/app
npm install
npx vitest run
npm run build

```

I used npx vitest run to execute the complete automated test suite and npm run build to verify that the TypeScript/React application also builds successfully for production.

### 6.3 Final run

<!-- The REAL output of the full run on your final code. Every test passes, and the number of
     tests equals what your test files hold (R2). -->

```text id="8p6m1r"
RUN  v4.1.12 /Users/molshylykhalibyek/se-practice/sis-04/app

✓ src/sis04.test.ts (12 tests)
✓ src/booking.test.ts (27 tests)

Test Files  2 passed (2)
Tests       39 passed (39)
```

Production build result:

```text id="mbb2wl"
vite v5.4.8 building for production...
✓ 35 modules transformed.
✓ built in 430ms
```

Final result: all 39 automated tests passed, and the production build completed successfully.

## 7. Quality evaluation (Task 5)

<!-- Original = your baseline commit. Final = what you submit. "How I obtained it" says how you
     measured, so someone else could repeat it: "1.1 and 6.3 runs", "counted in 5.3",
     "git ls-files app/src". Do not invent a metric. Tests: write passed/total, e.g. 19/19. -->

| Measure | Original | Final | How I obtained it |
| --- | --- | --- | --- |
| Automated tests passed / total | 27 / 27 | 39 / 39 | I ran `npx vitest run` on the unchanged baseline and again after the feature extension and refactoring. |
| Duplicated logic locations removed | 3 duplicated/responsibility-overlap locations identified | 0 of those identified duplications remain | I compared the locations listed in §5.3 before and after refactoring: duplicated booking validation, room-booking selection in the UI, and rule orchestration in `App.tsx`. |
| Code structure: modules and their responsibilities | Booking/data/UI responsibilities were mixed across `App.tsx`, `booking.ts`, `bookingLogic.ts`, `data.ts`, and `types.ts`. | Dedicated responsibilities: `rooms.ts` = catalog, `filter.ts` = filtering, `booking.ts` = availability rules, `bookingLogic.ts` = time/format helpers, `App.tsx` = UI. | I compared the baseline source structure with the final source files and documented the final responsibilities in §5.1 and the before/after diagrams. |
| Remaining limitation | The baseline used only fixed fictional room and booking data and had no capacity/equipment catalog filtering. | The room catalog is still hard-coded fictional data in `rooms.ts`; changing the catalog requires editing the source code and rebuilding the app. | I inspected the final `rooms.ts` implementation. This is a real remaining limitation, although persistent/database-backed data is intentionally outside the SIS #04 scope. |

## 8. AI evidence appendix

<!-- At least three exchanges, one ### 8.N block each: the analysis (Task 1), the plan, and at
     least one implementation, refactoring or test exchange. Copy the block for more.
     The prompt as you sent it; the output may be cut to the part you used, with "[…]" where
     you cut. Verified by: the test, run, file or check that confirmed it — not "it looked right". -->

### 8.1 Exchange 1

**Tool and model:** ChatGPT — GPT-5.6 Sol
**Date:** 27 November 2026
**Purpose:** Analyse the existing Smart Campus code before editing and identify maintainability risks and a safe implementation plan.



**Prompt:**

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

**Output used:**

```text
The analysis identified these main risks:
1. Booking validation was duplicated between canBook() and evaluateBooking().
2. The Room model did not contain equipment or room-owned bookings.
3. App.tsx contained booking and data-selection logic that should be separated from the UI.
4. Rooms and bookings were stored in separate collections and required repeated roomId filtering.

The suggested plan was to:
1. Add tests first.
2. Create rooms.ts.
3. Create filter.ts with filterRooms().
4. Add checkRoom() while preserving canBook().
5. Add boundary and integration tests.
6. Refactor duplicated validation.
7. Update App.tsx to use the new modules.
```

**Problems found:** One suggestion was to hide blocked rooms directly inside filterRooms(). I decided this mixed catalog filtering with booking availability.
**Changes made:** I modified that suggestion. filterRooms() handles only F1 capacity and F2 equipment. Blocked-room availability is handled by checkRoom() and canBook() under F3 and AC3.
**Verified by:** I checked the implementation with the F1, F2, F3, F5, B1–B6 and INT tests and then ran the full Vitest suite. The final result was 39/39 tests passing.

### 8.2 Exchange 2

**Tool and model:** ChatGPT — GPT-5.6 Sol
**Date:** 27 November 2026
**Purpose:** Implement room-specific availability checking after first creating failing F3 and F5 tests.

**Prompt:**

```text
The new SIS 04 tests fail:

F3 blocked room is never reported available
F5 changing selected room uses THAT room bookings

Error:
TypeError: checkRoom is not a function

The existing 31 tests still pass.
Help me implement the required checkRoom() without changing the existing canBook() behaviour.


```

**Output used:**

```text
Add a Room type import to booking.ts and add checkRoom():

export function checkRoom(
  rooms: Room[],
  roomId: string,
  { start, end, now }: { start: number; end: number; now: number }
): boolean {
  const room = rooms.find((item) => item.id === roomId);

  if (!room) return false;

  return canBook({
    start,
    end,
    now,
    blocked: room.blocked,
    bookings: room.bookings,
  });
}

The function should find the selected room and delegate the final booking decision to the existing canBook() function.
```

**Problems found:**  The first F3 and F5 tests failed because checkRoom() did not exist. The existing canBook() behaviour itself was already correct and should not be rewritten.
**Changes made:** I added checkRoom() to src/booking.ts. It finds the room by roomId and passes that room's blocked state and own bookings to canBook(). I kept the original canBook() contract unchanged.
**Verified by:** I ran npx vitest run. The F3 and F5 tests changed from failing to passing, and the full suite passed with 33/33 tests at that stage. Later, after adding the remaining boundary and integration tests, the final suite passed 39/39.

### 8.3 Exchange 3

**Tool and model:** ChatGPT — GPT-5.6 Sol
**Date:** 27 November 2026
**Purpose:** Remove duplicated booking validation while preserving all existing behaviour.

**Prompt:**

```text
I checked the project with:

grep -R "evaluateBooking\|canBook" -n src

The result shows that evaluateBooking() exists in bookingLogic.ts but App.tsx no longer calls it. The active booking rules are now handled by canBook() in booking.ts.

The full test suite currently passes.

How can I safely remove the duplicated validation without breaking AC1–AC5?
```

**Output used:**

```text
Keep canBook() unchanged as the single source of truth for booking availability.

Remove evaluateBooking() and the duplicated validation logic from bookingLogic.ts.

Keep only the UI helper functions in bookingLogic.ts:
- timeToMinutes()
- minutesToTime()
- formatInterval()

Then run the full Vitest suite and production build again.
```

**Problems found:** The project still contained two implementations of the same booking rules: canBook() in booking.ts and evaluateBooking() in bookingLogic.ts. Even though the UI no longer used evaluateBooking(), leaving it in the project could cause the two rule implementations to drift later.
**Changes made:** I removed evaluateBooking() and its duplicated time, duration, blocked-room, and overlap checks from bookingLogic.ts. I kept only the time conversion and formatting helper functions. canBook() remained unchanged as the single booking-rule implementation.
**Verified by:** I ran npx vitest run and all 39/39 tests passed. I also ran npm run build, and the production build completed successfully.

## 9. Checker results and known fails

<!-- Every check still FAIL or ERROR in your last run of python tests/check_sis.py, and why.
     The same IDs go in submission.yml known_fails. None left? Write: none. -->

| Check | Why it still fails |
| --- | --- |
| None | All 33 SIS #04 checker checks passed. |

## 10. AI reflection (Task 6)

<!-- 200–300 words, your own words, no assistant. Answer all five:
     What context did you provide the AI assistant? Which generated suggestions were useful or
     incorrect? What did you personally verify? How did tests influence your engineering
     decisions? What would you improve next? -->

For this task, I gave the AI the repository structure, the existing booking logic, AC1–AC6, the new F1–F5 requirements, and the project constraints before asking for code changes. This context was important because I needed to extend the existing Smart Campus checker without breaking the original behaviour.

The most useful AI suggestions were to separate the project into rooms.ts, filter.ts, booking.ts, and App.tsx, and to use a test-first approach. The AI also helped me add checkRoom() so that the selected room’s own bookings are passed to canBook(). One suggestion I modified was to hide blocked rooms inside filterRooms(). I decided not to do this because F1 and F2 are filtering rules, while blocked-room availability belongs to F3 and AC3.

I personally verified every important change by running the tests and checking the browser UI. I also checked the source code with grep before removing duplicated evaluateBooking() logic. After the refactoring, I ran the full test suite and production build again.

The tests strongly influenced my implementation. For example, F3 and F5 initially failed because checkRoom() did not exist. After implementing it, those tests passed. Boundary tests also confirmed that 120 minutes is valid, 121 minutes is invalid, touching bookings are allowed, and overlapping bookings are rejected.

Next time, I would create the full test plan earlier and make smaller commits after each requirement. I would also document AI exchanges immediately instead of reconstructing them later.
