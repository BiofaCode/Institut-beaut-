import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCHF, formatDate, formatTime, formatDuration } from "@/lib/utils";
import { ArrowLeft, User, Calendar, Clock, CreditCard } from "lucide-react";
import { BookingActions } from "./BookingActions";

const statusConfig = {
  PENDING: { label: "En attente", variant: "warning" as const },
  CONFIRMED: { label: "Confirmé", variant: "success" as const },
  CANCELLED: { label: "Annulé", variant: "destructive" as const },
  COMPLETED: { label: "Terminé", variant: "secondary" as const },
  NO_SHOW: { label: "Absent", variant: "destructive" as const },
};

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      client: true,
      service: { include: { category: true } },
      staff: true,
    },
  });

  if (!booking) notFound();

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/reservations">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1
            className="text-2xl text-[#2C2C2C]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Réservation #{id.slice(-8).toUpperCase()}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={statusConfig[booking.status].variant}>
              {statusConfig[booking.status].label}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Service & time */}
          <div className="bg-white rounded-2xl border border-[#E8E0D5] p-6">
            <h2 className="font-semibold text-[#2C2C2C] mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#8B7355]" />
              Détails du soin
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-[#F5F0EB]">
                <span className="text-[#6B6B6B]">Service</span>
                <span className="font-medium">{booking.service.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#F5F0EB]">
                <span className="text-[#6B6B6B]">Catégorie</span>
                <span>{booking.service.category.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#F5F0EB]">
                <span className="text-[#6B6B6B]">Durée</span>
                <span>{formatDuration(booking.service.duration)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#F5F0EB]">
                <span className="text-[#6B6B6B]">Date</span>
                <span>{formatDate(booking.date)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#F5F0EB]">
                <span className="text-[#6B6B6B]">Heure</span>
                <span>
                  {formatTime(booking.startTime)} — {formatTime(booking.endTime)}
                </span>
              </div>
              {booking.staff && (
                <div className="flex justify-between py-2">
                  <span className="text-[#6B6B6B]">Praticienne</span>
                  <span>{booking.staff.name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {booking.clientNotes && (
            <div className="bg-white rounded-2xl border border-[#E8E0D5] p-6">
              <h2 className="font-semibold text-[#2C2C2C] mb-3">Notes de la cliente</h2>
              <p className="text-sm text-[#6B6B6B]">{booking.clientNotes}</p>
            </div>
          )}

          {/* Admin notes */}
          <div className="bg-white rounded-2xl border border-[#E8E0D5] p-6">
            <h2 className="font-semibold text-[#2C2C2C] mb-3">Notes internes</h2>
            {booking.adminNotes ? (
              <p className="text-sm text-[#6B6B6B] mb-3">{booking.adminNotes}</p>
            ) : (
              <p className="text-sm text-[#A0A0A0] italic mb-3">Aucune note interne</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Client */}
          <div className="bg-white rounded-2xl border border-[#E8E0D5] p-6">
            <h2 className="font-semibold text-[#2C2C2C] mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-[#8B7355]" />
              Cliente
            </h2>
            <div className="space-y-2 text-sm">
              <div className="font-medium text-[#2C2C2C]">{booking.client.name || "N/A"}</div>
              <div className="text-[#6B6B6B]">{booking.client.email}</div>
              {booking.client.phone && (
                <div className="text-[#6B6B6B]">{booking.client.phone}</div>
              )}
              <Link
                href={`/admin/clients/${booking.client.id}`}
                className="text-[#8B7355] text-xs hover:underline"
              >
                Voir la fiche cliente →
              </Link>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-2xl border border-[#E8E0D5] p-6">
            <h2 className="font-semibold text-[#2C2C2C] mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#8B7355]" />
              Paiement
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#6B6B6B]">Total</span>
                <span className="font-semibold text-[#8B7355]">
                  {formatCHF(booking.totalPrice)}
                </span>
              </div>
              {booking.depositAmount && (
                <div className="flex justify-between">
                  <span className="text-[#6B6B6B]">Acompte</span>
                  <span>
                    {formatCHF(booking.depositAmount)}
                    {booking.depositPaid ? (
                      <span className="ml-1 text-green-600">(payé)</span>
                    ) : (
                      <span className="ml-1 text-orange-500">(en attente)</span>
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <BookingActions bookingId={booking.id} currentStatus={booking.status} />
        </div>
      </div>
    </div>
  );
}
