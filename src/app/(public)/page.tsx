import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCHF, formatDuration } from "@/lib/utils";
import {
  ArrowRight,
  Star,
  Clock,
  Shield,
  Leaf,
  Award,
  Phone,
  Calendar,
} from "lucide-react";

async function getFeaturedServices() {
  try {
    return await prisma.service.findMany({
      where: { isActive: true },
      include: { category: true },
      orderBy: { order: "asc" },
      take: 6,
    });
  } catch {
    return [];
  }
}

const testimonials = [
  {
    name: "Marie-Claire V.",
    text: "Un vrai moment de bonheur ! Sophie est aux petits soins, ses mains sont magiques. Je repars toujours ressourcée et avec une peau magnifique.",
    rating: 5,
    service: "Soin Signature",
  },
  {
    name: "Isabelle R.",
    text: "L'institut le plus professionnel de Lausanne. L'ambiance est feutrée, les produits de qualité supérieure. Je recommande à toutes mes amies.",
    rating: 5,
    service: "Massage Corps",
  },
  {
    name: "Nathalie M.",
    text: "Ma pose de gel tient 3 semaines sans écailles ! Léa est une artiste, elle crée des designs personnalisés magnifiques.",
    rating: 5,
    service: "Pose Gel Ongles",
  },
];

export default async function HomePage() {
  const services = await getFeaturedServices();

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "linear-gradient(135deg, #2C2420 0%, #4A3728 50%, #6D5A42 100%)",
          }}
        />
        <div className="absolute inset-0 bg-black/20" />

        {/* Decorative elements */}
        <div className="absolute top-1/4 left-8 w-72 h-72 rounded-full bg-[#8B7355]/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-8 w-96 h-96 rounded-full bg-[#9CAF88]/10 blur-3xl" />

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 py-32">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-sm mb-8">
            <Leaf className="w-3.5 h-3.5 text-[#9CAF88]" />
            <span>Institut de beauté à Lausanne</span>
          </div>

          <h1
            className="text-5xl sm:text-6xl lg:text-7xl text-white mb-6 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Révélez votre
            <em className="block text-[#C9A97A] not-italic">beauté naturelle</em>
          </h1>

          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            Un havre de bien-être au cœur de Lausanne. Soins visage, massages, épilation et onglerie
            dans un cadre élégant et apaisant.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/reservation">
                <Calendar className="w-5 h-5" />
                Réserver mon soin
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/40 text-white hover:bg-white/10">
              <Link href="/services">
                Découvrir nos services
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-white/10">
            {[
              { value: "500+", label: "Clientes fidèles" },
              { value: "15 ans", label: "D'expérience" },
              { value: "4.9★", label: "Note Google" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 text-xs">
          <span>Découvrir</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </section>

      {/* Values section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Award,
                title: "Excellence",
                description: "Produits professionnels sélectionnés pour leurs résultats",
              },
              {
                icon: Shield,
                title: "Expertise",
                description: "Esthéticiennes diplômées CIFC avec des années d'expérience",
              },
              {
                icon: Leaf,
                title: "Naturel",
                description: "Produits respectueux de votre peau et de l'environnement",
              },
              {
                icon: Clock,
                title: "Sur mesure",
                description: "Chaque soin est adapté à vos besoins et votre peau",
              },
            ].map((value) => (
              <div key={value.title} className="text-center group">
                <div className="w-12 h-12 bg-[#F5F0EB] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#8B7355] transition-colors duration-300">
                  <value.icon className="w-6 h-6 text-[#8B7355] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-semibold text-[#2C2C2C] mb-2">{value.title}</h3>
                <p className="text-sm text-[#6B6B6B] leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-20 bg-[#FEFCF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#8B7355] text-sm font-medium uppercase tracking-widest">
              Nos soins
            </span>
            <h2
              className="text-4xl text-[#2C2C2C] mt-2 mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Nos services phares
            </h2>
            <p className="text-[#6B6B6B] max-w-2xl mx-auto">
              Découvrez notre sélection de soins signature, conçus pour révéler votre éclat naturel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card
                key={service.id}
                className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="h-48 bg-gradient-to-br from-[#F5F0EB] to-[#E8E0D5] relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    <Leaf className="w-24 h-24 text-[#8B7355]" />
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="text-xs font-medium text-[#8B7355] bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full">
                      {service.category.name}
                    </span>
                  </div>
                </div>
                <CardContent className="p-5">
                  <h3
                    className="text-lg font-semibold text-[#2C2C2C] mb-2 group-hover:text-[#8B7355] transition-colors"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {service.name}
                  </h3>
                  {service.description && (
                    <p className="text-sm text-[#6B6B6B] mb-4 line-clamp-2">
                      {service.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm text-[#6B6B6B]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDuration(service.duration)}
                      </span>
                    </div>
                    <span className="font-semibold text-[#8B7355]">
                      {formatCHF(service.price)}
                    </span>
                  </div>
                  <Link
                    href={`/reservation?service=${service.id}`}
                    className="mt-4 flex items-center gap-1 text-sm font-medium text-[#8B7355] hover:gap-2 transition-all"
                  >
                    Réserver ce soin
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button asChild variant="outline">
              <Link href="/services">
                Voir tous nos services
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[#F5F0EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#8B7355] text-sm font-medium uppercase tracking-widest">
              Témoignages
            </span>
            <h2
              className="text-4xl text-[#2C2C2C] mt-2 mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Ce que disent nos clientes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-[#8B7355] text-[#8B7355]" />
                  ))}
                </div>
                <p className="text-[#2C2C2C] text-sm leading-relaxed mb-4 italic">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div>
                  <div className="font-semibold text-[#2C2C2C] text-sm">{testimonial.name}</div>
                  <div className="text-[#8B7355] text-xs">{testimonial.service}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#2C2C2C]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-4xl text-white mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Prête pour votre moment de beauté ?
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Réservez en ligne en quelques minutes, disponible 24h/24.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/reservation">
                <Calendar className="w-5 h-5" />
                Réserver maintenant
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
              <a href="tel:+41211234567">
                <Phone className="w-5 h-5" />
                +41 21 123 45 67
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
