# Lab report — Practice #03, Requirements Engineering with AI

Fill in every section. **Do not delete or renumber the headings** — the README points at them and a
missing heading reads as a missing section.

Name:
Student ID:24B030054
GitHub username: Alibyek1122

---

## 1. Setup

| | |
| --- | --- |
| AI assistant (tool) | ChatGPT |
| Exact model name and version | GPT-5.6 Sol |
| Date of the session | 30.09.2026 |
| Diagram renderer used | PlantUML Online Server |

One tool and one model for all three prompts. If you switched, say why here — it changes what your
findings mean.

---

## 2. Original AI output — user stories (Part 1)

Paste the **unedited** response to Prompt 1. Do not tidy it. If it is long, paste all of it anyway;
this is the baseline everything else is measured against.

```
Actor goals
Student goals: See when study rooms are available, reserve an available room for individual or group study, cancel an existing booking, and receive confirmation of booking actions.
Administrator goals: Keep unavailable rooms from being booked by blocking/unblocking them and review room usage.
User stories
ID	User story	Priority	Assumption
US-01	As a Student, I want to view room availability, so that I can choose a suitable room and time for study.	High	Availability reflects existing bookings and blocked rooms.
US-02	As a Student, I want to book an available room, so that I have a reserved space for individual or group study.	High	The requested start time is in the future and the booking lasts no more than two hours.
US-03	As a Student, I want the system to prevent conflicting room bookings, so that my confirmed room is not reserved by another student for the same time.	High	Two bookings for the same room cannot overlap.
US-04	As a Student, I want to cancel my booking, so that the room becomes available when I no longer need it.	Medium	The student has an existing booking to cancel.
US-05	As a Student, I want to receive a confirmation after booking a room, so that I know my reservation was successfully recorded.	Medium	Confirmation is provided through a method within scope; SMS, push notifications, and additional reminders are excluded.
US-06	As an Administrator, I want to block a room, so that students cannot book it while it is unavailable.	High	A blocked room cannot accept new bookings.
US-07	As an Administrator, I want to unblock a room, so that students can book it again when it becomes available.	Medium	Only a currently blocked room needs to be unblocked.
US-08	As an Administrator, I want to review room usage, so that I can understand how study rooms are being used.	Medium	Usage is based on booking information; attendance and check-in are outside scope.
```

---

## 3. Story review
| Story (as generated) | What I did | Why | Final ID |
| --- | --- | --- | --- |
| US-01 | Kept unchanged | It is a clear Student goal and matches UC-01 View availability. | US-01 |
| US-02 | Rewritten | I added all booking-rule conditions to the assumption so the story stays consistent with R1, R2, R3 and R4. | US-02 |
| US-03 | Merged into US-02 | Preventing overlapping bookings is not a separate stakeholder goal; it is business rule R3 for booking a room. | US-02 |
| US-04 | Kept and renumbered | Cancelling a booking is a clear Student goal and matches UC-03. | US-03 |
| US-05 | Rewritten and renumbered | The generated story covered confirmation after booking only, while UC-06 confirms both booking and cancellation. | US-04 |
| US-06 | Merged with US-07 | Blocking and unblocking are one fixed use case, UC-04. | US-05 |
| US-07 | Merged with US-06 | It describes the second part of the same Administrator goal in UC-04. | US-05 |
| US-08 | Kept and renumbered | Reviewing room usage is a clear Administrator goal and matches UC-05. | US-06 |

**Did the assistant invent anything outside the scenario?**

No. I checked the generated stories against the out-of-scope list. The final stories contain no payments, fees, QR codes, attendance, maintenance requests, authentication, waiting lists, screens, databases, or servers. The generated US-05 mentioned SMS and push notifications only to state that they were excluded.

**How many stories did you end with, and why that number?**

I ended with 6 stories. US-03 was merged into the Book room story because it repeated business rule R3, and US-06 and US-07 were combined because blocking and unblocking belong to one fixed use case, UC-04. The six final stories now map clearly to the six fixed use cases.

### Scope review

The generated stories stayed mostly within the supplied scenario. No payments, fees, QR codes, attendance, authentication, waiting lists, databases, servers, or other prohibited features were introduced.

However, US-03 duplicated business rule R3 instead of describing a separate stakeholder goal. US-05 was incomplete because it covered confirmation after booking but not after cancellation. US-06 and US-07 were merged because both belong to the single fixed use case UC-04 Block or unblock room.

I finished with 6 revised stories because each final story now maps clearly to one of the six fixed use cases.



## 4. Original AI output — acceptance criteria (Part 3)

