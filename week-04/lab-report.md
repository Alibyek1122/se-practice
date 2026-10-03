# Week 04 — Lab report: Modeling the System with UML

> The single worksheet for this lab. Fill in every section. **Do not delete, rename or renumber
> the headings** — the checker and the grader find your work by them. Replace every `<...>`
> placeholder; a row that still contains `<...>` counts as empty.

---

## 1. Setup

| Field | Value |
| --- | --- |
| Name | <your name> |
| Group | <your group> |
| AI assistant | <e.g. Claude, ChatGPT, Gemini, DeepSeek, Grok> |
| Exact model | <the exact model name with its version, e.g. claude-sonnet-4-5> |
| Renderer | <PlantUML web server / VS Code extension / IntelliJ plugin / local jar> |
| Behaviour diagram | <sequence / activity / both> |
| Stories used | <my week-03 stories, revised / the reference set from README §3> |

---

## 2. Prompts as sent

Paste every prompt **exactly as you sent it**, in the order you sent it, one code block each. The
AI's first replies are saved as files in `models/original/` — do not paste them here.

### 2.1 Task 1 — use-case prompt

```text
<paste>
```

### 2.2 Task 2 — class prompt

```text
<paste>
```

### 2.3 Task 3 — behaviour prompt (3A sequence or 3B activity)

```text
<paste>
```

### 2.4 Focused correction prompts (if you sent any)

```text
<paste, or write "none">
```

### 2.5 Critique prompt

```text
<paste>
```

---

## 3. Task 1 — use-case review

**Assumptions the AI listed:** 
- Availability reflects existing bookings and blocked rooms.
- Booking must satisfy R1, R2 and R3; touching bookings are allowed and exactly two hours is allowed.
- A Student may cancel only their own booking.
- Confirmation is provided only after successful booking or cancellation.
- Blocking prevents new bookings but does not cancel existing bookings.
- Usage is based on booking information over a selected period.

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | Student → Receive Confirmation | Receive Confirmation is a system result after booking or cancellation, not an independent Student goal. | US-04 | Removed the direct Student association; confirmation remains included from Book Room and Cancel Own Booking. |
| 2 | Book Room / Cancel Own Booking → Receive Confirmation | The AI used `<<include>>`, but the required `' why:` comment was not written directly above each relationship. | R4, US-04 and PlantUML convention | Added a `' why:` comment directly above both include relationships. |
---

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
| R1 | Book Room | Booking.startTime, Booking.endTime; R1 note | Valid time range? (R1) |
| R2 | Book Room | Booking.status, Booking.overlaps(), Room–Booking association; R2 note | Overlap with active booking? (R2) |
| R3 | Book Room; Block / Unblock Room | Room.blocked; R3 note | Room blocked? (R3) |
| R4 | Book Room; Receive Confirmation | Booking; R4 note | Show confirmation to Student |
| US-01 | View Room Availability | Student, Room, Booking | Not modeled in the selected Book Room activity diagram |
| US-02 | Book Room | Student, Room, Booking | Submit booking request → R1 → R3 → R2 → Create booking |
| US-03 | Cancel Own Booking | Student, Booking; ownership constraint | Not modeled in the selected Book Room activity diagram |
| US-04 | Receive Confirmation | Booking; confirmation note | Show confirmation to Student |
| US-05 | Block / Unblock Room | Administrator, Room | Room blocked? (R3) |
| US-06 | Review Room Usage | Administrator, Booking | Not modeled in the selected Book Room activity diagram |

## 8. Change log

| # | Diagram | Before (AI's original) | After (your revision) | Reason |
| --- | --- | --- | --- | --- |
| 1 | Use case | Student was directly associated with Receive Confirmation, and confirmation used unconditional `<<include>>`. | Removed the direct Student association and modeled confirmation conditionally with `<<extend>>`. | US-04 and R4 say confirmation occurs only after a successful booking or cancellation. |
| 2 | Class | Booking contained `generateConfirmation()` and Administrator had dependency arrows to Room and Booking. | Removed `generateConfirmation()` and the unnecessary dependency arrows; added an ownership constraint for cancellation. | Confirmation is an outcome, not a Booking responsibility; US-03 requires a Student to cancel only their own booking. |
| 3 | Activity | R1 was split into separate start-time and duration decisions. | Combined R1 into `Valid time range? (R1)` and clearly labeled the R1, R3 and R2 decisions. | The activity review requires three rule decisions: R1, R3 and R2. |
| 4 | Activity | The overlap decision did not explain touching bookings. | Added a note stating that touching bookings are allowed and are not an overlap. | This is an approved assumption that affects R2. |
---

## 9. Checker output

Paste the complete output of `python tests/check_models.py`, then explain **every FAIL you are
keeping**. The same IDs go in `submission.yml` under `checker.kept_fails`. A FAIL you report and explain costs you nothing. One you hide costs the whole criterion.

```text
<paste the full output>
```

**FAILs I am keeping, and why:** <one line per check ID, or "none">

---

## 10. Conclusion (120–180 words)

<Which diagram did the AI get most wrong, and what exactly was wrong? Which error would have
reached the code if nobody had reviewed it? What did the critique find that you missed — and what
did it claim that was false? Be specific: "the AI got the multiplicities wrong" is worth nothing;
"the AI put 1..* on the Booking end, which says every room must already have a booking" is worth
everything.>
