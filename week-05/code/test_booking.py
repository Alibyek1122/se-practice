import unittest
from booking import can_book


class BookingTests(unittest.TestCase):

    # Required six tests

    def test_touching_end_is_allowed(self):
        self.assertIs(
            can_book(660, 720, 540, False, [(600, 660)]),
            True
        )

    def test_overlap_is_rejected(self):
        self.assertIs(
            can_book(630, 690, 540, False, [(600, 660)]),
            False
        )

    def test_blocked_room_is_rejected(self):
        self.assertIs(
            can_book(660, 720, 540, True, [(600, 660)]),
            False
        )

    def test_exactly_two_hours_is_allowed(self):
        self.assertIs(
            can_book(720, 840, 540, False, [(600, 660)]),
            True
        )

    def test_over_two_hours_is_rejected(self):
        self.assertIs(
            can_book(720, 841, 540, False, [(600, 660)]),
            False
        )

    def test_starts_now_is_rejected(self):
        self.assertIs(
            can_book(540, 570, 540, False, [(600, 660)]),
            False
        )

    # Additional boundary tests

    def test_zero_duration(self):
        self.assertIs(
            can_book(700, 700, 540, False, []),
            False
        )

    def test_reversed_time(self):
        self.assertIs(
            can_book(720, 700, 540, False, []),
            False
        )

    def test_end_at_midnight(self):
        self.assertIs(
            can_book(1380, 1440, 540, False, []),
            True
        )

    def test_end_after_midnight(self):
        self.assertIs(
            can_book(1380, 1441, 540, False, []),
            False
        )

    def test_start_one_minute_after_now(self):
        self.assertIs(
            can_book(541, 571, 540, False, []),
            True
        )

    def test_start_in_past(self):
        self.assertIs(
            can_book(500, 530, 540, False, []),
            False
        )

    def test_one_minute_booking(self):
        self.assertIs(
            can_book(720, 721, 540, False, []),
            True
        )

    def test_touching_existing_start(self):
        self.assertIs(
            can_book(570, 600, 540, False, [(600, 660)]),
            True
        )

    def test_inside_existing_booking(self):
        self.assertIs(
            can_book(615, 645, 540, False, [(600, 660)]),
            False
        )

    def test_contains_existing_booking(self):
        self.assertIs(
            can_book(570, 690, 540, False, [(600, 660)]),
            False
        )

    def test_identical_booking(self):
        self.assertIs(
            can_book(600, 660, 540, False, [(600, 660)]),
            False
        )

    def test_overlap_second_booking(self):
        existing = [(600, 660), (700, 760)]
        self.assertIs(
            can_book(720, 780, 540, False, existing),
            False
        )

    def test_empty_existing(self):
        self.assertIs(
            can_book(600, 660, 540, False, []),
            True
        )

    def test_between_two_bookings(self):
        existing = [(600, 660), (720, 780)]
        self.assertIs(
            can_book(660, 720, 540, False, existing),
            True
        )

    def test_existing_remains_unchanged(self):
        existing = [(900, 960), (600, 660), (700, 760)]
        original = existing.copy()

        self.assertIs(
            can_book(780, 840, 540, False, existing),
            True
        )
        self.assertEqual(existing, original)

        self.assertIs(
            can_book(610, 650, 540, False, existing),
            False
        )
        self.assertEqual(existing, original)


if __name__ == "__main__":
    unittest.main()
