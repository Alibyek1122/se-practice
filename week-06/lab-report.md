Week 06 — Lab report
Name: Alibyek Molshylykh
Group: Monday 16:00–19:00
Date: 18.10.2026
Evidence status: This report is prepared from the Bolt messages, test statements and screenshots available in the conversation. Several source exports and screenshots have not been supplied. Items marked NOT VERIFIED must be checked on the user's computer. Do not replace missing evidence with invented results. ChatGPT helped draft the report, as disclosed in AI_USAGE.md.

1. Setup
	
Tool	Bolt.new
Exact model (as Bolt shows it, or not displayed)	not displayed
Bolt project link (or not shared, and why)	not shared — no share link was supplied for this report; the working project was shown in screenshots.
Browser and version	Google Chrome (exact version not verified; check chrome://settings/help)
If you could not use Bolt.new: the tool you used instead, and why	Not applicable; Bolt.new was used.


2. Task 1 — define before generating
Two predictions, written BEFORE you send the first prompt. The risks below were suggested in the earlier chat. The report does not establish whether they were entered into the repository before generation; verify the Git history before claiming that timing.
#	What I expect to go wrong	AC it concerns	Was I right? (after Task 3)
1	The app may validate the supplied current time or boundary conditions incorrectly.	AC1	Not demonstrated. T6 later correctly rejected a request starting exactly at 09:00.
2	The app may handle a booking overlap or a touching endpoint incorrectly.	AC4	The apparent T2 failure was a test-setup mistake: Atlas 101 was selected instead of Borealis 220. On Borealis 220, T2 returned Unavailable.


The initial prompt exactly as I sent it — the draft prepared in the earlier chat is reproduced below. Confirm its exact punctuation against Bolt history if it differed when sent:
Build a small responsive Smart Campus Room Availability Checker. Requirements: AC1: Accept a candidate interval only when 0 ≤ start < end ≤ 1440 and start is after the supplied current time.
AC2: Reject a booking longer than 120 minutes.
AC3: Reject the request when the selected room is blocked.
AC4: Reject any interval that overlaps an existing booking; touching endpoints are allowed.
AC5: Show a clear Available / Unavailable decision without changing the existing booking data.
AC6: The page remains usable at desktop and narrow/mobile width and gives understandable validation feedback. Use fictional sample data only. Keep the implementation simple and within one-page scope. Do not add authentication, backend services, analytics, or unrelated features. After building, briefly list the main files/components you created.
3. Task 2 — prototype v1
v1 export saved in original/ and screenshot saved as evidence/v1.png before any cleanup prompt: no — the v1 screenshot is available, but the initial source export has not been supplied and original/ remains empty in this package. If the untouched v1 is present on the student's computer, copy that exact original export to original/ and then change this statement based on evidence.
Bolt's list of the files/components it created, pasted unedited:
src/types.ts — shared types (Room, Booking, Interval, Decision)
src/data.ts — fictional sample rooms and bookings
src/bookingLogic.ts — the rule engine (AC1–AC5): time validation, 120-min max, blocked-room check, overlap with touching endpoints allowed
src/App.tsx — the responsive UI (room picker, time inputs, decision card, existing-bookings sidebar)
What v1 does — one line per thing that works, or visibly does not:
- The page allows a room, start time, end time and explicit current time to be supplied.
- The generated interface shows availability feedback and a room's fictional booking information.
- The first screenshot shows the selected room name repeated in the result card (a usability-cleanup candidate).
- Bolt later verified that src/bookingLogic.ts rejects an actual overlap on Borealis 220. The earlier T2 report was caused by using Atlas 101, not evidence of a broken overlap function.
- The initial export and the complete nine-case v1 test record still need to be recovered or honestly reported as missing.
Repair prompt (none confirmed before the v1 screenshot):
No initial-build repair prompt was reported.
4. Task 3 — the nine cases
Base for every case unless the row says otherwise: current time 09:00, room not blocked, the room's only booking 10:00–11:00. Borealis 220 was the room Bolt identified with the required 10:00–11:00 booking. Do not mark a missing test as "Not testable" unless the page genuinely cannot set up the test.
#	Case	What you set up and request	Expected	AC	Result on v1	Result on final	Final screenshot
T1	Touching	11:00–12:00	Available	AC4	Available	Available	final-T1.png
T2	Overlap	10:30–11:30	Unavailable	AC4	Available	Unavailable	final-T2.png
T3	Blocked	11:00–12:00, room blocked	Unavailable	AC3	NOT VERIFIED — run the v1 case	NOT VERIFIED — run the final case	final-T3.png
T4	Exactly 2 hours	12:00–14:00	Available	AC2	Unavailable	Available	final-T4.png
T5	Over 2 hours	12:00–14:01	Unavailable	AC2	Unavailable	Unavailable	final-T5.png
T6	Starts now	09:00–09:30 (current time 09:00)	Unavailable	AC1	NOT VERIFIED — run the v1 case	Unavailable	final-T6.png
T7	Reversed times	12:00–11:00, and the page says why	Unavailable	AC1, AC6	Unavailable	Unavailable	final-T7.png
T8	Same check twice	T1, then T1 again without reloading	Available	AC5	NOT VERIFIED — run the v1 case	Available	final-T8.png
T9	Narrow screen	T1 at about 375 px wide	Available	AC6	NOT VERIFIED — run the v1 case	NOT VERIFIED — 440 px was shown, not final 375 px evidence	final-T9.png


Important qualification: The first v1 observations for T2 and T4 were typed notes, not fully documented tests under the fixed Borealis 220 / 09:00 baseline. The 440 px mobile screenshot confirms an Available result at that width only. The entries above deliberately preserve those limitations rather than rewriting the test history.
5. Issue log — cleanup targets
#	Issue	Evidence: steps → expected → observed	Priority	Decision
1	Suspected AC4 overlap defect due to wrong selected room	With now 09:00 and request 10:30–11:30, the initial notes reported Available although T2 expects Unavailable for a room booked 10:00–11:00. Bolt inspected src/bookingLogic.ts and identified the mismatch: Atlas 101 had no booking in that interval. Retesting Borealis 220 returned Unavailable. Screenshot issue-1.png documents the corrected room and result, not a confirmed v1 code defect.	Medium	Reject an unnecessary overlap-function change; correct the test setup.
2	Repeated selected-room name in the result card (AC6)	In the initial screenshot the room name appears in the picker and again in the status line. The name also appeared near the picker in the metadata. Expected: a clear decision without distracting duplication. Observed: Available — Borealis 220 .... Screenshot issue-2.png shows v1's duplicate display.	Low	Accept a small presentation-only cleanup.


6. Task 4 — cleanup with focused prompts
Functional fix prompt, as sent, and Bolt's answer:
Prompt sent:
In the current prototype, setting the current time to 09:00 with an existing booking from 10:00 to 11:00 and requesting 10:30–11:30 produces Available, but AC4 requires Unavailable because the intervals overlap. Make the smallest change that fixes this behavior. Preserve the other acceptance criteria. Explain which file/component you changed and why.
Bolt's final text (provided in the chat; the intermediate tool events were also visible in Bolt):
I tested the exact scenario you described, and the current code already returns Unavailable — not Available. I don't want to make a change that would break correct behavior, so let me show you the evidence.

Test results (running the actual logic on disk):

The only room with a 10:00–11:00 booking is Borealis 220 (booking b3: 600–660 min).
With current time = 09:00 and request 10:30–11:30 on Borealis 220:
overlaps({630,690}, {600,660}) → true
evaluateBooking(...) → unavailable → "Overlaps existing booking by R. Lindqvist at 10:00 – 11:00 (Office hours)."
So AC4 is already satisfied for the room that carries the 10:00–11:00 booking.

The likely source of the confusion: the page's default-selected room is Atlas 101, which has bookings at 09:00–10:00 and 13:00–14:00 — no 10:00–11:00 booking. For Atlas 101, 10:30–11:30 with now=09:00 is genuinely free, so "Available" is the correct answer there, not a bug. The overlap check is room-scoped, as AC4 intends ("the selected room").

I'd rather not alter overlaps() or evaluateBooking() since they're already correct — changing them would risk regressing the "touching endpoints allowed" rule or producing false positives on rooms that don't own the booking.

Could you confirm which room you had selected when you saw "Available"? If it was Atlas 101 (the default), that result is correct and no fix is needed. If it was Borealis 220 and you still saw Available, let me know and I'll dig deeper — but on the code as it stands on disk, that case returns Unavailable.
Cleanup prompt, as sent, and Bolt's answer:
Prompt sent:
Review only the selected-room context in the availability result area for unnecessary duplication, confusing naming, or UI feedback problems. Suggest one small cleanup. Do not add features or redesign the whole application. Implement it only if it preserves AC1–AC6.
Bolt's answer — only the following excerpt was visible in the screenshots supplied. Before submitting, copy the entire, unedited answer from Bolt into this block (the lab explicitly requires the full response):
Issue: The selected room's name is shown three times in close vertical proximity within the checker panel — in the dropdown, in the meta row below it ("Borealis 220 — Borealis Wing · Seats 12"), and again in the DecisionCard header ("Available — Borealis 220 · 14:00 – 15:00"). The third occurrence is redundant: the room is already prominently identified directly above, and it never differs from the picker selection. Repeating it adds noise without adding information, and the result area should focus on the variable part (the requested slot and the decision).

Cleanup: Drop the redundant roomName from the DecisionCard header and its prop, leaving the status + requested interval. This is purely presentational — it touches no acceptance-criteria logic (AC1–AC6 all live in bookingLogic.ts), and the decision text still clearly reflects the selected room's availability via the status word and the conflict reasons (which name the conflicting booking's owner and interval).
Every change or suggestion Bolt made, judged.
#	What Bolt changed or suggested	accept / reject	Reason — cite the AC or the scope	Retest: which cases, result
1	Leave the overlap rule and evaluateBooking() unchanged: the reported failure came from testing the wrong room.	Reject the proposed need for a code fix; accept the finding.	AC4 applies to the selected room. Modifying correct overlap logic could wrongly reject a touching interval.	T2 on Borealis 220: Unavailable (PASS). T1 as part of T8: Available (PASS).
2	Remove the unnecessary roomName prop and duplicate room-name text from DecisionCard.	Accept.	AC6 requires clear feedback; the small UI change leaves AC1–AC5 unchanged and adds no out-of-scope feature.	T2: Unavailable (PASS); T4: Available (PASS); T5: Unavailable (PASS). Remaining screenshot evidence still incomplete.


