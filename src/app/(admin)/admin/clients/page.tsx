import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Users, Search } from "lucide-react";

async function getClients() {
  try {
    return await prisma.user.findMany({
      where: { role: "CLIENT" },
      include: {
        _count: { select: { bookings: true } },
        bookings: {
          orderBy: { date: "desc" },
          take: 1,
          select: { date: true, status: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

export default async function ClientsPage() {
  const clients = await getClients();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl text-[#2C2C2C]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Clients
          </h1>
          <p className="text-[#6B6B6B] mt-1">{clients.length} client(s) au total</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-[#E8E0D5] mb-6 max-w-sm">
        <Search className="w-4 h-4 text-[#A0A0A0]" />
        <input
          type="text"
          placeholder="Rechercher par nom ou email..."
          className="bg-transparent outline-none flex-1 text-sm text-[#2C2C2C] placeholder:text-[#A0A0A0]"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#E8E0D5] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F5F0EB]">
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">
                Client
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider hidden sm:table-cell">
                Téléphone
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider hidden md:table-cell">
                RDV total
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider hidden lg:table-cell">
                Dernière visite
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider hidden md:table-cell">
                Client depuis
              </th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5F0EB]">
            {clients.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12">
                  <Users className="w-10 h-10 text-[#E8E0D5] mx-auto mb-2" />
                  <p className="text-[#6B6B6B]">Aucun client pour le moment</p>
                </td>
              </tr>
            ) : (
              clients.map((client) => (
                <tr key={client.id} className="hover:bg-[#FEFCF9]">
                  <td className="px-4 py-3">
                    <div className="font-medium text-[#2C2C2C] text-sm">{client.name || "—"}</div>
                    <div className="text-xs text-[#6B6B6B]">{client.email}</div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="text-sm text-[#6B6B6B]">{client.phone || "—"}</span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-sm text-[#2C2C2C] font-medium">{client._count.bookings}</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-sm text-[#6B6B6B]">
                      {client.bookings[0] ? formatDate(client.bookings[0].date) : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-sm text-[#6B6B6B]">
                      {formatDate(client.createdAt)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/clients/${client.id}`}
                      className="text-xs text-[#8B7355] hover:underline"
                    >
                      Fiche
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
