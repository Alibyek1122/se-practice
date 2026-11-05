# Week 08 — Lab report

**Name:** Molshylykh Alibyek
**Group:** өз тобыңды жаз
**Date:** 2026-11-05

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Assistant I debugged with (tool) | 	ChatGPT |
| Exact model (with its version, or `not displayed`) | GPT-6 Astra Medium |
| Where the skill was installed (ChatGPT / Claude web / Claude Code / prompt-only simulation) | prompt-only simulation |
| Where I ran the tests (Bolt terminal / my computer / Codespace) | 	My computer — macOS, Terminal |
| Vitest version (the `RUN  v…` line of a run) | 4.1.12 |
| Language of my booking module (`ts` or `js`) — the file I copied from `buggy/` | ts |

---

## 2. Task 1 — baseline, buggy code, failing tests

### 2.1 My Week 07 suite on my own code

I ran my existing Week 07 suite in `week-08/app/` before replacing
`canBook`. All 25 tests passed.

Actual terminal output:

```text
 RUN  v4.1.12 /Users/molshylykhalibyek/se-practice/week-08/app

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
   Start at  22:50:04
   Duration  188ms (transform 19ms, setup 0ms, import 82ms, tests 5ms, environment 0ms)
```

### 2.2 The same suite on the provided canBook

I replaced the whole `canBook` function in `app/src/booking.ts`
with the provided function from `buggy/booking.ts`, leaving the
existing interfaces in place. I did not repair the provided function
or change the tests before this run.

Command: `npx vitest run`

The same 25 tests produced 9 failures and 16 passes.

Actual terminal output excerpts below. Repeated separators and some
individual failure details are omitted; the complete test list and
run summary are retained.

```text
 RUN  v4.1.12 /Users/molshylykhalibyek/se-practice/week-08/app

 ❯ src/booking.test.ts (25 tests | 9 failed) 11ms
   ❯ canBook — reviewed booking cases (25)
     × T01 AC4: touching after is available 4ms
     ✓ T02 AC1: starting now is unavailable 0ms
     ✓ T03 AC1: zero duration is unavailable 0ms
     ✓ T04 AC1: reversed interval is unavailable 0ms
     ✓ T05 AC1: ending after day end is unavailable 0ms
     × T06 AC2: exactly 120 minutes is available 1ms
     ✓ T07 AC2: 121 minutes is unavailable 0ms
     × T08 AC4: touching before is available 0ms
     ✓ T09 AC4: partial overlap is unavailable 0ms
     ✓ T10 AC4: containing an existing booking is unavailable 0ms
     ✓ T11 AC4: inside an existing booking is unavailable 0ms
     ✓ T12 AC4: identical interval is unavailable 0ms
     ✓ T13 AC3: blocked request is unavailable 0ms
     × T14 AC4: empty bookings allow an otherwise valid request 1ms
     × AC5: available decision preserves multiple unsorted bookings 1ms
     × X1 AC1: ending exactly at 1440 is available 0ms
     × X2 AC1: one minute starting after now is available 1ms
     ✓ R01 AC1: negative start is unavailable 0ms
     ✓ R02 AC1: starting before now is unavailable 0ms
     ✓ R03 AC1: later supplied now is respected 0ms
     × R04 AC1: earlier supplied now permits an earlier future request 0ms
     ✓ R05 AC4: overlap from the left is unavailable 0ms
     ✓ R06 AC4: overlap with a later array entry is unavailable 0ms
     × R07 AC4: exact gap between unsorted bookings is available 0ms
     ✓ R08 AC4: one minute of overlap is unavailable 0ms
```

T01 failure:

```text
 FAIL  src/booking.test.ts > canBook — reviewed booking cases > T01 AC4: touching after is available
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:39:22
     37|     const decision = canBook(request);
     38|
     39|     expect(decision).toBe(true);
       |                      ^
     40|     expect(request.bookings).toStrictEqual(before.bookings);
     41|     expect(request).toStrictEqual(before);
```

AC5 failure:

