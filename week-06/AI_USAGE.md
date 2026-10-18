AI Usage Disclosure — Week 06
Required by the course academic policy (Generative AI use level D — AI-integrated).
Tool	Exact model / plan	Used for	Which files it touched
Bolt.new	not displayed	Generated the v1 Smart Campus Room Availability Checker (Task 2).	src/types.ts, src/data.ts, src/bookingLogic.ts, src/App.tsx; initial version intended for original/
Bolt.new	not displayed	Investigated the reported overlap issue and removed the duplicate room name from the DecisionCard presentation (Task 4).	src/App.tsx; final version intended for prototype/
ChatGPT	GPT-6 (ChatGPT web)	Explained the requirements and test procedure, interpreted Bolt's messages and screenshots, and drafted the report and declaration files.	Prepared text for lab-report.md, AI_USAGE.md, submission.yml; assembled a local evidence package from screenshots supplied in the conversation.


I used another assistant as well (to explain code, to draft text in lab-report.md, …): yes — ChatGPT (GPT-6), for guidance and drafting, including sections 1–10 of the report. The final explanations and declared test results require my own review.
original/ holds Bolt's first version exactly as downloaded, and evidence/v1.png shows it: no — evidence/v1.png was available, but original/ has not yet been restored in the prepared package. If I recover the genuine original export, I must update this answer.
Every screenshot in evidence/ is an unedited capture of the page as it behaved: yes — the screenshots included here are copied byte-for-byte from images supplied in the conversation; no synthesized screenshots were added.
I can explain the component I chose in lab-report.md section 8 — and how the page decides availability — without the assistant: no — this has not been personally confirmed yet; I will review src/bookingLogic.ts before changing this answer to yes.
Anything I accepted from the AI without fully understanding it:
I have not yet independently inspected the final source export. Bolt reported removing the roomName prop in src/App.tsx, and browser observations support the change, but I still need to verify the actual code and understand it. The report narrative was drafted with ChatGPT assistance and requires a personal accuracy review.
Signed: Molshylykh Alibyek
Date: 2026-10-18