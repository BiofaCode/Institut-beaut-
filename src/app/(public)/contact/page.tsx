"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, Clock, CheckCircle, AlertCircle } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", phone: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-[#F5F0EB] text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[#8B7355] text-sm font-medium uppercase tracking-widest">
            Contact
          </span>
          <h1
            className="text-5xl text-[#2C2C2C] mt-2 mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Contactez-nous
          </h1>
          <p className="text-[#6B6B6B] max-w-xl mx-auto">
            Une question ? Un besoin spécifique ? Nous sommes là pour vous accompagner.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-[#FEFCF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Form */}
            <div>
              <h2
                className="text-2xl text-[#2C2C2C] mb-6"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Envoyez-nous un message
              </h2>

              {status === "success" ? (
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800">
                  <CheckCircle className="w-5 h-5" />
                  <p>Message envoyé ! Nous vous répondrons dans les plus brefs délais.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <Label htmlFor="name">Nom complet *</Label>
                      <Input
                        id="name"
                        className="mt-1"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                        placeholder="Marie Dupont"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        className="mt-1"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+41 79 123 45 67"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      className="mt-1"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                      placeholder="marie@exemple.ch"
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      className="mt-1 min-h-[140px]"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      required
                      placeholder="Décrivez votre demande..."
                    />
                  </div>

                  {status === "error" && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      Une erreur s&apos;est produite. Veuillez réessayer.
                    </div>
                  )}

                  <Button type="submit" disabled={status === "loading"} className="w-full">
                    {status === "loading" ? "Envoi en cours..." : "Envoyer le message"}
                  </Button>
                </form>
              )}
            </div>

            {/* Info */}
            <div>
              <h2
                className="text-2xl text-[#2C2C2C] mb-6"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Informations pratiques
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#F5F0EB] rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[#8B7355]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#2C2C2C] mb-1">Adresse</h3>
                    <p className="text-[#6B6B6B] text-sm">
                      Rue de la Paix 15<br />
                      1003 Lausanne, VD
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#F5F0EB] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-[#8B7355]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#2C2C2C] mb-1">Téléphone</h3>
                    <a
                      href="tel:+41211234567"
                      className="text-[#6B6B6B] text-sm hover:text-[#8B7355] transition-colors"
                    >
                      +41 21 123 45 67
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#F5F0EB] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-[#8B7355]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#2C2C2C] mb-1">Email</h3>
                    <a
                      href="mailto:contact@bellesereine.ch"
                      className="text-[#6B6B6B] text-sm hover:text-[#8B7355] transition-colors"
                    >
                      contact@bellesereine.ch
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#F5F0EB] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-[#8B7355]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#2C2C2C] mb-2">Horaires d&apos;ouverture</h3>
                    <div className="space-y-1 text-sm text-[#6B6B6B]">
                      <div className="flex justify-between gap-8">
                        <span>Lundi</span><span>09:00 – 18:30</span>
                      </div>
                      <div className="flex justify-between gap-8">
                        <span>Mardi</span><span>09:00 – 18:30</span>
                      </div>
                      <div className="flex justify-between gap-8">
                        <span>Mercredi</span><span>09:00 – 20:00</span>
                      </div>
                      <div className="flex justify-between gap-8">
                        <span>Jeudi</span><span>09:00 – 18:30</span>
                      </div>
                      <div className="flex justify-between gap-8">
                        <span>Vendredi</span><span>09:00 – 20:00</span>
                      </div>
                      <div className="flex justify-between gap-8">
                        <span>Samedi</span><span>09:00 – 17:00</span>
                      </div>
                      <div className="flex justify-between gap-8 text-red-400">
                        <span>Dimanche</span><span>Fermé</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map placeholder */}
              <div className="mt-8 h-56 rounded-2xl bg-[#F5F0EB] border border-[#E8E0D5] flex items-center justify-center overflow-hidden">
                <div className="text-center text-[#8B7355]">
                  <MapPin className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">Carte Google Maps</p>
                  <p className="text-xs text-[#6B6B6B] mt-1">Rue de la Paix 15, 1003 Lausanne</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
