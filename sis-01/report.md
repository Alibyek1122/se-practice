# SIS #01 — Software Engineering Fundamentals, With an AI in the Loop

<!--
  This is the only file you write your report in. README.md tells you what goes where.

  Rules the checker relies on:
  - Do not delete, rename or renumber the ## headings, the ### headings, or the **Label:** words.
  - Replace every "(write here)" and "(paste here)". None may be left when you submit.
  - Comments like this one are ignored by the word counter. Delete them or leave them.
-->

**Topic:** 1.6

<!-- Exactly one of 1.1 … 1.10, e.g.  **Topic:** 1.4  -->

---

## 1. Scenario

<!-- 100–150 words, labels included. One small scenario, used in every prompt and in your
     whole answer. Anything fictional is labelled in Assumptions. -->

**Question:** How can fundamental software engineering principles help create a reliable and user-friendly university study room booking system?

**Users:** University students who need rooms for studying and administrators who manage room availability.

**Problem:** In this fictional scenario, students must contact university staff to reserve study rooms. This manual process wastes time, creates confusion, and may cause booking conflicts.

**Constraints:**
1. Each room booking must not exceed two hours.
2. The system must prevent overlapping active bookings for the same room.

**Risk:** A software error could allow two students to book the same room at the same time, causing conflicts and reducing trust in the system.

**Assumptions:** The university, booking problems, users, and development team in this scenario are fictional. We assume the university provides a web application where students can view available rooms, make reservations, and cancel bookings.

## 2. Analysis

<!-- 350–400 words. Your answer to the question, the trade-offs, and how it applies to your
     scenario. Explain at least two engineering decisions and why they fit the scenario. -->

Fundamental software engineering principles can turn a manual study-room booking process into a predictable service. For this fictional university, the key principles are clear requirements, dependable data handling, iterative delivery, reuse with care, and testable quality. The two most important decisions concern precise reservation rules and simultaneous requests.

First, I would convert student and administrator feedback into acceptance criteria. The IEEE Computer Society's Software Requirements course description separates requirements work into elicitation, analysis, specification and validation. In practice, a student should be able to see availability, reserve a room and cancel an existing reservation. An administrator should be able to manage room availability. Instead of a vague rule such as "short bookings only," the specification would require a start time before the end time and a maximum duration of 120 minutes. A request lasting zero or 121 minutes must be rejected. Using start-inclusive, end-exclusive intervals, one booking ending at 11:00 would not conflict with another starting at 11:00. Cancelled reservations would not block a new reservation. These boundaries are proposed design rules, not facts about a real university.

Second, I would validate and commit a reservation as one controlled database operation. A page may show Room 101 as free at 14:00, but another student may book it before the first student confirms. Checking availability before saving is not enough. PostgreSQL's Transaction Isolation documentation explains that its default Read Committed level does not prevent all concurrency anomalies; Serializable can offer stronger guarantees for committed transactions but requires appropriate handling of serialization failures. The team could consider a Serializable transaction with a repeated overlap check and whole-transaction retry. It is more complex than a basic insert, so it would need tests for concurrent requests rather than an assumption that transactions alone solve the problem.

For delivery, I would begin with a small written plan and build the booking workflow in short iterations. Reusing a Python library might reduce coding effort, but a heavy framework could increase maintenance. Therefore, the team should choose tools only after checking compatibility and support. Acceptance tests should confirm valid, invalid, adjacent, cancelled and simultaneous bookings; usability tests should ask representative users to complete reservations without confusion. These are proposals: neither a working implementation nor measured usability results exist yet.

## 3. Review
<!-- 250–300 words. What Prompt B's critique said and what you did with it; your two source
     checks and your two substantive revisions, each with a reason. Point at the rows of the
     tables in section 9 ("verification row 2", "change-log row 1"). -->


Prompt B identified eight concerns, and I considered each one against the Smart Campus scenario.

I accept concern 1 because interviewing students is not enough: their needs must become measurable requirements. For example, a booking should have a valid duration and a clear confirmation. I accept concern 2 because two simultaneous requests can both see an available room; a simple availability check is insufficient. I accept concern 3 because zero-duration bookings, cancelled reservations, and bookings touching at their endpoints need explicit rules.

