# Week 07 — Lab report

**Name:** Alibyek Molshylykh
**Group:** Monday 16:00 - 19:00
**Date:** 03.11.2026

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Project I continue (week-06 or starter) | week-06 |
| Bolt project link (or not shared, and why) | not shared — the Week 06 project was exported as a ZIP file |
| Assistant that generated the tests (tool) | ChatGPT |
| Exact model (with its version, or not displayed) | not displayed |
| Where I ran the tests (Bolt terminal / my computer / Codespace) | My computer (MacBook Air, macOS) |
| Vitest version (the RUN v… line of a run) | v4.1.12 |
| Test command | npx vitest run src/booking.test.ts |

---

## 2. Task 1 — baseline and the booking function

**Before editing:** where did the booking decision live in the project you started from?

| | |
| --- | --- |
| File and function (or inside the page component) | app/src/bookingLogic.ts — evaluateBooking() |
| Its inputs | candidate interval, selected room, existing bookings, nowMinutes |
| What it returned | A Decision object: available or unavailable with reasons |
| How the page used it | App.tsx called evaluateBooking() inside useMemo and displayed Available or Unavailable. |

**What I changed to extract `canBook`.** Say which file it now lives in, what you moved, and why
the behaviour did not change. Also say which file of the page now calls it. 40 words or more.

I continued my Week 06 Smart Campus project. The original booking decision was implemented in the evaluateBooking function inside bookingLogic.ts. I created a new booking.ts file and extracted the main availability conditions into canBook. The new function checks valid time intervals, the 120-minute duration limit, blocked rooms, and overlapping bookings. It returns a boolean value instead of a Decision object. I updated App.tsx to call canBook for the availability decision. The existing evaluateBooking function remains responsible for providing validation messages. This preserved the original page behavior while making the decision easier to test independently.

---

## 3. Task 2 — the test plan

Default fixture: `now = 540`, `blocked = false`, `bookings = [{ start: 600, end: 660 }]`, fresh
for every test. **The Expected column comes from AC1–AC4, never from the code.** Write the
**reason** for each expected result **before** you send the generation prompt.

| ID | Candidate / changed input | Expected | AC | Reason (in your words) |
| --- | --- | --- | --- | --- |
| T01 | 660–720 (touching after) | true | AC4 | The previous booking ends at 660. The new booking starts at the same time, but the time periods do not overlap. |
| T02 | 540–570 (starts now) | false | AC1 | The current time is 540. The booking starts at the current time, but AC1 requires it to start strictly in the future. |
| T03 | 720–720 (zero duration) | false | AC1 | The start time and end time are equal. The booking duration is 0 minutes. |
| T04 | 750–720 (reversed) | false | AC1 | The end time is earlier than the start time. |
| T05 | 1380–1441 (past day end) | false | AC1 | The end time is 1441, which exceeds the maximum allowed time of 1440 minutes.|
| T06 | 720–840 (120 minutes) | true | AC2 | The booking lasts exactly 120 minutes, which is allowed by AC2. |
| T07 | 720–841 (121 minutes) | false | AC2 | The booking lasts 121 minutes, exceeding the 120-minute limit. |
| T08 | 570–600 (touching before) | true | AC4 | The new booking ends exactly when the existing booking starts. Touching endpoints are allowed. |
| T09 | 630–690 (partial overlap) | false | AC4 | The requested interval partially overlaps an existing booking. |
| T10 | 570–690 (contains booking) | false | AC4 | The requested interval contains the entire existing booking, causing an overlap. |
| T11 | 615–645 (inside booking) | false | AC4 | The requested interval is completely inside an existing booking. |
| T12 | 600–660 (identical interval) | false | AC4 | The requested interval is identical to an existing booking. |
| T13 | 660–720, blocked = true | false | AC3 | The selected room is blocked, so booking is not allowed. |
| T14 | 630–690, bookings = [] | true | AC4 | There are no existing bookings, so there is no time conflict. |
| AC5 | an Available request — the bookings after the call equal the bookings before | true, data unchanged | AC5 | The request is available, and checking availability must not modify the original bookings array. |
| X1 | 1380–1440 (ends exactly at day boundary) | true | AC1 | The booking ends exactly at 1440, which is the allowed day boundary. |
| X2 | 541–542 (starts one minute after now) | true | AC1 | The booking starts strictly after the current time and lasts one minute, so it is valid. |