7. Change log — v1 to final
The first row describes a test-procedure correction, not a source-code modification. Only the second row is a source-code change verified from the supplied Bolt response. If the instructor requires two code modifications, a further justified change and its complete regression evidence are needed.
#	Issue	Decision	Change (file or component)	Result after retest
1	T2 was initially checked against a room without the required booking.	Reject a false code fix; correct the test setup.	Test procedure and report: select Borealis 220 and set now to 09:00 so the 10:00–11:00 existing booking actually applies. No change to src/bookingLogic.ts.	T2: Unavailable (PASS); the suspected AC4 bug was not reproduced.
2	Repeated room name in the result header.	Accept the focused UI cleanup.	src/App.tsx: Bolt reported removing roomName from DecisionCard and its prop, keeping status + times.	T2: Unavailable (PASS); T4: Available (PASS); T5: Unavailable (PASS); T6–T8 were reported correct. T3 and 375 px T9 still need confirmation.


8. One generated component, in my own words
File: src/bookingLogic.ts
AI-assisted study draft: revise this explanation in your own words after opening the actual file.
Based on Bolt's explanation, this is the component responsible for deciding whether a requested interval can be used. The form provides a room, a start time, an end time and a supplied current time. The logic has to reject a start time that is not in the future, an invalid or reversed interval, a duration above 120 minutes, and a blocked room. It also compares the request with bookings belonging to the selected room. Two intervals overlap if they share actual minutes; merely touching at 11:00 should still be allowed. The function returns an availability decision and an explanation, but checking does not create another booking. This separation matters because the UI should display the result without silently modifying the fictional sample data. I would verify each condition against the actual exported code before presenting it in class.
9. What still fails, and what the criteria do not say
9.1 Checks I am keeping as FAIL or ERROR
This table was generated against the attached-file package, which is missing the user's local Bolt exports and several screenshots. Its check IDs must be refreshed after copying the package into the real repository and running the checker again.
Check	Why it stays
P1	The final Bolt source export has not been uploaded or copied into prototype/.
P2	Cannot verify the final export size or clean source until prototype/ exists.
P3	Cannot inspect the actual final code for out-of-scope features without the export.
O1	The genuine untouched Bolt v1 source export is missing from original/.
O2	Without both original and final exports, the code difference cannot be verified.
E3	Only genuine uploaded screenshots for final T1, T2, and T4 are available; the other case screenshots must be captured on the final app.
E4	The existing mobile screenshot shows 440 px, not a verified 375 px portrait case; final-T9.png is missing.
T3	There is no verified final run for the blocked-room scenario. It must be tested on the selected blocked room.
T9	The 440 px Available screenshot does not establish the requested 375 px test; final result is not declared.
L4	Four v1 cases (T3, T6, T8, T9) were not reported; do not label them Not testable without evidence that setup is impossible.
L8	The explanation draft exists, but the referenced real code file cannot be checked until the final source export is placed in prototype/.


