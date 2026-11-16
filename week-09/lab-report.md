# Week 09 — Lab Report: canBook as a Tool

Fill in every section. Do not delete or renumber the headings: the README and the checker point at
them. Replace every `<!-- comment -->` with your own text (comments are ignored by the checker).

**Name:** Alibyek Molshylykh
**Student ID:** 24B030054
**GitHub:** Alibyek1122

---

## 1. Setup

| | |
| --- | --- |
| Assistant (frozen for the whole lab) | ChatGPT |
| Exact model (or "not displayed") | GPT-6 astra |
| Three fresh chats for R1, R2, R3? (yes / no) | yes |
| Python version (`python --version`) | Python 3.13.7 |

## 2. Your tool definition — a reason for every constraint

Paste your final `tool/check_room.json`, then fill the table: one row per constraint you wrote.

```
{
  "name": "check_room",
  "description": "Smart Campus is a room booking availability checker that helps users check whether a room is available at a selected time. Time is measured in minutes from midnight, within the 0–1440 range. The tool checks room availability, existing bookings, time limits, and blocked rooms. It does not save a booking.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "start": { "type": "integer", "minimum": 0, "maximum": 1440 },
      "end": { "type": "integer", "minimum": 0, "maximum": 1440 },
      "now": { "type": "integer", "minimum": 0, "maximum": 1440 },
      "blocked": { "type": "boolean" },
      "bookings": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "start": { "type": "integer", "minimum": 0, "maximum": 1440 },
            "end": { "type": "integer", "minimum": 0, "maximum": 1440 }
          },
          "required": ["start", "end"],
          "additionalProperties": false
        }
      }
    },
    "required": ["start", "end", "now", "blocked", "bookings"],
    "additionalProperties": false
  }
}

```

| Field | Constraint | What goes wrong without it |
| --- | --- | --- |
| Input | `"type": "object"` | A value such as `[]` could pass without providing named arguments. |
| Input | `"required": ["start", "end", "now", "blocked", "bookings"]` | A call could omit `now`, as in S04, leaving the current time unknown. |
| Input | `"additionalProperties": false` | An unsupported argument such as `"room": "204"` in S05 could pass validation. |
| `start`, `end`, `now` | `"type": "integer"` | A clock string such as `"11:00"` in S03 or a fractional minute such as `600.5` in S10 could pass. |
| `start`, `end`, `now` | `"minimum": 0` | A negative time such as `-30` in S06 could pass. |
| `start`, `end`, `now` | `"maximum": 1440` | A time beyond the end of the day, such as `1500` in S07, could pass. |
| `blocked` | `"type": "boolean"` | The string `"false"` in S09 could pass where the function expects the Boolean value `false`. |
| `bookings` | `"type": "array"` | A single object could pass where the function expects a list. An empty list is valid in S02. |
| `bookings` entries | `"items"` applies the booking schema to every entry | An invalid entry could pass even though the outer value is an array. |
| Each booking | `"type": "object"` | A pair such as `[660, 720]` in S12 could pass without named fields. |
| Each booking | `"required": ["start", "end"]` | A booking could omit its end time, as in S08, leaving the interval incomplete. |
| Each booking | `"additionalProperties": false` | A misspelled or unsupported field inside a booking could go unnoticed. |
| Booking `start` and `end` | `"type": "integer"` | An existing booking could contain a fractional minute or a clock string. |
| Booking `start` and `end` | `"minimum": 0` | An existing booking could contain a negative minute. |
| Booking `start` and `end` | `"maximum": 1440` | An existing booking could contain a minute beyond the end of the day. |

## 3. The twelve calls — first run and final run

Your **first** run's S verdicts (before any fix), and your final ones. For every case that changed,
say what you changed.