```text
 FAIL  src/booking.test.ts > canBook — reviewed booking cases > AC5: available decision preserves multiple unsorted bookings
AssertionError: expected [ { start: 900, end: 960 }, …(2) ] to strictly equal [ { start: 900, end: 960 }, …(1) ]

- Expected
+ Received

@@ -5,6 +5,10 @@
    },
    {
      "end": 660,
      "start": 600,
    },
+   {
+     "end": 780,
+     "start": 720,
+   },
  ]

 ❯ src/booking.test.ts:242:30
    240|
    241|     expect(decision).toBe(true);
    242|     expect(request.bookings).toStrictEqual(before.bookings);
       |                              ^
    243|     expect(request).toStrictEqual(before);
    244|   });
```

Run summary:

```text
 Test Files  1 failed (1)
      Tests  9 failed | 16 passed (25)
   Start at  22:53:47
   Duration  230ms (transform 22ms, setup 0ms, import 29ms, tests 11ms, environment 0ms)
```

### 2.3 One failing test per bug

I added two named regression tests without repairing `canBook`:

- `BUG-A AC4: a one-minute gap touching both bookings is available`.
  The request is 660–661, with existing bookings 600–660 and 661–720,
  `now=540`, and `blocked=false`. It expects exactly `true`.
- `BUG-B AC5: a non-touching available request preserves bookings`.
  The request is 720–780, with an existing booking 600–660,
  `now=540`, and `blocked=false`. It expects exactly `true`, then
  compares the bookings with a copy made before the call.

Command: `npx vitest run`

Both new tests failed on the buggy implementation. The suite now
contained 27 tests: 11 failed and 16 passed.

Actual terminal output excerpts below. The earlier nine failure
details and repeated separators are omitted; both new failure
details and the run summary are retained.

```text
 RUN  v4.1.12 /Users/molshylykhalibyek/se-practice/week-08/app

 ❯ src/booking.test.ts (27 tests | 11 failed) 11ms
   ❯ canBook — reviewed booking cases (27)
     × T01 AC4: touching after is available 4ms
     ✓ T02 AC1: starting now is unavailable 0ms
     ✓ T03 AC1: zero duration is unavailable 0ms
     ✓ T04 AC1: reversed interval is unavailable 0ms
     ✓ T05 AC1: ending after day end is unavailable 0ms
     × T06 AC2: exactly 120 minutes is available 1ms
     ✓ T07 AC2: 121 minutes is unavailable 0ms
     × T08 AC4: touching before is available 0ms
     ✓ T09 AC4: partial overlap is unavailable 0ms
     ✓ T10 AC4: containing an existing booking is unavailable 0ms
     ✓ T11 AC4: inside an existing booking is unavailable 0ms
     ✓ T12 AC4: identical interval is unavailable 0ms
     ✓ T13 AC3: blocked request is unavailable 0ms
     × T14 AC4: empty bookings allow an otherwise valid request 1ms
     × AC5: available decision preserves multiple unsorted bookings 1ms
     × X1 AC1: ending exactly at 1440 is available 0ms
     × X2 AC1: one minute starting after now is available 1ms
     ✓ R01 AC1: negative start is unavailable 0ms
     ✓ R02 AC1: starting before now is unavailable 0ms
     ✓ R03 AC1: later supplied now is respected 0ms
     × R04 AC1: earlier supplied now permits an earlier future request 0ms
     ✓ R05 AC4: overlap from the left is unavailable 0ms
     ✓ R06 AC4: overlap with a later array entry is unavailable 0ms
     × R07 AC4: exact gap between unsorted bookings is available 0ms
     ✓ R08 AC4: one minute of overlap is unavailable 0ms
     × BUG-A AC4: a one-minute gap touching both bookings is available 0ms
     × BUG-B AC5: a non-touching available request preserves bookings 0ms
```

BUG-A failure:

```text
 FAIL  src/booking.test.ts > canBook — reviewed booking cases > BUG-A AC4: a one-minute gap touching both bookings is available
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:403:30
    401|     ];
    402|
    403|     expect(canBook(request)).toBe(true);
       |                              ^
    404|   });
    405|
```

BUG-B failure:

```text
 FAIL  src/booking.test.ts > canBook — reviewed booking cases > BUG-B AC5: a non-touching available request preserves bookings
AssertionError: expected [ { start: 600, end: 660 }, …(1) ] to strictly equal [ { start: 600, end: 660 } ]

- Expected
+ Received

  [
    {
      "end": 660,
      "start": 600,
    },
+   {
+     "end": 780,
+     "start": 720,
+   },
  ]

 ❯ src/booking.test.ts:413:30
    411|
    412|     expect(decision).toBe(true);
    413|     expect(request.bookings).toStrictEqual(before);
       |                              ^
    414|   });
    415|
```

Run summary:

```text
 Test Files  1 failed (1)
      Tests  11 failed | 16 passed (27)
   Start at  23:04:57
   Duration  232ms (transform 23ms, setup 0ms, import 31ms, tests 11ms, environment 0ms)
```

BUG-A failed at the Boolean decision assertion. BUG-B passed that
assertion and failed at the bookings comparison, showing that its
failure was caused by changed data rather than a rejected request.

---
## 3. Defect log

One row per defect. At least **BUG-A and BUG-B**. "Suspected cause" is your hypothesis
**before** you ask any assistant: the line and why.

| Defect | Test ID | Input | Expected | Actual | Suspected cause (line and why) |
| --- | --- | --- | --- | --- | --- |
| BUG-A | | | | | |
| BUG-B | | | | | |

---

## 4. Tasks 2–3 — the skill

**The checks from the deck, before you zip it.** Answer each one yes / no:

| Check | yes / no |
| --- | --- |
| The file is plain UTF-8 text, named exactly `SKILL.md` (not `SKILL.md.txt`) | yes / no |
| The first and the closing YAML delimiter are exactly three hyphens: `---` | yes / no |
| `name` is lowercase with hyphens, and `description` says WHEN to use it | yes / no |
| I read the whole file once: no passwords, API keys or private student data | yes / no |

**The contents of `skills/bug-detector.zip`.** Paste the listing (Windows: open the ZIP and copy
the paths; macOS/Linux: `unzip -l skills/bug-detector.zip`):

```text
(paste here)
```

**Installation.** Where you uploaded it, what the upload said, and whether a new chat showed the
skill as enabled. If upload was not available, write `prompt-only simulation` and say why.
Screenshot of the result: `evidence/install.png`.

<!-- Write below this line -->

---

## 5. Task 4 — without the skill

A **fresh chat, with no skill enabled**. Paste exactly what you sent: the deck's question, then
the same input you will use in section 6 (AC1–AC6, the failing test output, the code of
`canBook`):

```text
Find the root cause of the failed room-booking test. Propose minimal patch and regression test. Do not edit code.

Acceptance criteria:
AC1 Reject start ≥ end and requests in the past.
AC2 Enforce the maximum allowed duration (120 minutes).
AC3 Reject a blocked room.
AC4 Reject overlaps; allow bookings that only touch at endpoints.
AC5 Return Available / Unavailable without changing booking data.
AC6 Preserve clear UI feedback on desktop and mobile.

Failing test input:
{
  start: 660,
  end: 720,
  now: 540,
  blocked: false,
  bookings: [{ start: 600, end: 660 }]
}

Observed failure:
FAIL src/booking.test.ts > canBook — reviewed booking cases > T01 AC4: touching after is available
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

❯ src/booking.test.ts:39:22
37| const decision = canBook(request);
38|
39| expect(decision).toBe(true);
  |                  ^
40| expect(request.bookings).toStrictEqual(before.bookings);
41| expect(request).toStrictEqual(before);

Provided code:
export function canBook({ start, end, now, blocked, bookings }: {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: { start: number; end: number }[];
}): boolean {
  if (!(0 <= start && start < end && end <= 1440)) return false;
  if (!(start > now)) return false;
  if (end - start > 120) return false;
  if (blocked) return false;
  for (const b of bookings) {
    if (start <= b.end && end >= b.start) return false;
  }
  // keep the room's list current with the slot that was just found free
  bookings.push({ start, end });
  return true;
}
```

**The assistant's answer, pasted unedited:**

