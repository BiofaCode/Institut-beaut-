import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

async function getStaff() {
  try {
    return await prisma.staffMember.findMany({
      include: {
        _count: { select: { bookings: true } },
        services: { include: { service: { select: { name: true } } } },
      },
      orderBy: { name: "asc" },
    });
  } catch {
    return [];
  }
}

export default async function EquipePage() {
  const staff = await getStaff();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl text-[#2C2C2C]" style={{ fontFamily: "'Playfair Display', serif" }}>
          Équipe
        </h1>
        <p className="text-[#6B6B6B] mt-1">{staff.length} membre(s)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff.length === 0 ? (
          <div className="col-span-3 text-center py-20 text-[#6B6B6B]">
            <Users className="w-12 h-12 text-[#E8E0D5] mx-auto mb-3" />
            <p>Aucun membre d&apos;équipe pour le moment</p>
          </div>
        ) : (
          staff.map((member) => (
            <div key={member.id} className="bg-white rounded-2xl border border-[#E8E0D5] p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#F5F0EB] flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-[#8B7355]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[#2C2C2C]">{member.name}</h3>
                  {member.title && <p className="text-sm text-[#8B7355]">{member.title}</p>}
                  <Badge variant={member.isActive ? "success" : "secondary"} className="mt-1">
                    {member.isActive ? "Actif" : "Inactif"}
                  </Badge>
                </div>
              </div>
              {member.bio && <p className="text-sm text-[#6B6B6B] mb-4">{member.bio}</p>}
              <div>
                <p className="text-xs font-semibold text-[#8B7355] uppercase tracking-wider mb-2">
                  Services ({member.services.length})
                </p>
                <div className="flex flex-wrap gap-1">
                  {member.services.map((ss) => (
                    <span key={ss.serviceId} className="text-xs bg-[#F5F0EB] text-[#8B7355] px-2 py-0.5 rounded-full">
                      {ss.service.name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-[#F5F0EB] text-sm text-[#6B6B6B]">
                {member._count.bookings} rendez-vous effectués
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