I qualify concern 4. Iterative development fits a small project where feedback may change the interface, but some initial planning is still necessary. I also qualify concern 5: Python libraries might save effort, but the draft did not show that any particular library is appropriate. A small, understandable solution may be better than a large framework.

I accept concern 6 because tests need expected outcomes, not only scenario names. I accept concern 7 because correct booking logic does not guarantee usability. I accept concern 8 because the draft mixed fictional assumptions with technical proposals, particularly blocked rooms and the Python technology choice.

Verification row 1 supports keeping the requirements claim: the IEEE Software Requirements course description names elicitation, analysis, specification, and validation. Verification row 2 supports qualifying the concurrency claim: PostgreSQL documentation explains that Read Committed permits certain anomalies, while Serializable can require transaction retries.

My two main planned revisions are to specify the exact overlap rule, including back-to-back bookings, and to replace a vague recommendation about transactions with a conditional design requiring correct isolation and retry handling. These changes respond to the scenario's duplicate-booking risk; they are design recommendations, not proof that a working system has passed tests.

## 4. Conclusion

<!-- 100–150 words. Your recommendation for the scenario and its main limitation. -->

For the fictional Smart Campus booking system, I recommend starting with clear, testable requirements and treating the prevention of overlapping reservations as the highest priority. Students should be able to view available rooms, reserve a time slot, and cancel bookings, while administrators manage room availability.

The system should enforce the two-hour limit, reject invalid booking durations, and handle cancelled and back-to-back reservations correctly. Appropriate database transaction handling and concurrency testing are important for reducing booking conflicts.

I recommend using an iterative development approach because it allows the team to improve the application through feedback and testing. However, the main limitation is that this is only a proposed design. No working prototype or real user testing has demonstrated its reliability or usability. These aspects must be evaluated before deployment.

## 5. Reflection

<!-- 150–200 words. NOT part of the main total. Written by you, not by the assistant:
     what helped, what you changed, what you learned. Specific beats flattering. -->

During SIS 01, I learned that software engineering is not only about writing code. A good system needs clear requirements, reliable functions, and proper testing. At first, I focused mainly on collecting requirements, preventing duplicate bookings, and using Python libraries.

ChatGPT helped me organize these ideas and understand different software engineering principles. Prompt A provided an initial explanation, while Prompt B helped identify weaknesses in the draft. The most important issue was that two students could book the same room simultaneously.

I learned that checking room availability is not always enough. The system also needs clear booking rules and appropriate concurrency control. I considered invalid durations, cancelled reservations, and overlapping booking times.

The IEEE and PostgreSQL materials helped me understand requirements engineering and database transaction isolation. This showed me why technical claims need reliable supporting evidence.

In future projects, I want to define requirements more carefully, write specific test cases, and check AI-generated information before using it. I also want to improve my ability to make independent engineering decisions.

## 6. References

<!-- Full references, one per line, each starting with "- ". Only sources you actually opened.
     Every URL used in the verification table must also appear here. Example:
     - Sommerville, I. (2016). Software Engineering, 10th ed., Global Edition. Pearson. Ch. 1.
-->

- IEEE Computer Society. Software Requirements, Course CSE001. https://iln.ieee.org/Public/ContentDetails.aspx?id=8D866DF4BB054D7FB0F73DB13E4D6E30 (Accessed: 2026-10-11).

- PostgreSQL Global Development Group. PostgreSQL 14 Documentation, Section 13.2: Transaction Isolation. https://www.postgresql.org/docs/14/transaction-iso.html (Accessed: 2026-10-11).

## 7. Appendix A — Initial outline

<!-- Written BEFORE you run Prompt A. Five points, your own words, numbered. These are the
     "five points" you paste into Prompt A. -->

1. Requirements: We can identify students' requirements by asking them questions and collecting their feedback. We need to understand how they want to check room availability, book rooms, and cancel bookings.

2. Dependability: We should check existing bookings before allowing a new reservation. This will prevent two students from booking the same room at the same time.