```text
Two defects are confirmed in the provided code.
Defect	Evidence and root cause	Minimal fix
AC4: endpoint contact rejected	660 <= 660 && 720 >= 600 evaluates to true, so the overlap check rejects the request. Inclusive comparisons treat touching endpoints as an overlap.	Use strict comparisons: start < b.end && end > b.start.
AC5: booking data mutated	For accepted requests, bookings.push(...) changes the caller’s array. The current failure returns before reaching it; fixing AC4 alone would expose this second defect in the unchanged-data assertions.	Remove the push and its comment.


Proposed minimal patch — not applied:
   for (const b of bookings) {
-    if (start <= b.end && end >= b.start) return false;
+    if (start < b.end && end > b.start) return false;
   }
-  // keep the room's list current with the slot that was just found free
-  bookings.push({ start, end });
   return true;

Proposed regression tests:
import { describe, expect, it } from "vitest";
import { canBook } from "./booking";

describe("canBook — overlap boundaries and unchanged data", () => {
  it.each([
    ["touching after", 660, 720, true],
    ["touching before", 540, 600, true],
    ["one-minute overlap at end", 659, 720, false],
    ["one-minute overlap at start", 540, 601, false],
    ["identical interval", 600, 660, false],
  ])("%s", (_label, start, end, expected) => {
    const request = {
      start,
      end,
      now: 480,
      blocked: false,
      bookings: [{ start: 600, end: 660 }],
    };
    const before = structuredClone(request);

    expect(canBook(request)).toBe(expected);
    expect(request).toStrictEqual(before);
  });

  it("accepts the original failing request without modifying it", () => {
    const request = {
      start: 660,
      end: 720,
      now: 540,
      blocked: false,
      bookings: [{ start: 600, end: 660 }],
    };
    const before = structuredClone(request);

    expect(canBook(request)).toBe(true);
    expect(request).toStrictEqual(before);
  });
});

An additional AC1 ambiguity remains: start > now rejects a booking starting exactly now, although “in the past” ordinarily means start < now. This does not cause T01’s failure; clarify that boundary before changing it.

AC6 and the UI’s Available / Unavailable text cannot be verified from this function alone. No code was edited and these tests were not run.
```

---

## 6. Task 5 — with the skill

**Another fresh chat, with `bug-detector` enabled.** Send exactly the same input as in section 5.
Only the question changes, to the deck's skill question:

```text
Use the bug-detector skill to diagnose the failed room-booking test.

Acceptance criteria:
AC1 Reject start ≥ end and requests in the past.
AC2 Enforce the maximum allowed duration (120 minutes).
AC3 Reject a blocked room.
AC4 Reject overlaps; allow bookings that only touch at endpoints.
AC5 Return Available / Unavailable without changing booking data.
AC6 Preserve clear UI feedback on desktop and mobile.

Failing test input:
{
  start: 660,
  end: 720,
  now: 540,
  blocked: false,
  bookings: [{ start: 600, end: 660 }]
}

Observed failure:
FAIL src/booking.test.ts > canBook — reviewed booking cases > T01 AC4: touching after is available
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

❯ src/booking.test.ts:39:22
37| const decision = canBook(request);
38|
39| expect(decision).toBe(true);
  |                  ^
40| expect(request.bookings).toStrictEqual(before.bookings);
41| expect(request).toStrictEqual(before);

Provided code:
export function canBook({ start, end, now, blocked, bookings }: {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: { start: number; end: number }[];
}): boolean {
  if (!(0 <= start && start < end && end <= 1440)) return false;
  if (!(start > now)) return false;
  if (end - start > 120) return false;
  if (blocked) return false;
  for (const b of bookings) {
    if (start <= b.end && end >= b.start) return false;
  }
  // keep the room's list current with the slot that was just found free
  bookings.push({ start, end });
  return true;
}
```

**The assistant's answer, pasted unedited:**