| Case | First run | Final run | What you changed |
| --- | --- | --- | --- |
| S01 | PASS | PASS | No change. |
| S02 | PASS | PASS | No change. |
| S03 | PASS | PASS | No change. |
| S04 | PASS | PASS | No change. |
| S05 | PASS | PASS | No change. |
| S06 | PASS | PASS | No change. |
| S07 | PASS | PASS | No change. |
| S08 | PASS | PASS | No change. |
| S09 | PASS | PASS | No change. |
| S10 | PASS | PASS | No change. |
| S11 | PASS | PASS | No change. |
| S12 | PASS | PASS | No change. |

## 4. Function calling — what the model wrote

For each request, paste the model's reply exactly, then judge it against the request.

### R1

```
{"name":"check_room","arguments":{"start":600,"end":660,"now":540,"blocked":false,"bookings":[{"start":660,"end":720}]}}

```

<!-- Match? If F3 failed, which argument differs, and who was wrong: the model or the request? -->

All five arguments match the request. The requested slot ends at 660, exactly when the existing booking starts. Touching endpoints are allowed, so the expected canBook result is Available.


### R2

```
{"name":"check_room","arguments":{"start":840,"end":990,"now":810,"blocked":true,"bookings":[]}}

```

<!-- Same. R2 is a call that SHOULD be made, although canBook will say Unavailable. Did the model refuse to call? -->

All five arguments match the request. The call is valid under the schema. The expected canBook result is Unavailable because the room is blocked and the requested duration is 150 minutes, exceeding the 120-minute limit.

### R3

```
What exact two-hour slot tomorrow afternoon should I check, what time is it now, is the room blocked, and what bookings does it already have for tomorrow?


```

<!-- What information was missing? Did the model ask, or call? If it called, which values did it invent, and from where? -->
The model asked for the exact time slot, the current time, the room's blocked status, and its existing bookings. It interpreted “a couple of hours” as two hours, but it did not invent start or end times or send a tool call.

## 5. What the schema cannot check

<!-- Name the acceptance criteria (AC1-AC6, README section 3) that a JSON Schema with the allowed keywords cannot
     enforce, and say why for each. At least two, by their AC number. Which part of AC1 CAN the schema enforce? -->

- **AC1 — time range and order.** The schema can enforce that `start`, `end`, and `now` are whole minutes between 0 and 1440 inclusive. The allowed keywords cannot compare two fields, so `canBook` must check `start < end` and `start > now`.
- **AC2 — maximum duration.** The schema cannot calculate `end - start`. In R2, 840 and 990 are both valid minute values, but their difference is 150 minutes. `canBook` rejects the request because the limit is 120 minutes.
- **AC3 — blocked room.** The schema accepts both `true` and `false` for `blocked`. In R2, `blocked: true` is valid input. `canBook` uses that value to return Unavailable.
- **AC4 — overlapping bookings.** The schema checks the structure of each booking. `canBook` compares the intervals to detect overlaps and allow touching endpoints. In R1, the request ends at 660 and the existing booking starts at 660, so the endpoints only touch.
- **AC5 — unchanged booking data.** The schema validates the input before the call. A test must compare the bookings before and after the call to verify that the function leaves them unchanged.
- **AC6 — UI feedback.** The schema cannot inspect what the user sees. Desktop and mobile UI checks must verify that the page clearly displays Available or Unavailable.

## 6. Permissions — allow, ask or block

| # | Action | Decision (allow / ask / block) | Reason (the risk, in one sentence or more) |
| --- | --- | --- | --- |
| A1 | call `check_room` with the times the user just typed | allow | The tool only checks availability. If any required input is missing, the agent should ask for it before calling the tool. |
| A2 | read `week-08/app/src/booking.ts` | allow | Reading this project file lets the agent verify the booking rules without changing the code. |
| A3 | edit `booking.ts` to raise the 120-minute limit to 180 | block | AC2 sets a 120-minute limit, and a request for a longer booking does not authorize changing the rule for every user. |
| A4 | run `npm test` in `week-08/app` | allow | Running the project's reviewed test script helps detect regressions in the booking rules. |
| A5 | run `git reset --hard` to undo its own last three edits | block | A hard reset can discard my uncommitted changes together with the agent's edits. |
| A6 | `git commit` its change on the `week-09` branch | ask | I want to review the staged diff first because the commit could include unrelated files. |
| A7 | `git push` to `main` | block | A direct push would bypass the required pull request from `week-09` and publish changes before review. |
| A8 | send the contents of `.env` to an MCP server it found online | block | The file may contain passwords or API keys, and sending it would expose them to an unverified server. |

