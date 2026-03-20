import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Admin user
  const passwordHash = await bcrypt.hash("admin123!", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@institutbeaute.ch" },
    update: {},
    create: {
      email: "admin@institutbeaute.ch",
      name: "Sophie Martin",
      passwordHash,
      role: "ADMIN",
    },
  });

  // Demo client
  await prisma.user.upsert({
    where: { email: "cliente@example.ch" },
    update: {},
    create: {
      email: "cliente@example.ch",
      name: "Marie Dubois",
      phone: "+41 79 123 45 67",
      role: "CLIENT",
    },
  });

  // Settings
  await prisma.settings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      instituteName: "Institut Belle & Sereine",
      phone: "+41 21 123 45 67",
      email: "contact@bellesereine.ch",
      address: "Rue de la Paix 15",
      city: "Lausanne",
      postalCode: "1003",
      canton: "VD",
      primaryColor: "#8B7355",
      secondaryColor: "#F5F0EB",
      depositPercent: 20,
      reminderHours: 24,
      cancellationHours: 24,
    },
  });

  // Business hours (Mon-Sat)
  const hours = [
    { dayOfWeek: 0, isClosed: true }, // Sunday
    { dayOfWeek: 1, openTime: "09:00", closeTime: "18:30" }, // Monday
    { dayOfWeek: 2, openTime: "09:00", closeTime: "18:30" }, // Tuesday
    { dayOfWeek: 3, openTime: "09:00", closeTime: "20:00" }, // Wednesday
    { dayOfWeek: 4, openTime: "09:00", closeTime: "18:30" }, // Thursday
    { dayOfWeek: 5, openTime: "09:00", closeTime: "20:00" }, // Friday
    { dayOfWeek: 6, openTime: "09:00", closeTime: "17:00" }, // Saturday
  ];

  for (const h of hours) {
    await prisma.businessHours.upsert({
      where: { dayOfWeek: h.dayOfWeek },
      update: {},
      create: { ...h },
    });
  }

  // Service categories
  const catSoins = await prisma.serviceCategory.upsert({
    where: { slug: "soins-visage" },
    update: {},
    create: { name: "Soins Visage", slug: "soins-visage", description: "Soins et traitements pour le visage", order: 1 },
  });
  const catCorps = await prisma.serviceCategory.upsert({
    where: { slug: "soins-corps" },
    update: {},
    create: { name: "Soins Corps", slug: "soins-corps", description: "Massages et soins corporels", order: 2 },
  });
  const catEpilation = await prisma.serviceCategory.upsert({
    where: { slug: "epilation" },
    update: {},
    create: { name: "Épilation", slug: "epilation", description: "Épilation à la cire et laser", order: 3 },
  });
  const catOnglerie = await prisma.serviceCategory.upsert({
    where: { slug: "onglerie" },
    update: {},
    create: { name: "Onglerie", slug: "onglerie", description: "Manucure, pédicure et pose d'ongles", order: 4 },
  });

  // Services
  const services = [
    {
      name: "Soin Signature Belle & Sereine",
      slug: "soin-signature",
      description: "Notre soin phare : nettoyage profond, gommage, masque personnalisé et massage facial. Un moment de pure détente pour une peau lumineuse.",
      duration: 90,
      price: 145,
      categoryId: catSoins.id,
      order: 1,
    },
    {
      name: "Soin Anti-Âge Intense",
      slug: "soin-anti-age",
      description: "Traitement concentré en actifs anti-âge pour lisser les rides et raffermir la peau. Résultats visibles dès la première séance.",
      duration: 75,
      price: 165,
      categoryId: catSoins.id,
      order: 2,
    },
    {
      name: "Soin Éclat Express",
      slug: "soin-eclat-express",
      description: "En 45 minutes, retrouvez une peau fraîche et lumineuse. Idéal avant un événement.",
      duration: 45,
      price: 85,
      categoryId: catSoins.id,
      order: 3,
    },
    {
      name: "Soin Hydratant Profond",
      slug: "soin-hydratant",
      description: "Pour les peaux desséchées, ce soin restaure le film hydrolipidique et offre un confort immédiat.",
      duration: 60,
      price: 110,
      categoryId: catSoins.id,
      order: 4,
    },
    {
      name: "Massage Relaxant Corps",
      slug: "massage-relaxant",
      description: "Massage suédois aux huiles essentielles de qualité suisse. Libère les tensions et apaise le corps et l'esprit.",
      duration: 60,
      price: 120,
      categoryId: catCorps.id,
      order: 1,
    },
    {
      name: "Soin Corps Enveloppant",
      slug: "soin-corps-enveloppant",
      description: "Gommage corps + enveloppement aux argiles alpines + massage. Un rituel bien-être complet.",
      duration: 90,
      price: 160,
      categoryId: catCorps.id,
      order: 2,
    },
    {
      name: "Épilation Jambes Complètes",
      slug: "epilation-jambes",
      description: "Épilation à la cire chaude ou froide selon la sensibilité. Demi-jambes incluses.",
      duration: 45,
      price: 65,
      categoryId: catEpilation.id,
      order: 1,
    },
    {
      name: "Épilation Maillot Intégral",
      slug: "epilation-maillot",
      description: "Épilation à la cire avec finition soignée.",
      duration: 30,
      price: 55,
      categoryId: catEpilation.id,
      order: 2,
    },
    {
      name: "Épilation Aisselles",
      slug: "epilation-aisselles",
      description: "Épilation rapide et efficace à la cire chaude.",
      duration: 15,
      price: 25,
      categoryId: catEpilation.id,
      order: 3,
    },
    {
      name: "Manucure Classique",
      slug: "manucure-classique",
      description: "Soin complet des mains : limage, cuticules, soin hydratant et pose de vernis.",
      duration: 45,
      price: 55,
      categoryId: catOnglerie.id,
      order: 1,
    },
    {
      name: "Pose Gel Ongles",
      slug: "pose-gel",
      description: "Pose d'ongles en gel pour un résultat durable jusqu'à 3 semaines.",
      duration: 75,
      price: 85,
      categoryId: catOnglerie.id,
      order: 2,
    },
    {
      name: "Pédicure Soin",
      slug: "pedicure-soin",
      description: "Soin complet des pieds : bain, gommage, soin des ongles et hydratation.",
      duration: 60,
      price: 75,
      categoryId: catOnglerie.id,
      order: 3,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: {
        ...service,
        price: service.price,
        currency: "CHF",
      },
    });
  }

  // Staff member
  const sophie = await prisma.staffMember.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      userId: admin.id,
      name: "Sophie Martin",
      title: "Esthéticienne diplômée CIFC",
      bio: "Sophie est fondatrice de l'institut et possède 15 ans d'expérience en soins esthétiques. Spécialisée dans les soins visage et les massages relaxants, elle accorde une attention particulière à chaque cliente.",
      isActive: true,
    },
  });

  await prisma.staffMember.upsert({
    where: { id: "staff-lea" },
    update: {},
    create: {
      id: "staff-lea",
      name: "Léa Fontaine",
      title: "Esthéticienne & Ongleries",
      bio: "Léa est spécialisée dans l'onglerie et les soins corps. Avec 8 ans de pratique, elle maîtrise toutes les techniques de pose et crée des designs personnalisés.",
      isActive: true,
    },
  });

  // Staff schedules
  for (let day = 1; day <= 5; day++) {
    await prisma.staffSchedule.upsert({
      where: { id: `sophie-schedule-${day}` },
      update: {},
      create: {
        id: `sophie-schedule-${day}`,
        staffId: sophie.id,
        dayOfWeek: day,
        startTime: "09:00",
        endTime: "18:30",
        isWorking: true,
      },
    });
  }

  // Gallery images (placeholder URLs)
  const galleryImages = [
    { url: "/images/gallery/soin-visage-1.jpg", alt: "Soin visage relaxant", category: "soins" },
    { url: "/images/gallery/massage-corps-1.jpg", alt: "Massage corps", category: "soins" },
    { url: "/images/gallery/ambiance-1.jpg", alt: "Espace détente", category: "ambiance" },
    { url: "/images/gallery/ambiance-2.jpg", alt: "Salle de soin", category: "ambiance" },
    { url: "/images/gallery/onglerie-1.jpg", alt: "Pose ongles gel", category: "onglerie" },
    { url: "/images/gallery/equipe-1.jpg", alt: "Notre équipe", category: "equipe" },
  ];

  for (let i = 0; i < galleryImages.length; i++) {
    await prisma.galleryImage.upsert({
      where: { id: `gallery-${i + 1}` },
      update: {},
      create: { id: `gallery-${i + 1}`, ...galleryImages[i], order: i + 1 },
    });
  }

  console.log("✅ Seed completed successfully!");
  console.log("Admin credentials: admin@institutbeaute.ch / admin123!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