```
Assumptions
- A student is authenticated before booking or cancelling a room.
- A booking has a room, date, start time, and end time.
- A student may cancel only a booking they made.
- A booking must start in the future and may last no more than two hours.
- A room cannot have overlapping active bookings.
- A room marked as blocked is unavailable for booking.
- Confirmation is shown only after the requested booking or cancellation has completed successfully.
US-02 — Book room
AC1 — Successful booking
Given a room is available and not blocked, and the selected time is in the future and no longer than two hours,
When the student submits the booking request,
Then the system creates the booking and reserves the room for the selected period.
AC2 — Past or current time validation
Given a student selects a booking start time that is not in the future,
When the student attempts to book the room,
Then the system rejects the booking and informs the student that bookings must be in the future.
AC3 — Maximum duration validation
Given a student selects a booking period longer than two hours,
When the student attempts to book the room,
Then the system rejects the booking and informs the student that the maximum booking duration is two hours.
AC4 — Overlapping booking
Given a room already has an active booking that overlaps the requested time period,
When the student attempts to book that room,
Then the system rejects the booking and informs the student that the room is unavailable for the selected time.
AC5 — Blocked room
Given a room is marked as blocked,
When the student attempts to book that room,
Then the system rejects the booking and informs the student that the room is unavailable.
US-03 — Cancel booking
AC1 — Successful cancellation
Given the student has an active booking that they created,
When the student cancels the booking,
Then the system removes or marks the booking as cancelled and makes the room available for that period.
AC2 — Cannot cancel another student's booking
Given a booking was created by another student,
When the student attempts to cancel it,
Then the system rejects the cancellation and leaves the booking unchanged.
AC3 — Already cancelled booking
Given the student's booking has already been cancelled,
When the student attempts to cancel it again,
Then the system does not perform another cancellation and informs the student that the booking is already cancelled.
AC4 — Booking does not exist
Given the requested booking does not exist,
When the student attempts to cancel it,
Then the system rejects the request and informs the student that the booking could not be found.
US-04 — Receive confirmation
AC1 — Booking confirmation
Given a student's booking request satisfies all booking rules and is successfully created,
When the booking operation completes,
Then the system displays a confirmation containing the room and reserved date/time.
AC2 — Cancellation confirmation
Given the student successfully cancels their booking,
When the cancellation operation completes,
Then the system displays confirmation that the booking has been cancelled.
AC3 — No success confirmation for failed booking
Given a booking request violates a rule, such as being in the past, exceeding two hours, overlapping another booking, or selecting a blocked room,
When the booking attempt fails,
Then the system displays an appropriate error message instead of a successful booking confirmation.
AC4 — No success confirmation for failed cancellation
Given a cancellation cannot be completed,
When the cancellation attempt fails,
Then the system displays an appropriate error message and does not indicate that the booking was successfully cancelled.
```

---

## 5. Criteria review (Part 3)
## 5. Criteria review (Part 3)

| Criterion (as generated) | Problem | What I changed it to | Final ID |
| --- | --- | --- | --- |
| Assumption: A student is authenticated before booking or cancelling a room. | Authentication is out of scope. | Removed this assumption. | Removed |
| US-02 AC1 — Successful booking | It does not explicitly test the exact two-hour boundary. | Added a separate boundary case where exactly two hours is allowed. | US-02-AC6 |
| US-03 AC2 — Cannot cancel another student's booking | This behaviour is not defined in the original scenario. | Removed this criterion. | Removed |
| US-03 AC3 — Already cancelled booking | The scenario does not define this case. | Removed this criterion. | Removed |
| US-03 AC4 — Booking does not exist | The scenario does not define this behaviour. | Removed this criterion. | Removed |
| US-04 AC1 — Booking confirmation | It adds confirmation details that were not required. | Simplified it to confirm only that the booking completed successfully. | US-04-AC1 |

| A booking ending exactly when another begins — overlap under R3? | allowed | The bookings only touch at the boundary and do not overlap. |
| Is exactly two hours allowed under R2? | allowed | R2 says at most two hours, so exactly two hours is valid. |

**Which invalid or boundary case did the assistant leave out?**
The assistant did not test the exact two-hour boundary. R2 says a booking may last at most two hours, so a booking lasting exactly two hours should be explicitly tested and accepted.

---

## 6. Original AI output — use-case diagram (Part 4)

```
@startuml
left to right direction

actor Student
actor Administrator

rectangle "Smart Campus Study Room Booking System" {
  usecase "View availability" as UC1
  usecase "Book room" as UC2
  usecase "Cancel booking" as UC3
  usecase "Block or unblock room" as UC4
  usecase "Review usage" as UC5
  usecase "Send confirmation" as UC6

  UC2 ..> UC1 : <<include>>
  UC2 ..> UC6 : <<include>>
  UC3 ..> UC6 : <<include>>
}

Student --> UC1
Student --> UC2
Student --> UC3

Administrator --> UC4
Administrator --> UC5

@enduml
```

Rendered diagram (image, or a link): `requirements/usecase.png`

---

## 7. Diagram review (Part 4)

| Element | Problem | What I changed |
| --- | --- | --- |
| UC-02 Book room → UC-01 View availability <<include>> | The scenario does not state that viewing availability is a mandatory part of every booking. | Removed this <<include>> relationship. |
| UC-02 Book room → UC-06 Send confirmation <<include>> | No problem. Booking can lead to confirmation. | Kept unchanged. |
| UC-03 Cancel booking → UC-06 Send confirmation <<include>> | No problem. Cancellation can lead to confirmation. | Kept unchanged. |

