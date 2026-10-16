marks = [78, 85, 92, 46, 67, 55, 88]

valid_marks = []

for mark in marks:
    if 0 <= mark <= 100:
        valid_marks.append(mark)

if len(valid_marks) == 0:
    print("No valid marks.")
else:
    average = sum(valid_marks) / len(valid_marks)
    highest = max(valid_marks)
    lowest = min(valid_marks)

    passed = 0
    failed = 0

    for mark in valid_marks:
        if mark >= 50:
            passed += 1
        else:
            failed += 1

    print("Number of valid marks:", len(valid_marks))
    print("Average:", f"{average:.2f}")
    print("Highest mark:", highest)
    print("Lowest mark:", lowest)
    print("Passed:", passed)
    print("Failed:", failed)