9.2 The end of the day
I currently declare not-expressible because the demonstrated page used ordinary HH:MM time inputs, and there is no evidence that an end time of exactly 24:00 can be entered. AC1's mathematical upper boundary is 1440 minutes, so a 23:00–24:00 request should be valid if no other rule prevents it. A normal browser time control often ends at 23:59. This is a limitation of the current user interface rather than a reason to silently change AC1. If the exported page has an explicit end-of-day option, I will revise this assumption and provide a screenshot demonstrating it.
9.3 Which "now"?
The page has an editable Current time input. In the first screenshot it showed 13:30; in the later tests the user explicitly changed it to 09:00. It is therefore not enough to assume the computer's real time matches the test's supplied current time. T6 requires setting current time = 09:00 and checking a request starting at 09:00; the page then correctly reported, "Start time must be after the current time." This behavior was confirmed on the later version, but the identical v1 test result was not recorded.
10. Conclusion (120–180 words)
The first risks I considered were time validation (AC1) and overlap handling (AC4). The later browser tests did not establish a defect in either rule. The supposed T2 failure came from a mismatch in the selected room: Atlas 101 did not have the required 10:00–11:00 booking, while Borealis 220 did. Bolt verified that the request overlapped Borealis 220's booking, and I rejected an unnecessary logic change because it could have broken correct behavior. The genuine cleanup was smaller: the selected room appeared repeatedly in the interface, so Bolt removed its redundant name from the decision header. The difference between a polished prototype and a verified prototype is evidence. For example, T4 must accept exactly 120 minutes, while T5 must reject 121 minutes; both outcomes were checked with the supplied current time set to 09:00. The remaining missing exports, test records and narrow-screen screenshot must still be supplied before I can claim full compliance with AC1–AC6.