3. Development Process: First, we collect requirements and design the system. Then, we write the code, test the system, and fix any problems.

4. Software Reuse: We can use existing Python libraries to save time and reduce errors. This helps us develop the system faster without writing everything from scratch.

5. Testing: We should test the system with different situations, such as overlapping bookings, blocked rooms, and invalid booking times. We also check that valid bookings are accepted and invalid bookings are rejected.

## 8. Appendix B — AI exchanges

<!-- Complete prompts and complete responses, as text — never screenshots. Paste each inside
     the fenced block that follows its label. If a response itself contains ``` lines, open
     and close that block with ~~~~ instead. You may add B4, B5 … after B3 if you ran more. -->

### B1 — Draft (Prompt A)

- **Tool:** ChatGPT
- **Model:** GPT-6
- **Date:** 2026-10-11
- **Purpose:** contextual draft

**Prompt:**

```text
Act as a software engineering tutor. Help me analyze topic 1.6 — Fundamental Engineering Principles: How can fundamental software engineering principles help create a reliable and user-friendly university study room booking system? for a first-year-level university assignment.

My scenario is a fictional university study room booking system. The users are university students who need study rooms and administrators who manage room availability. Students currently contact university staff to reserve rooms, which wastes time and may create booking conflicts. The two constraints are that each booking must not exceed two hours and overlapping active bookings for the same room must be prevented. The main risk is a software error allowing two students to book the same room at the same time. The university, booking problems, and proposed development team are fictional. My initial ideas are:

1. Requirements: We can identify students' requirements by asking them questions and collecting their feedback. We need to understand how they want to check room availability, book rooms, and cancel bookings.

2. Dependability: We should check existing bookings before allowing a new reservation. This will prevent two students from booking the same room at the same time.

3. Development Process: First, we collect requirements and design the system. Then, we write the code, test the system, and fix any problems.

4. Software Reuse: We can use existing Python libraries to save time and reduce errors. This helps us develop the system faster without writing everything from scratch.

5. Testing: We should test the system with different situations, such as overlapping bookings, blocked rooms, and invalid booking times. We also check that valid bookings are accepted and invalid bookings are rejected.

Draft a 400–500 word explanation using these details.

Separate facts from assumptions. Explain trade-offs and identify claims I should verify. Do not invent quotations, references or page numbers.
```

**Response:**

```text
# Fundamental Engineering Principles: Smart Campus Study Room Booking System

## Introduction

Fundamental software engineering principles help developers create software that is reliable, understandable, maintainable, and useful. In this assignment, these principles are applied to a fictional university study room booking system. The system allows students to check room availability, make reservations, and cancel bookings. Administrators manage rooms and their availability.

## 1. Requirements Engineering

Requirements engineering is an important part of software development. Before creating the application, developers should understand what students and administrators need. They can collect information through interviews, questionnaires, and user feedback.

For this scenario, students need a simple interface that displays available rooms and allows reservations. Administrators need functions for managing rooms and preventing unavailable rooms from being booked.

However, collecting detailed requirements takes time. The development team must balance user needs with available resources.

## 2. Dependability and Reliability

Dependability is especially important because students must trust the booking system.

Two constraints are defined in this fictional scenario. First, each reservation must not exceed two hours. Second, two active bookings must never overlap for the same room.

Developers should validate booking requests before accepting them. However, checking existing reservations alone may not prevent conflicts if two students submit requests simultaneously. The system may need database transactions or another concurrency-control mechanism.

This adds implementation complexity but improves protection against duplicate bookings.

## 3. Development Process

A structured development process can help the team organize its work. The process includes collecting requirements, designing the application, implementing features, testing, and maintaining the software.

For this small project, an iterative approach may be suitable. Developers can first implement basic booking functionality and then improve the system using feedback.

The trade-off is that frequent changes may require additional testing and documentation.

## 4. Software Reuse

Software reuse allows developers to use existing components instead of creating every feature themselves.

For example, Python libraries and web frameworks could support database operations, input validation, and application development.

