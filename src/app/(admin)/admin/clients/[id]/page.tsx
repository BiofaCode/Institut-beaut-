import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatCHF, formatTime } from "@/lib/utils";
import { ArrowLeft, Mail, Phone, Calendar } from "lucide-react";

const statusConfig = {
  PENDING: { label: "En attente", variant: "warning" as const },
  CONFIRMED: { label: "Confirmé", variant: "success" as const },
  CANCELLED: { label: "Annulé", variant: "destructive" as const },
  COMPLETED: { label: "Terminé", variant: "secondary" as const },
  NO_SHOW: { label: "Absent", variant: "destructive" as const },
};

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const client = await prisma.user.findUnique({
    where: { id },
    include: {
      bookings: {
        include: { service: true, staff: true },
        orderBy: { date: "desc" },
      },
    },
  });

  if (!client || client.role !== "CLIENT") notFound();

  const totalSpent = client.bookings
    .filter((b) => b.status === "COMPLETED")
    .reduce((sum, b) => sum + Number(b.totalPrice), 0);

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/clients">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl text-[#2C2C2C]" style={{ fontFamily: "'Playfair Display', serif" }}>
            {client.name || client.email}
          </h1>
          <p className="text-[#6B6B6B] text-sm">
            Cliente depuis le {formatDate(client.createdAt)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client info */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#E8E0D5] p-6">
            <h2 className="font-semibold text-[#2C2C2C] mb-4">Coordonnées</h2>
            <div className="space-y-3 text-sm">
              {client.email && (
                <div className="flex items-center gap-2 text-[#6B6B6B]">
                  <Mail className="w-4 h-4 text-[#8B7355]" />
                  <a href={`mailto:${client.email}`} className="hover:text-[#8B7355]">
                    {client.email}
                  </a>
                </div>
              )}
              {client.phone && (
                <div className="flex items-center gap-2 text-[#6B6B6B]">
                  <Phone className="w-4 h-4 text-[#8B7355]" />
                  <a href={`tel:${client.phone}`} className="hover:text-[#8B7355]">
                    {client.phone}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-2xl border border-[#E8E0D5] p-6">
            <h2 className="font-semibold text-[#2C2C2C] mb-4">Statistiques</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#6B6B6B]">Total réservations</span>
                <span className="font-semibold">{client.bookings.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6B6B6B]">Visites complètes</span>
                <span className="font-semibold">
                  {client.bookings.filter((b) => b.status === "COMPLETED").length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6B6B6B]">Total dépensé</span>
                <span className="font-semibold text-[#8B7355]">{formatCHF(totalSpent)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {client.notes && (
            <div className="bg-white rounded-2xl border border-[#E8E0D5] p-6">
              <h2 className="font-semibold text-[#2C2C2C] mb-3">Notes internes</h2>
              <p className="text-sm text-[#6B6B6B]">{client.notes}</p>
            </div>
          )}
        </div>

        {/* Booking history */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-[#E8E0D5] overflow-hidden">
            <div className="p-6 border-b border-[#F5F0EB]">
              <h2 className="font-semibold text-[#2C2C2C] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#8B7355]" />
                Historique des rendez-vous ({client.bookings.length})
              </h2>
            </div>
            <div className="divide-y divide-[#F5F0EB]">
              {client.bookings.length === 0 ? (
                <div className="text-center py-10 text-[#6B6B6B] text-sm">
                  Aucune réservation
                </div>
              ) : (
                client.bookings.map((booking) => (
                  <Link
                    key={booking.id}
                    href={`/admin/reservations/${booking.id}`}
                    className="flex items-center justify-between p-4 hover:bg-[#FEFCF9] transition-colors"
                  >
                    <div>
                      <div className="font-medium text-sm text-[#2C2C2C]">
                        {booking.service.name}
                      </div>
                      <div className="text-xs text-[#6B6B6B] mt-0.5">
                        {formatDate(booking.date)} à {formatTime(booking.startTime)}
                        {booking.staff && ` • ${booking.staff.name}`}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={statusConfig[booking.status].variant}>
                        {statusConfig[booking.status].label}
                      </Badge>
                      <span className="text-sm font-medium text-[#8B7355]">
                        {formatCHF(booking.totalPrice)}
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
