import { prisma } from "@/lib/prisma";
import { timeToMinutes, minutesToTime } from "@/lib/utils";
import { format } from "date-fns";

const SLOT_INTERVAL = 15; // minutes

export async function getAvailableSlots(
  date: Date,
  serviceId: string,
  staffId?: string
): Promise<string[]> {
  const dayOfWeek = date.getDay();
  const dateStr = format(date, "yyyy-MM-dd");

  // 1. Check if date is closed
  const closedDate = await prisma.closedDate.findFirst({
    where: {
      date: {
        gte: new Date(dateStr),
        lt: new Date(
          new Date(dateStr).getTime() + 24 * 60 * 60 * 1000
        ),
      },
    },
  });
  if (closedDate) return [];

  // 2. Get business hours for this day
  const businessHours = await prisma.businessHours.findUnique({
    where: { dayOfWeek },
  });
  if (!businessHours || businessHours.isClosed || !businessHours.openTime || !businessHours.closeTime) {
    return [];
  }

  let openMinutes = timeToMinutes(businessHours.openTime);
  let closeMinutes = timeToMinutes(businessHours.closeTime);

  // 3. If staffId, check staff schedule
  if (staffId) {
    const staffSchedule = await prisma.staffSchedule.findFirst({
      where: { staffId, dayOfWeek },
    });
    if (!staffSchedule || !staffSchedule.isWorking) return [];
    openMinutes = Math.max(openMinutes, timeToMinutes(staffSchedule.startTime));
    closeMinutes = Math.min(closeMinutes, timeToMinutes(staffSchedule.endTime));
  }

  // 4. Get service duration
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    select: { duration: true },
  });
  if (!service) return [];

  const duration = service.duration;

  // 5. Get existing bookings for this day
  const existingBookings = await prisma.booking.findMany({
    where: {
      date: {
        gte: new Date(dateStr),
        lt: new Date(new Date(dateStr).getTime() + 24 * 60 * 60 * 1000),
      },
      staffId: staffId || undefined,
      status: { notIn: ["CANCELLED"] },
    },
    select: { startTime: true, endTime: true },
  });

  // 6. Generate slots
  const slots: string[] = [];
  let current = openMinutes;

  while (current + duration <= closeMinutes) {
    const slotStart = current;
    const slotEnd = current + duration;
    const slotStartTime = minutesToTime(slotStart);
    const slotEndTime = minutesToTime(slotEnd);

    // Check if slot overlaps any existing booking
    const hasConflict = existingBookings.some((booking) => {
      const bookingStart = timeToMinutes(booking.startTime);
      const bookingEnd = timeToMinutes(booking.endTime);
      return slotStart < bookingEnd && slotEnd > bookingStart;
    });

    if (!hasConflict) {
      slots.push(slotStartTime);
    }

    current += SLOT_INTERVAL;
  }

  return slots;
}

export async function isSlotAvailable(
  date: Date,
  startTime: string,
  serviceId: string,
  staffId?: string
): Promise<boolean> {
  const available = await getAvailableSlots(date, serviceId, staffId);
  return available.includes(startTime);
}
