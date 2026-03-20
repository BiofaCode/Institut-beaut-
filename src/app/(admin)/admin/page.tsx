import { prisma } from "@/lib/prisma";
import { formatCHF, formatDate, formatTime } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

const statusConfig = {
  PENDING: { label: "En attente", variant: "warning" as const },
  CONFIRMED: { label: "Confirmé", variant: "success" as const },
  CANCELLED: { label: "Annulé", variant: "destructive" as const },
  COMPLETED: { label: "Terminé", variant: "secondary" as const },
  NO_SHOW: { label: "Absent", variant: "destructive" as const },
};

async function getDashboardData() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  try {
    const [todayBookings, monthBookings, pendingCount, totalClients] = await Promise.all([
      prisma.booking.findMany({
        where: { date: { gte: today, lt: tomorrow } },
        include: {
          client: { select: { name: true, email: true } },
          service: { select: { name: true, price: true } },
          staff: { select: { name: true } },
        },
        orderBy: { startTime: "asc" },
      }),
      prisma.booking.findMany({
        where: {
          date: { gte: startOfMonth, lte: endOfMonth },
          status: { notIn: ["CANCELLED"] },
        },
        select: { totalPrice: true, status: true },
      }),
      prisma.booking.count({ where: { status: "PENDING" } }),
      prisma.user.count({ where: { role: "CLIENT" } }),
    ]);

    const monthRevenue = monthBookings
      .filter((b) => b.status === "COMPLETED")
      .reduce((sum, b) => sum + Number(b.totalPrice), 0);

    return {
      todayBookings,
      monthRevenue,
      pendingCount,
      totalClients,
      todayCount: todayBookings.length,
    };
  } catch {
    return {
      todayBookings: [],
      monthRevenue: 0,
      pendingCount: 0,
      totalClients: 0,
      todayCount: 0,
    };
  }
}

export default async function AdminDashboard() {
  const data = await getDashboardData();
  const todayStr = format(new Date(), "EEEE d MMMM yyyy", { locale: fr });

  return (
    <div>
      <div className="mb-8">
        <h1
          className="text-3xl text-[#2C2C2C]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Bonjour 👋
        </h1>
        <p className="text-[#6B6B6B] mt-1 capitalize">{todayStr}</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-xs text-[#6B6B6B] bg-[#F5F0EB] px-2 py-0.5 rounded-full">
                Aujourd&apos;hui
              </span>
            </div>
            <div className="text-3xl font-bold text-[#2C2C2C]">{data.todayCount}</div>
            <div className="text-sm text-[#6B6B6B] mt-1">Rendez-vous</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-xs text-[#6B6B6B] bg-[#F5F0EB] px-2 py-0.5 rounded-full">
                Ce mois
              </span>
            </div>
            <div className="text-3xl font-bold text-[#2C2C2C]">
              {formatCHF(data.monthRevenue)}
            </div>
            <div className="text-sm text-[#6B6B6B] mt-1">Chiffre d&apos;affaires</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-orange-500" />
              </div>
              {data.pendingCount > 0 && (
                <span className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                  À confirmer
                </span>
              )}
            </div>
            <div className="text-3xl font-bold text-[#2C2C2C]">{data.pendingCount}</div>
            <div className="text-sm text-[#6B6B6B] mt-1">En attente</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-[#2C2C2C]">{data.totalClients}</div>
            <div className="text-sm text-[#6B6B6B] mt-1">Clients au total</div>
          </CardContent>
        </Card>
      </div>

      {/* Today's schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Planning du jour</CardTitle>
              <Link
                href="/admin/reservations"
                className="text-sm text-[#8B7355] flex items-center gap-1 hover:gap-2 transition-all"
              >
                Tout voir <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {data.todayBookings.length === 0 ? (
              <div className="text-center py-10 text-[#6B6B6B]">
                <CheckCircle className="w-10 h-10 text-[#E8E0D5] mx-auto mb-3" />
                <p>Aucun rendez-vous aujourd&apos;hui</p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.todayBookings.map((booking) => (
                  <Link
                    key={booking.id}
                    href={`/admin/reservations/${booking.id}`}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#F5F0EB] transition-colors group"
                  >
                    <div className="text-center w-16 flex-shrink-0">
                      <div className="text-[#8B7355] font-bold text-sm">
                        {formatTime(booking.startTime)}
                      </div>
                      <div className="text-xs text-[#6B6B6B]">
                        {booking.endTime}
                      </div>
                    </div>
                    <div className="w-px h-10 bg-[#E8E0D5]" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-[#2C2C2C] truncate">
                        {booking.client.name || booking.client.email}
                      </div>
                      <div className="text-sm text-[#6B6B6B] truncate">{booking.service.name}</div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant={statusConfig[booking.status].variant}>
                        {statusConfig[booking.status].label}
                      </Badge>
                      <span className="text-sm font-medium text-[#8B7355]">
                        {formatCHF(booking.service.price)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Accès rapide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { href: "/admin/reservations", icon: Calendar, label: "Voir le calendrier" },
                { href: "/admin/services", icon: CheckCircle, label: "Gérer les services" },
                { href: "/admin/horaires", icon: Clock, label: "Modifier les horaires" },
                { href: "/admin/clients", icon: Users, label: "Base clients" },
                { href: "/admin/stats", icon: TrendingUp, label: "Statistiques" },
                { href: "/admin/parametres", icon: CheckCircle, label: "Paramètres" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#F5F0EB] transition-colors text-sm text-[#2C2C2C]"
                >
                  <item.icon className="w-4 h-4 text-[#8B7355]" />
                  {item.label}
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
