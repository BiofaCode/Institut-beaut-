"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { formatCHF, formatDuration, formatDate } from "@/lib/utils";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Clock,
  Calendar,
  User,
  CreditCard,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { DayPicker } from "react-day-picker";
import { fr } from "date-fns/locale";
import "react-day-picker/dist/style.css";

type Service = {
  id: string;
  name: string;
  duration: number;
  price: number | string;
  description?: string | null;
  category: { name: string; slug: string };
};

type Staff = {
  id: string;
  name: string;
  title?: string | null;
};

type ServiceCategory = {
  id: string;
  name: string;
  slug: string;
  services: Service[];
};

const STEPS = [
  { label: "Service", icon: Check },
  { label: "Date & Heure", icon: Calendar },
  { label: "Vos infos", icon: User },
  { label: "Confirmation", icon: CreditCard },
];

export function BookingWizard({
  categories,
  staff,
}: {
  categories: ServiceCategory[];
  staff: Staff[];
}) {
  const searchParams = useSearchParams();
  const initialServiceId = searchParams.get("service");

  const [step, setStep] = useState(initialServiceId ? 1 : 0);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<string>("any");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [form, setForm] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    clientNotes: "",
    acceptsCgv: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState<{ id: string; success: boolean } | null>(null);
  const [error, setError] = useState<string>("");

  // Pre-select service from URL
  useEffect(() => {
    if (initialServiceId) {
      for (const cat of categories) {
        const found = cat.services.find((s) => s.id === initialServiceId);
        if (found) {
          setSelectedService(found);
          setStep(1);
          break;
        }
      }
    }
  }, [initialServiceId, categories]);

  // Load available slots when date/service/staff changes
  useEffect(() => {
    if (!selectedDate || !selectedService) return;

    const fetchSlots = async () => {
      setLoadingSlots(true);
      setAvailableSlots([]);
      setSelectedSlot("");
      try {
        const staffId = selectedStaff === "any" ? "" : selectedStaff;
        const dateStr = selectedDate.toISOString().split("T")[0];
        const params = new URLSearchParams({
          date: dateStr,
          serviceId: selectedService.id,
          ...(staffId && { staffId }),
        });
        const res = await fetch(`/api/availability?${params}`);
        const data = await res.json();
        setAvailableSlots(data.slots || []);
      } catch {
        setAvailableSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [selectedDate, selectedService, selectedStaff]);

  const handleSubmit = async () => {
    if (!selectedService || !selectedDate || !selectedSlot) return;
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedService.id,
          staffId: selectedStaff === "any" ? undefined : selectedStaff,
          date: selectedDate.toISOString().split("T")[0],
          startTime: selectedSlot,
          ...form,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setBookingResult({ id: data.bookingId, success: true });
        setStep(4);
      } else {
        setError(data.error || "Une erreur s'est produite");
      }
    } catch {
      setError("Erreur de connexion. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  };

  const canProceed = () => {
    if (step === 0) return !!selectedService;
    if (step === 1) return !!selectedDate && !!selectedSlot;
    if (step === 2)
      return form.clientName && form.clientEmail && form.clientPhone && form.acceptsCgv;
    return false;
  };

  // Success screen
  if (step === 4 && bookingResult) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2
          className="text-3xl text-[#2C2C2C] mb-3"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Réservation confirmée !
        </h2>
        <p className="text-[#6B6B6B] mb-2">
          Un email de confirmation a été envoyé à <strong>{form.clientEmail}</strong>
        </p>
        <p className="text-[#6B6B6B] mb-8 text-sm">Réf. : #{bookingResult.id.slice(-8).toUpperCase()}</p>
        <div className="bg-[#F5F0EB] rounded-2xl p-6 max-w-sm mx-auto text-left mb-8">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#6B6B6B]">Service</span>
              <span className="font-medium">{selectedService?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B6B6B]">Date</span>
              <span className="font-medium">{selectedDate && formatDate(selectedDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B6B6B]">Heure</span>
              <span className="font-medium">{selectedSlot}</span>
            </div>
          </div>
        </div>
        <Button onClick={() => (window.location.href = "/")}>
          Retour à l&apos;accueil
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Progress steps */}
      <div className="flex items-center justify-center mb-10 gap-2">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                i === step
                  ? "bg-[#8B7355] text-white"
                  : i < step
                  ? "bg-[#F5F0EB] text-[#8B7355]"
                  : "bg-[#F5F0EB] text-[#A0A0A0]"
              }`}
            >
              {i < step ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <span className="w-3.5 h-3.5 text-center text-xs leading-none">{i + 1}</span>
              )}
              <span className="hidden sm:inline">{s.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <ChevronRight className="w-4 h-4 text-[#E8E0D5] mx-1" />
            )}
          </div>
        ))}
      </div>

      {/* Step 0 — Choose service */}
      {step === 0 && (
        <div>
          <h2
            className="text-2xl text-[#2C2C2C] mb-6 text-center"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Choisissez votre soin
          </h2>
          {categories.map((cat) => (
            <div key={cat.id} className="mb-8">
              <h3 className="text-sm font-semibold text-[#8B7355] uppercase tracking-wider mb-3">
                {cat.name}
              </h3>
              <div className="space-y-2">
                {cat.services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      selectedService?.id === service.id
                        ? "border-[#8B7355] bg-[#F5F0EB]"
                        : "border-[#E8E0D5] bg-white hover:border-[#8B7355]/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-[#2C2C2C]">{service.name}</div>
                        {service.description && (
                          <div className="text-xs text-[#6B6B6B] mt-0.5 line-clamp-1">
                            {service.description}
                          </div>
                        )}
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-[#6B6B6B] flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDuration(service.duration)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 ml-4">
                        <span className="font-semibold text-[#8B7355]">
                          {formatCHF(service.price)}
                        </span>
                        {selectedService?.id === service.id && (
                          <div className="w-5 h-5 bg-[#8B7355] rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Step 1 — Date & Time */}
      {step === 1 && selectedService && (
        <div>
          <h2
            className="text-2xl text-[#2C2C2C] mb-2 text-center"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Choisissez la date et l&apos;heure
          </h2>
          <p className="text-center text-[#6B6B6B] text-sm mb-6">
            {selectedService.name} — {formatDuration(selectedService.duration)} — {formatCHF(selectedService.price)}
          </p>

          {/* Staff selector */}
          {staff.length > 1 && (
            <div className="mb-6">
              <Label className="mb-2 block">Praticienne</Label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedStaff("any")}
                  className={`px-4 py-2 rounded-full text-sm border-2 transition-all ${
                    selectedStaff === "any"
                      ? "border-[#8B7355] bg-[#F5F0EB] text-[#8B7355]"
                      : "border-[#E8E0D5] text-[#6B6B6B] hover:border-[#8B7355]/50"
                  }`}
                >
                  Sans préférence
                </button>
                {staff.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedStaff(s.id)}
                    className={`px-4 py-2 rounded-full text-sm border-2 transition-all ${
                      selectedStaff === s.id
                        ? "border-[#8B7355] bg-[#F5F0EB] text-[#8B7355]"
                        : "border-[#E8E0D5] text-[#6B6B6B] hover:border-[#8B7355]/50"
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Calendar */}
            <div className="flex justify-center">
              <style>{`
                .rdp { --rdp-accent-color: #8B7355; --rdp-background-color: #F5F0EB; }
                .rdp-day_selected { background-color: #8B7355 !important; color: white !important; }
                .rdp-day:hover { background-color: #F5F0EB; }
              `}</style>
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                locale={fr}
                fromDate={new Date()}
                disabled={[{ dayOfWeek: [0] }]}
                modifiersClassNames={{
                  selected: "rdp-day_selected",
                }}
              />
            </div>

            {/* Time slots */}
            <div>
              {!selectedDate ? (
                <div className="h-full flex items-center justify-center">
                  <p className="text-[#6B6B6B] text-sm text-center">
                    Sélectionnez une date pour voir les créneaux disponibles
                  </p>
                </div>
              ) : loadingSlots ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="w-6 h-6 animate-spin text-[#8B7355]" />
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-center">
                  <AlertCircle className="w-8 h-8 text-[#E8E0D5] mb-2" />
                  <p className="text-[#6B6B6B] text-sm">Aucun créneau disponible ce jour.</p>
                  <p className="text-[#A0A0A0] text-xs mt-1">Essayez une autre date.</p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-[#6B6B6B] mb-3">
                    {availableSlots.length} créneau(x) disponible(s) le {formatDate(selectedDate)}
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2.5 rounded-lg text-sm font-medium border-2 transition-all ${
                          selectedSlot === slot
                            ? "bg-[#8B7355] text-white border-[#8B7355]"
                            : "bg-white text-[#2C2C2C] border-[#E8E0D5] hover:border-[#8B7355]"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Step 2 — Client info */}
      {step === 2 && (
        <div>
          <h2
            className="text-2xl text-[#2C2C2C] mb-6 text-center"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Vos informations
          </h2>
          <div className="max-w-md mx-auto space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nom complet *</Label>
                <Input
                  id="name"
                  className="mt-1"
                  placeholder="Marie Dupont"
                  value={form.clientName}
                  onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="phone">Téléphone *</Label>
                <Input
                  id="phone"
                  className="mt-1"
                  placeholder="+41 79 000 00 00"
                  value={form.clientPhone}
                  onChange={(e) => setForm({ ...form, clientPhone: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                className="mt-1"
                placeholder="marie@exemple.ch"
                value={form.clientEmail}
                onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
              />
              <p className="text-xs text-[#6B6B6B] mt-1">
                La confirmation sera envoyée à cette adresse.
              </p>
            </div>
            <div>
              <Label htmlFor="notes">Notes (optionnel)</Label>
              <Textarea
                id="notes"
                className="mt-1"
                placeholder="Peau sensible, première visite, allergie..."
                value={form.clientNotes}
                onChange={(e) => setForm({ ...form, clientNotes: e.target.value })}
              />
            </div>
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="cgv"
                checked={form.acceptsCgv}
                onChange={(e) => setForm({ ...form, acceptsCgv: e.target.checked })}
                className="mt-0.5 w-4 h-4 accent-[#8B7355]"
              />
              <label htmlFor="cgv" className="text-sm text-[#6B6B6B]">
                J&apos;accepte les{" "}
                <a href="/cgv" target="_blank" className="text-[#8B7355] hover:underline">
                  conditions générales de vente
                </a>{" "}
                et la{" "}
                <a href="/politique-confidentialite" target="_blank" className="text-[#8B7355] hover:underline">
                  politique de confidentialité
                </a>{" "}
                *
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Step 3 — Summary */}
      {step === 3 && selectedService && selectedDate && (
        <div>
          <h2
            className="text-2xl text-[#2C2C2C] mb-6 text-center"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Récapitulatif & confirmation
          </h2>
          <div className="max-w-md mx-auto">
            <div className="bg-[#F5F0EB] rounded-2xl p-6 mb-6">
              <h3 className="font-semibold text-[#2C2C2C] mb-4">Votre réservation</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#6B6B6B]">Service</span>
                  <span className="font-medium text-[#2C2C2C]">{selectedService.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B6B6B]">Durée</span>
                  <span>{formatDuration(selectedService.duration)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B6B6B]">Date</span>
                  <span>{formatDate(selectedDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B6B6B]">Heure</span>
                  <span>{selectedSlot}</span>
                </div>
                {selectedStaff !== "any" && (
                  <div className="flex justify-between">
                    <span className="text-[#6B6B6B]">Praticienne</span>
                    <span>{staff.find((s) => s.id === selectedStaff)?.name}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#6B6B6B]">Nom</span>
                  <span>{form.clientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B6B6B]">Email</span>
                  <span className="text-right max-w-[55%] break-all">{form.clientEmail}</span>
                </div>
                <div className="border-t border-[#E8E0D5] pt-3 mt-3">
                  <div className="flex justify-between font-semibold text-base">
                    <span>Total</span>
                    <span className="text-[#8B7355]">{formatCHF(selectedService.price)}</span>
                  </div>
                  <p className="text-xs text-[#6B6B6B] mt-1">
                    Paiement sur place — TWINT, carte bancaire ou espèces acceptés
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-4">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full"
              size="lg"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Confirmation en cours...
                </>
              ) : (
                "Confirmer ma réservation"
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Navigation */}
      {step < 4 && (
        <div className="flex justify-between mt-10 pt-6 border-t border-[#E8E0D5]">
          <Button
            variant="ghost"
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
          >
            <ChevronLeft className="w-4 h-4" />
            Retour
          </Button>
          {step < 3 && (
            <Button onClick={() => setStep((s) => s + 1)} disabled={!canProceed()}>
              Continuer
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
