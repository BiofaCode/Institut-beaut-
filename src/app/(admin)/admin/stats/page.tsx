import { prisma } from "@/lib/prisma";
import { formatCHF } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Calendar, BarChart2, AlertCircle, CheckCircle } from "lucide-react";

async function getStats() {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const [
      allBookings,
      monthBookings,
      yearBookings,
      totalClients,
      topServices,
    ] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.findMany({
        where: { date: { gte: startOfMonth }, status: { notIn: ["CANCELLED"] } },
        select: { totalPrice: true, status: true },
      }),
      prisma.booking.findMany({
        where: { date: { gte: startOfYear }, status: "COMPLETED" },
        select: { totalPrice: true },
      }),
      prisma.user.count({ where: { role: "CLIENT" } }),
      prisma.booking.groupBy({
        by: ["serviceId"],
        where: { status: { notIn: ["CANCELLED"] } },
        _count: { _all: true },
        orderBy: { _count: { serviceId: "desc" } },
        take: 5,
      }),
    ]);

    const monthRevenue = monthBookings
      .filter((b) => b.status === "COMPLETED")
      .reduce((sum, b) => sum + Number(b.totalPrice), 0);

    const yearRevenue = yearBookings.reduce((sum, b) => sum + Number(b.totalPrice), 0);

    const noShows = await prisma.booking.count({ where: { status: "NO_SHOW" } });
    const cancelled = await prisma.booking.count({ where: { status: "CANCELLED" } });

    // Get service names
    const serviceIds = topServices.map((s) => s.serviceId);
    const services = await prisma.service.findMany({
      where: { id: { in: serviceIds } },
      select: { id: true, name: true },
    });

    const topServicesWithNames = topServices.map((ts) => ({
      ...ts,
      name: services.find((s) => s.id === ts.serviceId)?.name || "Inconnu",
    }));

    return {
      allBookings,
      monthRevenue,
      yearRevenue,
      totalClients,
      noShows,
      cancelled,
      topServices: topServicesWithNames,
      noShowRate: allBookings > 0 ? Math.round((noShows / allBookings) * 100) : 0,
      cancellationRate: allBookings > 0 ? Math.round((cancelled / allBookings) * 100) : 0,
    };
  } catch {
    return {
      allBookings: 0,
      monthRevenue: 0,
      yearRevenue: 0,
      totalClients: 0,
      noShows: 0,
      cancelled: 0,
      topServices: [],
      noShowRate: 0,
      cancellationRate: 0,
    };
  }
}

export default async function StatsPage() {
  const stats = await getStats();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl text-[#2C2C2C]" style={{ fontFamily: "'Playfair Display', serif" }}>
          Statistiques
        </h1>
        <p className="text-[#6B6B6B] mt-1">Vue d&apos;ensemble de l&apos;activité de l&apos;institut</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-[#2C2C2C]">{formatCHF(stats.monthRevenue)}</div>
            <div className="text-sm text-[#6B6B6B] mt-1">CA ce mois</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <BarChart2 className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-[#2C2C2C]">{formatCHF(stats.yearRevenue)}</div>
            <div className="text-sm text-[#6B6B6B] mt-1">CA cette année</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-[#2C2C2C]">{stats.totalClients}</div>
            <div className="text-sm text-[#6B6B6B] mt-1">Clients total</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-[#2C2C2C]">{stats.allBookings}</div>
            <div className="text-sm text-[#6B6B6B] mt-1">Total réservations</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top services */}
        <Card>
          <CardHeader>
            <CardTitle>Services les plus réservés</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.topServices.length === 0 ? (
              <p className="text-[#6B6B6B] text-sm">Aucune donnée</p>
            ) : (
              <div className="space-y-4">
                {stats.topServices.map((service, i) => {
                  const maxCount = stats.topServices[0]?._count._all || 1;
                  const pct = (service._count._all / maxCount) * 100;
                  return (
                    <div key={service.serviceId}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-[#2C2C2C] font-medium">{service.name}</span>
                        <span className="text-[#6B6B6B]">{service._count._all} rés.</span>
                      </div>
                      <div className="h-2 bg-[#F5F0EB] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#8B7355] rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Rates */}
        <Card>
          <CardHeader>
            <CardTitle>Taux de qualité</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="flex items-center gap-2 text-[#2C2C2C]">
                    <AlertCircle className="w-4 h-4 text-orange-500" />
                    Taux de no-show
                  </span>
                  <span className="font-semibold text-orange-600">{stats.noShowRate}%</span>
                </div>
                <div className="h-2 bg-[#F5F0EB] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-400 rounded-full"
                    style={{ width: `${stats.noShowRate}%` }}
                  />
                </div>
                <p className="text-xs text-[#A0A0A0] mt-1">{stats.noShows} absence(s) sur {stats.allBookings} réservation(s)</p>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="flex items-center gap-2 text-[#2C2C2C]">
                    <CheckCircle className="w-4 h-4 text-red-500" />
                    Taux d&apos;annulation
                  </span>
                  <span className="font-semibold text-red-600">{stats.cancellationRate}%</span>
                </div>
                <div className="h-2 bg-[#F5F0EB] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-400 rounded-full"
                    style={{ width: `${stats.cancellationRate}%` }}
                  />
                </div>
                <p className="text-xs text-[#A0A0A0] mt-1">{stats.cancelled} annulation(s) sur {stats.allBookings} réservation(s)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
