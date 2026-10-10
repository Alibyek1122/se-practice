# Week 05 — Lab report
**Name:** Alibyek Molshylykh

**Group:** Mon 16:00–19:00

**Date:** 2026-10-10



Fill in every section. **\*\*Do not delete, rename or renumber the headings\*\*** — the checker and the

grader find your answers by them. Add rows to any table; never remove its header.



---



## 1. Setup
| | |
| --- | --- |
| Assistant (tool) | ChatGPT |
| **Exact** model name | GPT-6 |
| Language and version | Python 3.13.7 |
| Path | A |
| My Week 04 declaration for touching bookings | not-allowed — In Week 04, touching bookings were not allowed. AC4 in Week 05 allows them. The overlap condition in my Week 04 activity diagram should be updated. |

---



## 2. Task 1 — the plan
**\*\*The assistant's plan, pasted unedited:\*\***



```text

1\. Implementation Plan — can_book()



language: Python 3

Function: can_book(start, end, now, blocked, exicting)

Return: True or False



The function will check the booking conditions in the following order and resturn False immediatley when a condition fails.



Step 1: Valide time range (AC1)

Return False when start < 0, start >= end, or end > 1440.



Step 2: Future booking (AC1)

Return False when start <= now.



Step 3: Maximum duration (AC2)

Return False when end - start > 120.





Step 4: Room blocked (AC3)

Return False when blocked === True



Step 5: Booking overlap (AC4)

Return False when any existing booking overlaps the requested interval.



Step 6: Final decision (AC5)

Return True only if all checks pass.



Overlap logic :

For each existing booking (s, e), overlap occurs when:

start < e and end > s



Because intervals include the start and exclude the end, touching endpoints are allowed.



2\. Assumptions



Based only on the supplied contract;



- All times are integer minutes on one date.

- now is valid (0-1439).

- blocked in a Boolean.

- existing contians valide (start, end) tuples for active bookings of the selected room.

- The function does not modify any input, including existing.

- Saving bookings and sending confirmations are outside the function's responsibility.

3\. Suggested Boundary Test Cases



Assume now = 600 (10:00) unless otherwise specified.



1\. Valid booking:

&#x20;  700, 800, False, [] -> True



2\. Start equals now:

&#x20;  600, 700, False, [] -> False



3\. Start one minute after now:

&#x20;  601, 700, False, [] -> True



4\. Zero duration:

&#x20;  700, 700, False, [] -> False



5\. Negative start:

&#x20;  -1, 100, False, [] -> False



6\. End exceeds midnight:

&#x20;  1400, 1441, False, [] -> False



7\. Exactly 120 minutes:

&#x20;  700, 820, False, [] -> True



8\. 121 minutes:

&#x20;  700, 821, False, [] -> False



9\. Blocked room:

&#x20;  700, 800, True, [] -> False



10\. Overlapping booking:

&#x20;   700, 800, False, [(750, 850)] -> False



11\. Touching existing end:

&#x20;   700, 800, False, [(600, 700)] -> True



12\. Touching existing start:

&#x20;   700, 800, False, [(800, 900)] -> True



13\. Booking ends at midnight:

&#x20;   1380, 1440, False, [], now=1300 -> True



Additional test:

Verify that existing remains unchanged after both successful and unsuccessful calls.



4\. Implementation Approach



Use simple conditional checks and a loop over existing.

No additional libraries are required.



Expected complexity:

- Time: O(n), where n is the number of existing bookings.

- Extra space: O(1).



The implementation should be a single Python 3 function that returns a Boolean without modifying its inputs.



No code written yet.

```



**\*\*What the plan invented or changed.\*\*** One row for every rule in the plan that is not in the contract or in AC1–AC5, or that says something different from them. If you found none, write one row saying which lines of the plan you checked against which AC.



| # | What the plan said | What the contract or the AC says | What I did |
| --- | --- | --- | --- |
| 1 | Steps 1–6: time validation, future start, maximum duration, blocked room, overlap, final decision | Steps 1–2 follow AC1; step 3 follows AC2; step 4 follows AC3; step 5 follows AC4; step 6 follows AC5. | I checked all six steps against the specification. No invented rules were found. I kept the plan unchanged. |



