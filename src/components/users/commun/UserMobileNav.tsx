"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarCheck, Heart, User } from "lucide-react";

const ITEMS = [
  { label: "Accueil", href: "/users", icon: LayoutDashboard },
  { label: "Réservations", href: "/users/reservations", icon: CalendarCheck },
  { label: "Favoris", href: "/users/favoris", icon: Heart },
  { label: "Profil", href: "/users/profil", icon: User },
];

export function UserMobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-white lg:hidden">
      <div className="flex h-16 items-stretch justify-around">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center justify-center gap-0.5 transition ${
                isActive ? "text-emerald-700" : "text-slate-500"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
              {isActive && (
                <span className="absolute bottom-1 h-1 w-1 rounded-full bg-emerald-700" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}