**Associations.** Which actor–use-case links did the assistant draw that a person does not actually trigger? Name them.

None. Student is connected only to View availability, Book room, and Cancel booking. Administrator is connected to Block or unblock room and Review usage. Send confirmation is not directly triggered by an actor.

**Did any screen, database or internal component appear as a use case or an actor?**

No. The diagram contains only the two required actors and the six required use cases.
---

## 8. Traceability (Part 5)

Summarise what the table in `requirements/traceability.md` shows:

- Use cases with **no story** behind them:
- Stories with **no use case** they belong to:
- Criteria that test **no rule** from section 1:

**What does the largest gap tell you about the generated requirements?**
The largest gap is that UC-01, UC-04, and UC-05 have user stories but no acceptance criteria. This happened because only three stories were selected for Part 3. All six use cases are covered by stories, but acceptance-criteria coverage is not equal across all use cases.

---

## 9. Checker runs

Paste the **real terminal output** of both runs. A table with nothing behind it does not count.

```
| | PASS | FAIL | ERROR |
| --- | --- | --- | --- |
| `check_requirements.py` | 23 | 0 | 0 |
| `validate_submission.py` | 21 | 0 | 0 |

Commit these numbers were produced at (`git rev-parse --short HEAD`):

`b64af5f`

**Every FAIL, one line each: what it is and what you decided to do about it.**

None. Both final checker runs have 0 FAIL and 0 ERROR.

**Did you run the checks by hand instead of with Python?**

No. I ran both checks with Python.
```

```
$ python tests/validate_submission.py
$ python3 tests/validate_submission.py
submission.yml — submission.yml
------------------------------------------------------------------------
PASS   schema                                    1
PASS   week                                      03
PASS   student.name                              Alibyek Molshylykh
PASS   student.student_id                        24B030054
PASS   student.github                            Alibyek1122
PASS   assistant.tool                            ChatGPT
PASS   assistant.model                           GPT-5.6 Sol
PASS   counts.user_stories                       6
PASS   counts.acceptance_criteria_sets           3
PASS   checker                                   23 PASS · 0 FAIL · 0 ERROR
NOTE   checker                                   you are claiming a clean run — it will be re-run at your commit, so make sure it is true
PASS   checker.commit                            ec84de4
PASS   assumptions.overlap_touching_bookings     allowed
PASS   assumptions.exactly_two_hours             allowed
PASS   traceability.use_cases_not_covered        []
PASS   traceability.stories_not_traced           []
NOTE   traceability                              you are claiming full coverage in both directions — that is rare on a first pass, and it is checked
PASS   review_findings                           3 findings
PASS   review_findings[1]                        US-03 was merged into US-02 because overlap prevention is bu…
PASS   review_findings[2]                        US-04 was rewritten so that confirmation covers both success…
PASS   review_findings[3]                        UC-02 originally included UC-01, but that relationship was r…
PASS   honesty.can_explain_everything_submitted  yes
PASS   honesty.ai_usage_disclosed                yes
------------------------------------------------------------------------
21 PASS · 0 FAIL · 0 ERROR · 2 note
Shape is fine. This says nothing about whether the work is good.
```

| | PASS | FAIL | ERROR |
| --- | --- | --- | --- |
| `check_requirements.py` | | | |

Commit these numbers were produced at (`git rev-parse --short HEAD`):

**Every FAIL, one line each: what it is and what you decided to do about it.** A FAIL you report and
explain costs you nothing.

**Did you run the checks by hand instead of with Python?** Say so here — it costs nothing, but it
has to be said.

---

## 10. Conclusion (150–200 words)

Answer all three:

1. Which part of the generated requirements was most wrong, and how would you have caught it without
   a checker?
2. What did the assistant get right that would have taken you noticeably longer by hand?
3. You are handing these requirements to someone who will implement them, and you will not be in the
   room. Which single one would you rewrite first, and why?


The most problematic part of the generated requirements was the duplication and unsupported relationships. For example, the generated US-03 described overlap prevention as a separate stakeholder goal, although it is already business rule R3. The first diagram also made UC-02 include UC-01, even though the scenario does not say that viewing availability is mandatory for every booking. Without a checker, I would catch these problems by comparing every story, criterion, and diagram relationship with the six fixed use cases, four business rules, and the out-of-scope list.

The assistant was useful for producing an initial set of structured user stories, Given/When/Then criteria, and PlantUML quickly. Writing the first draft manually would have taken me longer.

Before giving the requirements to an implementer, I would review US-02 first. It is the main booking story and depends on R1, R2, R3, and R4. Its duration, overlap, future-time, and blocked-room conditions must be precise because unclear booking rules could lead to incorrect implementation.

Be specific. "The AI was useful" is worth nothing; "UC-06 had no story behind it until I wrote
US-07, and the checker is what told me" is worth everything.
