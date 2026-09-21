# Lab report — Practice #02: The Prompt Is an Engineering Input

**Name:** Molshylykh Alibyek
**Group:** Monday 16:00-19:00
**Date:** 21 sep 2026

> Fill in every section. **Do not delete or renumber the headings** — the grading pass reads them
> by number. If something did not happen, write "did not happen" and why; an empty section and a
> fabricated one are graded the same way.

---

## 1. The frozen experiment

| | |
| --- | --- |
| AI assistant | ChatGPT |
| Exact model name | GPT-5.6 Sol |
| Implementation language | Python |
| Date of the runs | 21 September 2026 |

**Non-Python students only:**

n/a — used Python

**Confirmations:**

- Each prompt was sent in a fresh chat: yes
- No follow-up questions were asked before Part 7: yes
- Every output was saved before any editing: yes
---

## 2. Prompt A — minimal

**Prompt sent** (should be exactly one sentence):

```text
Write Python code to analyze student marks.
```

**Assumptions the AI made that I never gave it** — list them, one per line.

1. It created a standalone script with its own sample marks instead of the required `analyze_marks` function.
2. It printed the results directly instead of returning a dictionary.
3. It added extra outputs such as number of valid marks, passed marks, and failed marks.

**Questions it should have asked and did not:**

1. What function name, signature, and return format are required?
2. How should invalid input, the pass threshold, and rounding be handled?

**Is the function named `analyze_marks` with the required signature?**

no — there is no callable named `analyze_marks`

**First impression before testing:**

The script ran and printed statistics, but it did not look like the required function-based solution.

---

## 3. Prompt B — structured context

**Prompt sent** (paste it in full, including any substitutions):

```text
You are a Python developer. Implement analyze_marks(marks, pass_mark=50). Return
average, highest, lowest, and pass_rate in a dictionary. Accept marks from 0 to 100;
raise ValueError for an empty list, non-numeric values, or out-of-range values. Use
no external libraries. Return code plus a short explanation.
```

**What B fixed compared to A:**

1. It specified the exact function name and signature: `analyze_marks(marks, pass_mark=50)`.
2. It specified the return values and validation rules, so the official harness could test the function.

**What B still leaves open:**

1. It does not clearly say whether a mark equal to `pass_mark` should pass.
2. It does not say how `pass_rate` should be rounded.

---

## 4. Prompt C — examples and tests

**What I appended to Prompt B:**

```text
Example: analyze_marks([40, 60, 80], 50) → average 60, highest 80, lowest 40,
pass_rate 66.67. Include tests for: one mark, decimals, custom pass_mark, empty list,
text value, and marks below 0 or above 100. State any remaining assumptions before
the code.
```

**Tests the AI wrote for itself** — 8 test runs: the worked example, one mark, decimals, custom pass_mark, empty list, text value, below 0, and above 100.

| Situation | Covered by the AI's tests? |
| --- | --- |
| one mark | Yes |
| decimals | Yes |
| custom pass_mark | Yes |
| empty list | Yes |
| text value | Yes |
| below 0 / above 100 | Yes |

**Do the AI's own tests pass against the AI's own code?**

yes

**Do they agree with the harness in section 6?**

yes — Prompt C passed all 6 official harness cases.

**Assumptions C stated explicitly before the code:**

Copy the exact assumptions from the original Prompt C response here. If the AI did not state any assumptions, write: `None stated explicitly.`

## 5. Prompt D — my combined prompt

**The complete prompt I wrote** (one message, sent to a fresh chat):

```text
You are a Python developer. Implement a function analyze_marks(marks, pass_mark=50).

The function must return one dictionary with exactly these four keys:
average, highest, lowest, and pass_rate.

Requirements:
- Marks may be integers or decimal numbers from 0 to 100 inclusive.
- A mark passes if it is greater than or equal to pass_mark.
- Raise ValueError if marks is empty.
- Raise ValueError if any mark is non-numeric.
- Raise ValueError if any mark is below 0 or above 100.
- Use no external libraries.
- Do not add extra features or input/output code.

Calculate pass_rate as:
passing marks / total marks * 100

Round pass_rate to 2 decimal places, so for example 2 passing marks out of 3 returns 66.67.

Example:
analyze_marks([40, 60, 80], 50)
should return:
{
    "average": 60,
    "highest": 80,
    "lowest": 40,
    "pass_rate": 66.67
}

Include tests for:
1. one mark
2. decimal marks
3. custom pass_mark
4. empty list
5. non-numeric value
6. marks below 0 or above 100

State any remaining assumptions before the code. Return the code and a short explanation.
```

**What I deliberately added that A, B and C did not have:**