X1 and X2 are **your own two cases**: a boundary or a state that T01–T14 do not reach. Fill all
five columns.

---

## 4. Task 3 — the generation prompt and the first suite

**The prompt exactly as I sent it.** Use the deck's prompt with `[our test framework]` replaced by
`Vitest`, followed by the case table from section 3:

```text
Generate tests for the existing booking function using Vitest. Use AC1–AC6 and the reviewed case table below.

Import the real function used by the page. Keep its code unchanged. Use fixed time and fresh fixtures. Assert exact decisions and unchanged booking data.

Return the test file, run command, and AC mapping. Flag unclear requirements. We will run the tests ourselves.
```

**The assistant's answer: run command, AC mapping and any unclear requirements it flagged,
pasted unedited.** Its test file goes to `suites/first/` and is not pasted here:

```text
Save as `week-07/suites/first/booking.test.ts`. It contains **17 tests** matching your table, imports the real `canBook`, uses fixed `now = 540` and fresh fixtures, and asserts exact booleans and unchanged booking data. Production code is unchanged. **Tests were not run.**

Run from `week-07/app`:
```
npx vitest run --root .. suites/first/booking.test.ts
```

AC1: T02–T05, X1, X2
AC2: T06, T07
AC3: T13
AC4: T01, T08–T12, T14
AC5: Dedicated AC5 test; unchanged-data assertions in all tests
AC6: Requires browser or manual UI checks

Limitations: AC5’s visible Available/Unavailable label also needs a UI check. AC6 does not specify viewport sizes, validation wording, or measurable usability expectations; function tests cannot verify those behaviors.
```

The first suite was saved to `suites/first/` **before** I changed anything in it: yes 

---

## 5. Task 4 — review of the first suite

Review it **before** you run it. Look at the imports, the expected values, isolation, duplicates
and skipped tests. Make one row per decision. At least **two** rows, and each one names the kind of
weakness (the deck's table: *no exception occurred* · *expected = current output* · *only valid
requests* · *mocked booking function*, or your own) and the AC that decides it.

| # | Test or part of the suite | What is weak or wrong | Decision: accept / revise / reject | AC or reason |
| --- | --- | --- | --- | --- |
| 1 | Import statement | The import path works in suites/first, but it is incorrect in app/src. The working copy must import ./booking. | revise | AC1–AC5: Tests must use the real booking function. |
| 2 | AC5 test | AC5 repeats the same interval as T01 (660–720). A different available interval would improve test coverage. | revise | AC5: Booking data must remain unchanged. |

---

## 6. Task 5 — running, diagnosing, improving

### 6.1 The first run

The **real** terminal output of the first run of the first suite, pasted unedited. Include the
`RUN  v…` line and the `Tests` summary line. A build message or the assistant saying "tests pass"
is not a run.

```text
 RUN  v4.1.12 /Users/molshylykhalibyek/se-practice/week-07

 ✓ suites/first/booking.test.ts (17 tests) 5ms
   ✓ canBook — reviewed booking cases (17)
     ✓ T01 AC4: touching after is available 1ms
     ✓ T02 AC1: starting now is unavailable 0ms
     ✓ T03 AC1: zero duration is unavailable 0ms
     ✓ T04 AC1: reversed interval is unavailable 0ms
     ✓ T05 AC1: ending after day end is unavailable 0ms
     ✓ T06 AC2: exactly 120 minutes is available 1ms
     ✓ T07 AC2: 121 minutes is unavailable 0ms
     ✓ T08 AC4: touching before is available 0ms
     ✓ T09 AC4: partial overlap is unavailable 0ms
     ✓ T10 AC4: containing an existing booking is unavailable 0ms
     ✓ T11 AC4: inside an existing booking is unavailable 0ms
     ✓ T12 AC4: identical interval is unavailable 0ms
     ✓ T13 AC3: blocked request is unavailable 0ms
     ✓ T14 AC4: empty bookings allow an otherwise valid request 0ms
     ✓ AC5: available decision leaves bookings unchanged 0ms
     ✓ X1 AC1: ending exactly at 1440 is available 0ms
     ✓ X2 AC1: one minute starting after now is available 0ms

 Test Files  1 passed (1)
      Tests  17 passed (17)
   Start at  19:33:00
   Duration  110ms (transform 21ms, setup 0ms, import 28ms, tests 5ms, environment 0ms)

```

