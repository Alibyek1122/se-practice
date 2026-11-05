interface BookingInterval {
  start: number;
  end: number;
}

interface CanBookInput {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: BookingInterval[];
}

export function canBook({
  start,
  end,
  now,
  blocked,
  bookings,
}: CanBookInput): boolean {

  // AC1: Уақыт дұрыс болуы керек
  if (start < 0 || end > 1440) return false;
  if (start >= end) return false;
  if (start <= now) return false;

  // AC2: Ең көбі 120 минут
  if (end - start > 120) return false;

  // AC3: Бөлме жабық болмауы керек
  if (blocked) return false;

  // AC4: Басқа брондаумен қабыспауы керек
  const hasOverlap = bookings.some(
    (booking) =>
      start < booking.end && booking.start < end
  );

  if (hasOverlap) return false;

  return true;
}