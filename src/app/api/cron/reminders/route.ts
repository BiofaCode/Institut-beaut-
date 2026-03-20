import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendBookingReminder } from "@/lib/resend";
import { formatDate, formatTime } from "@/lib/utils";

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const settings = await prisma.settings.findUnique({ where: { id: "default" } });
    const reminderHours = settings?.reminderHours || 24;

    const now = new Date();
    const targetTime = new Date(now.getTime() + reminderHours * 60 * 60 * 1000);

    // Find bookings that need reminder
    const bookings = await prisma.booking.findMany({
      where: {
        status: "CONFIRMED",
        reminderSent: false,
        date: {
          gte: new Date(targetTime.toDateString()),
          lte: new Date(targetTime.toDateString()),
        },
      },
      include: {
        client: { select: { email: true, name: true } },
        service: { select: { name: true } },
      },
    });

    let sent = 0;
    for (const booking of bookings) {
      try {
        await sendBookingReminder({
          to: booking.client.email,
          clientName: booking.client.name || "Cliente",
          serviceName: booking.service.name,
          date: formatDate(booking.date),
          time: formatTime(booking.startTime),
          address: settings?.address
            ? `${settings.address}, ${settings.postalCode} ${settings.city}`
            : undefined,
        });

        await prisma.booking.update({
          where: { id: booking.id },
          data: { reminderSent: true },
        });
        sent++;
      } catch (err) {
        console.error(`Failed to send reminder for booking ${booking.id}:`, err);
      }
    }

    return NextResponse.json({ success: true, sent });
  } catch (error) {
    console.error("Cron error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
