
import unittest
from booking import can_book


class BookingTests(unittest.TestCase):

    def setUp(self):
        self.now = 540
        self.existing = [(600, 660)]

    def test_t1_touching(self):
        self.assertIs(
            can_book(660, 720, self.now, False, self.existing),
            True
        )

    def test_t2_overlap(self):
        self.assertIs(
            can_book(630, 690, self.now, False, self.existing),
            False
        )

    def test_t3_blocked(self):
        self.assertIs(
            can_book(660, 720, self.now, True, self.existing),
            False
        )

    def test_t4_exactly_120(self):
        self.assertIs(
            can_book(720, 840, self.now, False, self.existing),
            True
        )

    def test_t5_121_minutes(self):
        self.assertIs(
            can_book(720, 841, self.now, False, self.existing),
            False
        )

    def test_t6_starts_now(self):
        self.assertIs(
            can_book(540, 570, self.now, False, self.existing),
            False
        )

    def test_t7_reversed(self):
        self.assertIs(
            can_book(720, 660, self.now, False, self.existing),
            False
        )

    def test_t8_midnight(self):
        self.assertIs(
            can_book(1380, 1440, self.now, False, self.existing),
            True
        )

    def test_t9_past_midnight(self):
        self.assertIs(
            can_book(1380, 1441, self.now, False, self.existing),
            False
        )

    def test_t10_second_booking(self):
        bookings = [(600, 660), (700, 760)]
        self.assertIs(
            can_book(720, 780, self.now, False, bookings),
            False
        )

    def test_t11_same_check_twice(self):
        bookings = [(600, 660)]
        self.assertIs(
            can_book(660, 720, self.now, False, bookings),
            True
        )
        self.assertIs(
            can_book(660, 720, self.now, False, bookings),
            True
        )
        self.assertEqual(bookings, [(600, 660)])

    def test_float_start(self):
        self.assertIs(
            can_book(660.5, 720, self.now, False, self.existing),
            False
        )

    def test_float_end(self):
        self.assertIs(
            can_book(660, 720.5, self.now, False, self.existing),
            False
        )

    def test_equal_times(self):
        self.assertIs(
            can_book(720, 720, self.now, False, self.existing),
            False
        )

    def test_touching_booking_start(self):
        self.assertIs(
            can_book(550, 600, self.now, False, self.existing),
            True
        )

    def test_start_before_now(self):
        self.assertIs(
            can_book(539, 600, self.now, False, self.existing),
            False
        )

    def test_existing_not_modified(self):
        bookings = [(600, 660)]
        self.assertIs(
            can_book(630, 690, self.now, False, bookings),
            False
        )
        self.assertEqual(bookings, [(600, 660)])
    

    # AC4: Reject a request that fully contains an existing booking.
    def test_request_contains_existing_booking(self):
        self.assertIs(
            can_book(550, 670, self.now, False, [(600, 660)]),
            False
        )

    # AC4: Reject a request completely inside an existing booking.
    def test_request_inside_existing_booking(self):
        self.assertIs(
            can_book(610, 640, self.now, False, [(600, 660)]),
            False
        )

    # AC4: Reject an interval identical to an existing booking.
    def test_identical_booking_overlap(self):
        self.assertIs(
            can_book(600, 660, self.now, False, [(600, 660)]),
            False
        )

    # AC4: Reject overlap at the end of an existing booking.
    def test_overlap_at_booking_end(self):
        self.assertIs(
            can_book(650, 700, self.now, False, [(600, 660)]),
            False
        )

    # AC5: A successful check must not modify or reorder bookings.
    def test_success_preserves_unsorted_bookings(self):
        bookings = [(900, 960), (600, 660)]
        original = bookings.copy()

        result = can_book(660, 720, self.now, False, bookings)

        self.assertIs(result, True)
        self.assertEqual(bookings, original)

    # AC5: A rejected check must not modify or reorder bookings.
    def test_rejection_preserves_unsorted_bookings(self):
        bookings = [(900, 960), (600, 660), (700, 760)]
        original = bookings.copy()

        result = can_book(720, 780, self.now, False, bookings)

        self.assertIs(result, False)
        self.assertEqual(bookings, original)


if __name__ == "__main__":
    unittest.main()