Reusing components may reduce development effort. However, external libraries can introduce dependencies, compatibility problems, and security risks. Therefore, developers should evaluate libraries before selecting them.

## 5. Testing and Quality Assurance

Testing helps identify errors before users experience them.

The team should test valid reservations, overlapping bookings, blocked rooms, and invalid booking durations. It should also test simultaneous booking requests because this situation is directly related to the main risk.

Automated tests can help developers check whether updates break existing functionality.

## Facts, Assumptions, and Verification

The university, users, booking problems, and development team are fictional assumptions. The two-hour limit is a proposed business rule, not a universal requirement.

Two general claims require verification using reliable sources:

1. Requirements engineering helps developers understand stakeholder needs and define system requirements.
2. Software reuse can reduce development effort but may introduce maintenance and dependency challenges.

These claims should be checked in software engineering textbooks or technical documentation before the final report.

## Conclusion

The project should prioritize clear requirements, reliable booking validation, iterative development, careful software reuse, and testing. The most important engineering decision is preventing overlapping reservations, including simultaneous requests. Although stronger reliability mechanisms increase complexity, they can reduce booking conflicts and improve user confidence.
```
### B2 — Critique (Prompt B)

- **Tool:** ChatGPT
- **Model:** GPT-6
- **Date:** 2026-10-11
- **Purpose:** critical review of the draft

**Prompt:**

```text
Review the draft below against my chosen question and scenario. Identify inaccuracies, missing reasoning, vague claims and unsupported assumptions.
For each concern, explain why it matters and how I could check it. Include a counterexample or alternative interpretation. Do not rewrite the answer yet.
Question: How can fundamental software engineering principles help create a reliable and user-friendly university study room booking system?
Scenario: A fictional university study room booking system for students and administrators. Students currently contact staff to reserve rooms, which wastes time and may create booking conflicts. Each booking must not exceed two hours, and overlapping active bookings for the same room must be prevented. The main risk is that a software error could allow two students to reserve the same room at the same time. The university, booking problems, and development team are fictional.
Draft:

# Fundamental Engineering Principles: Smart Campus Study Room Booking System

## Introduction

Fundamental software engineering principles help developers create software that is reliable, understandable, maintainable, and useful. In this assignment, these principles are applied to a fictional university study room booking system. The system allows students to check room availability, make reservations, and cancel bookings. Administrators manage rooms and their availability.

## 1. Requirements Engineering

Requirements engineering is an important part of software development. Before creating the application, developers should understand what students and administrators need. They can collect information through interviews, questionnaires, and user feedback.

For this scenario, students need a simple interface that displays available rooms and allows reservations. Administrators need functions for managing rooms and preventing unavailable rooms from being booked.

However, collecting detailed requirements takes time. The development team must balance user needs with available resources.

## 2. Dependability and Reliability

Dependability is especially important because students must trust the booking system.

Two constraints are defined in this fictional scenario. First, each reservation must not exceed two hours. Second, two active bookings must never overlap for the same room.

Developers should validate booking requests before accepting them. However, checking existing reservations alone may not prevent conflicts if two students submit requests simultaneously. The system may need database transactions or another concurrency-control mechanism.

This adds implementation complexity but improves protection against duplicate bookings.

## 3. Development Process

A structured development process can help the team organize its work. The process includes collecting requirements, designing the application, implementing features, testing, and maintaining the software.

For this small project, an iterative approach may be suitable. Developers can first implement basic booking functionality and then improve the system using feedback.

The trade-off is that frequent changes may require additional testing and documentation.

## 4. Software Reuse

Software reuse allows developers to use existing components instead of creating every feature themselves.

For example, Python libraries and web frameworks could support database operations, input validation, and application development.

Reusing components may reduce development effort. However, external libraries can introduce dependencies, compatibility problems, and security risks. Therefore, developers should evaluate libraries before selecting them.

## 5. Testing and Quality Assurance

Testing helps identify errors before users experience them.

The team should test valid reservations, overlapping bookings, blocked rooms, and invalid booking durations. It should also test simultaneous booking requests because this situation is directly related to the main risk.

Automated tests can help developers check whether updates break existing functionality.