**Each failure, diagnosed** (the deck's table: import/runner error · assertion mismatch · result
changing per run · no tests discovered). Write `none` in the first row if nothing failed.

| Failing test | Observed failure | First check | Test repair or implementation fix? | Action taken |
| --- | --- | --- | --- | --- |
| none | All 17 tests passed. | Checked the test results against AC1–AC5. | Neither required for the first run. | Proceed to review and improve the suite. |

### 6.2 The improvement prompt

The deck's improvement prompt exactly as sent, followed by the actual output from 6.1. Then
paste the assistant's answer, unedited:

```text
Review this test suite against AC1–AC6 and our case table. Identify incorrect expectations, weak assertions, duplicated cases, and missing boundaries.

For each proposed change, explain the requirement and the defect it could detect. Improve the tests without changing correct expectations to match buggy behavior.

Use the actual failure output below. Separate test repairs from implementation fixes.

Your Vitest output reports 17/17 tests passing. There are no observed failures to diagnose, and none of the original expectations are incorrect.

booking.improved.test.ts — 25 tests, unrun. The first suite and production implementation are preserved.

The original exact boolean assertions and copied booking snapshots are sound. The main weakness is the single-booking fixture: it cannot expose sorting, checking only the first booking, or some overlap errors. The dedicated AC5 test also duplicates T01’s inputs and assertions.
Change	Requirement	Defect it could detect
Strengthen AC5 with multiple unsorted bookings	AC5: data unchanged	In-place sorting, deletion, insertion, or changed booking values
R01: negative start → false	AC1: start ≥ 0	Invalid negative interval accepted; this case also violates the future-time rule, so it does not isolate the lower-bound check
R02: starts before now → false	AC1: strictly future	Accepting past starts
R03–R04: vary supplied now	AC1: use supplied current time	Hardcoded 540 or ignored now
R05: overlap from the left → false	AC4: reject any overlap	Checking only whether the candidate starts inside a booking
R06: overlap with second booking → false	AC4: check all bookings	Inspecting only the first entry
R07: exact gap in unsorted bookings → true	AC4: touching allowed	Rejecting valid gaps or assuming sorted input
R08: one-minute overlap → false	AC4: any positive overlap	Off-by-one overlap errors


All original decision expectations remain unchanged.
AC	Improved coverage
AC1	T02–T05, X1, X2, R01–R04
AC2	T06–T07
AC3	T13
AC4	T01, T08–T12, T14, R05–R08
AC5	Strengthened dedicated case; unchanged-data checks throughout
AC6	Requires UI checks


Test improvements: the additions above address coverage gaps; no failing assertion needed repair.

Implementation fixes: none are justified by the supplied passing run. No production code was changed.

Unclear requirements: testing an accepted start = 0 independently requires clarification about whether negative now is permitted. AC5’s visible label and AC6’s responsive layout and understandable feedback require page-level checks; viewport sizes and expected feedback are unspecified.

Save the improved file as week-07/suites/final/booking.test.ts, then run from week-07/app:
npx vitest run --root .. suites/final/booking.test.ts
```

### 6.3 The final run

The **real** output of the final suite (`booking.test.*` beside your module), after every
change and after restoring the correct code from section 7. Every test must pass. If a real defect
is still open, leave its test failing and explain it in 9.1.

```text
 RUN  v4.1.12 /Users/molshylykhalibyek/se-practice/week-07/app

 ✓ src/booking.test.ts (25 tests) 5ms
   ✓ canBook — reviewed booking cases (25)
     ✓ T01 AC4: touching after is available 1ms
     ✓ T02 AC1: starting now is unavailable 0ms
     ✓ T03 AC1: zero duration is unavailable 0ms
     ✓ T04 AC1: reversed interval is unavailable 0ms
     ✓ T05 AC1: ending after day end is unavailable 0ms
     ✓ T06 AC2: exactly 120 minutes is available 0ms
     ✓ T07 AC2: 121 minutes is unavailable 0ms
     ✓ T08 AC4: touching before is available 0ms
     ✓ T09 AC4: partial overlap is unavailable 0ms
     ✓ T10 AC4: containing an existing booking is unavailable 0ms
     ✓ T11 AC4: inside an existing booking is unavailable 0ms
     ✓ T12 AC4: identical interval is unavailable 0ms
     ✓ T13 AC3: blocked request is unavailable 0ms
     ✓ T14 AC4: empty bookings allow an otherwise valid request 0ms
     ✓ AC5: available decision preserves multiple unsorted bookings 0ms
     ✓ X1 AC1: ending exactly at 1440 is available 0ms
     ✓ X2 AC1: one minute starting after now is available 0ms
     ✓ R01 AC1: negative start is unavailable 0ms
     ✓ R02 AC1: starting before now is unavailable 0ms
     ✓ R03 AC1: later supplied now is respected 0ms
     ✓ R04 AC1: earlier supplied now permits an earlier future request 0ms
     ✓ R05 AC4: overlap from the left is unavailable 0ms
     ✓ R06 AC4: overlap with a later array entry is unavailable 0ms
     ✓ R07 AC4: exact gap between unsorted bookings is available 0ms
     ✓ R08 AC4: one minute of overlap is unavailable 0ms

 Test Files  1 passed (1)
      Tests  25 passed (25)
   Start at  19:51:26
   Duration  244ms (transform 23ms, setup 0ms, import 96ms, tests 5ms, environment 0ms)

```