**\*\*Boundary cases the assistant suggested that I kept as tests:\*\***



- Start equals now and one minute after now (AC1).

- Zero-length and negative start times (AC1).

- End exceeds 1440 and ends exactly at 1440 (AC1).

- Exactly 120 minutes and 121 minutes (AC2).

- Blocked room (AC3).

- Overlapping and touching bookings (AC4).

- Unchanged existing bookings (AC5).



---







## 3. Task 2 — the first version (v1), read before it was run
v1 is saved as `code/original/booking_v1.py`, exactly as the assistant returned it: yes



**\*\*AC map.\*\*** One row per condition in v1. Quote the line.



| # | Line in v1 | AC it implements | Correct as written? If not, why |
| --- | --- | --- | --- |
| 1 | `if not (0 <= start < end <= 1440):` | AC1 | Yes. Checks the valid time boundaries and positive duration. |
| 2 | `if start <= now:` | AC1 | Yes. The booking must start strictly after now. |
| 3 | `if end - start > 120:` | AC2 | Yes. A maximum duration of 120 minutes is allowed. |
| 4 | `if blocked:` | AC3 | Yes. A blocked room cannot be booked. |
| 5 | `if start < booked_end and end > booked_start:` | AC4 | Yes. Detects overlapping intervals and allows touching endpoints. |
| 6 | `return True` | AC5 | Yes. True is returned only if all previous checks pass. Failed conditions return False. |



**\*\*Anything in v1 that no AC asks for\*\*** (extra validation, a buffer between bookings, logging, saving the booking, a different return type):



- None. The implementation follows AC1–AC5 and does not add extra functionality.



---



---





## 4. Task 3 — my tests
Base input for every row unless the row says otherwise: `now=540, blocked=False, existing=[(600, 660)]`.



| # | Test name | Request (start, end) | What differs from the base input | Expected | AC | Result on v1 | Result on final |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | test_touching_end_is_allowed | (660, 720) | None | True | AC4 | PASS | PASS |
| 2 | test_overlap_is_rejected | (630, 690) | None | False | AC4 | PASS | PASS |
| 3 | test_blocked_room_is_rejected | (660, 720) | blocked=True | False | AC3 | PASS | PASS |
| 4 | test_exactly_two_hours_is_allowed | (720, 840) | None | True | AC2 | PASS | PASS |
| 5 | test_over_two_hours_is_rejected | (720, 841) | None | False | AC2 | PASS | PASS |
| 6 | test_starts_now_is_rejected | (540, 570) | None | False | AC1 | PASS | PASS |
| 7 | test_zero_duration | (700, 700) | existing=[] | False | AC1 | PASS | PASS |
| 8 | test_reversed_time | (720, 700) | existing=[] | False | AC1 | PASS | PASS |
| 9 | test_end_at_midnight | (1380, 1440) | existing=[] | True | AC1 | PASS | PASS |
| 10 | test_end_after_midnight | (1380, 1441) | existing=[] | False | AC1 | PASS | PASS |
| 11 | test_start_one_minute_after_now | (541, 571) | existing=[] | True | AC1 | PASS | PASS |
| 12 | test_start_in_past | (500, 530) | existing=[] | False | AC1 | PASS | PASS |
| 13 | test_one_minute_booking | (720, 721) | existing=[] | True | AC1 | PASS | PASS |
| 14 | test_touching_existing_start | (570, 600) | None | True | AC4 | PASS | PASS |
| 15 | test_inside_existing_booking | (615, 645) | None | False | AC4 | PASS | PASS |
| 16 | test_contains_existing_booking | (570, 690) | None | False | AC4 | PASS | PASS |
| 17 | test_identical_booking | (600, 660) | None | False | AC4 | PASS | PASS |
| 18 | test_overlap_second_booking | (720, 780) | existing=[(600,660),(700,760)] | False | AC4 | PASS | PASS |
| 19 | test_empty_existing | (600, 660) | existing=[] | True | AC4 | PASS | PASS |
| 20 | test_between_two_bookings | (660, 720) | existing=[(600,660),(720,780)] | True | AC4 | PASS | PASS |
| 21 | test_existing_remains_unchanged | (780, 840) and (610, 650) | existing=[(900,960),(600,660),(700,760)] | True, False; list unchanged | AC5 | PASS | PASS |