## Facts, Assumptions, and Verification

The university, users, booking problems, and development team are fictional assumptions. The two-hour limit is a proposed business rule, not a universal requirement.

Two general claims require verification using reliable sources:

1. Requirements engineering helps developers understand stakeholder needs and define system requirements.
2. Software reuse can reduce development effort but may introduce maintenance and dependency challenges.

These claims should be checked in software engineering textbooks or technical documentation before the final report.

## Conclusion

The project should prioritize clear requirements, reliable booking validation, iterative development, careful software reuse, and testing. The most important engineering decision is preventing overlapping reservations, including simultaneous requests. Although stronger reliability mechanisms increase complexity, they can reduce booking conflicts and improve user confidence.
```

**Response:**

```text
# Prompt B — Critical Review of the Draft

Topic 1.6: Fundamental Engineering Principles

Question: How can fundamental software engineering principles help create a reliable and user-friendly university study room booking system?

The draft covers relevant software engineering principles, but several claims require stronger explanations, clearer engineering decisions, or factual verification. The following concerns should be evaluated before writing the final report.

## Concern 1 — Requirements are not sufficiently specific

Problem: The draft recommends interviews, questionnaires, and feedback but does not explain how the collected information becomes testable software requirements.

Why it matters: Vague requirements can lead to misunderstandings between developers and users.

How to check: Consult a software engineering textbook's requirements engineering section. Check whether it discusses stakeholder requirements, specification, and validation.

Counterexample: Students may request a simple booking interface, while administrators require additional controls. Meeting student needs alone would not satisfy both groups.

## Concern 2 — Booking validation may not prevent simultaneous reservations

Problem: The draft suggests using database transactions or concurrency control but does not explain precisely how these mechanisms prevent duplicate bookings.

Why it matters: Two students might check the same room simultaneously, both see it as available, and both submit successful reservations.

How to check: Review database documentation about transactions, isolation levels, and concurrent updates. Test two simultaneous booking requests.

Counterexample: A transaction alone does not guarantee safety if the system allows both requests to read availability before either reservation is committed.

## Concern 3 — Booking constraints need clearer definitions

Problem: The draft mentions a maximum two-hour duration and overlapping reservations but does not explain zero-duration bookings, boundary times, or cancelled reservations.

Why it matters: Incomplete business rules can produce unexpected behavior.

How to check: Define precise acceptance criteria and test boundary cases.

Counterexample: A reservation ending at 12:00 and another starting at 12:00 should normally be allowed. The system must distinguish this situation from a genuine overlap.

## Concern 4 — The development approach is insufficiently justified

Problem: The draft recommends iterative development without comparing it with another reasonable development approach.

Why it matters: Engineering decisions should consider project size, uncertainty, available resources, and maintenance requirements.

How to check: Compare iterative and plan-driven development in a software engineering reference.

Alternative interpretation: A small project with stable requirements might benefit from more upfront planning rather than frequent iterations.

## Concern 5 — Software reuse claims are too general

Problem: The draft claims that Python libraries and frameworks may reduce development effort, but no specific component or selection criteria are provided.

Why it matters: Reusable software may save implementation effort while creating dependency, maintenance, or security challenges.

How to check: Examine official framework documentation, dependency management guidance, and software reuse discussions in engineering literature.

Counterexample: Introducing a complicated framework for a very small application could increase maintenance work rather than reduce it.

## Concern 6 — Testing strategy lacks measurable acceptance criteria

Problem: The draft recommends testing different booking situations but does not define expected results or distinguish testing levels.

Why it matters: A list of test situations does not demonstrate that the system meets its requirements.

How to check: Create test cases containing inputs, expected results, and observed results. Review software testing principles in a textbook.

Counterexample: A system could pass ordinary booking tests but still fail when two users submit reservations simultaneously.

## Concern 7 — User-friendliness is not evaluated

Problem: The chosen question includes user-friendliness, but the draft focuses mainly on correctness and reliability.

Why it matters: Software can process reservations correctly while remaining difficult to understand or navigate.

How to check: Define usability tasks and test them with representative student and administrator users.

