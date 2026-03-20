import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { BookingWizard } from "@/components/public/BookingWizard";
import { Loader2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Réservation en ligne",
  description:
    "Réservez votre soin en ligne en quelques minutes. Disponible 24h/24.",
};

async function getData() {
  try {
    const [categories, staff] = await Promise.all([
      prisma.serviceCategory.findMany({
        include: {
          services: {
            where: { isActive: true },
            orderBy: { order: "asc" },
          },
        },
        orderBy: { order: "asc" },
      }),
      prisma.staffMember.findMany({
        where: { isActive: true },
        select: { id: true, name: true, title: true },
      }),
    ]);
    return { categories, staff };
  } catch {
    return { categories: [], staff: [] };
  }
}

export default async function ReservationPage() {
  const { categories, staff } = await getData();

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-10 bg-[#F5F0EB] text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[#8B7355] text-sm font-medium uppercase tracking-widest">
            Réservation en ligne
          </span>
          <h1
            className="text-5xl text-[#2C2C2C] mt-2 mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Prenez rendez-vous
          </h1>
          <p className="text-[#6B6B6B] max-w-xl mx-auto">
            Réservez votre soin en quelques étapes simples. Disponible 24h/24.
          </p>
        </div>
      </section>

      {/* Booking wizard */}
      <section className="py-12 bg-[#FEFCF9]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-[#E8E0D5] shadow-sm p-6 sm:p-10">
            <Suspense
              fallback={
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-[#8B7355]" />
                </div>
              }
            >
              <BookingWizard categories={categories as never} staff={staff} />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
}