All 21 tests passed. The original and final implementations are identical at this stage. Both satisfy the tested acceptance criteria.



---



## 5. Task 4 — debugging with evidence
One row per defect you found — in v1, in a later version, or in your own tests. If v1 passed

everything, the row is the **\*\*new edge case you added\*\***, with expected and actual equal, and the

cause column says why no change was needed.



| # | Input (the full call) | Expected | Actual | Cause (quote the line) | Fix | Who proposed the fix |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `can_book(660, 720, 540, False, [(600, 660), (720, 780)])` | True | True | The condition `start < booked_end and end > booked_start` allows touching endpoints (AC4). The new edge case passed. | No code change required. | No fix was needed. |



**\*\*The debug prompt I sent, and the assistant's answer\*\*** (leave the block empty if you did not use it):



```text

```



---



## 6. Task 5 — the critique

**The assistant's critique, pasted unedited:**

```text
## Code Review — `can_book()`

Result: No concrete issues found.

The implementation satisfies AC1–AC5 and the supplied function contract.

| Criterion | Code reviewed | Result |
| --- | --- | --- |
| AC1 | `0 <= start < end <= 1440` and `start <= now` | Pass |
| AC2 | `end - start > 120` | Pass |
| AC3 | `if blocked:` | Pass |
| AC4 | `start < booked_end and end > booked_start` | Pass |
| AC5 | `return False` for failed conditions; `return True` otherwise | Pass |
| Contract | No modification of `existing` or other inputs | Pass |

Conclusion: No changes are required under the supplied rules. The function correctly handles interval boundaries, maximum duration, blocked rooms, overlapping bookings, and Boolean decisions.
```

The AI suggested no changes. I reviewed its findings and recorded my decisions below.

| # | Suggestion | accept / reject | Reason — cite the AC or the contract line | Suite after the change |
| --- | --- | --- | --- | --- |
| 1 | Keep the current time validation | accept | AC1 requires 0 <= start < end <= 1440 and start > now. Both checks enforce these conditions. | No code change; 21 tests OK; F2–F3 PASS. |
| 2 | Keep the existing overlap comparison | accept | AC4 rejects overlaps and allows touching endpoints; strict `<` and `>` are needed. | No code change; 21 tests OK; F6–F8 PASS. |
| 3 | Do not add input mutation | accept | AC5 says existing must remain unchanged, and the contract says keep all inputs unchanged. | No code change; 21 tests OK; F10 PASS. |

---

## 7. Change log — v1 to final

| # | What changed (the line, before → after) | Why | Evidence: the test or check that moved |
| --- | --- | --- | --- |
| 1 | No code change: `if start <= now:` was kept as written | AC1 was satisfied by v1. | `test_starts_now_is_rejected` passed; F3 PASS. |
| 2 | No code change: `if start < booked_end and end > booked_start:` was kept as written | AC4 already rejects overlaps and permits touching endpoints. | `test_between_two_bookings` passed; F6–F8 PASS. |
| 3 | No change from v1 to final | Original implementation satisfied AC1–AC5; changing correct code would add risk. | All 21 tests OK; F1–F10 PASS. |

---

## 8. Evidence — real output
### 8.1 My suite, final run
Paste the **\*\*complete\*\*** terminal output. For Python: everything `python -m unittest -v` printed.



