# AI Usage Disclosure — Week 08

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
I am responsible for the accuracy, testing and integrity of everything I submit, including AI-produced material.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| ChatGPT | GPT-6 Astra Medium / Plus | Diagnosis without the skill (Task 4) | No direct edits; response copied into lab-report.md §5 |
| ChatGPT | GPT-6 Astra Medium / Plus | Diagnosis with bug-detector in a prompt-only simulation (Task 5) | No direct edits; response copied into lab-report.md §6 |
| ChatGPT | not displayed / Plus | Setup and Git guidance, regression test generation, patch instructions, report drafts, comparison table, examples for §9.2 and §10, and disclosure assistance | Suggestions manually applied to app/src/booking.test.ts, app/src/booking.ts, lab-report.md and AI_USAGE.md |

**`skills/bug-detector/SKILL.md` was typed by me from the deck's text, not generated:** [yes if manually typed; no if copied and pasted]

The guidance assistant reproduced the prescribed skill text and provided instructions for naming, packaging and checking it. I used a prompt-only simulation, not an installed skill.

**I applied the patches myself, one minimal change per bug, after reviewing what the assistant proposed:** yes

I manually changed the overlap comparisons for BUG-A and removed the bookings.push statement for BUG-B. Each fix was committed separately after failing-test evidence. Obsolete comments were removed separately afterward.

**I used another assistant as well (to explain a failure, to draft text in lab-report.md, …):** yes

In addition to the two diagnosis chats, I used a separate ChatGPT guidance conversation. It helped generate the BUG-A and BUG-B tests, explain results, prepare report sections and compare the two answers. It also supplied example wording for §9.2 and §10 that informed my writing. These sections were therefore AI-assisted, not wholly unaided.

The defect log was completed retrospectively with AI assistance. I do not present it as an independently recorded pre-AI hypothesis.

**Every terminal output in lab-report.md was pasted from a real run, unedited:** no

All reported test results came from my actual terminal runs. Some sections contain explicitly labelled excerpts with warnings, repeated separators or individual failure details omitted. I do not claim that every output block is a complete, unedited transcript.

**I can explain both bugs and both fixes — which line, why it was wrong, which test proves the fix — without the assistant:** [yes or no — answer honestly]

**Anything I accepted from the AI without fully understanding it:**

[Write None only if you understand everything you accepted. Otherwise identify the file and the part you still need to understand.]

Signed: Molshylykh Alibyek
Date: 2026-11-06