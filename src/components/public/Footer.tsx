import Link from "next/link";
import { Sparkles, MapPin, Phone, Mail, Instagram, Facebook, Clock } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#2C2C2C] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#8B7355] rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span
                className="text-xl font-semibold text-[#F5F0EB]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Belle & Sereine
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Institut de beauté à Lausanne. Votre espace de bien-être et de sérénité au cœur de la ville.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#3C3C3C] flex items-center justify-center hover:bg-[#8B7355] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#3C3C3C] flex items-center justify-center hover:bg-[#8B7355] transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3
              className="text-[#8B7355] font-semibold mb-4 text-sm uppercase tracking-wider"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Nos Services
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              {[
                { href: "/services#soins-visage", label: "Soins Visage" },
                { href: "/services#soins-corps", label: "Soins Corps" },
                { href: "/services#epilation", label: "Épilation" },
                { href: "/services#onglerie", label: "Onglerie" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-[#8B7355] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h3
              className="text-[#8B7355] font-semibold mb-4 text-sm uppercase tracking-wider"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Navigation
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              {[
                { href: "/reservation", label: "Réservation en ligne" },
                { href: "/a-propos", label: "À propos" },
                { href: "/galerie", label: "Galerie" },
                { href: "/contact", label: "Contact" },
                { href: "/cgv", label: "CGV" },
                { href: "/politique-confidentialite", label: "Confidentialité (LPD)" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-[#8B7355] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Hours */}
          <div>
            <h3
              className="text-[#8B7355] font-semibold mb-4 text-sm uppercase tracking-wider"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Contact & Horaires
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#8B7355] mt-0.5 flex-shrink-0" />
                <span>Rue de la Paix 15<br />1003 Lausanne</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#8B7355] flex-shrink-0" />
                <a href="tel:+41211234567" className="hover:text-[#8B7355] transition-colors">
                  +41 21 123 45 67
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#8B7355] flex-shrink-0" />
                <a href="mailto:contact@bellesereine.ch" className="hover:text-[#8B7355] transition-colors">
                  contact@bellesereine.ch
                </a>
              </li>
              <li className="flex items-start gap-2 pt-1">
                <Clock className="w-4 h-4 text-[#8B7355] mt-0.5 flex-shrink-0" />
                <div>
                  <p>Lun–Mar–Jeu : 09:00–18:30</p>
                  <p>Mer–Ven : 09:00–20:00</p>
                  <p>Sam : 09:00–17:00</p>
                  <p>Dim : Fermé</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#3C3C3C] mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Institut Belle & Sereine. Tous droits réservés.</p>
          <div className="flex items-center gap-2">
            <img
              src="/images/twint-logo.svg"
              alt="TWINT accepté"
              className="h-6 opacity-50"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <span>TWINT accepté sur place</span>
          </div>
          <p>Site conforme LPD • Suisse</p>
        </div>
      </div>
    </footer>
  );
}
