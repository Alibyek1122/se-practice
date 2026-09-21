# Week 01 — Manual vs AI: Comparison

**Name:** Alibyek Molshylykh
**Group:** Monday 16:00-19:00
**Date:** 19 September 2026

---

## 1. Facts

| | Manual (Part 1) | Rocket (Part 2) |
| --- | --- | --- |
| Language / stack used | Python | Next.js + TypeScript |
| Time to first version that ran | about 10 min | about 11 min |
| Time to all 4 test cases passing | 20 min | about 22 min |
| Number of attempts / prompts needed | 2 attempts | 2 main prompts |
| Lines of code you actually wrote | 40 lines | 0 |
| Did it handle invalid marks (case B)? | Yes | Yes |
| Did it handle an empty list (case D)? | Yes | Yes |
| Did it use the ≥ 50 pass threshold? | Yes | Yes |
| Output format matches the spec? | Yes | No at first, fixed later |
| Can you explain every line of it? | Yes | No, not every generated line |

## 2. Test results

| Case | Input | Manual output | Rocket output | Spec says | Match? |
| --- | --- | --- | --- | --- | --- |
| A | `85, 23, 45, 90, 92` | avg 67.00 · high 92 · low 23 · pass 60.0% | avg 67.0 · high 92 · low 23 · pass 60.0% | avg 67.00 · high 92 · low 23 · pass 60.0% | No, average format |
| B | `88, 47, -5, 101, abc, 73, 50, , 100` | avg 71.60 · high 100 · low 47 · pass 80.0% | avg 71.6 · high 100 · low 47 · pass 80.0% | avg 71.60 · high 100 · low 47 · pass 80.0% | No, average format |
| C | `10, 20, 30` | avg 20.00 · high 30 · low 10 · pass 0.0% | avg 20.0 · high 30 · low 10 · pass 0.0% | avg 20.00 · high 30 · low 10 · pass 0.0% | No, average format |
| D | `abc, , xyz` | Clear message, no crash | Clear invalid-input warning, no crash | clear message, no crash | Yes |

## 3. What the AI added that I never asked for

<!-- Tech stack, UI, extra features, a pass threshold it invented, styling, etc. -->
- A full web interface instead of a simple program.
- Next.js and TypeScript as the technology stack.
- A pass-threshold slider.
- Preset buttons and sample data.
- A grade distribution chart.
- A detailed marks table.
- Invalid-token detection and warning messages.
- Extra styling and a clean dashboard layout.


## 4. What the AI got wrong or silently skipped

<!-- Be concrete: input, expected, actual. -->
- The average was displayed with one decimal place instead of exactly two decimals.
- In Case A, Rocket showed 67.0 instead of 67.00.
- In Case B, Rocket showed 71.6 instead of 71.60.
- In Case C, Rocket showed 20.0 instead of 20.00.
- The calculations were correct, but the output format did not fully match the specification.

## 5. The defect I asked Rocket to fix

**Prompt I used:**
Display the average with exactly 2 decimal places.

**Result:** (fixed / partly fixed / broke something else)
fixed

**What this tells me:**
Rocket created the application quickly, but it did not follow the output format exactly at first. The calculations were correct, but the average used only one decimal place. After I gave a clear follow-up prompt, Rocket fixed the problem and showed the average with exactly two decimal places.


---

## 6. Reflection (200–300 words)

Answer all four, in your own words:

1. Which parts of the work did the AI genuinely speed up?
2. Where did the AI cost you time, or give you something that looked right but was not?
3. Which of these two artefacts would you be willing to put your name on, and why?
4. What must a human engineer still be responsible for after this experiment?

<!-- Write your reflection below this line -->
Rocket helped me make the application faster. I only wrote a short prompt and answered some questions. After that, Rocket made a web application with an input box, results, a chart, and other features. This was useful because I did not need to build the full interface by myself.

But Rocket also made a small mistake. The average was shown with one decimal place. For example, it showed 67.0 instead of 67.00. The calculation was correct, but the format was not correct. I found this problem when I tested the four test cases. Then I gave Rocket another prompt to fix it. After that, the average was shown with two decimal places.

I trust my manual version more because I wrote the Python code by myself. I understand every line and I know how it works. The Rocket version looks better and has more features, but I do not understand all the Next.js and TypeScript code.

From this task, I learned that AI can help us work faster, but we still need to check the result. A human engineer must test the program, check the requirements, find mistakes, and make sure the final program works correctly.
