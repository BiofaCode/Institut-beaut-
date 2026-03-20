import { prisma } from "@/lib/prisma";
import { formatCHF, formatDate, formatTime } from "@/lib/utils";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, List, Search, Plus } from "lucide-react";

const statusConfig = {
  PENDING: { label: "En attente", variant: "warning" as const },
  CONFIRMED: { label: "Confirmé", variant: "success" as const },
  CANCELLED: { label: "Annulé", variant: "destructive" as const },
  COMPLETED: { label: "Terminé", variant: "secondary" as const },
  NO_SHOW: { label: "Absent", variant: "destructive" as const },
};

async function getBookings() {
  try {
    return await prisma.booking.findMany({
      include: {
        client: { select: { name: true, email: true, phone: true } },
        service: { select: { name: true, duration: true } },
        staff: { select: { name: true } },
      },
      orderBy: [{ date: "desc" }, { startTime: "asc" }],
      take: 100,
    });
  } catch {
    return [];
  }
}

export default async function ReservationsPage() {
  const bookings = await getBookings();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-3xl text-[#2C2C2C]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Réservations
          </h1>
          <p className="text-[#6B6B6B] mt-1">{bookings.length} réservation(s) au total</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-[#E8E0D5] text-sm flex-1 max-w-xs">
          <Search className="w-4 h-4 text-[#A0A0A0]" />
          <input
            type="text"
            placeholder="Rechercher un client..."
            className="bg-transparent outline-none flex-1 text-[#2C2C2C] placeholder:text-[#A0A0A0]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#E8E0D5] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F5F0EB] text-left">
                <th className="px-4 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">
                  Client
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">
                  Service
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">
                  Date & Heure
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">
                  Praticienne
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F0EB]">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-[#6B6B6B]">
                    Aucune réservation pour le moment
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-[#FEFCF9] transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-[#2C2C2C] text-sm">
                        {booking.client.name || "N/A"}
                      </div>
                      <div className="text-xs text-[#6B6B6B]">{booking.client.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-[#2C2C2C]">{booking.service.name}</div>
                      <div className="text-xs text-[#6B6B6B]">{booking.service.duration} min</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-[#2C2C2C]">{formatDate(booking.date)}</div>
                      <div className="text-xs text-[#6B6B6B]">
                        {formatTime(booking.startTime)} – {formatTime(booking.endTime)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-[#6B6B6B]">
                        {booking.staff?.name || "—"}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusConfig[booking.status].variant}>
                        {statusConfig[booking.status].label}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-[#8B7355]">
                        {formatCHF(booking.totalPrice)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/reservations/${booking.id}`}
                        className="text-xs text-[#8B7355] hover:underline"
                      >
                        Détails
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
