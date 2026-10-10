# AI Usage Disclosure — Week 05

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
I reviewed the AI-generated material against the specification and test results before submitting it.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| ChatGPT | GPT-6 / Plus | Implementation plan and boundary tests (Task 1) | `lab-report.md` |
| ChatGPT | GPT-6 / Plus | First implementation of `can_book` (Task 2) | `code/original/booking_v1.py`, `code/booking.py` |
| ChatGPT | GPT-6 / Plus | Assistance with 21 `unittest` tests and AC mappings (Task 3) | `code/test_booking.py`, `lab-report.md` |
| ChatGPT | GPT-6 / Plus | Code review, debugging guidance, and help organizing the report (Tasks 4–5) | `lab-report.md` |

**The assistant wrote, or helped write, my tests in `code/`:** yes

ChatGPT helped draft all 21 test cases. I checked their expected outcomes against AC1–AC5, not against whatever the implementation happened to return. The complete suite passed, and the shipped checker reported that all ten faulty implementations were detected.

**`code/original/` holds the assistant's first answer exactly as returned:** yes

**Everything I submitted, I can explain and defend in class — including the overlap condition:** yes

**Anything I accepted from the AI without fully understanding it:**

None. I reviewed the checks against AC1–AC5 and can explain the accepted behavior.

Signed: Alibyek Molshylykh
Date: 2026-10-11
