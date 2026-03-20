import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { bookingSchema } from "@/lib/validations";
import { isSlotAvailable } from "@/lib/availability";
import { addMinutes, formatDate, formatTime } from "@/lib/utils";
import { sendBookingConfirmation } from "@/lib/resend";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = bookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const dateObj = new Date(data.date + "T00:00:00.000Z");

    // Verify slot is still available
    const available = await isSlotAvailable(dateObj, data.startTime, data.serviceId, data.staffId);
    if (!available) {
      return NextResponse.json(
        { error: "Ce créneau n'est plus disponible. Veuillez en choisir un autre." },
        { status: 409 }
      );
    }

    // Get service details
    const service = await prisma.service.findUnique({
      where: { id: data.serviceId },
      select: { duration: true, price: true, name: true },
    });
    if (!service) {
      return NextResponse.json({ error: "Service introuvable" }, { status: 404 });
    }

    const endTime = addMinutes(data.startTime, service.duration);

    // Find or create client
    let client = await prisma.user.findUnique({
      where: { email: data.clientEmail },
    });

    if (!client) {
      const tempPassword = Math.random().toString(36).slice(-12);
      const passwordHash = await bcrypt.hash(tempPassword, 10);
      client = await prisma.user.create({
        data: {
          email: data.clientEmail,
          name: data.clientName,
          phone: data.clientPhone,
          passwordHash,
          role: "CLIENT",
        },
      });
    } else {
      // Update phone if changed
      if (data.clientPhone && client.phone !== data.clientPhone) {
        await prisma.user.update({
          where: { id: client.id },
          data: { phone: data.clientPhone, name: data.clientName || client.name },
        });
      }
    }

    // Get settings for deposit calculation
    const settings = await prisma.settings.findUnique({ where: { id: "default" } });
    const depositPercent = settings?.depositPercent || 20;
    const depositAmount = (Number(service.price) * depositPercent) / 100;

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        date: dateObj,
        startTime: data.startTime,
        endTime,
        clientId: client.id,
        serviceId: data.serviceId,
        staffId: data.staffId || null,
        totalPrice: service.price,
        depositAmount,
        clientNotes: data.clientNotes,
        status: "PENDING",
      },
      include: {
        service: true,
        staff: true,
        client: true,
      },
    });

    // Send confirmation email
    try {
      await sendBookingConfirmation({
        to: client.email,
        clientName: data.clientName,
        serviceName: service.name,
        date: formatDate(dateObj),
        time: formatTime(data.startTime),
        staffName: booking.staff?.name,
        price: `CHF ${Number(service.price).toFixed(2)}`,
        bookingId: booking.id,
      });
    } catch (emailError) {
      console.error("Email send failed:", emailError);
      // Don't fail the booking if email fails
    }

    return NextResponse.json({
      success: true,
      bookingId: booking.id,
      booking: {
        id: booking.id,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
        service: booking.service.name,
        totalPrice: booking.totalPrice,
        depositAmount: booking.depositAmount,
        status: booking.status,
      },
    });
  } catch (error) {
    console.error("Booking creation error:", error);
    return NextResponse.json({ error: "Erreur lors de la réservation" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID requis" }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        service: { include: { category: true } },
        staff: true,
        client: { select: { name: true, email: true, phone: true } },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Réservation introuvable" }, { status: 404 });
    }

    return NextResponse.json({ booking });
  } catch {
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
