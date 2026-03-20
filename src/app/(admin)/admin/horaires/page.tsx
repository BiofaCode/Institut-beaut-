import { prisma } from "@/lib/prisma";
import { HoraireEditor } from "./HoraireEditor";
import { ClosedDatesEditor } from "./ClosedDatesEditor";

const DAY_NAMES = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

async function getData() {
  try {
    const [hours, closedDates] = await Promise.all([
      prisma.businessHours.findMany({ orderBy: { dayOfWeek: "asc" } }),
      prisma.closedDate.findMany({ orderBy: { date: "asc" } }),
    ]);
    return { hours, closedDates };
  } catch {
    return { hours: [], closedDates: [] };
  }
}

export default async function HorairesPage() {
  const { hours, closedDates } = await getData();

  const hoursWithNames = DAY_NAMES.map((name, i) => {
    const h = hours.find((h) => h.dayOfWeek === i);
    return h || { id: `temp-${i}`, dayOfWeek: i, openTime: null, closeTime: null, isClosed: true };
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl text-[#2C2C2C]" style={{ fontFamily: "'Playfair Display', serif" }}>
          Horaires
        </h1>
        <p className="text-[#6B6B6B] mt-1">Gérez les horaires d&apos;ouverture et les jours de fermeture</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-[#E8E0D5] p-6">
          <h2 className="font-semibold text-[#2C2C2C] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            Horaires hebdomadaires
          </h2>
          <HoraireEditor hours={hoursWithNames as never} dayNames={DAY_NAMES} />
        </div>

        <div className="bg-white rounded-2xl border border-[#E8E0D5] p-6">
          <h2 className="font-semibold text-[#2C2C2C] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            Jours de fermeture exceptionnels
          </h2>
          <ClosedDatesEditor closedDates={closedDates as never} />
        </div>
      </div>
    </div>
  );
}
