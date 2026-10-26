# SIS #03 — Report: Smart Campus Room Availability Checker

<!-- The ONLY file you write prose in. Keep every numbered heading (## 1. … ## 13.) and every
     ### sub-heading, and the **Label:** words — the checker finds your answers by them.
     Replace every "(write here)" and "(paste here)". Delete these <!-- --> comments if you like. -->

## 1. Setup and reuse

<!-- Model: the exact model with its version, as the tool shows it ("ChatGPT" is a tool, not a
     model). If the tool does not show it, write: not displayed
     Reuse: week-05 if code/original/booking_v1.py is your Week 05 v1, copied unedited;
     week-06 if web/original/ is your Week 06 v1 export; fresh if you generated it for this SIS. -->

| Item | Value |
| --- | --- |
| Coding assistant (tool) | ChatGPT (web) |
| Coding assistant model | GPT-6 |
| Bolt.new model | not displayed |
| Bolt project link | not-shared |
| Language | Python |
| Path | A |
| Python v1 from | week-05 |
| Web v1 from | fresh |

## 2. Baseline — before any new AI exchange

<!-- Written by you, without AI, before the first exchange of this SIS. Commit and push it
     first (README §2). Reusing Week 05/06 work does not exempt you: this section is new. -->

### 2.1 Scope in my own words

**Scope:** The system helps students check room availability. It accepts the start time and end time of a booking. It compares the requested time with existing bookings. The system shows the result as Available or Unavailable. It does not book rooms or save new bookings. It does not use a login system, database, backend, or external API.

### 2.2 The acceptance criteria in my own words

| AC | In my own words |
| --- | --- |
| AC1 | The start and end times must be valid. The start time must be later than the current time. |
| AC2 | The maximum booking duration is 120 minutes. |
| AC3 | If the room is blocked, it unavailable. |
| AC4 | The booking must not overlap with another booking. Back-to-back booking are allowed. |
| AC5 | The result must clearly be either Available and Unavailabe. Exicting booking must not be modified. |
| AC6 | The interface must provide clear error messages and be mobile-friendly. |

### 2.3 Likely failure points

<!-- At least two. The brief's examples: endpoint overlap, starts-now. -->

| # | Failure point | AC | How I will check it |
| --- | --- | --- | --- |
| 1 | The system may incorrectly reject bookings when one booking ends as another starts. | AC4 | I will test an existing booking from 600 to 660 and a new booking from 660 to 720. The expected result is Available. |
| 2 | The system may allow a booking that starts at the current time. | AC1 | I will test now = 540, start = 540, and end = 570. The expected result is Unavailable. |

### 2.4 The contract

| Parameter | Meaning | Type and allowed values |
| --- | --- | --- |
| `start` | Booking start time | int - an integer representing from 0 to 1440. |
| `end` | Booking end time | int - an integer representing from 0 to 1440. |
| `now` | current time  | int - an integer representing from 0 to 1439. |
| `blocked` | Is the room blocked? | bool - True ar False |
| `existing` | Existing bookings | A list of (start, end) pairs, for example, [(600, 660)]. |
| returns | Function return value | bool — True or False |

### 2.5 Initial assumptions and manual checks

**Assumptions:**

1. All times are measured in minutes from midnight on the same day.
2. All existing booking belong to the selected room.

**Checked manually:**

- I checked a booking with now = 540, start = 660, and end = 720.
- The room is not blocked (blocked = False).
- The existing booking is [(600, 660)].
- The start time is in the future, and the duration is 60 minutes.
- The new booking starts when the existing booking ends, so there is no overlap.
- Expected result: Available (True).


## 3. Python v1 review

<!-- One row per conditional branch in code/original/booking_v1.py (your language's v1 on
     Path B). Quote the condition exactly. AC1-AC4 must all appear in the AC column. -->
| Branch in v1 (quoted) | AC | Satisfies it? | Why |
| --- | --- | --- | --- |
| `if not (0 <= start < end <= 1440):` | AC1 | Partly | It checks the time range and order, but does not check integer types. |
| `if start <= now:` | AC1 | Yes | It rejects bookings that start now or earlier. |
| `if end - start > 120:` | AC2 | Yes | It rejects bookings longer than 120 minutes. |
| `if blocked:` | AC3 | Yes | It rejects the request if the room is blocked. |
| `if start < booked_end and end > booked_start:` | AC4 | Yes | It rejects overlapping bookings and allows touching endpoints. |
| `return True` | AC5 | Yes | It returns True when all checks pass and does not change existing bookings. |

## 4. Prototype v1 in Bolt.new

**Prompt as sent:**

~~~~text
Create a responsive one-page Smart Campus Room Availability Checker.
The page is for one selected campus room, Room 101.
Use fictional existing bookings: 10:00–11:00.
Requirements:
AC1: Times must be integer minutes between 0 and 1440. Start must be before end and strictly after the current time.
AC2: Maximum duration is 120 minutes. Exactly 120 minutes is allowed.
AC3: If the room is blocked, show Unavailable.
AC4: Reject overlapping bookings. Back-to-back bookings are allowed.
AC5: Display clearly Available or Unavailable. Never change existing bookings.
AC6: Show understandable validation messages and make the interface mobile-friendly.
Provide start and end time inputs, a Check Availability button, and a clear result area.
For testing, use a fixed current time of 09:00. Allow testing the blocked room state and an additional fictional booking of 700–760 minutes.
Do not implement login, authentication, backend, database, external APIs, payments, or actual booking creation.
Use a clean and modern interface.
~~~~

<!-- Main generated files or components, with their path inside web/original/
     (for example src/App.tsx). At least two. -->

| Generated file or component | Path | Its role |
|---|---|---|
| Main App component | `src/App.tsx` | Contains the room availability checker, validation logic, and user interface. |
| CSS styles | `src/index.css` | Loads Tailwind CSS styles. |
| React entry point | `src/main.tsx` | Starts the React application. |
| HTML page | `index.html` | Provides the main HTML structure. |
| Tailwind configuration | `tailwind.config.js` | Configures Tailwind CSS styling. |
| Project dependencies | `package.json` | Lists project dependencies and scripts. |

**What v1 does:**

- The first version checks the availability of Room 101.
- Users can select start and end times.
- The system checks if the selected time overlaps with existing bookings.
- It shows Available or Unavailable with a clear message.
- Users can test blocked rooms and additional bookings.
- The page includes a 24-hour timeline and a mobile-friendly design.
- The system only checks availability and does not create bookings.

## 5. Test cases — executed on both artifacts

<!-- Base for every case unless the row says otherwise: now = 540, blocked = False,
     existing = [(600, 660)]. Do not change the first four columns.
     Python columns: True, False or Error (it raised) — what the call actually returned.
       T11: the result of the SECOND call. T12: n/a.
       Path A: the checker runs both of your files on T1-T11 and compares (C2, C3).
     Page columns: Available, Unavailable or Not testable — what the page actually showed.
     Never write a result you did not observe. -->

| Case | Name | Input | Expected | Python v1 | Python final | Page v1 | Page final |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T1 | Touching | 660–720 | Available | True | True | Available | Available |
| T2 | Overlap | 630–690 | Unavailable | False | False | Unavailable | Unavailable |
| T3 | Blocked | 660–720, blocked | Unavailable | False | False | Unavailable | Unavailable |
| T4 | Exactly 120 min | 720–840 | Available | True | True | Available | Available |
| T5 | 121 min | 720–841 | Unavailable | False | False | Invalid input | Unavailable |
| T6 | Starts now | 540–570 | Unavailable | False | False | Invalid input | Unavailable |
| T7 | Reversed | 720–660 | Unavailable | False | False | Invalid input | Unavailable |
| T8 | Ends at midnight | 1380–1440 | Available | True | True | Not testable | Not testable |
| T9 | Past midnight | 1380–1441 | Unavailable | False | False | Not testable | Not testable |
| T10 | Second booking | 720–780, existing (600–660), (700–760) | Unavailable | False | False | Unavailable | Unavailable |
| T11 | Same check twice | 660–720, twice | Available | True | True | Available | Available|
| T12 | Narrow screen | T1 at ~375 px wide | Available | n/a | n/a | Available | Available |

## 6. Traceability

<!-- His table. Implementation / file: where the rule lives (booking.py line, a component).
     Test input: the case IDs from section 5. v1 / final actual: what those cases gave. -->

| AC | Implementation / file | Test input | Expected | v1 actual | Final actual |
| --- | --- | --- | --- | --- | --- |
| AC1 | code/booking.py, web/original/src/App.tsx | T6, T7 | Unavailable | Python: False; Web: Invalid input | Python: False; Web: Pending |
| AC2 | code/booking.py, web/original/src/App.tsx | T4, T5 | T4: Available; T5: Unavailable | Python: True/False; Web: Available/Invalid input | Python: True/False; Web: Pending |
| AC3 | code/booking.py, web/original/src/App.tsx | T3 | Unavailable | Python: False; Web: Unavailable | Python: False; Web: Pending |
| AC4 | code/booking.py, web/original/src/App.tsx | T1, T2, T10 | Available, Unavailable, Unavailable | Python: All passed; Web: All passed | Python: All passed; Web: Pending |
| AC5 | code/booking.py, web/original/src/App.tsx | T5, T11 | Unavailable; Available twice | Python: Passed; Web: Invalid input on T5, Available on T11 | Python: Passed; Web: Pending |
| AC6 | web/original/src/App.tsx, src/index.css | T6, T12 | Clear feedback and mobile-friendly layout | T6: Clear error message; T12: 375px layout observed, exact test pending | Web: Pending |

## 7. Issue log

<!-- At least two, from v1 — a functional defect and a usability or code-quality issue where you
     have them. If every case passed on v1, log the preventive cleanup and say why.
     Reproduction names a case (T1-T12) or an AC. Priority: High, Medium or Low.
     Prompt / change: the focused prompt you sent, and what changed. Never "make it better". -->
     
| # | Issue | Reproduction | Priority | Prompt / change | Retest result |
|---|---|---|---|---|---|
| 1 | Invalid result label (AC5) | T5, T6, T7 displayed "Invalid input" instead of "Unavailable". | High | Asked Bolt.new to change the result label to "Unavailable" while keeping validation messages. | PASS — T5, T6 and T7 displayed "Unavailable" after the fix. |
| 2 | Timeline text is truncated (AC6) | AC6: The original 24-hour timeline displayed the existing 10:00–11:00 booking label as "1..." instead of the full time interval. This was visible in the original screenshot. | Medium | Asked Bolt.new to display the full booking time label without changing the booking logic. | PASS — The full 10:00–11:00 booking label is visible on desktop and at 375px mobile width. |

**Before / after:** `evidence/before-1.png` → `evidence/after-1.png` document Issue 1, showing the original "Invalid input" result and the corrected "Unavailable" result. Screenshots must be saved and checked before submission.


## 8. Critique decisions

<!-- The AI's review against AC1-AC6 (stage C), claim by claim. At least three rows.
     How I verified it: the case, test or run that confirmed or refuted the claim.
     Decision: accept, reject or modify. At least one reject or modify — the reflection asks for it. -->

| # | AI claim or recommendation | How I verified it | Decision | Reason (AC or case) |
|---|---|---|---|---|
| 1 | Invalid booking requests should display "Unavailable" instead of "Invalid input". | Tested T5, T6 and T7 before and after the fix. All three displayed "Unavailable" after repair. | Accept | AC5 requires a clear Available or Unavailable result. |
| 2 | The truncated booking labels in the timeline should be fixed. | Compared the original screenshot with the repaired timeline. The full 10:00–11:00 label is visible on desktop and at 375px mobile width. | Accept | AC6 requires a clear and mobile-friendly interface. |
| 3 | The Python function should reject non-integer time values. | Reviewed the original function and ran 17 tests on the final version, including float input tests. | Accept | AC1 requires integer minutes. The final Python tests passed. |
| 4 | Replace the native time input with a custom input to support 24:00 and 24:01. | Checked the browser input limitation and the assignment rules for T8 and T9. | Reject | The assignment allows T8 and T9 to be Not testable on the page. Replacing the input is unnecessary for the required scope. |

## 9. Coding-agent analysis

### 9.1 The loop

<!-- One real pass through the loop from this assignment — with your assistant or with Bolt. -->

| Step | What happened in this assignment |
| --- | --- |
| User goal | Fix the incorrect "Invalid input" result in the Room Availability Checker. |
| Model / plan | I asked Bolt.new to change the result to "Unavailable" while keeping the validation messages and existing booking logic. |
| Tool call | I submitted a focused repair prompt to Bolt.new, which updated the project. Its internal tool calls were not visible to me. |
| Observation | Before the repair, T5, T6 and T7 displayed "Invalid input". After the repair, they displayed "Unavailable". |
| Next step | I tested the repaired behavior and continued with the timeline readability issue. |
| Human review | I checked the results against AC5 and confirmed the corrected output myself. |

### 9.2 Context, tools and permissions

<!-- At least three rows. Last column: Observed (you saw it happen) or Assumed (you infer it
     about the internals). Use both at least once. -->

| Tool | Context it used | Tools or permissions | Observed or assumed |
|---|---|---|---|
| ChatGPT | AC1–AC6 requirements, Python booking function, and test results shared in the conversation. | Suggested code, test cases, and fixes. I manually applied the changes. | Observed |
| Bolt.new | Room availability requirements, my prompts, and the existing website project. | Generated and modified React files. I downloaded the project as a ZIP. Exact internal permissions were not visible. | Observed for file changes; assumed for internal permissions. |
| VS Code / Python Terminal | Local Python files, test cases, and Git repository. | I ran Python tests, copied project files, and used Git commands. All 17 automated tests passed. | Observed |

### 9.3 Checkpoint and dependability

**Safety checkpoint:** Before accepting AI-generated changes, I keep the original version separately and check that the new version still follows AC1–AC6. I test the affected cases, review the visible results, and verify that the AI has not added unnecessary features such as login, backend services, or databases.

**Reliability, security, responsibility:** AI-assisted coding helped me create and improve the booking checker, but AI-generated results still required verification. Reliability depends on testing normal and boundary cases. Security requires checking that the generated project does not introduce unnecessary access or external services. Clear error messages and responsive layouts improve usability. I am responsible for reviewing the changes, checking permissions, running tests, and reporting actual results instead of assuming the AI is always correct.

## 10. Reflection

<!-- 100-200 words, in your own words, no AI. Compare AI-assisted coding (the Python part) with
     vibe coding (the Bolt part); one example each of a reliability, an availability/usability and
     a security risk; why review, tool permissions and tests stay human responsibilities; one AI
     recommendation you rejected or modified, and why; what you would improve next without
     expanding the scope. -->


## Reflection

In this assignment, I used AI in two ways. For the Python part, I used ChatGPT to review the `can_book()` function and help create automated tests. For the web part, I used Bolt.new to generate a React interface. Python testing was more structured, while vibe coding helped me build the interface faster.

I found three main risks. First, a reliability risk is that AI may generate incorrect logic. For example, the website initially showed “Invalid input” instead of “Unavailable” in some test cases. Second, a usability risk is that a booking on the timeline was not fully visible. Third, a security risk is that AI-generated code may handle user input unsafely.

Human responsibility is important because AI-generated code must be reviewed and tested. Tool permissions must also be checked before allowing AI to change files or access external services.

I modified the AI-generated interface after comparing it with the acceptance criteria. I did not add complex custom handling for 24:00 because it was outside the required test scope. Next, I would improve input validation and add more tests without adding new features.


## 11. Appendix A — AI exchanges

### B1

- **Tool:** ChatGPT
- **Model:** not displayed
- **Date:** 2026-10-25
- **Stage:** Plan
- **Source:** this SIS

**Prompt:**

~~~~text
(base) molshylykhalibyek@Molshylykhs-MacBook-Air se-practice % git log --oneline origin/main..sis-03
c84d0ea (HEAD -> sis-03, origin/sis-03) sis-03: baseline in my own words
~~~~

**Response:**

~~~~text
Correct! The Git issue has been resolved.

Now the `sis-03` branch contains only one commit:

`c84d0ea — sis-03: baseline in my own words`

This is the result we need.

The next stage is Section 3: Python.

First, we will complete Stage A — AI Plan. This assignment requires you to obtain a plan from AI and approve it yourself.

My AI plan:

1. Prepare the `can_book(start, end, now, blocked, existing)` function.
2. Check the valid time conditions for AC1: `0 <= start < end <= 1440` and `start > now`.
3. For AC2, check that the booking duration does not exceed 120 minutes.
4. For AC3, return `False` if `blocked = True`.
5. For AC4, check overlaps with existing bookings, but allow a new booking to begin exactly when another one ends.
6. For AC5, return `True` or `False` and do not modify the `existing` list.
7. Test boundary cases: 120 and 121 minutes, a booking starting at the current time, minute 1440, and repeated requests.
8. Prepare at least 10 automated tests.

The function will use only Python's standard features.

Important: Your `week-05/` folder appeared in the terminal earlier. If the original Week 05 `booking_v1.py` is still available, you may reuse it unchanged. In that case, we must not invent the earlier AI conversation.

Review this plan and reply "Approved" if you agree, and then we will proceed. We will also check whether the original Week 05 code exists.

Later, we will record this actual AI Plan exchange in Section 11 — AI Exchanges of `report.md`.
~~~~

### B2

- **Tool:** ChatGPT
- **Model:** not displayed (check the original Week 05 chat)
- **Date:** 2026-10-10
- **Stage:** Generate
- **Source:** week-05

**Prompt:**

~~~~text
[NOT RECOVERED: The original Week 05 prompt that generated the first Python implementation was unavailable. It has not been fabricated.]
~~~~

**Response:**

~~~~text
[PARTIAL RECOVERY: Only the Python code portion of the original response was available. The complete original AI response was not recovered.]

def can_book(start, end, now, blocked, existing):
    """Return whether the requested interval can be booked for this room."""
    if not (0 <= start < end <= 1440):
        return False

    if start <= now:
        return False

    if end - start > 120:
        return False

    if blocked:
        return False

    for booked_start, booked_end in existing:
        if start < booked_end and end > booked_start:
            return False

    return True
~~~~


### B3

- **Tool:** ChatGPT
- **Model:** GPT-6
- **Date:** 2026-10-27
- **Stage:** Critique
- **Source:** this SIS

**Prompt:**

~~~~text
Review my original Python booking function against AC1–AC5. Identify problems with input validation, booking overlaps, time boundaries, and data preservation. Explain which requirements pass, which need improvement, and recommend additional tests without modifying the original code.
~~~~

**Response:**

~~~~text
AI Critique — Review of the Original Python Booking Function

I reviewed the original can_book(start, end, now, blocked, existing) function against acceptance criteria AC1–AC5. The function implements the main booking rules correctly for valid integer inputs, but its input validation can be improved.

1. Acceptance Criteria Review

| AC | Requirement | Status | Explanation |
|---|---|---|---|
| AC1 | Valid time range, correct ordering, and future start | Partially satisfied | The function checks 0 <= start < end <= 1440 and start > now, but does not explicitly validate integer types. |
| AC2 | Maximum booking duration of 120 minutes | Satisfied | The condition end - start > 120 rejects longer bookings while allowing exactly 120 minutes. |
| AC3 | Reject bookings when the room is blocked | Satisfied | The function immediately returns False when blocked is true. |
| AC4 | Reject overlapping bookings and allow touching endpoints | Satisfied | The overlap condition correctly detects conflicts with existing intervals. |
| AC5 | Return a Boolean without modifying existing bookings | Satisfied for valid inputs | The function returns True or False and does not directly modify the existing list. |

2. Identified Weaknesses

Weakness 1 — Missing integer validation (AC1)

The original function accepts fractional values such as start = 600.5, although the booking contract specifies whole minutes. It may also raise a TypeError for incompatible input types.

Weakness 2 — Boundary conditions require explicit tests (AC1 and AC2)

The implementation appears correct, but it is important to test bookings beginning exactly at the current time, lasting exactly 120 minutes, lasting 121 minutes, and ending at minute 1440.

Weakness 3 — Overlap logic needs comprehensive testing (AC4)

The overlap condition is logically correct, but tests should cover a request that fully contains an existing booking, a request entirely inside an existing booking, identical intervals, and bookings that touch without overlapping.

Weakness 4 — Data preservation should be verified (AC5)

The function does not intentionally modify existing bookings. However, automated tests should verify that the list remains unchanged after both successful and rejected requests, including when bookings are unsorted.

3. Recommended Additional Tests

| Test | Input | Expected |
|---|---|---|
| Fractional start | 660.5, 720 | False |
| Exactly 120 minutes | 720, 840 | True |
| 121 minutes | 720, 841 | False |
| Starts at current time | 540, 570 | False |
| Request contains existing booking | 550, 670 | False |
| Request inside existing booking | 610, 640 | False |
| Identical booking | 600, 660 | False |
| Touching endpoint | 660, 720 | True |
| Successful check preserves data | Unsorted existing bookings | True; list unchanged |
| Rejected check preserves data | Overlapping existing bookings | False; list unchanged |

These examples assume now = 540, blocked = False, and existing = [(600, 660)] unless otherwise stated.

4. Conclusion

The original Python function correctly implements the core booking rules for integer-minute inputs. AC2, AC3, AC4, and AC5 are satisfied under the intended input assumptions.

The main weakness is AC1 because integer types are not explicitly checked. The existing overlap logic does not need to be replaced, but additional tests can improve confidence in its correctness.

I recommend preserving the original function in code/original/booking_v1.py, adding stronger validation to the final implementation where appropriate, and expanding the automated test suite to cover boundary conditions, overlapping intervals, and data preservation.

This critique is based on static code review. It does not claim that the recommended tests were executed.
~~~~


### B4

- **Tool:** ChatGPT
- **Model:** not displayed
- **Date:** 2026-10-25
- **Stage:** Repair
- **Source:** this SIS

**Prompt:**

~~~~text
Fix one issue in my existing Smart Campus Room Availability Checker.

Issue: For invalid booking requests such as T5 (12:00–14:01), T6 (09:00–09:30), and T7 (12:00–11:00), the page currently displays "Invalid input".

AC5 requires a clear Available or Unavailable result.

Change the displayed result to "Unavailable" for these rejected requests, while keeping the specific validation explanation visible.

Do not change the existing booking data, valid interval behavior, maximum duration, or overlap rules.

Do not add login, a backend, a database, or external APIs.

Make the smallest focused change. Explain which file and component you changed.

I have done it. What should I do next?
~~~~

**Response:**

~~~~text
Good! Now we move to Repair 1 — Retesting.

You submitted the repair prompt to Bolt.new. Now we need to check whether the issue was actually fixed.

Step 1. Rerun the three tests.

In the Bolt.new website, enter the following times and click Check Availability for each case.

| Test | Start | End | Expected result |
| --- | --- | --- | --- |
| T5 | 12:00 | 14:01 | Unavailable |
| T6 | 09:00 | 09:30 | Unavailable |
| T7 | 12:00 | 11:00 | Unavailable |

Both Block Room and Additional Booking must be OFF.

The page should not only show `Unavailable`; it should also explain why the request was rejected.

Step 2. Save a screenshot.

If T5 displays `Unavailable`, save a screenshot of that screen as:

`se-practice/sis-03/evidence/after-1.png`

Also keep the earlier `before-1.png` screenshot. The two images will serve as evidence in Section 7.

Step 3. Section 7 — Issue 1.

If all three tests show the correct result, you can describe the first issue in Section 7 like this:

Issue 1 — Invalid result label

Before: T5–T7 displayed `Invalid input`.

Change: Updated the result label to `Unavailable` while keeping validation messages.

Retest: Write the results you actually observed.

Evidence: `before-1.png` and `after-1.png`.

Now rerun T5, T6, and T7. Did all three display `Unavailable`, or does any one still show `Invalid input`?

After that, we will work on Repair 2 — fixing truncated timeline text.
~~~~


## 12. Appendix B — Test output

### 12.1 Your suite

<!-- The complete terminal output of your final suite. Path A: python -m unittest -v, run inside
     code/ — the part ending in "Ran N tests" and OK or FAILED. -->

~~~~text
python3 -m unittest -v
test_equal_times (test_booking.BookingTests.test_equal_times) ... ok
test_existing_not_modified (test_booking.BookingTests.test_existing_not_modified) ... ok
test_float_end (test_booking.BookingTests.test_float_end) ... ok
test_float_start (test_booking.BookingTests.test_float_start) ... ok
test_start_before_now (test_booking.BookingTests.test_start_before_now) ... ok
test_t10_second_booking (test_booking.BookingTests.test_t10_second_booking) ... ok
test_t11_same_check_twice (test_booking.BookingTests.test_t11_same_check_twice) ... ok
test_t1_touching (test_booking.BookingTests.test_t1_touching) ... ok
test_t2_overlap (test_booking.BookingTests.test_t2_overlap) ... ok
test_t3_blocked (test_booking.BookingTests.test_t3_blocked) ... ok
test_t4_exactly_120 (test_booking.BookingTests.test_t4_exactly_120) ... ok
test_t5_121_minutes (test_booking.BookingTests.test_t5_121_minutes) ... ok
test_t6_starts_now (test_booking.BookingTests.test_t6_starts_now) ... ok
test_t7_reversed (test_booking.BookingTests.test_t7_reversed) ... ok
test_t8_midnight (test_booking.BookingTests.test_t8_midnight) ... ok
test_t9_past_midnight (test_booking.BookingTests.test_t9_past_midnight) ... ok
test_touching_booking_start (test_booking.BookingTests.test_touching_booking_start) ... ok

----------------------------------------------------------------------
Ran 17 tests in 0.000s

OK
~~~~

### 12.2 Path B only — three faults you planted

<!-- Path A: leave this table as it is. Path B: three rows — the line you broke, the AC it
     breaks, the test that failed. -->

| # | Line you broke | AC | Test that failed |
| --- | --- | --- | --- |
| 1 | | | |
| 2 | | | |
| 3 | | | |

## 13. Remaining limitations and known fails

<!-- One row per check ID in submission.yml known_fails, and any limitation you know of.
     If the checker is clean and you know of none, one row that says so. -->

| Check ID or limitation | Why it stays | What I would do next |
| --- | --- | --- |
| C1 | The original prototype displayed "Invalid input" for T5, T6, and T7 instead of "Unavailable". The actual results were preserved. | Keep the original evidence and use the corrected final prototype. |