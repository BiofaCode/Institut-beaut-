import { NextRequest, NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/availability";
import { z } from "zod";

const querySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  serviceId: z.string().min(1),
  staffId: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = querySchema.safeParse({
      date: searchParams.get("date"),
      serviceId: searchParams.get("serviceId"),
      staffId: searchParams.get("staffId") || undefined,
    });

    if (!parsed.success) {
      return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
    }

    const { date, serviceId, staffId } = parsed.data;
    const dateObj = new Date(date + "T00:00:00.000Z");

    // Don't allow past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (dateObj < today) {
      return NextResponse.json({ slots: [] });
    }

    const slots = await getAvailableSlots(dateObj, serviceId, staffId);
    return NextResponse.json({ slots });
  } catch (error) {
    console.error("Availability error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
