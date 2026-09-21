# Rocket Prompt Log

## Initial Prompt

Build a small program that processes a list of student marks and prints:
average, highest, lowest, and pass rate.

## Question 1

How do the student marks get into the tool?

My answer:
Type or paste marks manually.

## Question 2

Who will be using this tool?

My answer:
A teacher or lecturer.

## Rocket Enhanced Prompt

A simple web tool for teachers to type or paste a list of student marks and instantly see the class average, highest score, lowest score, and pass rate — all computed and displayed in a clean, readable layout.

Building with Next.js and TypeScript.


## Test Case B

Input:
88, 47, -5, 101, abc, 73, 50, , 100

Rocket output:
- Valid marks: 5
- Average: 71.6
- Highest: 100
- Lowest: 47
- Pass rate: 80.0%

Result:
Partly correct. Invalid marks were ignored correctly, but the average should be displayed as 71.60 instead of 71.6.

## Test Case C

Input:
10, 20, 30

Rocket output:
- Valid marks: 3
- Average: 20.0
- Highest: 30
- Lowest: 10
- Pass rate: 0.0%

Result:
Partly correct. The calculations are correct, but the average should be displayed as 20.00 instead of 20.0.

## Test Case D

Input:
abc, , xyz

Rocket output:
- No valid marks were processed.
- abc and xyz were detected as invalid.
- The empty value was ignored.
- No statistics were displayed.
- The app did not crash.

Result:
Correct. The app handled the case without crashing and showed a clear invalid-input message.

## Follow-up Prompt

Display the average with exactly 2 decimal places.

## Result

Fixed.

After the fix, I tested Case A again:

Input:
85, 23, 45, 90, 92

Average before fix:
67.0

Average after fix:
67.00

The defect was fixed successfully and the other statistics still worked correctly.