---

## 7. Task 6 — deliberate defects

I tested three intentional defects one at a time. I kept the test suite unchanged, recorded the failing tests, and restored the correct implementation after each experiment.

| Trial | Intentional change | Detected / Survived | Failing test ID(s) | If it survived: why, and what you added |
| --- | --- | --- | --- | --- |
| M1 | Reject duration >= 120 instead of > 120 | Detected | T06 | N/A — T06 detected the defect. |
| M2 | Treat touching endpoints as an overlap | Detected | T01, T08, R07 | N/A — all three tests detected the defect. |
| M3 | Remove the blocked-room rejection | Detected | T13 | N/A — T13 detected the defect. |

**The run of each mutant, pasted unedited.** Paste the `Tests` summary line and the failing test names at least:

```text
M1 — Reject duration >= 120 instead of > 120

 RUN  v4.1.12 /Users/molshylykhalibyek/se-practice/week-07/app

 ❯ src/booking.test.ts (25 tests | 1 failed) 7ms

 FAIL  src/booking.test.ts > canBook — reviewed booking cases > T06 AC2: exactly 120 minutes is available
AssertionError: expected false to be true // Object.is equality

 Test Files  1 failed (1)
      Tests  1 failed | 24 passed (25)
   Start at  20:38:17
   Duration  228ms (transform 23ms, setup 0ms, import 29ms, tests 7ms, environment 0ms)

M2 — Treat touching endpoints as an overlap

 RUN  v4.1.12 /Users/molshylykhalibyek/se-practice/week-07/app

 ❯ src/booking.test.ts (25 tests | 3 failed) 8ms

 FAIL  src/booking.test.ts > canBook — reviewed booking cases > T01 AC4: touching after is available
AssertionError: expected false to be true // Object.is equality

 FAIL  src/booking.test.ts > canBook — reviewed booking cases > T08 AC4: touching before is available
AssertionError: expected false to be true // Object.is equality

 FAIL  src/booking.test.ts > canBook — reviewed booking cases > R07 AC4: exact gap between unsorted bookings is available
AssertionError: expected false to be true // Object.is equality

 Test Files  1 failed (1)
      Tests  3 failed | 22 passed (25)
   Start at  20:00:06
   Duration  264ms (transform 21ms, setup 0ms, import 28ms, tests 8ms, environment 0ms)

M3 — Remove the blocked-room rejection

 RUN  v4.1.12 /Users/molshylykhalibyek/se-practice/week-07/app

 ❯ src/booking.test.ts (25 tests | 1 failed) 8ms

 FAIL  src/booking.test.ts > canBook — reviewed booking cases > T13 AC3: blocked request is unavailable
AssertionError: expected true to be false // Object.is equality

 Test Files  1 failed (1)
      Tests  1 failed | 24 passed (25)
   Start at  20:01:34
   Duration  256ms (transform 21ms, setup 0ms, import 28ms, tests 8ms, environment 0ms)
```

All three changes reverted, and the full suite run again (section 6.3): yes

## 8. Task 7 — manual UI checks

Use `now = 09:00` and an existing `10:00–11:00` booking. Do them in the page in a browser. Save a
screenshot of each as `evidence/ui-1.png` … `evidence/ui-5.png`. Take **ui-4 at phone width**
(about 375 px, portrait).