Counterexample: A student might successfully reserve a room but misunderstand the confirmation screen and accidentally submit another request.

## Concern 8 — Facts and assumptions need stronger separation

Problem: The draft labels the university and development team as fictional but introduces blocked rooms, Python technologies, and particular development practices without clearly identifying whether they are requirements or proposals.

Why it matters: Readers should distinguish established engineering knowledge from decisions made for a fictional scenario.

How to check: Compare each claim with the scenario, original requirements, and technical sources. Label unsupported project details as assumptions or proposed design choices.

Alternative interpretation: The university might use another programming language, or administrators might not need a blocked-room feature in the first version.

## Overall Assessment

The draft provides a useful starting point, but its main weakness is that several recommendations are not connected to measurable engineering decisions.

The most important areas for improvement are concurrency control, precise booking constraints, requirements validation, and testing.

The final analysis should explain at least two engineering decisions, compare realistic alternatives, and connect each decision to the fictional scenario.

The following factual claims particularly need independent verification:

1. Requirements engineering helps identify, specify, and validate stakeholder needs.
2. Software reuse can reduce development effort but may introduce dependency and maintenance challenges.
3. Database transactions require appropriate concurrency-control behavior to prevent conflicting operations.

This critique is not independent evidence. Each concern should be accepted, qualified, or rejected with a reason. Any factual claim used in the final report must be verified using sources that have actually been opened.
```

### B3 — Revision (Prompt C)

- **Tool:** ChatGPT
- **Model:** GPT-6
- **Date:** 2026-10-11
- **Purpose:** revision using my decisions and verified evidence

**Prompt:**

```text
Revise the draft using my review decisions and source notes below. Keep the answer relevant to my scenario and preserve uncertainty where evidence is limited.

My decisions:
1. ACCEPT concern 1: Requirements must become measurable acceptance criteria, not just feedback.
2. ACCEPT concern 2: A simple availability check cannot guarantee protection against simultaneous bookings.
3. ACCEPT concern 3: Define invalid durations, cancelled bookings, and back-to-back booking boundaries.
4. QUALIFY concern 4: Iterative development is appropriate, but the project also requires initial planning and clear requirements.
5. QUALIFY concern 5: Reusable Python libraries may reduce development effort, but their suitability and maintenance costs must be evaluated.
6. ACCEPT concern 6: Tests need specific inputs and expected results, including concurrent booking cases.
7. ACCEPT concern 7: Usability should be evaluated through student and administrator tasks.
8. ACCEPT concern 8: Fictional assumptions and proposed technology choices must be clearly separated from factual engineering claims.

Verified evidence:
Source 1: IEEE Computer Society, Software Requirements, Course CSE001.
https://iln.ieee.org/Public/ContentDetails.aspx?id=8D866DF4BB054D7FB0F73DB13E4D6E30
Access date: 2026-10-11.
The course description identifies four requirements engineering activities: elicitation, analysis, specification, and validation.
Decision: KEEP the claim that requirements engineering helps define stakeholder needs.

Source 2: PostgreSQL Global Development Group, PostgreSQL 14 Documentation, Section 13.2.1 (Read Committed) and Section 13.2.3 (Serializable).
https://www.postgresql.org/docs/14/transaction-iso.html
Access date: 2026-10-11.
Read Committed can permit concurrency anomalies. Serializable provides stronger isolation but may cause serialization failures requiring transaction retries.
Decision: QUALIFY the claim that database transactions prevent booking conflicts. Correct business rules and transaction handling are still required.

Draft:

# Fundamental Engineering Principles: Smart Campus Study Room Booking System

## Introduction

Fundamental software engineering principles help developers create software that is reliable, understandable, maintainable, and useful. In this assignment, these principles are applied to a fictional university study room booking system. The system allows students to check room availability, make reservations, and cancel bookings. Administrators manage rooms and their availability.

## 1. Requirements Engineering

Requirements engineering is an important part of software development. Before creating the application, developers should understand what students and administrators need. They can collect information through interviews, questionnaires, and user feedback.