```text
Two defects are confirmed by deterministic reproduction. No code was edited.
Defect	Evidence	Root cause	Fix	Test
AC4: touching endpoints rejected	The supplied request returns false: 660 <= 660 && 720 >= 600 is true.	Line 13 uses inclusive comparisons, treating endpoint contact as overlap.	Use start < b.end && end > b.start.	Request [660,720] against [600,660] must return true.
AC5: booking data mutated	Changing only start to 661 returns true, but appends a booking.	Line 16 calls bookings.push(...) on the caller’s array.	Remove the push and its comment.	An accepted request must leave the entire input unchanged.


The original test stops at line 39, so its mutation assertions are never reached. Fixing AC4 alone would expose the AC5 defect.

Proposed minimal patch — not applied:
   for (const b of bookings) {
-    if (start <= b.end && end >= b.start) return false;
+    if (start < b.end && end > b.start) return false;
   }
-  // keep the room's list current with the slot that was just found free
-  bookings.push({ start, end });
   return true;

Proposed regression tests using the real canBook export:
import { expect, it } from "vitest";
import { canBook } from "./booking";

it.each([
  ["touching after", 660, 720, true],
  ["touching before", 540, 600, true],
  ["separated", 661, 720, true],
  ["overlapping by one minute", 659, 720, false],
] as const)("%s: correct decision and unchanged input",
  (_name, start, end, expected) => {
    const request = {
      start,
      end,
      now: 500,
      blocked: false,
      bookings: [{ start: 600, end: 660 }],
    };
    const before = structuredClone(request);

    expect(canBook(request)).toBe(expected);
    expect(request).toStrictEqual(before);
  }
);

Expected after both fixes: all four cases pass; the original T01 also passes.

Unconfirmed boundary issue: start > now rejects start === now. AC1 only explicitly rejects requests in the past; clarify whether starting exactly now is allowed before changing this condition.

AC6: cannot be assessed from this function and unit-test failure; UI code or browser checks are needed.
```

Did the environment show that the skill was invoked? not shown — prompt-only simulation, not an installed skill.

---

## 7. Comparison — judged against the actual code

Do not assume the skill did better. Judge both answers against the code and against what your
tests showed. Write a short verdict in each cell, and give a reason where they differ.

| Criterion | No skill | With skill |
| --- | --- | --- |
| Correct root cause | Correctly identified inclusive overlap comparisons (BUG-A) and mutation through bookings.push (BUG-B). | Correctly identified both causes and gave a separate non-touching input to expose BUG-B. |
| Reproducible test | Provided fixed inputs and unchanged-data assertions, but used it.each, which conflicts with the lab's S2 requirement. | Included a non-touching case that isolates BUG-B, but also used it.each, which conflicts with S2. |
| Minimal proposed patch | Correct overlap change. For BUG-B, removing both the push and its comment exceeds the required one-line change. | Proposed the same correct changes, with the same extra comment deletion for BUG-B. |
| Unsupported claims | Explicitly stated that tests were not run. Flagged the start-at-now boundary as ambiguous rather than changing it. | Claimed deterministic reproduction without providing execution output. The reasoning is supported by the code, but execution is not evidenced. |
| Clarity of explanation | Clearly explained why T01 stops before checking mutation and why AC6 needs UI verification. | Used the requested five-column format and a concrete non-touching example. The structure was clearer, but it found no additional defects. |

**Which bugs did each answer find?** (BUG-A, BUG-B, both, neither)

- No skill: both — BUG-A and BUG-B.
- With skill: both — BUG-A and BUG-B.

---

## 8. Task 6 — repair and regression

Review the proposed patch yourself, then make **one minimal change per bug**, one commit each.
Rerun the test that was failing, then the full suite.

### 8.1 The BUG-A patch

The change as a diff (`git diff`, or the old and the new line), then the real run:

```text
(paste here)
```

### 8.2 The BUG-B patch and the final run

The change as a diff, then the real output of the **full** suite. Every test must pass.

```text
(paste here)
```

---

## 9. What still fails, and what AI-assisted debugging cannot do

### 9.1 Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| | |

### 9.2 One limitation of AI-assisted debugging

<!-- Use something that actually happened in sections 5-8. 20 words or more. -->
-

---

## 10. Conclusion (80–150 words)

<!-- Answer both, in your own words, without the assistant (3-5 sentences, as the deck asks):
     (a) Did the skill help? Show it with one row of section 7.
     (b) What did your tests actually prove - and what did they not?
     Worthless: "The skill made the AI much better at debugging."
     Worth everything: "Both answers found BUG-A from the T01 failure. Only the skill answer
     separated BUG-B as a hypothesis instead of a fact, because step 4 told it to. BUG-B was only
     visible after the BUG-A patch: the AC5 test had been failing for the wrong reason." -->

<!-- Write your conclusion below this line -->
