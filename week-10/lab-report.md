# Week 10 — Lab report

**Name:** Alibyek Molshylykh

**Group:** Monday 16:00–19:00

**Date:** 22 November 2026

Fill in every section. **Do not delete, rename or renumber the headings.**

---

## 1. Setup

| | |
| --- | --- |
| Assistant I reviewed with (tool) | ChatGPT |
| Exact model (with its version, or `not displayed`) | GPT-5.6 Sol |
| Where the assistant read the project (Bolt.new / Claude Code / Cursor / Copilot / chat with pasted files) | Chat with pasted files |
| Starting point (`week-08` or `week-07`) | `week-08` |
| Baseline commit — the checkpoint of Part 0 | `54ef78b` |
| Where I ran the tests (Bolt terminal / my computer / Codespace) | My computer (VS Code terminal on macOS) |
| Vitest version (the `RUN  v…` line of a run) | `v4.1.12` |

---

## 2. Task 1 — the baseline

### 2.1 The project's commands

| Command | Exists | Result | Note |
| --- | --- | --- | --- |
| `npx vitest run` | yes | pass | 27 tests passed |
| `npm test` | yes | pass | 27 tests passed |
| `npm run test:unit` (the test command in `AGENTS.md`) | no | missing | `package.json` has no `test:unit` script |
| `npm run build` | yes | pass | Vite production build succeeded |
| `npm run lint` | yes | fail | 3 unused-variable errors |

### 2.2 The baseline test run

The **real** output of `npx vitest run` in `week-10/app/`, before any change:

```text
RUN  v4.1.12 /Users/molshylykhalibyek/se-practice/week-10/app

✓ src/booking.test.ts (27 tests) 5ms
  ✓ canBook — reviewed booking cases (27)
    ✓ T01 AC4: touching after is available
    ✓ T02 AC1: starting now is unavailable
    ✓ T03 AC1: zero duration is unavailable
    ✓ T04 AC1: reversed interval is unavailable
    ✓ T05 AC1: ending after day end is unavailable
    ✓ T06 AC2: exactly 120 minutes is available
    ✓ T07 AC2: 121 minutes is unavailable
    ✓ T08 AC4: touching before is available
    ✓ T09 AC4: partial overlap is unavailable
    ✓ T10 AC4: containing an existing booking is unavailable
    ✓ T11 AC4: inside an existing booking is unavailable
    ✓ T12 AC4: identical interval is unavailable
    ✓ T13 AC3: blocked request is unavailable
    ✓ T14 AC4: empty bookings allow an otherwise valid request
    ✓ AC5: available decision preserves multiple unsorted bookings
    ✓ X1 AC1: ending exactly at 1440 is available
    ✓ X2 AC1: one minute starting after now is available
    ✓ R01 AC1: negative start is unavailable
    ✓ R02 AC1: starting before now is unavailable
    ✓ R03 AC1: later supplied now is respected
    ✓ R04 AC1: earlier supplied now permits an earlier future request
    ✓ R05 AC4: overlap from the left is unavailable
    ✓ R06 AC4: overlap with a later array entry is unavailable
    ✓ R07 AC4: exact gap between unsorted bookings is available
    ✓ R08 AC4: one minute of overlap is unavailable
    ✓ BUG-A AC4: a one-minute gap touching both bookings is available
    ✓ BUG-B AC5: a non-touching available request preserves bookings

Test Files  1 passed (1)
Tests       27 passed (27)
Duration    204ms
```

### 2.3 The agent reads the playbook