For this scenario, students need a simple interface that displays available rooms and allows reservations. Administrators need functions for managing rooms and preventing unavailable rooms from being booked.

However, collecting detailed requirements takes time. The development team must balance user needs with available resources.

## 2. Dependability and Reliability

Dependability is especially important because students must trust the booking system.

Two constraints are defined in this fictional scenario. First, each reservation must not exceed two hours. Second, two active bookings must never overlap for the same room.

Developers should validate booking requests before accepting them. However, checking existing reservations alone may not prevent conflicts if two students submit requests simultaneously. The system may need database transactions or another concurrency-control mechanism.

This adds implementation complexity but improves protection against duplicate bookings.

## 3. Development Process

A structured development process can help the team organize its work. The process includes collecting requirements, designing the application, implementing features, testing, and maintaining the software.

For this small project, an iterative approach may be suitable. Developers can first implement basic booking functionality and then improve the system using feedback.

The trade-off is that frequent changes may require additional testing and documentation.

## 4. Software Reuse

Software reuse allows developers to use existing components instead of creating every feature themselves.

For example, Python libraries and web frameworks could support database operations, input validation, and application development.

Reusing components may reduce development effort. However, external libraries can introduce dependencies, compatibility problems, and security risks. Therefore, developers should evaluate libraries before selecting them.

## 5. Testing and Quality Assurance

Testing helps identify errors before users experience them.

The team should test valid reservations, overlapping bookings, blocked rooms, and invalid booking durations. It should also test simultaneous booking requests because this situation is directly related to the main risk.

Automated tests can help developers check whether updates break existing functionality.

## Facts, Assumptions, and Verification

The university, users, booking problems, and development team are fictional assumptions. The two-hour limit is a proposed business rule, not a universal requirement.

Two general claims require verification using reliable sources:

1. Requirements engineering helps developers understand stakeholder needs and define system requirements.
2. Software reuse can reduce development effort but may introduce maintenance and dependency challenges.

These claims should be checked in software engineering textbooks or technical documentation before the final report.

## Conclusion

The project should prioritize clear requirements, reliable booking validation, iterative development, careful software reuse, and testing. The most important engineering decision is preventing overlapping reservations, including simultaneous requests. Although stronger reliability mechanisms increase complexity, they can reduce booking conflicts and improve user confidence.

Show what you changed and why. Use only the sources I supplied. Flag remaining gaps instead of inventing details.
```

**Response:**

```text
# Fundamental Engineering Principles: Smart Campus Study Room Booking System

## Introduction

This analysis applies software engineering principles to a fictional university study room booking system. Students would view availability, reserve rooms, and cancel reservations; administrators would manage rooms. The university, its current manual process, the development team, and the proposed application are fictional. The question is how to make this system reliable and easy to use without creating unnecessary complexity.

## Requirements Engineering

The IEEE Computer Society's Software Requirements course description identifies elicitation, analysis, specification, and validation as four requirements engineering activities. For this project, developers could interview students and administrators, compare their needs, document precise rules, and ask both groups to review them.

A measurable requirement is: a booking duration must be greater than zero and no more than 120 minutes. Another is: a new active booking must be rejected if its time overlaps an existing active booking for the same room. Using half-open intervals, bookings from 10:00 to 11:00 and from 11:00 to 12:00 do not overlap. Cancelled bookings would not block future reservations. These boundary and cancellation rules are proposed clarifications, not facts established by IEEE.

## Dependability and Reliability

The first engineering decision is to enforce booking rules when a reservation is saved, rather than trusting an earlier availability screen. Two students could otherwise see the same free room before either booking is recorded. A transaction must check for conflicts and save the new booking consistently.

PostgreSQL documentation explains that Read Committed permits certain concurrency anomalies, while Serializable gives stronger guarantees for successfully committed transactions. Therefore, PostgreSQL Serializable is one possible design choice, provided the application handles serialization failures by retrying the entire transaction and rechecking the booking rules. This offers stronger protection but increases implementation and testing effort. Simply saying "use transactions" is not a sufficient design.

## Development, Reuse, and Testing

