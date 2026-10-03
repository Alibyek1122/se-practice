# Week 04 — Lab report: Modeling the System with UML

> The single worksheet for this lab. Fill in every section. **Do not delete, rename or renumber
> the headings** — the checker and the grader find your work by them. Replace every `<...>`
> placeholder; a row that still contains `<...>` counts as empty.

---

## 1. Setup

| Field | Value |
| --- | --- |
| Name | Alibyek Molshylykh |
| Group | Monday 16:00–19:00 |
| AI assistant | ChatGPT |
| Exact model | GPT-5.6 Sol |
| Renderer | PlantUML web server |
| Behaviour diagram | activity |
| Stories used | my Week 03 stories, revised |
---

## 2. Prompts as sent

### 2.1 Task 1 — use-case prompt

```text
Using the supplied scenario and approved stories, generate PlantUML for a use-case diagram. Include Student and Administrator outside a named system boundary. Model their goals, show justified associations, and list assumptions. Use include or extend only with a clear reason.

### 2.2 Task 2 — class prompt

```text
<Create a UML domain class diagram in PlantUML for Smart Campus. Start with Student, Room, and Booking. Add attributes, appropriate operations, and association multiplicities. Add other classes only when requirements justify them. Explain each relationship and list assumptions. Avoid unjustified inheritance or composition.>
```

### 2.3 Task 3 — behaviour prompt (3A sequence or 3B activity)

```text
<Generate a UML activity diagram in PlantUML for Book room. Show the initial node, actions, guarded decisions, and final nodes. Check the time range, blocked-room status, and overlapping bookings. Show confirmation after success and rejection after failure. Use branches rather than parallel paths unless concurrency is required.>
```

### 2.4 Focused correction prompts (if you sent any)

```text
<none>
```

### 2.5 Critique prompt

```text
Compare my diagrams with the requirements. Identify missing rules, inconsistent names, and unjustified elements. Cite each issue and propose a specific correction.>
```

---

## 3. Task 1 — use-case review

**Assumptions the AI listed:** 
**Assumptions the AI listed:**

- Availability reflects existing bookings and blocked rooms.
- Booking must start in the future and last more than 0 and at most 2 hours.
- Active bookings for the same room cannot overlap.
- Touching bookings are allowed.
- A blocked room cannot accept a new booking.
- Exactly two hours is allowed.
- A Student may cancel only their own booking.
- Confirmation follows successful booking or cancellation.
- Blocking does not automatically cancel existing bookings.
- Usage is based on booking information over a selected period.

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | Student to Receive Confirmation | Receive Confirmation is a system outcome, not an independent Student goal. | US-04, R4 | Removed the direct Student association to Receive Confirmation. |
| 2 | Book Room and Cancel Own Booking to Receive Confirmation | The AI modeled confirmation as an unconditional include relationship, even though confirmation happens only after success. | R4, US-04 | Changed confirmation to conditional extend relationships after successful booking or cancellation. |


## 4. Task 2 — class diagram review

### 4.1 Relationships, read both ways

| Association | Read left → right | Read right → left | Multiplicities |
| --- | --- | --- | --- |
| Student — Booking | One Student makes 0..* Bookings. | Each Booking belongs to exactly 1 Student. | 1 / 0..* |
| Room — Booking | One Room may have 0..* Bookings over time. | Each Booking reserves exactly 1 Room. | 1 / 0..* |

### 4.2 Constraints the multiplicities cannot show

- R2: The note on Booking states that ACTIVE bookings for the same Room cannot overlap.
- R1: The Booking note states that the start must be in the future and the duration must be greater than 0 and at most 2 hours.
- R3: The Room note states that a blocked Room cannot accept a new Booking.

### 4.3 Assumptions

- A1: Touching bookings are allowed, so one booking ending at 12:00 and another starting at 12:00 do not overlap.
- A2: Blocking a room prevents new bookings but does not automatically cancel existing bookings.
- A3: Cancelled bookings remain represented with status CANCELLED and do not count as active bookings for R2.

### 4.4 Findings

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | Booking.generateConfirmation() | The AI assigned confirmation generation directly to the Booking domain class, but the requirements only state that confirmation is an outcome of successful booking or cancellation. | R4, US-04 | Removed generateConfirmation() from Booking and kept confirmation as a constraint note. |
| 2 | Administrator dependencies to Room and Booking | The AI added dependency arrows that were not required to express the persistent domain structure. | US-05, US-06 | Removed the dependency arrows and kept Administrator operations and notes to show the required behaviour. |

## 5. Task 3 — activity review

**Assumptions the AI listed:**

- The activity models only the Book room flow.
- Rejection shows a reason to the Student.
- Confirmation is shown only after successful booking creation.
- Overlap checking is done only against active bookings for the same room.

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | Time validation | The AI split R1 into two separate decisions: future start time and valid duration. The checker guidance expects three decisions overall: R1, R3 and R2. | R1, activity review question | Replaced the two separate checks with one decision: `Valid time range? (R1)`. |
| 2 | Decision labels | The AI used Yes/No guards, but the revised diagram should clearly show the rule names on the decision nodes. | R1, R2, R3 and activity review question | Labeled the three decisions as `Valid time range? (R1)`, `Room blocked? (R3)` and `Overlap with active booking? (R2)`. |

## 6. AI critique

| # | Issue the AI raised | Element it cited | Verdict | Why |
| --- | --- | --- | --- | --- |
| 1 | Confirmation is modeled as unconditional with `<<include>>`. | Use case: Book Room / Cancel Own Booking → Receive Confirmation | accept | R4 and US-04 say confirmation is produced only after a successful booking or cancellation. I will model confirmation as conditional behaviour using `<<extend>>`. |
| 2 | The “cancel only your own booking” rule is not explicit in the class diagram. | Booking.cancel() and Student — Booking association | accept | US-03 says a Student may cancel only a booking they made. I will add this constraint to the class diagram. |
| 3 | The touching-bookings assumption is not explicit in the activity diagram. | Overlap with active booking? (R2) | accept | The approved assumptions say an end time equal to another booking's start time is not an overlap. I will add this as a note near the R2 decision. |
| 4 | Failure-reason messages are not required by the requirements. | Show overlap reason / blocked-room reason / invalid time-range reason | reject | The activity task requires rejection after failure, and these actions only make the reason for each rejection branch explicit. They do not add a new domain feature. |


## 7. Consistency table

| Requirement / story | Use case | Classes | Behaviour element |
| --- | --- | --- | --- |
| R1 | Book Room | Booking.startTime, Booking.endTime | Valid time range? (R1) |
| R2 | Book Room | Booking.status, Booking.overlaps(), Room and Booking association | Overlap with active booking? (R2) |
| R3 | Book Room | Room.blocked | Room blocked? (R3) |
| R4 | Book Room | Booking | Show confirmation to Student |
| US-01 | View Room\nAvailability | Student, Room, Booking | Availability is checked before choosing a room |
| US-02 | Book Room | Student, Room, Booking | Submit booking request, validate rules, create booking |
| US-03 | Cancel Own\nBooking | Student, Booking | Not part of the selected Book Room activity |
| US-04 | Receive\nConfirmation | Booking | Show confirmation to Student |
| US-05 | Block / Unblock\nRoom | Administrator, Room | Room blocked? (R3) |
| US-06 | Review Room\nUsage | Administrator, Booking | Not part of the selected Book Room activity |

## 8. Change log

| # | Diagram | Before (AI's original) | After (your revision) | Reason |
| --- | --- | --- | --- | --- |
| 1 | Use case | Student had a direct association with Receive Confirmation and confirmation was modeled with include relationships. | Removed the direct Student association and changed confirmation to conditional extend relationships. | R4 and US-04 require confirmation only after successful booking or cancellation. |
| 2 | Class | Booking contained generateConfirmation and Administrator had unnecessary dependency arrows. | Removed generateConfirmation and the unnecessary dependency arrows, and added the cancellation ownership constraint. | Confirmation is an outcome and US-03 requires cancellation only by the Student who made the booking. |
| 3 | Activity | R1 was split into separate start-time and duration decisions. | Combined R1 into one Valid time range decision and kept separate R3 and R2 decisions. | The activity model requires separate decisions for R1, R3 and R2. |
| 4 | Activity | The overlap decision did not explain touching bookings. | Added a note that touching bookings are allowed and are not an overlap. | This is an approved assumption affecting R2. |

## 9. Checker output

```text
Week 04 structural check - shape only, never quality

