PASS_MARK = 50


def parse_marks(raw):
    """Keep only numbers between 0 and 100 (valid marks)."""
    marks = []
    for token in raw.replace(",", " ").split():
        try:
            value = float(token)
        except ValueError:
            continue  # skip anything that is not a number
        if 0 <= value <= 100:
            marks.append(value)
    return marks


def main():
    raw = input("Enter marks (separate them with commas or spaces): ")
    marks = parse_marks(raw)

    if not marks:
        print("No valid marks found. Only numbers from 0 to 100 are valid.")
        return

    count = len(marks)
    average = sum(marks) / count
    highest = max(marks)
    lowest = min(marks)
    passed = sum(1 for m in marks if m >= PASS_MARK)
    pass_rate = passed / count * 100

    print(f"Valid marks: {count}")
    print(f"Average: {average:.2f}")
    print(f"Highest: {highest:g}")
    print(f"Lowest: {lowest:g}")
    print(f"Pass rate: {pass_rate:.1f}%")


if __name__ == "__main__":
    main()