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

Run the critique prompt once, on all your revised diagrams together. At least **three** rows. A
critique is another claim to evaluate, not a verdict: reject what is wrong and say why.

| # | Issue the AI raised | Element it cited | Verdict | Why |
| --- | --- | --- | --- | --- |
| 1 | <issue> | <element> | <accept / reject> | <your reason> |
| 2 | <issue> | <element> | <accept / reject> | <your reason> |
| 3 | <issue> | <element> | <accept / reject> | <your reason> |

---

## 7. Consistency table

One row for each of **R1–R4**, then one row for **every use case in your revised use-case
diagram**, spelled exactly as in the diagram, with the story ID it traces to.

| Requirement / story | Use case | Classes | Behaviour element |
| --- | --- | --- | --- |
| R1 | <use case> | <classes and attributes> | <message, guard or decision> |
| R2 | <use case> | <classes, note> | <message, guard or decision> |
| R3 | <use case> | <classes and attributes> | <message, guard or decision> |
| R4 | <use case> | <classes> | <message or action> |
| <US-01> | <Book room> | <Student, Booking, Room> | <message or action> |

---

## 8. Change log

At least **three** rows, and at least one for each required diagram (use case, class, your
behaviour diagram). "Before" is what the AI produced; "After" is what you submitted.

| # | Diagram | Before (AI's original) | After (your revision) | Reason |
| --- | --- | --- | --- | --- |
| 1 | <use case> | <before> | <after> | <rule, story or notation reason> |
| 2 | <class> | <before> | <after> | <reason> |
| 3 | <sequence / activity> | <before> | <after> | <reason> |

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