1. I clearly stated that a mark equal to `pass_mark` also passes.
2. I required `pass_rate` to be rounded to 2 decimal places.
3. I required exactly four dictionary keys and no extra input/output features.

**The ambiguity I found in the specification, and how I resolved it inside Prompt D:**

The specification expects 66.67 for two passing marks out of three, but the exact result is 66.666.... I resolved this by clearly requiring `pass_rate` to be rounded to 2 decimal places.

## 6. Test results — the evidence

Six cases × four prompts. Verdicts are **PASS**, **FAIL** or **ERROR** only.

| # | Call | Required | A | B | C | D |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `analyze_marks([40, 60, 80], 50)` | avg 60 · high 80 · low 40 · rate 66.67 | ERROR | PASS | PASS | PASS |
| 2 | `analyze_marks([100], 50)` | avg 100 · high 100 · low 100 · rate 100 | ERROR | PASS | PASS | PASS |
| 3 | `analyze_marks([49.5, 50], 50)` | avg 49.75 · high 50 · low 49.5 · rate 50 | ERROR | PASS | PASS | PASS |
| 4 | `analyze_marks([], 50)` | raises ValueError | ERROR | PASS | PASS | PASS |
| 5 | `analyze_marks([40, "60"], 50)` | raises ValueError | ERROR | PASS | PASS | PASS |
| 6 | `analyze_marks([-1, 50, 101], 50)` | raises ValueError | ERROR | PASS | PASS | PASS |
| | **Totals** | | 0/6 | 6/6 | 6/6 | 6/6 |

**For every FAIL and ERROR above, one line: what was returned or raised instead.**

| Prompt | Case | What actually happened |
| --- | --- | --- |
| A | 1–6 | ERROR — `prompt_a.py` defines no callable named `analyze_marks`, so all six cases count as ERROR. |

### Pasted terminal output — all four runs

> This is the part that makes the table above count. Paste the **whole** output, unedited,
> including the header lines. A table with nothing behind it is not accepted.

**Prompt A**

```text
Number of valid marks: 7
Average: 73.00
Highest mark: 92
Lowest mark: 46
Passed: 6
Failed: 1
ERROR: prompt_a.py defines no callable named 'analyze_marks'.
All six cases count as ERROR. Record that in lab-report.md.
```

**Prompt B**

```text
{'average': 60.0, 'highest': 90, 'lowest': 30, 'pass_rate': 60.0}
========================================================================
analyze_marks harness — prompt_b.py
tolerance for numeric comparison: 0.01
========================================================================
SIGNATURE: ok
------------------------------------------------------------------------
case 1  PASS   analyze_marks([40, 60, 80], 50)
          expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
          got   : average=60.0, highest=80, lowest=40, pass_rate=66.66666666666666
------------------------------------------------------------------------
case 2  PASS   analyze_marks([100], 50)
          expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
          got   : average=100.0, highest=100, lowest=100, pass_rate=100.0
------------------------------------------------------------------------
case 3  PASS   analyze_marks([49.5, 50], 50)
          expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
          got   : average=49.75, highest=50, lowest=49.5, pass_rate=50.0
------------------------------------------------------------------------
case 4  PASS   analyze_marks([], 50)
          expect: ValueError
          got   : raised ValueError: Marks list cannot be empty.
------------------------------------------------------------------------
case 5  PASS   analyze_marks([40, '60'], 50)
          expect: ValueError
          got   : raised ValueError: All marks must be numeric.
------------------------------------------------------------------------
case 6  PASS   analyze_marks([-1, 50, 101], 50)
          expect: ValueError
          got   : raised ValueError: Marks must be between 0 and 100.
------------------------------------------------------------------------
RESULT  6 PASS · 0 FAIL · 0 ERROR   (prompt_b.py)
========================================================================
```

**Prompt C**

