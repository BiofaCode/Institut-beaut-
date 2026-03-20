"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/reservation", label: "Réservation" },
  { href: "/a-propos", label: "À propos" },
  { href: "/galerie", label: "Galerie" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHome = pathname === "/";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled || !isHome
          ? "bg-[#FEFCF9]/95 backdrop-blur-md shadow-sm border-b border-[#E8E0D5]"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-[#8B7355] rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <span
                className={cn(
                  "text-lg font-semibold transition-colors",
                  scrolled || !isHome ? "text-[#2C2C2C]" : "text-white"
                )}
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Belle & Sereine
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-[#8B7355]",
                  pathname === link.href
                    ? "text-[#8B7355]"
                    : scrolled || !isHome
                    ? "text-[#2C2C2C]"
                    : "text-white/90"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden lg:block">
            <Button asChild size="sm">
              <Link href="/reservation">Prendre RDV</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className={cn(
              "lg:hidden p-2 rounded-lg",
              scrolled || !isHome ? "text-[#2C2C2C]" : "text-white"
            )}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-[#FEFCF9] border-t border-[#E8E0D5] shadow-lg">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-[#F5F0EB] text-[#8B7355]"
                    : "text-[#2C2C2C] hover:bg-[#F5F0EB]"
                )}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-[#E8E0D5] mt-2">
              <Button asChild className="w-full" size="sm">
                <Link href="/reservation" onClick={() => setMenuOpen(false)}>
                  Prendre rendez-vous
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
