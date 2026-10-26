# AI Usage Disclosure — SIS #03

Required by the course academic policy (Generative AI use level **D — AI-integrated**).

I am responsible for the accuracy, testing, and integrity of everything submitted, including AI-generated content.

| Tool | Exact model / plan | Used for | Which files it touched | Reused from |
| --- | --- | --- | --- | --- |
| ChatGPT | Model not displayed for the original exchange | Planning the Python booking function, acceptance criteria, and testing strategy (Stage A) | `report.md` (planning documentation) | this SIS |
| ChatGPT | Original Week 05 model not displayed | Generating the original Python booking function (Stage B) | `code/original/booking_v1.py` | week-05 |
| Bolt.new | not displayed | Generating the responsive room availability checker prototype (Stage B) | `web/original/` | this SIS |
| ChatGPT | GPT-6 | Reviewing AC1–AC5, identifying validation weaknesses, and recommending additional tests (Stage C) | `report.md`, review recommendations for `code/` | this SIS |
| Bolt.new and ChatGPT | Bolt model not displayed; ChatGPT model not displayed for the earlier repair exchange | Fixing the invalid result label, improving timeline readability, and guiding retesting (Stage D) | `web/final/src/App.tsx`, `report.md` | this SIS |
| ChatGPT | GPT-6 | Helping develop additional automated tests for overlap detection and data preservation | `code/test_booking.py` | this SIS |

**The assistant wrote, or helped write, my tests in `code/`:** yes

ChatGPT helped create and improve the automated tests in `code/test_booking.py`. The final suite contains 23 tests. Expected results were derived from the acceptance criteria rather than copied from the function's output. AC1 requires valid time intervals, AC2 limits bookings to 120 minutes, AC3 rejects blocked rooms, AC4 rejects overlaps while allowing touching endpoints, and AC5 requires Boolean results without changing existing bookings. I checked the test suite using `python3 -m unittest -v` and the SIS checker.

**`code/original/` and `web/original/` hold the AI's first versions exactly as returned:** yes

The original Python implementation was preserved in `code/original/booking_v1.py`. The original web prototype was preserved in `web/original/`. Changes were made to the final versions instead of replacing the originals.

**Every result in `report.md` Section 5 was actually run or seen, not assumed:** no

The Python results were verified by the automated checker. Some final web results still require confirmation against direct browser observations. The original T5, T6, and T7 results were preserved as `Invalid input`, and the mismatch is disclosed as known failure C1.

**Everything I submitted, I can explain and defend in class — including the overlap condition and what the agent did in Section 9:** no

This statement must be confirmed personally after reviewing the implementation and being able to explain the overlap condition and the agent workflow without relying on AI-generated text.

**Anything I accepted from the AI without fully understanding it:**

The initial Bolt.new prototype contained generated dependencies and interface behavior that required further inspection. In particular, `web/original/src/App.tsx` displayed `Invalid input` for rejected requests T5–T7. I subsequently reviewed this behavior, documented the issue, and used the corrected final prototype. An unused database-related dependency was also removed from the final project.

**Signed:** Molshylykh Alibyek

**Date:** 2026-10-27