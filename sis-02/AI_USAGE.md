# AI Usage Disclosure — SIS #02

Required by the course academic policy (Generative AI use level **D** — AI-integrated). AI use is required for this assignment. I remain responsible for reviewing, understanding, and defending the submitted work.

The complete AI exchanges are recorded in `report.md`, section 11.

| Tool | Exact model / plan | Used for | Which sections and files it touched |
| --- | --- | --- | --- |
| ChatGPT | GPT-6 / Plus | Prompt A: Drafted three user stories and six acceptance criteria. | `report.md` sections 1, 2, 11 (B1) |
| ChatGPT | GPT-6 / Plus | Prompt B: Generated the original sequence and class diagrams in PlantUML. | `models/original/sequence.puml`, `models/original/classes.puml`, `report.md` section 11 (B2) |
| ChatGPT | GPT-6 / Plus | Prompt C: Reviewed UML models against R1–R5 and T1–T4 and identified modeling issues. | `report.md` sections 7, 11 (B3) |
| ChatGPT | GPT-6 / Plus | Prompt D: Revised the UML diagrams based on three accepted review decisions. | `models/sequence.puml`, `models/classes.puml`, `report.md` section 11 (B4) |
| ChatGPT | GPT-6 / Plus | Assisted with explanations, traceability, walkthrough drafts, reflection drafting, source-check formatting, Markdown corrections, and Git/VS Code instructions. | `report.md` sections 3–10 and 13, `AI_USAGE.md` |

**Three parts of this assignment are yours alone. All three were written without AI assistance:** no

AI assistance was used in preparing the initial scope and assumptions in section 10. AI also helped draft the T1–T4 walkthroughs in section 6 and the reflection in section 9. These sections require my own review and revision before final submission.

**The files in `models/original/` are the assistant's Prompt B output, unedited:** yes

**Every source in section 13 is one I opened and read myself:** no

The PlantUML documentation references were suggested by AI. I must personally open and check both sources before changing this declaration to yes.

**Everything I submitted, I can explain and defend without consulting the assistant:** no

I am still reviewing the modeling decisions and ensuring that I can explain the diagrams and all four walkthroughs independently.

**Anything I accepted from the AI without fully understanding it:**

The implementation of atomic registration and concurrency control has not been independently verified. The UML diagrams specify the required atomic behavior, but they do not define its technical implementation.

Signed: Molshylykh Alibyek

Date: 2026-10-18