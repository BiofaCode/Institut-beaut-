import { prisma } from "@/lib/prisma";
import { formatCHF, formatDuration } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ServiceActions } from "./ServiceActions";
import { AddServiceButton } from "./AddServiceButton";
import { Clock } from "lucide-react";

async function getServicesWithCategories() {
  try {
    const [services, categories] = await Promise.all([
      prisma.service.findMany({
        include: { category: true },
        orderBy: [{ category: { order: "asc" } }, { order: "asc" }],
      }),
      prisma.serviceCategory.findMany({ orderBy: { order: "asc" } }),
    ]);
    return { services, categories };
  } catch {
    return { services: [], categories: [] };
  }
}

export default async function ServicesAdminPage() {
  const { services, categories } = await getServicesWithCategories();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-3xl text-[#2C2C2C]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Services
          </h1>
          <p className="text-[#6B6B6B] mt-1">{services.length} service(s)</p>
        </div>
        <AddServiceButton categories={categories} />
      </div>

      <div className="bg-white rounded-2xl border border-[#E8E0D5] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F5F0EB]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">
                  Service
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">
                  Durée
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">
                  Prix
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F0EB]">
              {services.map((service) => (
                <tr key={service.id} className="hover:bg-[#FEFCF9]">
                  <td className="px-4 py-3">
                    <div className="font-medium text-[#2C2C2C] text-sm">{service.name}</div>
                    {service.description && (
                      <div className="text-xs text-[#6B6B6B] line-clamp-1 mt-0.5">
                        {service.description}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-[#6B6B6B]">{service.category.name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-[#6B6B6B] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDuration(service.duration)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-[#8B7355]">
                      {formatCHF(service.price)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={service.isActive ? "success" : "secondary"}>
                      {service.isActive ? "Actif" : "Inactif"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <ServiceActions service={service} categories={categories} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