```text

test_between_two_bookings (test_booking.BookingTests.test_between_two_bookings) ... ok
test_blocked_room_is_rejected (test_booking.BookingTests.test_blocked_room_is_rejected) ... ok
test_contains_existing_booking (test_booking.BookingTests.test_contains_existing_booking) ... ok
test_empty_existing (test_booking.BookingTests.test_empty_existing) ... ok
test_end_after_midnight (test_booking.BookingTests.test_end_after_midnight) ... ok
test_end_at_midnight (test_booking.BookingTests.test_end_at_midnight) ... ok
test_exactly_two_hours_is_allowed (test_booking.BookingTests.test_exactly_two_hours_is_allowed) ... ok
test_existing_remains_unchanged (test_booking.BookingTests.test_existing_remains_unchanged) ... ok
test_identical_booking (test_booking.BookingTests.test_identical_booking) ... ok
test_inside_existing_booking (test_booking.BookingTests.test_inside_existing_booking) ... ok
test_one_minute_booking (test_booking.BookingTests.test_one_minute_booking) ... ok
test_over_two_hours_is_rejected (test_booking.BookingTests.test_over_two_hours_is_rejected) ... ok
test_overlap_is_rejected (test_booking.BookingTests.test_overlap_is_rejected) ... ok
test_overlap_second_booking (test_booking.BookingTests.test_overlap_second_booking) ... ok
test_reversed_time (test_booking.BookingTests.test_reversed_time) ... ok
test_start_in_past (test_booking.BookingTests.test_start_in_past) ... ok
test_start_one_minute_after_now (test_booking.BookingTests.test_start_one_minute_after_now) ... ok
test_starts_now_is_rejected (test_booking.BookingTests.test_starts_now_is_rejected) ... ok
test_touching_end_is_allowed (test_booking.BookingTests.test_touching_end_is_allowed) ... ok
test_touching_existing_start (test_booking.BookingTests.test_touching_existing_start) ... ok
test_zero_duration (test_booking.BookingTests.test_zero_duration) ... ok

----------------------------------------------------------------------
Ran 21 tests in 0.000s

OK

```



### 8.2 The checker, final run
Paste the **\*\*complete\*\*** output of `python tests/check_booking.py`. Paste it **\*\*last\*\***: if you edit

this file afterwards, run the checker again and paste again.



```text
Week 05 - can_book: the function, your tests, the evidence   (Path A)

PASS   F1   the six cases from the task table           6 of 6 cases
PASS   F2   AC1 time order and day bounds               5 of 5 cases
PASS   F3   AC1 the start is in the future              5 of 5 cases
PASS   F4   AC2 at most 120 minutes                     3 of 3 cases
PASS   F5   AC3 a blocked room accepts nothing          2 of 2 cases
PASS   F6   AC4 every kind of overlap is rejected       5 of 5 cases
PASS   F7   AC4 touching endpoints are allowed          3 of 3 cases
PASS   F8   AC4 every existing booking is checked       4 of 4 cases
PASS   F9   AC5 the result is a real Boolean            3 of 3 cases
PASS   F10  AC5 the inputs are left unchanged           2 of 2 cases
PASS   O1   the assistant's first version is kept       v1 kept (19 lines)
PASS   S1   your suite has at least 11 tests            21 tests
PASS   S2   your suite is green on your own code        21 tests, OK
PASS   M1   your tests catch a fault in AC1             caught by test_starts_now_is_rejected
PASS   M2   your tests catch a fault in AC1             caught by test_end_after_midnight
PASS   M3   your tests catch a fault in AC1             caught by test_zero_duration
PASS   M4   your tests catch a fault in AC2             caught by test_exactly_two_hours_is_allowed
PASS   M5   your tests catch a fault in AC3             caught by test_blocked_room_is_rejected
PASS   M6   your tests catch a fault in AC4             caught by test_between_two_bookings, test_touching_end_is_allowed, test_touching_existing_start
PASS   M7   your tests catch a fault in AC4             caught by test_existing_remains_unchanged, test_overlap_second_booking
PASS   M8   your tests catch a fault in AC4             caught by test_contains_existing_booking
PASS   M9   your tests catch a fault in AC5             caught by test_existing_remains_unchanged
PASS   M10  your tests catch a fault in AC5             caught by test_existing_remains_unchanged
PASS   L1   report 1: tool, model and language          tool, model and language recorded
PASS   L2   report 2: the plan, and what you corrected  plan pasted, 1 row(s) on what you corrected or verified
PASS   L3   report 3: v1 mapped to AC1-AC4              6 conditions mapped, AC1-AC4 all present
PASS   L4   report 4: at least 11 of your tests listed  21 tests listed
PASS   L5   report 5: debugging evidence                1 row(s) of input / expected / actual
PASS   L6   report 6: the critique, each point judged   critique pasted, 3 points judged
PASS   L7   report 7: change log                        3 change-log row(s)
PASS   L8   report 8.1: real output of your suite       suite output pasted
PASS   L9   report 10: conclusion of 120-180 words      158 words
------------------------------------------------------------------------------
v1 (code/original/booking_v1.py): passes F1 F2 F3 F4 F5 F6 F7 F8 F9 F10 - fails nothing - identical to your final: yes
SUMMARY pass=32 fail=0 error=0   (32 checks)
Behaviour and shape are clean. This says nothing about the quality of your review.
```