## 7. Checkpoint

<!-- The commit you would make before letting such an agent edit anything: its real SHA (git log --oneline),
     the exact command that returns you to it, and what that command would throw away. -->

My checkpoint is commit 7a15e4a, "week-09: add practice starter and checkpoint". It records the starter files before I edited the tool definition.

On the week-09 branch, git reset --hard 7a15e4a would move the branch back to that commit and restore its tracked files. It would discard uncommitted changes to tracked files and move the branch tip behind my later schema and model-response commits.

## 8. Checker output

Paste the **whole** output of your last `python tests/check_tool.py`, unedited.

```
PASS  D1    tool/check_room.json exists and is valid JSON
PASS  D2    has name, description and inputSchema
PASS  D3    name is exactly "check_room"
PASS  D4    description: 25+ words, says minutes, 1440, and that it does not save
PASS  D5    inputSchema: an object with exactly the five fields, all required
PASS  D6    inputSchema uses only the keywords listed in README section 5
PASS  S01   the R1 call, valid -> accept
PASS  S02   no existing bookings: bookings = [] -> accept
PASS  S03   end as a string: "11:00" -> refuse
PASS  S04   now missing -> refuse
PASS  S05   an extra field: "room": "204" -> refuse
PASS  S06   start below the day: -30 -> refuse
PASS  S07   end beyond the day: 1500 -> refuse
PASS  S08   a booking with no end: {start: 660} -> refuse
PASS  S09   blocked as a string: "false" -> refuse
PASS  S10   start not a whole minute: 600.5 -> refuse
PASS  S11   end at the end of the day: 1440 -> accept
PASS  S12   a booking as a pair: [660, 720] -> refuse
PASS  F1    calls/r1.json: a call to check_room
PASS  F2    calls/r1.json: arguments valid against your schema
PASS  F3    calls/r1.json: arguments equal the expected ones (README section 5, Part 2)
PASS  F4    calls/r2.json: a call to check_room
PASS  F5    calls/r2.json: arguments valid against your schema
PASS  F6    calls/r2.json: arguments equal the expected ones (README section 5, Part 2)
PASS  F7    calls/r3: exactly one of r3.json (it called) or r3.txt (it asked), not empty
PASS  L1    section 5 names at least two acceptance criteria (AC1-AC6) the schema cannot check
PASS  L2    section 6: A1-A8 each have allow / ask / block and a reason of 5+ words
PASS  L3    section 7 names the checkpoint commit (a SHA)
PASS  L4    section 10: a conclusion of 80-150 words
PASS  L5    AI_USAGE.md filled in (a tool row, and signed)

SUMMARY: 30 PASS · 0 FAIL · 0 ERROR  (of 30 checks)
Paste this whole output into lab-report.md section 8, and these three numbers into submission.yml.


```

## 9. What still fails

<!-- Every check in submission.yml known_fails, with the reason. "None" if all 30 pass. -->

None

## 10. Conclusion (80–150 words)

<!-- What did you learn about the line between the schema, the model and the function? Be specific:
     name a case, a request or an action. "Tool definitions are important" is worth nothing. -->


In S03, the schema rejected “11:00” because the end field requires a whole number of minutes since midnight, so the correct value for 11:00 is 660. In R2, the model converted 16:30 to 990 and placed it in the end field, which made that part of the call valid. The expected canBook result was Unavailable because the requested slot lasted 150 minutes and the room was blocked. In R3, “tomorrow afternoon” left the start time unclear, so the model asked for the exact slot, current time, room status, and existing bookings before making a call.

