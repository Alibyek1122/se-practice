# AI Usage Disclosure — Week 10

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| ChatGPT | GPT-5.6 Sol / ChatGPT Plus | read-only risk review (Task 2) | none — "WITHOUT editing files" |
| ChatGPT | GPT-5.6 Sol / ChatGPT Plus | AGENTS.md review and patch draft (Task 6) | `app/AGENTS.md`, only after my approval |
| ChatGPT | GPT-5.6 Sol / ChatGPT Plus | minimal patches for two risks and regression test (Tasks 7–8) | `app/src/availabilityRules.ts`, `app/src/booking.ts`, `app/src/bookingLogic.ts`, `app/src/App.tsx`, `app/src/booking.test.ts` |
| ChatGPT | GPT-5.6 Sol / ChatGPT Plus | helped draft and organize the risk register, audit evidence and report text | `lab-report.md`, `submission.yml`, `AI_USAGE.md` |

**The review in Task 2 ran in a mode where the assistant could not edit, and `git status` showed no
change afterwards:** yes

The Task 2 review was performed in a ChatGPT conversation using project files pasted into the chat. ChatGPT had no direct access to edit my local repository.

**I labelled every claim in lab-report.md §3.2 after opening the cited file myself:** yes

**Every change to `app/` was reviewed by me as a diff before I accepted it:** yes

I accepted the R1 shared validation refactor and the R5 `AGENTS.md` correction after reviewing their diffs. I rejected unrelated feature additions and did not add login, a database, external deployment, or unnecessary dependencies.

**I used another assistant as well (to explain a risk, to draft text in lab-report.md, …):** no

**Every terminal output in lab-report.md was pasted from a real run, unedited:** yes

**I can explain every score in my register, and why my release decision follows from it, without
the assistant:** yes

**Anything I accepted from the AI without fully understanding it:**

None. I reviewed the proposed changes, checked the diffs, and verified the final behavior with Vitest, lint, typecheck, build, the Week 10 checker, and manual desktop/mobile UI checks.

Signed: Alibyek Molshylykh  
Date: 22 November 2026