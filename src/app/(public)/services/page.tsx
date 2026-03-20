import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { formatCHF, formatDuration } from "@/lib/utils";
import { Clock, ArrowRight, Leaf } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nos Services",
  description:
    "Découvrez tous nos soins visage, massages, épilations et services d'onglerie à Lausanne.",
};

async function getCategoriesWithServices() {
  try {
    return await prisma.serviceCategory.findMany({
      include: {
        services: {
          where: { isActive: true },
          orderBy: { order: "asc" },
        },
      },
      orderBy: { order: "asc" },
    });
  } catch {
    return [];
  }
}

export default async function ServicesPage() {
  const categories = await getCategoriesWithServices();

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-[#F5F0EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[#8B7355] text-sm font-medium uppercase tracking-widest">
            Catalogue
          </span>
          <h1
            className="text-5xl text-[#2C2C2C] mt-2 mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Nos Services
          </h1>
          <p className="text-[#6B6B6B] max-w-2xl mx-auto text-lg">
            Chaque soin est pensé pour votre bien-être. Nos esthéticiennes diplômées vous accueillent
            dans un cadre chaleureux et élégant.
          </p>
        </div>
      </section>

      {/* Services by category */}
      <section className="py-16 bg-[#FEFCF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category tabs */}
          <div className="flex flex-wrap gap-3 mb-12">
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`#${cat.slug}`}
                className="px-4 py-2 rounded-full text-sm font-medium bg-[#F5F0EB] text-[#8B7355] hover:bg-[#8B7355] hover:text-white transition-colors"
              >
                {cat.name}
              </a>
            ))}
          </div>

          {categories.map((category) => (
            <div key={category.id} id={category.slug} className="mb-16">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <h2
                    className="text-3xl text-[#2C2C2C]"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {category.name}
                  </h2>
                  {category.description && (
                    <p className="text-[#6B6B6B] mt-1">{category.description}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.services.map((service) => (
                  <div
                    key={service.id}
                    className="bg-white rounded-2xl border border-[#E8E0D5] p-6 group hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3
                        className="text-lg font-semibold text-[#2C2C2C] group-hover:text-[#8B7355] transition-colors flex-1"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {service.name}
                      </h3>
                    </div>

                    {service.description && (
                      <p className="text-sm text-[#6B6B6B] mb-4 leading-relaxed">
                        {service.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-[#F5F0EB]">
                      <div className="flex items-center gap-1.5 text-sm text-[#6B6B6B]">
                        <Clock className="w-3.5 h-3.5 text-[#9CAF88]" />
                        {formatDuration(service.duration)}
                      </div>
                      <span className="text-lg font-semibold text-[#8B7355]">
                        {formatCHF(service.price)}
                      </span>
                    </div>

                    <Link
                      href={`/reservation?service=${service.id}`}
                      className="mt-4 flex items-center gap-1 text-sm font-medium text-[#8B7355] hover:gap-2 transition-all"
                    >
                      Réserver
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* CTA */}
          <div className="text-center mt-8 p-10 bg-[#F5F0EB] rounded-3xl">
            <Leaf className="w-8 h-8 text-[#9CAF88] mx-auto mb-3" />
            <h3
              className="text-2xl text-[#2C2C2C] mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Besoin d&apos;un conseil personnalisé ?
            </h3>
            <p className="text-[#6B6B6B] mb-6">
              Contactez-nous pour une consultation gratuite. Nous vous orienterons vers le soin
              adapté à vos besoins.
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <Link href="/reservation">Réserver en ligne</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/contact">Nous contacter</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