```text
{'average': 60.0, 'highest': 80, 'lowest': 40, 'pass_rate': 66.67}
{'average': 75.0, 'highest': 75, 'lowest': 75, 'pass_rate': 100.0}
{'average': 62.0, 'highest': 80.0, 'lowest': 45.5, 'pass_rate': 66.67}
{'average': 70.0, 'highest': 80, 'lowest': 60, 'pass_rate': 33.33}
Marks list cannot be empty.
All marks must be numeric.
Marks must be between 0 and 100.
Marks must be between 0 and 100.
========================================================================
analyze_marks harness — prompt_c.py
tolerance for numeric comparison: 0.01
========================================================================
SIGNATURE: ok
------------------------------------------------------------------------
case 1  PASS   analyze_marks([40, 60, 80], 50)
          expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
          got   : average=60.0, highest=80, lowest=40, pass_rate=66.67
------------------------------------------------------------------------
case 2  PASS   analyze_marks([100], 50)
          expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
          got   : average=100.0, highest=100, lowest=100, pass_rate=100.0
------------------------------------------------------------------------
case 3  PASS   analyze_marks([49.5, 50], 50)
          expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
          got   : average=49.75, highest=50, lowest=49.5, pass_rate=50.0
------------------------------------------------------------------------
case 4  PASS   analyze_marks([], 50)
          expect: ValueError
          got   : raised ValueError: Marks list cannot be empty.
------------------------------------------------------------------------
case 5  PASS   analyze_marks([40, '60'], 50)
          expect: ValueError
          got   : raised ValueError: All marks must be numeric.
------------------------------------------------------------------------
case 6  PASS   analyze_marks([-1, 50, 101], 50)
          expect: ValueError
          got   : raised ValueError: Marks must be between 0 and 100.
------------------------------------------------------------------------
RESULT  6 PASS · 0 FAIL · 0 ERROR   (prompt_c.py)
========================================================================
```

**Prompt D**

```text
========================================================================
analyze_marks harness — prompt_d.py
tolerance for numeric comparison: 0.01
========================================================================
SIGNATURE: ok
------------------------------------------------------------------------
case 1  PASS   analyze_marks([40, 60, 80], 50)
          expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
          got   : average=60.0, highest=80, lowest=40, pass_rate=66.67
------------------------------------------------------------------------
case 2  PASS   analyze_marks([100], 50)
          expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
          got   : average=100.0, highest=100, lowest=100, pass_rate=100.0
------------------------------------------------------------------------
case 3  PASS   analyze_marks([49.5, 50], 50)
          expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
          got   : average=49.75, highest=50, lowest=49.5, pass_rate=50.0
------------------------------------------------------------------------
case 4  PASS   analyze_marks([], 50)
          expect: ValueError
          got   : raised ValueError: Marks list cannot be empty.
------------------------------------------------------------------------
case 5  PASS   analyze_marks([40, '60'], 50)
          expect: ValueError
          got   : raised ValueError: All marks must be numeric.
------------------------------------------------------------------------
case 6  PASS   analyze_marks([-1, 50, 101], 50)
          expect: ValueError
          got   : raised ValueError: Marks must be between 0 and 100.
------------------------------------------------------------------------
RESULT  6 PASS · 0 FAIL · 0 ERROR   (prompt_d.py)
========================================================================
```
## 7. Scoring

0–2 per criterion, using the rubric in `README.md` Part 7.

| Criterion | A | B | C | D |
| --- | --- | --- | --- | --- |
| Correctness (cases passed) | 0 | 2 | 2 | 2 |
| Requirement coverage | 0 | 2 | 2 | 2 |
| Verifiability (tests) | 0 | 0 | 2 | 2 |
| Assumptions stated | 0 | 0 | 2 | 2 |
| Noise (2 = none) | 1 | 1 | 2 | 2 |
| **Total / 10** | **1** | **5** | **10** | **10** |

**Prompt length, in words:** A 7 · B 44 · C 84 · D 177

**Words added per point gained** — B over A, C over B, D over C.

B added 37 words and gained 4 points, which is about 9.25 words per point.  
C added 40 words and gained 5 points, which is 8 words per point.  
D added 93 more words but gained 0 extra scoring points because C and D both scored 10/10. This shows that more words do not always improve the score when the important requirements are already clear.

## 8. Conclusion — 150–200 words

Prompt C and Prompt D got the highest score in my experiment. Both passed all six test cases. If I use one at work, I would choose Prompt D because it is more clear about the exact dictionary keys, validation rules, pass condition, and rounding.

The most important addition was the exact function requirement `analyze_marks(marks, pass_mark=50)`. Prompt A did not create this function, so all six cases were ERROR. In Case 1, the harness could not even call the required function. Prompt B added the correct function and Case 1 changed from ERROR to PASS. B also passed all six cases.

Some extra printed example output was not useful for the official harness. For example, Prompt B printed a dictionary before the harness started. This did not help the test result.

The main ambiguity was the pass rate. Two passing marks out of three gives 66.666..., but the required result is 66.67. In Prompt D, I solved this by clearly saying that `pass_rate` must be rounded to two decimal places. This made the expected format clear.

**Word count:** 169
---

## 9. Two questions for the debrief

Written before class, answered in class.

1. Why did Prompt B pass all six tests even though its pass_rate was 66.66666666666666 instead of exactly 66.67?

2. If Prompt C and Prompt D both passed all six tests, how can we decide which prompt is better for real software development?