The second engineering decision is to use a small, iterative development process with an initial requirements plan. The team could build viewing and booking features first, then test cancellation and usability. Iteration allows feedback, but frequent changes require retesting and clear documentation. This is a project recommendation, not a claim verified by the two sources.

Python frameworks are another possible choice, not an established requirement. Any reuse decision should consider simplicity, maintenance, and dependency risks; the supplied sources do not establish that reuse would save time here.

Acceptance tests should specify inputs and expected outcomes: a 120-minute booking succeeds if available; a zero-minute or 121-minute request fails; back-to-back reservations succeed; overlapping active bookings fail; and simultaneous requests must not both succeed. Students and administrators should also try key tasks and explain confusing screens.

## Conclusion

The proposed priorities are testable requirements and consistent booking decisions. Stronger concurrency controls may cost more effort, and usability has not yet been tested with real users. These limitations should remain explicit until a prototype and its tests provide evidence.

## Changes Made and Why

1. Clarified requirements: Added measurable booking duration limits, overlap rules, cancellation behavior, and boundary conditions because the original draft was too general.
2. Improved concurrency reasoning: Explained why availability checks alone are insufficient and why Serializable transactions require correct business logic and retry handling.
3. Qualified development choices: Presented iterative development and Python reuse as proposals rather than universally proven solutions.
4. Strengthened testing: Added expected results for valid, invalid, boundary, and simultaneous booking requests.
5. Separated facts from assumptions: Distinguished IEEE and PostgreSQL evidence from fictional project requirements and proposed design decisions.

## Remaining Gaps

- No working prototype has been tested for concurrent bookings.
- The two supplied sources do not demonstrate that Python reuse reduces development time in this particular system.
- Usability has not been evaluated with actual students or administrators.
- Database performance and retry behavior have not been measured.
```

## 9. Appendix C — Evidence tables

### Verification table

<!-- At least two complete rows. Source and locator: title + page / slide / section / chapter,
     or title + URL + access date (YYYY-MM-DD). Decision: keep, qualify or reject — one word. -->

| AI claim | Source and locator | Evidence found | Decision |
| --- | --- | --- | --- |
| Before creating the application, developers should understand what students and administrators need. | IEEE Computer Society, Software Requirements, Course CSE001. https://iln.ieee.org/Public/ContentDetails.aspx?id=8D866DF4BB054D7FB0F73DB13E4D6E30 (Accessed: 2026-10-11) | The source identifies requirements elicitation, analysis, specification, and validation. It emphasizes understanding user needs before software development. | keep |
| However, checking existing reservations alone may not prevent conflicts if two students submit requests simultaneously. | PostgreSQL 14 Documentation, Sections 13.2.1 and 13.2.3. https://www.postgresql.org/docs/14/transaction-iso.html (Accessed: 2026-10-11) | Read Committed can allow concurrency anomalies. Serializable provides stronger isolation, but correct transaction logic and retry handling are still necessary. | qualify |
### Change log

<!-- At least two substantive revisions. Your final version must differ from the AI wording,
     and the reason must say which evidence or scenario constraint made you change it. -->

| AI wording / suggestion | Your final version | Reason for change |
| --- | --- | --- |
| Developers should validate booking requests before accepting them. | Second, I would validate and commit a reservation as one controlled database operation. | The original advice did not adequately address simultaneous reservations. PostgreSQL documentation shows why concurrency control matters, and the scenario requires preventing overlapping bookings. |
| First, each reservation must not exceed two hours. Second, two active bookings must never overlap for the same room. | A request lasting zero or 121 minutes must be rejected. Using start-inclusive, end-exclusive intervals, one booking ending at 11:00 would not conflict with another starting at 11:00. | The original rules did not define invalid durations or adjacent booking boundaries. Specific conditions make the scenario requirements measurable and testable. |
| The team should test valid reservations, overlapping bookings, blocked rooms, and invalid booking durations. | Acceptance tests should confirm valid, invalid, adjacent, cancelled and simultaneous bookings; usability tests should ask representative users to complete reservations without confusion. | Prompt B identified missing expected outcomes and usability evaluation. The revised tests better address the booking conflict risk and both user groups. |