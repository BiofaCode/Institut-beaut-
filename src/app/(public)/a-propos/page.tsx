import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Award, Heart, Leaf, Users, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "L'Institut Belle & Sereine, votre espace beauté à Lausanne. Découvrez notre histoire, notre équipe et nos valeurs.",
};

async function getStaff() {
  try {
    return await prisma.staffMember.findMany({
      where: { isActive: true },
    });
  } catch {
    return [];
  }
}

export default async function AboutPage() {
  const staff = await getStaff();

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-[#F5F0EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[#8B7355] text-sm font-medium uppercase tracking-widest">
                Notre histoire
              </span>
              <h1
                className="text-5xl text-[#2C2C2C] mt-2 mb-6"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Un lieu pensé pour vous
              </h1>
              <p className="text-[#6B6B6B] text-lg mb-6 leading-relaxed">
                Fondé en 2009 par Sophie Martin à Lausanne, l&apos;Institut Belle & Sereine est né
                d&apos;une passion pour la beauté et le bien-être. Notre mission : créer un espace
                où chaque cliente se sent choyée, écoutée et transformée.
              </p>
              <p className="text-[#6B6B6B] mb-8 leading-relaxed">
                Nous sélectionnons rigoureusement nos produits pour leur efficacité et leur respect
                de la peau. Nos esthéticiennes suivent des formations continues pour vous offrir les
                dernières techniques et technologies esthétiques.
              </p>
              <Button asChild>
                <Link href="/reservation">
                  Prendre rendez-vous
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: Users, value: "500+", label: "Clientes fidèles", color: "bg-[#8B7355]" },
                { icon: Award, value: "15 ans", label: "D'expertise", color: "bg-[#9CAF88]" },
                { icon: Heart, value: "98%", label: "Satisfaction", color: "bg-[#C9A97A]" },
                { icon: Leaf, value: "100%", label: "Produits sélectionnés", color: "bg-[#8B7355]" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-sm text-center">
                  <div
                    className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-3`}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div
                    className="text-3xl font-bold text-[#2C2C2C] mb-1"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-sm text-[#6B6B6B]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className="text-4xl text-[#2C2C2C]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Nos valeurs
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Excellence & qualité",
                description:
                  "Nous n'utilisons que des produits professionnels certifiés, sélectionnés pour leur efficacité et leur douceur. Chaque geste est précis, chaque soin est un rituel.",
              },
              {
                title: "Écoute & personnalisation",
                description:
                  "Chaque cliente est unique. Nous prenons le temps de comprendre vos besoins, votre peau, vos attentes pour adapter chaque soin à votre profil.",
              },
              {
                title: "Bien-être & sérénité",
                description:
                  "Notre institut est un espace hors du temps. Une ambiance feutrée, une musique douce, des parfums délicats — tout est pensé pour votre relaxation totale.",
              },
            ].map((value) => (
              <div key={value.title} className="text-center p-8 rounded-2xl bg-[#FEFCF9] border border-[#E8E0D5]">
                <h3
                  className="text-xl text-[#2C2C2C] mb-3"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {value.title}
                </h3>
                <p className="text-[#6B6B6B] text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      {staff.length > 0 && (
        <section className="py-20 bg-[#FEFCF9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-[#8B7355] text-sm font-medium uppercase tracking-widest">
                Notre équipe
              </span>
              <h2
                className="text-4xl text-[#2C2C2C] mt-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Des expertes à votre service
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {staff.map((member) => (
                <div key={member.id} className="bg-white rounded-2xl overflow-hidden border border-[#E8E0D5] group">
                  <div className="h-64 bg-gradient-to-br from-[#F5F0EB] to-[#E8E0D5] flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-[#8B7355]/20 flex items-center justify-center">
                      <Users className="w-12 h-12 text-[#8B7355]" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3
                      className="text-xl text-[#2C2C2C] mb-1"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {member.name}
                    </h3>
                    {member.title && (
                      <p className="text-[#8B7355] text-sm font-medium mb-3">{member.title}</p>
                    )}
                    {member.bio && (
                      <p className="text-[#6B6B6B] text-sm leading-relaxed">{member.bio}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
