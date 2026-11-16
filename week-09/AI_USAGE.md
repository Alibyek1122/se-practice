# AI Usage Disclosure — Week 09

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| ChatGPT | MODEL / Plus | Part 2 — writing the calls for R1, R2, R3 | I saved the replies in calls/r1.json, calls/r2.json and calls/r3.txt. |
| ChatGPT | MODEL / Plus | Help with the input schema, checker output, permissions table, report wording and an example for the conclusion | I used the guidance while editing tool/check_room.json, lab-report.md and AI_USAGE.md. |

**I wrote `tool/check_room.json` myself:**  no
<!-- If an AI wrote or revised any of it, say which part, and how you checked it. -->
I provided the tool description, and ChatGPT helped write the input schema. I checked the definition with `python3 tests/check_tool.py`. All twelve schema cases, S01–S12, passed.

**I used an AI to explain a JSON Schema keyword or a check:** yes 
<!-- If "yes": which one, and for what. -->
ChatGPT helped me understand why S03 rejects `"11:00"` for `end`. The schema requires a whole number of minutes since midnight, so 11:00 is represented as `660`

**Every reply in `calls/` and in lab-report.md section 4 is exactly what the model returned:** yes 

**Every terminal output in lab-report.md was pasted from a real run, unedited:** yes 

**Anything I accepted from the AI without fully understanding it:** None
<!-- Name the file and the part. An honest entry here costs far less than a blank one that turns out to be untrue. -->

Signed: <Alibyek Molshylykh>
Date: 2026.11.16
