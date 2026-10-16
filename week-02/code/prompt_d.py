def analyze_marks(marks, pass_mark=50):
    if len(marks) == 0:
        raise ValueError("Marks list cannot be empty.")

    for mark in marks:
        if not isinstance(mark, (int, float)) or isinstance(mark, bool):
            raise ValueError("All marks must be numeric.")

        if mark < 0 or mark > 100:
            raise ValueError("Marks must be between 0 and 100.")

    average = sum(marks) / len(marks)
    highest = max(marks)
    lowest = min(marks)

    passing_marks = 0

    for mark in marks:
        if mark >= pass_mark:
            passing_marks += 1

    pass_rate = (passing_marks / len(marks)) * 100
    pass_rate = round(pass_rate, 2)

    return {
        "average": average,
        "highest": highest,
        "lowest": lowest,
        "pass_rate": pass_rate
    }


# 1. One mark
assert analyze_marks([80]) == {
    "average": 80,
    "highest": 80,
    "lowest": 80,
    "pass_rate": 100.0
}


# 2. Decimal marks
assert analyze_marks([40.5, 60.5, 80.5]) == {
    "average": 60.5,
    "highest": 80.5,
    "lowest": 40.5,
    "pass_rate": 66.67
}


# 3. Custom pass_mark
assert analyze_marks([40, 60, 80], 70) == {
    "average": 60,
    "highest": 80,
    "lowest": 40,
    "pass_rate": 33.33
}


# 4. Empty list
try:
    analyze_marks([])
    assert False
except ValueError:
    pass


# 5. Non-numeric value
try:
    analyze_marks([40, "60", 80])
    assert False
except ValueError:
    pass


# 6. Mark below 0
try:
    analyze_marks([40, -10, 80])
    assert False
except ValueError:
    pass


# 6. Mark above 100
try:
    analyze_marks([40, 110, 80])
    assert False
except ValueError:
    pass