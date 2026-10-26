
def can_book(start, end, now, blocked, existing):
    """Return whether the requested interval is available."""

    # AC1: Time values must be integers.
    if not all(type(value) is int for value in (start, end, now)):
        return False

    # AC1: Check the time range and order.
    if not (0 <= start < end <= 1440):
        return False

    # AC1: Start must be after now.
    if start <= now:
        return False

    # AC2: Maximum duration is 120 minutes.
    if end - start > 120:
        return False

    # AC3: Reject blocked rooms.
    if blocked:
        return False

    # AC4: Reject overlapping bookings.
    for booked_start, booked_end in existing:
        if start < booked_end and end > booked_start:
            return False

    # AC5: Do not modify existing bookings.
    return True
