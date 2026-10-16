def analyze_marks(marks, pass_mark=50):
    # Check whether marks is empty
    if not marks:
        raise ValueError("Marks list cannot be empty.")

    # Validate pass_mark
    if isinstance(pass_mark, bool) or not isinstance(pass_mark, (int, float)):
        raise ValueError("Pass mark must be numeric.")

    if pass_mark < 0 or pass_mark > 100:
        raise ValueError("Pass mark must be between 0 and 100.")

    # Validate every mark
    for mark in marks:
        if isinstance(mark, bool) or not isinstance(mark, (int, float)):
            raise ValueError("All marks must be numeric.")

        if mark < 0 or mark > 100:
            raise ValueError("Marks must be between 0 and 100.")

    # Calculate statistics
    average = sum(marks) / len(marks)
    highest = max(marks)
    lowest = min(marks)

    passed_students = 0

    for mark in marks:
        if mark >= pass_mark:
            passed_students += 1

    pass_rate = (passed_students / len(marks)) * 100

    return {
        "average": round(average, 2),
        "highest": highest,
        "lowest": lowest,
        "pass_rate": round(pass_rate, 2)
    }


# ---------------- TESTS ----------------

# 1. Example
print(analyze_marks([40, 60, 80], 50))
# Expected:
# {'average': 60.0, 'highest': 80, 'lowest': 40, 'pass_rate': 66.67}


# 2. One mark
print(analyze_marks([75]))
# Expected:
# {'average': 75.0, 'highest': 75, 'lowest': 75, 'pass_rate': 100.0}


# 3. Decimal marks
print(analyze_marks([45.5, 60.5, 80.0]))
# Expected:
# average = 62.0
# highest = 80.0
# lowest = 45.5
# pass_rate = 66.67


# 4. Custom pass_mark
print(analyze_marks([60, 70, 80], 75))
# Expected:
# {'average': 70.0, 'highest': 80, 'lowest': 60, 'pass_rate': 33.33}


# 5. Empty list
try:
    print(analyze_marks([]))
except ValueError as error:
    print(error)


# 6. Text value
try:
    print(analyze_marks([50, "hello", 80]))
except ValueError as error:
    print(error)


# 7. Mark below 0
try:
    print(analyze_marks([-10, 50, 80]))
except ValueError as error:
    print(error)


# 8. Mark above 100
try:
    print(analyze_marks([50, 80, 120]))
except ValueError as error:
    print(error)