| # | Action | Expected observation | AC | What I observed | Pass / Fail / Not testable |
| --- | --- | --- | --- | --- | --- |
| U1 | Check 11:00–12:00, unblocked | Available, with the fixed sample booking | AC5 | Borealis 220 displayed Available for 11:00–12:00. | Pass |
| U2 | Enable blocked, then check again | Unavailable replaces the earlier result | AC3, AC5 | I temporarily changed Borealis 220 to blocked: true in data.ts. The page displayed Unavailable. | Pass |
| U3 | Clear a required input and submit | Understandable validation feedback | AC6 | I cleared the Start Time field, but the page did not display understandable validation feedback. | Fail |
| U4 | Use a narrow (phone) width | Controls and result remain usable | AC6 | At 375px width, the form and availability result remained visible and usable. | Pass |
| U5 | Repeat the checks on the same data | Existing bookings remain unchanged | AC5 | I repeated availability checks. The existing booking remained unchanged. | Pass |

---
## 9. Comparison and what still fails

### 9.1 Checks I am keeping as FAIL or ERROR

| Check | Why it stays |
| --- | --- |
| A4 | The app still contains node_modules. It must be removed before submission. |
| U2 | The ui-4 screenshot is not in portrait phone format. |
| U3 | The five manual UI observations and verdicts are not fully recorded. |
| L1 | The setup information is incomplete. |
| L2 | The original booking function and extraction explanation are incomplete. |
| L6 | The exact improvement prompt is missing from section 6.2. |
| L7 | The original and improved suites comparison is incomplete. |
| L8 | The 120–180 word conclusion is missing. |

### 9.2 Original and improved suites

| Measure | First suite | Improved suite |
| --- | --- | --- |
| Executed / passed / failed | 17 / 17 / 0 | 25 / 25 / 0 |
| Requirements with meaningful tests (AC IDs and gaps) | AC1–AC4 and AC5 data preservation. AC6 requires manual UI checks. | AC1–AC4 and stronger AC5 coverage. AC6 still requires UI checks. |
| Selected mutants detected | Not tested separately against mutants. | All three mutants detected: M1 by T06, M2 by T01, T08 and R07, M3 by T13. |
| Accepted / revised / rejected tests | 17 initial tests retained. Two review decisions proposed revisions. | Import path and AC5 revised. Eight additional tests added. No original expectations changed. |
| Remaining limitations | Only one existing booking in the default fixture. Limited boundary coverage. | Invalid existing bookings are not specified. Visual feedback and responsive design require manual testing. |

### 9.3 What no AC decides

The function uses an overlap check based on the start and end times of existing bookings.

For a request of 660–720 and an invalid existing booking of 700–650, the current overlap logic returns true because it does not detect a conflict.

The existing booking is invalid because its end time is earlier than its start time. The acceptance criteria do not specify how invalid existing bookings should be handled.

In a real application, I would prefer validating existing booking data before checking availability. However, I preserved the implementation behavior for this practice.

## 10. Conclusion (120–180 words)

<!-- Answer all three in your own words, without the assistant:
     (a) Which mistake in the FIRST suite would have let a wrong canBook pass, and how did you find it?
     (b) What does your final green run prove, and what does it NOT prove? Use a mutant or a UI check.
     (c) One testing limitation that remains.
     Worthless: "The AI wrote good tests and they all passed."
     Worth everything: "The first suite expected T06 (exactly 120 minutes) to be rejected. That
     contradicts AC2, and it failed on a correct canBook. If I had changed the code to make it
     pass, M1 would have become the real behaviour." -->

In this practice, I continued my Week 06 Smart Campus project instead of using the starter. The original page used evaluateBooking to decide whether a room was available. I extracted a boolean canBook function and connected the page to it while keeping the existing validation messages.

I planned the expected outcomes before generating tests because the acceptance criteria, not the implementation, must determine correct behavior. My first AI-generated suite passed all 17 cases, but passing alone did not prove strong coverage. I reviewed its import path and repeated AC5 scenario, then improved the working suite to 25 tests, including unsorted bookings and additional boundaries.

The improved suite detected all three deliberate defects: an incorrect duration limit, treating touching times as overlapping, and ignoring blocked rooms. I restored the correct implementation and reran the suite successfully.

Manual interface checks remain important because unit tests cannot establish whether feedback is clear or the layout works on mobile. I disclosed the AI assistance and retained the original suite for comparison.
