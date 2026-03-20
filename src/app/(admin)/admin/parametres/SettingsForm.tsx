"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Loader2, CheckCircle } from "lucide-react";

type Settings = {
  instituteName: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  postalCode: string | null;
  canton: string | null;
  googleMapsUrl: string | null;
  instagram: string | null;
  facebook: string | null;
  primaryColor: string;
  secondaryColor: string;
  depositPercent: number;
  reminderHours: number;
  cancellationHours: number;
};

export function SettingsForm({ settings }: { settings: Settings | null }) {
  const [form, setForm] = useState({
    instituteName: settings?.instituteName || "",
    phone: settings?.phone || "",
    email: settings?.email || "",
    address: settings?.address || "",
    city: settings?.city || "",
    postalCode: settings?.postalCode || "",
    canton: settings?.canton || "",
    googleMapsUrl: settings?.googleMapsUrl || "",
    instagram: settings?.instagram || "",
    facebook: settings?.facebook || "",
    primaryColor: settings?.primaryColor || "#8B7355",
    secondaryColor: settings?.secondaryColor || "#F5F0EB",
    depositPercent: settings?.depositPercent || 20,
    reminderHours: settings?.reminderHours || 24,
    cancellationHours: settings?.cancellationHours || 24,
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const field = (id: keyof typeof form, label: string, type = "text", placeholder = "") => (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        className="mt-1"
        placeholder={placeholder}
        value={form[id] as string}
        onChange={(e) => setForm({ ...form, [id]: type === "number" ? Number(e.target.value) : e.target.value })}
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Institut info */}
      <div className="bg-white rounded-2xl border border-[#E8E0D5] p-6">
        <h2 className="font-semibold text-[#2C2C2C] mb-5" style={{ fontFamily: "'Playfair Display', serif" }}>
          Informations de l&apos;institut
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {field("instituteName", "Nom de l'institut *")}
          {field("phone", "Téléphone", "tel", "+41 21 000 00 00")}
          {field("email", "Email de contact", "email", "contact@exemple.ch")}
          {field("address", "Adresse")}
          {field("city", "Ville")}
          {field("postalCode", "Code postal")}
          {field("canton", "Canton (ex: VD, GE, VS)")}
          {field("googleMapsUrl", "URL Google Maps")}
          {field("instagram", "Instagram (@handle)")}
          {field("facebook", "Facebook (URL)")}
        </div>
      </div>

      {/* Colors */}
      <div className="bg-white rounded-2xl border border-[#E8E0D5] p-6">
        <h2 className="font-semibold text-[#2C2C2C] mb-5" style={{ fontFamily: "'Playfair Display', serif" }}>
          Couleurs du thème
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <Label>Couleur principale</Label>
            <div className="flex items-center gap-3 mt-1">
              <input
                type="color"
                value={form.primaryColor}
                onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                className="w-10 h-10 rounded-lg border border-[#E8E0D5] cursor-pointer"
              />
              <Input
                value={form.primaryColor}
                onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                placeholder="#8B7355"
                className="flex-1"
              />
              <div
                className="w-10 h-10 rounded-lg border border-[#E8E0D5]"
                style={{ backgroundColor: form.primaryColor }}
              />
            </div>
          </div>
          <div>
            <Label>Couleur secondaire</Label>
            <div className="flex items-center gap-3 mt-1">
              <input
                type="color"
                value={form.secondaryColor}
                onChange={(e) => setForm({ ...form, secondaryColor: e.target.value })}
                className="w-10 h-10 rounded-lg border border-[#E8E0D5] cursor-pointer"
              />
              <Input
                value={form.secondaryColor}
                onChange={(e) => setForm({ ...form, secondaryColor: e.target.value })}
                placeholder="#F5F0EB"
                className="flex-1"
              />
              <div
                className="w-10 h-10 rounded-lg border border-[#E8E0D5]"
                style={{ backgroundColor: form.secondaryColor }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Booking config */}
      <div className="bg-white rounded-2xl border border-[#E8E0D5] p-6">
        <h2 className="font-semibold text-[#2C2C2C] mb-5" style={{ fontFamily: "'Playfair Display', serif" }}>
          Configuration des réservations
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="depositPercent">Acompte (%)</Label>
            <Input
              id="depositPercent"
              type="number"
              className="mt-1"
              min={0}
              max={100}
              value={form.depositPercent}
              onChange={(e) => setForm({ ...form, depositPercent: Number(e.target.value) })}
            />
            <p className="text-xs text-[#6B6B6B] mt-1">0 = pas d&apos;acompte</p>
          </div>
          <div>
            <Label htmlFor="reminderHours">Rappel (heures avant)</Label>
            <Input
              id="reminderHours"
              type="number"
              className="mt-1"
              min={1}
              max={72}
              value={form.reminderHours}
              onChange={(e) => setForm({ ...form, reminderHours: Number(e.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="cancellationHours">Annulation libre (heures avant)</Label>
            <Input
              id="cancellationHours"
              type="number"
              className="mt-1"
              min={1}
              max={72}
              value={form.cancellationHours}
              onChange={(e) => setForm({ ...form, cancellationHours: Number(e.target.value) })}
            />
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <Button type="submit" disabled={loading} size="lg">
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : saved ? (
            <>
              <CheckCircle className="w-4 h-4" /> Sauvegardé !
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Enregistrer les modifications
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