UC1  PASS  Student and Administrator declared
UC2  PASS  named system boundary: "Smart Campus Study Room Booking System"
UC3  PASS  all actors declared outside the boundary
UC4  PASS  all scenario goals present (6 use cases)
UC5  PASS  no actor is associated with a confirmation use case
UC6  PASS  actor responsibilities match the scenario
UC7  PASS  use cases are goals, not screens or components
UC8  PASS  every include / extend / generalization carries a ' why: comment (or there are none)
UC9  PASS  revised diagram differs from the AI's original
CL1  PASS  Student, Room and Booking present
CL2  PASS  Booking is associated with Student and with Room
CL3  PASS  every association has multiplicities at both ends
CL4  PASS  1 student / 1 room per booking, 0..* bookings per student and per room
CL5  PASS  every inheritance / composition / aggregation carries a ' why: comment (or there are none)
CL6  PASS  only domain concepts in the class diagram
CL7  PASS  attributes needed by R1-R3 are present
CL8  PASS  a note states R2 (no overlapping active bookings)
AC1  PASS  initial and final nodes present
AC2  PASS  separate decisions check R1, R3 and R2 (3 decisions)
AC3  PASS  every branch has a labelled guard
AC4  PASS  no parallel paths
AC5  PASS  confirmation on success, rejection on failure
AC6  PASS  creation comes after all rule checks
FI1  PASS  the AI's original output is kept for every diagram
FI2  PASS  a rendered image for every diagram
LR1  PASS  §1 setup filled (tool and model recorded)
LR2  PASS  4 prompts pasted in §2
LR3  PASS  2 use-case findings in §3
LR4  PASS  §4 relationships read both ways, 3 assumption(s) declared
LR5  PASS  2 behaviour-diagram findings in §5
LR6  PASS  3 critique issues with a verdict
LR7  PASS  4 change-log rows covering all three diagrams
CS1  PASS  6 approved stories
CS2  PASS  §7 traces R1-R4 into the diagrams
CS3  PASS  every use case traces to an approved story

SUMMARY pass=35 fail=0 error=0
A FAIL you report and explain in lab-report.md §9 costs you nothing. One you hide costs the criterion.


## 10. Conclusion (120–180 words)

The AI got the use-case diagram most wrong. It first connected the Student directly to Receive Confirmation, even though confirmation is a system outcome rather than an independent Student goal. It also modeled confirmation with an unconditional include relationship. After review, I removed the direct Student association and changed confirmation to conditional behaviour because R4 and US-04 say that confirmation is produced only after a successful booking or cancellation. If nobody had reviewed this, the implementation could have treated confirmation as a separate user action instead of a result of a successful process.
The critique also found one issue I had missed in the class diagram: US-03 requires a Student to cancel only a booking they made, so I added an explicit ownership constraint. It also identified that the activity diagram did not explain the touching-bookings assumption, so I added a note near R2. I rejected the critique claim that failure-reason actions were unjustified because they only explain rejection branches and do not introduce a new domain feature.>
