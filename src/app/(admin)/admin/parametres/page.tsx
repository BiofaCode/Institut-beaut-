import { prisma } from "@/lib/prisma";
import { SettingsForm } from "./SettingsForm";

async function getSettings() {
  try {
    const settings = await prisma.settings.findUnique({ where: { id: "default" } });
    return settings || {
      id: "default",
      instituteName: "Institut Belle & Sereine",
      logo: null,
      phone: null,
      email: null,
      address: null,
      city: null,
      postalCode: null,
      canton: null,
      googleMapsUrl: null,
      instagram: null,
      facebook: null,
      primaryColor: "#8B7355",
      secondaryColor: "#F5F0EB",
      depositPercent: 20,
      reminderHours: 24,
      cancellationHours: 24,
    };
  } catch {
    return null;
  }
}

export default async function ParametresPage() {
  const settings = await getSettings();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl text-[#2C2C2C]" style={{ fontFamily: "'Playfair Display', serif" }}>
          Paramètres
        </h1>
        <p className="text-[#6B6B6B] mt-1">Configuration générale de l&apos;institut</p>
      </div>

      <SettingsForm settings={settings as never} />
    </div>
  );
}
