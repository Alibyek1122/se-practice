# AI Usage Disclosure — SIS #04

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
I am responsible for the accuracy, testing and integrity of everything submitted,
including anything an AI tool produced.

| Tool | Exact model / plan | Date | Used for | Which files it touched |
| --- | --- | --- | --- | --- |
| ChatGPT | GPT-5.6 Sol | 27 Nov 2026 | codebase analysis (Task 1) | `report.md` |
| ChatGPT | GPT-5.6 Sol | 27 Nov 2026 | improvement plan | `report.md` |
| ChatGPT | GPT-5.6 Sol | 27 Nov 2026 | feature extension (Task 2) | `app/src/rooms.ts`, `app/src/filter.ts`, `app/src/booking.ts`, `app/src/App.tsx` |
| ChatGPT | GPT-5.6 Sol | 27 Nov 2026 | refactoring (Task 3) | `app/src/bookingLogic.ts`, `diagrams/before.puml`, `diagrams/after.puml`, `report.md` |
| ChatGPT | GPT-5.6 Sol | 27 Nov 2026 | tests (Task 4) | `app/src/sis04.test.ts` |

**The assistant wrote, or helped write, tests in `app/`:** yes

The assistant helped write the tests in `app/src/sis04.test.ts`. I checked the expected values against the fixed requirements instead of deriving them from the implementation. For example, B1 expects exactly 120 minutes to be valid because AC2 allows a maximum of 120 minutes; B2 expects 121 minutes to be invalid; B3 expects touching bookings to be valid; B4 expects overlapping bookings to be invalid; F1 and F2 use the required capacity and ALL-equipment rules; and F3–F5 follow the stated room availability requirements.

**Every run pasted in report.md was produced by my code on my machine (or Codespace), unedited:** yes

**Every number in report.md section 7 was measured the way its row says:** yes

**I shared no credentials, keys or private data with any tool:** yes

**Everything I submitted, I can explain and defend in class — including filterRooms, checkRoom and why each module exists:** yes

**Anything I accepted from the AI without fully understanding it:**

None. I reviewed the suggested changes, ran the automated tests after the changes, checked the UI manually, and verified the final project with the SIS #04 checker.

Signed: Alibyek Molshylykh  
Date: 27 November 2026