### 8.3 Path B only — three faults I planted myself
Break your own function on purpose, one line at a time, run your suite, restore the line.



| # | Line I changed (before → after) | AC it breaks | Test that failed |
| --- | --- | --- | --- |
| 1 | | | |
| 2 | | | |
| 3 | | | |



The three failing runs (Path A students leave this block empty):



```text

```



---



## 9. What still fails, and what the contract does not say

### 9.1 Checks I am keeping as FAIL or ERROR

The same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| none | No remaining FAIL or ERROR; verified by the final checker output. |

### 9.2 Outside the contract

The contract says times are integers. It does not specify what happens for non-integer inputs such as `600.5` or `"600"`.

- My function does not validate input types. For example, `can_book(600.5, 660, 540, False, [])` returns `True` because Python can compare a float with integers and the other checks pass. But `can_book("600", 660, 540, False, [])` raises `TypeError` at the first time-range comparison. I did not add type validation because the stated contract assumes integer times. I am reporting this as behavior outside the contract, not a failing acceptance test.

### 9.3 A bound that never decides

One of the bounds in AC1 can never be the *only* reason a request is rejected. Which one, and why?

- The lower bound `0 <= start` cannot be the only reason. The contract guarantees that `now` is an integer from 0 to 1439, and AC1 also requires `start > now`. If a request violates `0 <= start`, then `start` is negative and it also violates `start > now`. Therefore, the lower bound never rejects a request on its own.

---

## 10. Conclusion (120–180 words)
<!-- Answer all three, in your own words, without the assistant:

&#x20;    (a) Explain the overlap condition in your final code — why those two comparisons, and why

&#x20;        they let touching bookings through.

&#x20;    (b) Which fault did your tests miss the longest, and what did the missing test have in common

&#x20;        with the ones you already had?

&#x20;    (c) What did you have to decide that neither the contract nor the assistant decided for you?

&#x20;    Worthless: "the AI made a mistake and I fixed it."

&#x20;    Worth everything: "F7 failed on can_book(570, 600, ...): v1 compared with <= on the start

&#x20;    side, so a booking that ends exactly when another begins was rejected." -->



<!-- Write your conclusion below this line -->

In this practice, I worked on a Python function that decides whether a study room can be booked. I learned that booking intervals include the start but exclude the end. The overlap condition uses `start < booked_end` and `end > booked_start`. Both comparisons must be true to reject a booking. If two bookings only touch at an endpoint, the request is allowed.

I first tested six required cases and then added fifteen additional tests. All twenty-one tests passed. The official checker showed that my tests detected ten faulty implementations. I cannot identify which fault survived the longest because I did not record checker results after every new test. I also tested whether the existing bookings remained unchanged.

My main decision was to keep the original AI-generated code because the tests supported its correctness. I chose to add boundary tests instead of changing working code. This practice taught me the importance of testing, reviewing AI suggestions, and using evidence.