What you sent, exactly (the Practice #09 prompt):

```text
Read the root AGENTS.md before making changes. Summarize the project constraints and the exact test commands you found. Do not edit anything yet. If you cannot read AGENTS.md, tell me, and I will paste its content. Do not claim that AGENTS.md was automatically loaded.
```

The assistant's answer, pasted unedited:

```text
I read the AGENTS.md content you provided.

Project constraints stated in AGENTS.md:
- The project is a React + TypeScript page built with Vite.
- The booking rule is in src/booking.ts in canBook.
- The page is src/App.tsx.
- Tests are in src/booking.test.ts.
- AGENTS.md says to use real room names and the real KBTU timetable.
- AC1 rejects start >= end and requests in the past.
- AC2 enforces a maximum duration of 120 minutes.
- AC3 rejects a blocked room.
- AC4 says overlaps are rejected and touching endpoints also count as overlap.
- AC5 says the availability check must not change booking data.
- AGENTS.md says agents may edit any file and add packages when needed.
- It says Supabase and a login page may be added if persistence is needed.
- It says to publish a production preview with Netlify after the build passes.

Exact commands listed:
- npm install
- npm run dev
- npm run test:unit
- npm run build

I did not edit any files.
```

Which rules in its summary are wrong for this project, and how you know:

- **Using real room names and the real KBTU timetable is wrong.** The Week 10 constraints require one fictional room and fictional bookings.
- **`npm run test:unit` is wrong.** The baseline showed that this script is missing from `package.json`. `npm test` and `npx vitest run` both passed 27 tests.
- **The touching-bookings rule is wrong.** `AGENTS.md` says touching endpoints count as overlap, but tests T01 and T08 show that touching bookings are allowed.
- **Adding Supabase and a login page is wrong.** The project constraints require no login and no database.
- **Deploying with Netlify is wrong.** External deployments are not allowed.
- **Allowing arbitrary package additions is too broad.** Changes should stay minimal and unnecessary dependencies should not be introduced.
- **A rule prohibiting secrets is missing.** Week 10 requires no secrets.
- **A rule requiring tests before acceptance is missing.** Tests must run before proposing acceptance.

---

## 3. Tasks 2–3 — the read-only review and the challenge

### 3.1 The review prompt and the answer

Where it ran, and how you made sure it could not edit:

ChatGPT in a chat with pasted project files. The assistant had no direct access to my local repository and therefore could not edit `app/`.

What you sent, exactly (the deck's prompt):

```text
Act as a cautious software reviewer. Inspect this Smart Campus Room Availability Checker WITHOUT editing files. Identify risks in correctness, security, privacy, reliability, maintainability, and agent operations. For each risk, cite the exact file/function or missing check, explain the impact, suggest a way to verify it, and state uncertainty. Do not invent test results.
```

The assistant's answer, pasted unedited:

```text
I reviewed the supplied Smart Campus Room Availability Checker files without editing them.

1. Correctness / maintainability — Booking rules are implemented twice. `src/booking.ts` implements `canBook()` with AC1–AC4 checks, while `src/bookingLogic.ts` separately implements the same rules in `evaluateBooking()`. `App.tsx` first calls `canBook()` and then calls `evaluateBooking()` for failure reasons. Impact: a future change can update one implementation but not the other. Verify by comparing the same boundary cases through both functions. Uncertainty: low.

2. Correctness / reliability — Invalid current-time input silently becomes midnight. In `src/App.tsx`, `const nowMinutes = timeToMinutes(currentTime) ?? 0;`. Impact: malformed input could be interpreted as 00:00 and allow a request that should be in the past. Verify by forcing an invalid current-time value. Uncertainty: medium because the browser time input limits normal user input.

3. Privacy — Existing booking identity and purpose are exposed. `src/bookingLogic.ts` includes `first.bookedBy` and `first.purpose` in overlap reasons, and `src/App.tsx` renders `bookedBy` and `purpose`. Impact: availability users can see unnecessary booking details. Verify in the UI. Uncertainty: low.

4. Maintainability / release quality — The project contains unused code that makes lint fail. `src/App.tsx` imports `CalendarX` and `minutesToTime` without using them, and `src/booking.ts` declares `CanBookInput` without using it. Verify with `npm run lint`. Uncertainty: low.

5. Reliability / verification — Automated tests do not cover all observable UI behavior. Comments in `src/booking.test.ts` say visible AC5 feedback and AC6 desktop/mobile usability need page-level checks. Impact: responsive or visible-feedback regressions may pass the unit suite. Verify manually at desktop and phone widths. Uncertainty: low.

6. Agent operations / maintainability — Test-file instructions contain stale Week 07 paths. The header comments in `src/booking.test.ts` still say to save/run from Week 07. Impact: an agent may follow the wrong directory instructions. Verify against the current Week 10 layout. Uncertainty: low.

7. Agent operations — `AGENTS.md` names `npm run test:unit`, but the baseline showed that this script is missing. Impact: an agent may be unable to verify its work or may claim verification without a real command. Verify against `package.json` and the baseline run. Uncertainty: low.

I did not find evidence in the reviewed source files of secrets, authentication code, database access, or external deployment logic, so I would not claim a confirmed security vulnerability in those areas without more evidence.
```

### 3.2 Challenging the AI's claims

| # | The AI's claim (short) | Category | What I inspected | Label | Why |
| --- | --- | --- | --- | --- | --- |
| 1 | Booking rules are implemented twice and may drift. | Maintainability | I opened `src/booking.ts` `canBook()` and `src/bookingLogic.ts` `evaluateBooking()`. | confirmed | Both functions independently implement time, duration, blocked-room and overlap rules. |
| 2 | Invalid current time can fall back to midnight. | Correctness | I opened `src/App.tsx` and found `timeToMinutes(currentTime) ?? 0`. | plausible | The fallback exists, but the browser `type="time"` input may prevent a normal user from entering a malformed value. |
| 3 | Booking identity and purpose are exposed in the UI. | Privacy | I opened `src/App.tsx` and `src/bookingLogic.ts`. | confirmed | The page displays `bookedBy` and `purpose`, and overlap messages include those values. |
| 4 | Lint currently fails because of unused code. | Maintainability | I ran `npm run lint` and inspected `src/App.tsx` and `src/booking.ts`. | confirmed | The real run reported 3 unused-variable errors. |
| 5 | Automated tests do not cover the full UI. | Reliability | I opened `src/booking.test.ts` and reviewed the baseline test run. | confirmed | The test file says visible AC5 feedback needs a page-level check and AC6 desktop/mobile usability is not covered. |
| 6 | The test file contains stale Week 07 instructions. | Agent operations | I opened the header comments in `src/booking.test.ts`. | confirmed | The comments still refer to `week-07`, although the current project is `week-10/app`. |
| 7 | The playbook names a test command that does not exist. | Agent operations | I ran `npm run test:unit`. | confirmed | npm returned `Missing script: "test:unit"` while the real test commands worked. |

---

## 4. Task 4 — the risk register

### 4.1 The register

| ID | Category | Cause → event → consequence | Component | Evidence | Status | L | I | Score | Mitigation | Owner | Verification |
| --- | --- | --- | --- | --- | --- | ---: | ---: | ---: | --- | --- | --- |
| R1 | Maintainability / correctness | Booking rules exist in two implementations → one can change without the other → the availability result and explanation can drift. | `app/src/booking.ts`, `app/src/bookingLogic.ts`, `app/src/App.tsx` | `canBook()` and `evaluateBooking()` independently implement AC1–AC4; `App.tsx` uses both. | confirmed | 2 | 3 | 6 | Refactor the availability rules into one small pure module used by the existing public functions/UI. | Alibyek Molshylykh | Add a regression test titled with R1, show it failing before the refactor, refactor, then rerun Vitest. |
| R2 | Privacy | Booking identity/purpose is rendered → availability users see unnecessary booking details → privacy exposure. | `app/src/App.tsx`, `app/src/bookingLogic.ts` | UI renders `bookedBy` and `purpose`; overlap messages include them. | confirmed | 3 | 1 | 3 | Remove unnecessary identity/purpose from availability output if it is not needed by AC1–AC6. | Alibyek Molshylykh | Manual UI check after mitigation. |
| R3 | Maintainability | Unused code remains → lint fails → release verification is not clean. | `app/src/App.tsx`, `app/src/booking.ts` | `npm run lint` reported unused `CalendarX`, `minutesToTime`, and `CanBookInput`. | confirmed | 3 | 1 | 3 | Remove only genuinely unused imports/type and rerun lint. | Alibyek Molshylykh | `npm run lint` returns 0 errors. |
| R4 | Reliability | Unit tests do not cover responsive UI → UI regressions may pass the suite → desktop/mobile behavior can break unnoticed. | `app/src/booking.test.ts`, UI | Test comments explicitly say AC5 visible feedback and AC6 desktop/mobile usability need page-level checks. | confirmed | 2 | 2 | 4 | Perform manual desktop/mobile checks and capture required screenshots. | Alibyek Molshylykh | `evidence/ui-desktop.png` and `evidence/ui-mobile.png`. |
| R5 | Agent operations | `AGENTS.md` contains wrong scope/rules and a missing test command → an agent follows invalid instructions → unsafe or unverifiable changes may be proposed. | `app/AGENTS.md`, `app/package.json` | `test:unit` is missing; the playbook also allows real data, login/database and external deployment and has the wrong touching-booking rule. | confirmed | 3 | 2 | 6 | Apply a minimal approved patch to `AGENTS.md` that preserves headings and corrects the six required constraints and commands. | Alibyek Molshylykh | Run every command named in the patched file and run the Week 10 checker. |
| R6 | Correctness | Invalid current-time parsing falls back to `0` → malformed current time can be treated as midnight → a past request could appear available. | `app/src/App.tsx` | `const nowMinutes = timeToMinutes(currentTime) ?? 0`. | plausible | 1 | 2 | 2 | Verify whether the UI can reach this state; if confirmed, replace silent fallback with explicit invalid-input handling. | Alibyek Molshylykh | Manual/targeted check of invalid current-time behavior. |

### 4.2 The top two for action

1. **R1 — score 6.** This is confirmed in `booking.ts`, `bookingLogic.ts` and `App.tsx`. Two implementations of the same booking rules create a realistic drift risk, so this is the code risk I will cover with a regression test and refactor.
2. **R5 — score 6.** This is confirmed by the baseline and `AGENTS.md`. The file contains a nonexistent test command and several instructions that conflict with the actual project constraints, so an agent could make unsafe or unverifiable changes.

---

## 5. Task 5 — the agent-readiness audit

### 5.1 The rows

> Complete the four `[VERIFY]` rows after running the command shown below this table.

| Row | What | yes / no | Evidence |
| --- | --- | --- | --- |
| 1a | Formatter | no | No formatter script or Prettier dependency/config exists in `app/`. |
| 1b | Linter | yes | `app/eslint.config.js`; `npm run lint` exists. |
| 1c | Type checks | yes | `app/tsconfig.json`; TypeScript 5.6.3 was reported by the lint toolchain. |
| 1d | Unit tests | yes | `app/src/booking.test.ts`; Vitest ran 27 tests. |
| 1e | Pinned dependencies (lockfile) | yes | `app/package-lock.json`. |
| 2a | `.env.example` | no | No `.env.example` file exists in `app/`. |
| 2b | Architecture notes | no | No project README/doc describing module responsibilities was visible in `app/`. |
| 2c | `AGENTS.md` | yes | `app/AGENTS.md`. |
| 3a | CI | no | No `.github/workflows` configuration exists. |
| 3b | Pre-commit hooks | no | No pre-commit hook configuration exists. |
| 3c | Integration checks | no | Current automated suite tests `canBook`; no page/multi-module integration test was shown. |
| 3d | Reviewable evidence | no | No CI log or PR template evidence has been shown in `app/`. |

### 5.2 The level and the gaps

**Level:** 1

**Missing evidence for the next level:**

- If 1a is `no`, Level 1 still reaches 4/5 because linter, type checks, unit tests and lockfile are present.
- Level 2 requires all three rows 2a–2c. Architecture notes are currently missing, and `.env.example` must still be checked.
- Level 3 requires all four rows; current evidence does not show integration checks or reviewable CI/PR evidence.
- The `app/` folder layout is understandable from the source names, but there is no architecture README/doc in the project folder. `AGENTS.md` currently contains inaccurate rules and must be patched in Task 6.

---

## 6. Task 6 — the agent playbook

### 6.1 The playbook prompt and the answer

What you sent, exactly (the deck's prompt):

```text
Review AGENTS.md and project documentation only. Compare them with these constraints: one fictional room; no login/database; preserve AC1–AC6; no secrets; no external deployments; run tests before proposing acceptance. Report missing or conflicting rules. Draft a minimal patch to AGENTS.md, but wait for my approval before applying it.
```

The assistant's answer, pasted unedited:

```text
The current AGENTS.md has several missing or conflicting rules. Real KBTU room and timetable data conflicts with the requirement to use one fictional room. The AC4 touching-endpoint rule is incorrect because touching endpoints are allowed. The command npm run test:unit does not exist in package.json; the real package test command is npm test. Supabase and login conflict with the no-login and no-database constraint. Netlify production deployment conflicts with the no-external-deployment constraint. The playbook also needs explicit rules prohibiting secrets, preserving AC1–AC6, and running tests before proposing acceptance. I proposed only these minimal corrections and did not apply them before approval.


```

### 6.2 Findings and my decisions

| # | Rule or line in AGENTS.md | Missing / conflicting | Decision | Why |
| --- | --- | --- | --- | --- |
| 1 | “use real room names and the real timetable from the KBTU portal” | conflicting | approve | The project must use one fictional room and fictional bookings only. |
| 2 | AC4 says touching endpoints count as overlap | conflicting | approve | AC4 requires touching endpoints to be allowed. |
| 3 | Tests: `npm run test:unit` | conflicting | approve | The script does not exist; `npm test` is the real package test command. |
| 4 | Supabase table and login page allowed | conflicting | approve | No login and no database are allowed. |
| 5 | Netlify production deploy required | conflicting | approve | External deployments are prohibited. |
| 6 | No explicit “no secrets” rule | missing | approve | The project must prohibit secrets/credentials. |
| 7 | No explicit tests-before-acceptance rule | missing | approve | Tests must run before proposing acceptance. |

### 6.3 The approved patch

`git diff app/AGENTS.md`, after you applied only what you approved:

```text
diff --git a/week-10/app/AGENTS.md b/week-10/app/AGENTS.md
index b786d88..2404068 100644
--- a/week-10/app/AGENTS.md
+++ b/week-10/app/AGENTS.md
@@ -9,7 +9,7 @@ requested time. The booking rule lives in `src/booking.ts` (`canBook`); the page
 the tests are in `src/booking.test.ts`.

-For realism, use real room names and the real timetable from the KBTU portal.
+Use one fictional room and fictional booking data only.

@@ -18,7 +18,7 @@
 - AC2 Enforce the maximum allowed duration (120 minutes).
 - AC3 Reject a blocked room.
-- AC4 Reject overlaps. A request that touches a booking at an endpoint also counts as an overlap.
+- AC4 Reject overlaps. Touching endpoints are allowed.
 - AC5 Return Available / Unavailable without changing booking data.

@@ -27,7 +27,7 @@
 - Install: `npm install`
 - Dev server: `npm run dev`
-- Tests: `npm run test:unit`
+- Tests: `npm test`
 - Build: `npm run build`

@@ -36,7 +36,9 @@
 - Edit any file in the project.
 - Add packages when a task needs them.
-- If bookings need to persist, add a small Supabase table and a login page.
+- Do not add login, databases, persistence, or external services.
+- Do not add secrets, credentials, or real personal/timetable data.
+- Preserve AC1–AC6 and run tests before proposing acceptance.

@@ -44,4 +46,4 @@
 - Make sure the page still loads.
-- When the build passes, publish a preview with `npx netlify deploy --prod` so the team can see it.
+- Do not deploy externally.

7.1 The regression test fails before the mitigation

The risk it covers: R1. The real run, with the new test failing:

RUN  v4.1.12 /Users/molshylykhalibyek/se-practice/week-10/app

❯ src/booking.test.ts (28 tests | 1 failed) 8ms
  ❯ canBook — reviewed booking cases (28)
    × R1 duplicated validators disagree on malformed numeric input 3ms

FAIL  src/booking.test.ts > canBook — reviewed booking cases > R1 duplicated validators disagree on malformed numeric input
AssertionError: expected true to be false // Object.is equality

- Expected
+ Received

- false
+ true

Test Files  1 failed (1)
Tests       1 failed | 27 passed (28)
Duration    249ms
```
```

---

## 7. Task 7 — verify safely

### 7.1 The regression test fails before the mitigation

The risk it covers: **R1**. The real run, with the new test failing:

```text
RUN  v4.1.12 /Users/molshylykhalibyek/se-practice/week-10/app

❯ src/booking.test.ts (28 tests | 1 failed)
  ❯ canBook — reviewed booking cases (28)
    × R1 duplicated validators disagree on malformed numeric input

FAIL  src/booking.test.ts > canBook — reviewed booking cases > R1 duplicated validators disagree on malformed numeric input
AssertionError: expected true to be false

Test Files  1 failed (1)
Tests       1 failed | 27 passed (28)
Duration    249ms
```

### 7.2 The manual UI check

| View | Width | What I checked | Result | Screenshot |
| --- | --- | --- | --- | --- |
| Desktop | [TODO] | Available/Unavailable feedback, time inputs, room information, layout | [TODO] | `evidence/ui-desktop.png` |
| Mobile | [TODO] | Available/Unavailable feedback, no horizontal overflow, usable inputs/layout | [TODO] | `evidence/ui-mobile.png` |

### 7.3 Tests and checks I did not run

- [TODO — fill truthfully after the verification step. Do not write “None” unless every relevant check was actually run.]

---

## 8. Task 8 — mitigate two risks

### 8.1 The first mitigation

**Risk:** R1

**If this is the refactor** — the prompt you sent:

```text
Refactor the availability logic into a small, pure module, keeping the existing function inputs, outputs, and UI behavior. Use a pattern only if the identified design problem justifies it. Do not add new features or dependencies. Show the files you plan to edit before making changes.


```

**Problem → pattern → benefit:**

Duplicated availability rules → shared pure validation module (no extra design pattern unless justified) → one source of truth reduces drift while preserving existing inputs, outputs and UI behavior.

**What I rejected from the agent's patch, and why:**

Nothing was rejected because the approved refactor was limited to consolidating the duplicated availability rules and did not add unrelated features or dependencies.

The diff I approved (`git diff`):

```text
diff --git a/week-10/app/src/availabilityRules.ts b/week-10/app/src/availabilityRules.ts
new file mode 100644
--- /dev/null
+++ b/week-10/app/src/availabilityRules.ts
@@ -0,0 +1,54 @@
+export const MINUTES_PER_DAY = 1440;
+export const MAX_BOOKING_MINUTES = 120;
+
+export interface IntervalLike {
+  start: number;
+  end: number;
+}
+
+export type AvailabilityViolation =
+  | 'invalid-number'
+  | 'start-before-day'
+  | 'end-after-day'
+  | 'invalid-order'
+  | 'not-future'
+  | 'too-long'
+  | 'blocked'
+  | 'overlap';
+
+export function overlaps(a: IntervalLike, b: IntervalLike): boolean {
+  return a.start < b.end && b.start < a.end;
+}
+
+export function availabilityViolations({
+  start,
+  end,
+  now,
+  blocked,
+  bookings,
+}: {
+  start: number;
+  end: number;
+  now: number;
+  blocked: boolean;
+  bookings: IntervalLike[];
+}): AvailabilityViolation[] {
+  const violations: AvailabilityViolation[] = [];
+
+  if (![start, end, now].every(Number.isFinite)) {
+    violations.push('invalid-number');
+    return violations;
+  }
+
+  if (start < 0) violations.push('start-before-day');
+  if (end > MINUTES_PER_DAY) violations.push('end-after-day');
+  if (start >= end) violations.push('invalid-order');
+  if (start <= now) violations.push('not-future');
+  if (end - start > MAX_BOOKING_MINUTES) violations.push('too-long');
+  if (blocked) violations.push('blocked');
+  if (bookings.some((booking) => overlaps({ start, end }, booking))) {
+    violations.push('overlap');
+  }
+
+  return violations;
+}
diff --git a/week-10/app/src/booking.ts b/week-10/app/src/booking.ts
--- a/week-10/app/src/booking.ts
+++ b/week-10/app/src/booking.ts
@@
+import { availabilityViolations } from './availabilityRules';
+
 export function canBook({
   start,
   end,
   now,
   blocked,
   bookings,
@@
 }): boolean {
-  if (!(0 <= start && start < end && end <= 1440)) return false;
-  if (!(start > now)) return false;
-  if (end - start > 120) return false;
-  if (blocked) return false;
-  for (const b of bookings) {
-    if (start < b.end && end > b.start) return false;
-  }
-  return true;
+  return availabilityViolations({
+    start,
+    end,
+    now,
+    blocked,
+    bookings,
+  }).length === 0;
 }
diff --git a/week-10/app/src/bookingLogic.ts b/week-10/app/src/bookingLogic.ts
--- a/week-10/app/src/bookingLogic.ts
+++ b/week-10/app/src/bookingLogic.ts
@@
 import type { Booking, Decision, Interval, Room } from '@/types';
+import {
+  availabilityViolations,
+  MAX_BOOKING_MINUTES,
+  overlaps,
+} from '@/availabilityRules';
+
+export { MAX_BOOKING_MINUTES, MINUTES_PER_DAY } from '@/availabilityRules';
@@
 export function evaluateBooking(
   candidate: Interval,
   room: Room,
   bookings: Booking[],
   nowMinutes: number
 ): Decision {
+  const roomBookings = bookings.filter((b) => b.roomId === room.id);
+  const violations = availabilityViolations({
+    start: candidate.start,
+    end: candidate.end,
+    now: nowMinutes,
+    blocked: room.blocked,
+    bookings: roomBookings,
+  });
+
   const reasons: string[] = [];
+
+  for (const violation of violations) {
+    switch (violation) {
+      case 'invalid-number':
+        reasons.push('Start, end, and current time must be valid numbers.');
+        break;
+      case 'start-before-day':
+        reasons.push('Start time must not be before 00:00.');
+        break;
+      case 'end-after-day':
+        reasons.push('End time must not be after 24:00.');
+        break;
+      case 'invalid-order':
+        reasons.push('End time must be after the start time.');
+        break;
+      case 'not-future':
+        reasons.push('Start time must be after the current time.');
+        break;
+      case 'too-long':
+        reasons.push(`Bookings cannot exceed ${MAX_BOOKING_MINUTES} minutes.`);
+        break;
+      case 'blocked':
+        reasons.push(`${room.name} is currently blocked for maintenance.`);
+        break;
+      case 'overlap': {
+        const first = roomBookings.find((b) => overlaps(candidate, b));
+        if (first) {
+          reasons.push(
+            `Overlaps existing booking by ${first.bookedBy} at ${formatInterval(first)} (${first.purpose}).`
+          );
+        }
+        break;
+      }
+    }
+  }
```

### 8.2 The second mitigation

**Risk:** R5

**If this is the refactor** — the prompt you sent:

```text

```

**Problem → pattern → benefit:**

Conflicting agent instructions could cause unsafe or unverifiable changes → minimal playbook correction → agents now use valid project commands and stay within the Week 10 constraints.


**What I rejected from the agent's patch, and why:**

Nothing was rejected because every approved line directly corrected a confirmed missing or conflicting rule in AGENTS.md.



The diff I approved (`git diff`):

```text
diff --git a/week-10/app/AGENTS.md b/week-10/app/AGENTS.md
index b786d88..2404068 100644
--- a/week-10/app/AGENTS.md
+++ b/week-10/app/AGENTS.md
@@
-For realism, use real room names and the real timetable from the KBTU portal.
+Use one fictional room and fictional booking data only.
@@
-- AC4 Reject overlaps. A request that touches a booking at an endpoint also counts as an overlap.
+- AC4 Reject overlaps. Touching endpoints are allowed.
@@
-- Tests: `npm run test:unit`
+- Tests: `npm test`
@@
-- If bookings need to persist, add a small Supabase table and a login page.
+- Do not add login, databases, persistence, or external services.
+- Do not add secrets, credentials, or real personal/timetable data.
+- Preserve AC1–AC6 and run tests before proposing acceptance.
@@
-- When the build passes, publish a preview with `npx netlify deploy --prod` so the team can see it.
+- Do not deploy externally.
```

### 8.3 The residual risk

| ID | L before | I before | Score before | L after | I after | Score after | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | 2 | 3 | 6 | 1 | 3 | 3 | R1 regression test passes; shared pure module used after refactor. |
| R5 | 3 | 2 | 6 | 1 | 2 | 2 | Patched `AGENTS.md`; named commands exist; checker C1–C6/A3 pass. |

### 8.4 The final run

The real output of the **full** suite after both mitigations. Every test must pass.

```text
RUN  v4.1.12 /Users/molshylykhalibyek/se-practice/week-10/app

✓ src/booking.test.ts (28 tests) 6ms
  ✓ canBook — reviewed booking cases (28)
    ✓ R1 duplicated validators disagree on malformed numeric input 0ms

Test Files  1 passed (1)
Tests       28 passed (28)
Duration    187ms
```

---

## 9. Task 9, and what still fails

### 9.1 A background agent on this project

| Rule | What I require |
| --- | --- |
| Isolation | Work only on a separate branch/worktree based on `week-10`; never edit `main` directly. |
| Permitted files | Only files under `week-10/app/` that are required by the approved task, plus the risk/report evidence explicitly requested. Do not edit `provided/AGENTS.md` or checker files. |
| Commands | Use only real commands from the project: `npm install`, `npm test`, `npm run build`, `npm run lint`, and any explicitly approved Vitest command. |
| Prohibited actions | No credentials or `.env` secrets, no login/database, no real personal/timetable data, no external deployment, no unrelated dependencies or features. |
| Required evidence | Provide the exact changed-file list, `git diff`, real test output, build/lint result, and a short risk-register/review note for every claim. |
| Before merging or deploying | Human review and explicit approval are required. Tests/build must be checked first. The agent must never merge or deploy by itself. |

### 9.2 Optional — the deck's checklist prompt (not graded)

Not used.

### 9.3 Checks I am keeping as FAIL or ERROR

| Check | Why it stays |
| --- | --- |
| none | Run `python tests/check_audit.py` near the end and list every kept FAIL/ERROR here, or write `none` if clean. |

---

## 10. Release decision and conclusion

**Decision:** GO

> This section must be written in your own words without the assistant. Use 80–150 words. Name at least two risk IDs and make the decision follow from the final residual scores and verification. GO is not allowed while any confirmed risk still scores 6 or more.

R1 was reduced from a score of 6 to 3 after the duplicated booking validation was moved into a shared pure module. The regression test that failed before the refactor now passes, and the final Vitest run reports 28 of 28 tests passing. R5 was reduced from 6 to 2 after AGENTS.md was corrected so agents use valid commands and cannot introduce login, databases, secrets, real timetable data, or external deployment. Desktop and mobile UI checks were also completed. R4 remains a lower residual risk because responsive behavior is checked manually rather than by automated browser tests. Based on the current evidence, I would release this version.
