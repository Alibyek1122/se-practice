# Lab report — Practice #03, Requirements Engineering with AI

Fill in every section. **Do not delete or renumber the headings** — the README points at them and a
missing heading reads as a missing section.

Name:
Student ID:
GitHub username:

---

## 1. Setup

| | |
| --- | --- |
| AI assistant (tool) | |
| Exact model name and version | |
| Date of the session | |
| Diagram renderer used | |

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

| Original story | Action | Reason | Final story |
| --- | --- | --- | --- |
| US-01 | Kept | It represents the Student goal of checking which rooms are available and matches UC-01. | US-01 |
| US-02 | Rewritten | The story is valid, but its assumption did not cover all booking rules, especially overlapping bookings and blocked rooms. | US-02 |
| US-03 | Merged into US-02 | Preventing conflicting bookings is not a separate stakeholder goal. It is a business rule that belongs to the Book room story. | US-02 |
| US-04 | Kept and renumbered | Cancelling a booking is a clear Student goal and directly matches UC-03. | US-03 |
| US-05 | Rewritten and renumbered | The generated story mentioned confirmation only after booking, but UC-06 requires confirmation after both booking and cancellation. | US-04 |
| US-06 | Merged with US-07 | Blocking and unblocking are defined as one use case, UC-04, so they were combined into one stakeholder goal. | US-05 |
| US-07 | Merged with US-06 | It describes the second half of the same UC-04 business goal. | US-05 |
| US-08 | Kept and renumbered | Reviewing room usage is a clear Administrator goal and matches UC-05. | US-06 |

### Scope review

The generated stories stayed mostly within the supplied scenario. No payments, fees, QR codes, attendance, authentication, waiting lists, databases, servers, or other prohibited features were introduced.

However, US-03 duplicated business rule R3 instead of describing a separate stakeholder goal. US-05 was incomplete because it covered confirmation after booking but not after cancellation. US-06 and US-07 were merged because both belong to the single fixed use case UC-04 Block or unblock room.

I finished with 6 revised stories because each final story now maps clearly to one of the six fixed use cases.



## 4. Original AI output — acceptance criteria (Part 3)

```
(paste here)
```

---

## 5. Criteria review (Part 3)

| Criterion (as generated) | Problem | What I changed it to | Final ID |
| --- | --- | --- | --- |
| | | | |

**The two open questions.** Write your decision and the reason. Either answer is accepted.

| Question | My decision | Why |
| --- | --- | --- |
| A booking ending exactly when another begins — overlap under R3? | allowed / not-allowed | |
| Is exactly two hours allowed under R2? | allowed / not-allowed | |

**Which invalid or boundary case did the assistant leave out?**

---

## 6. Original AI output — use-case diagram (Part 4)

```
(paste the PlantUML source exactly as generated)
```

Rendered diagram (image, or a link):

---

## 7. Diagram review (Part 4)

| Element | Problem | What I changed |
| --- | --- | --- |
| | | |

**Associations.** Which actor–use-case links did the assistant draw that a person does not actually
trigger? Name them.

**Did any screen, database or internal component appear as a use case or an actor?**

---

## 8. Traceability (Part 5)

Summarise what the table in `requirements/traceability.md` shows:

- Use cases with **no story** behind them:
- Stories with **no use case** they belong to:
- Criteria that test **no rule** from section 1:

**What does the largest gap tell you about the generated requirements?**

---

## 9. Checker runs

Paste the **real terminal output** of both runs. A table with nothing behind it does not count.

```
$ python tests/check_requirements.py
(paste)
```

```
$ python tests/validate_submission.py
(paste)
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

Be specific. "The AI was useful" is worth nothing; "UC-06 had no story behind it until I wrote
US-07, and the checker is what told me" is worth everything.
