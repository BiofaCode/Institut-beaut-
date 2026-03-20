"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Calendar,
  Scissors,
  Tag,
  Clock,
  Users,
  UserCog,
  Image,
  Settings,
  BarChart2,
  LogOut,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/reservations", label: "Réservations", icon: Calendar },
  { href: "/admin/services", label: "Services", icon: Scissors },
  { href: "/admin/categories", label: "Catégories", icon: Tag },
  { href: "/admin/horaires", label: "Horaires", icon: Clock },
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/equipe", label: "Équipe", icon: UserCog },
  { href: "/admin/galerie", label: "Galerie", icon: Image },
  { href: "/admin/stats", label: "Statistiques", icon: BarChart2 },
  { href: "/admin/parametres", label: "Paramètres", icon: Settings },
];

export function Sidebar({
  onClose,
}: {
  onClose?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-[#2C2C2C] text-white w-64">
      {/* Logo */}
      <div className="flex items-center justify-between p-5 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#8B7355] rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
              Belle & Sereine
            </div>
            <div className="text-xs text-gray-400">Administration</div>
          </div>
        </Link>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1 hover:bg-white/10 rounded">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    active
                      ? "bg-[#8B7355] text-white"
                      : "text-gray-400 hover:text-white hover:bg-white/10"
                  )}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/10">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-colors mb-1"
          target="_blank"
        >
          <Sparkles className="w-4 h-4" />
          Voir le site
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/connexion" })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-red-500/20 hover:text-red-300 transition-colors w-full text-left"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>
      </div>
    </div>
  );
}
