"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  Heart,
  Bell,
  User,
  Settings,
  Compass,
  ExternalLink,
} from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
 
const NAV_ITEMS = [
  { label: "Tableau de bord", href: "/users/", icon: LayoutDashboard },
  { label: "Mes réservations", href: "/users/reservations", icon: CalendarCheck },
  { label: "Mes favoris", href: "/users/favoris", icon: Heart },
  { label: "Notifications", href: "/users/notifications", icon: Bell, badge: 5 },
  { label: "Mon profil", href: "/users/profil", icon: User },
  { label: "Paramètres", href: "/users/settings", icon: Settings },
];

function SidebarContent({ onItemClick }: { onItemClick?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center gap-2 border-b px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-700 text-white">
          <span className="text-lg font-bold">B</span>
        </div>
        <div>
          <div className="text-base font-extrabold tracking-tight text-slate-900">
            BestRev
          </div>
          <div className="text-[10px] text-slate-500">Espace personnel</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4 lr-scrollbar">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onItemClick}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-emerald-50 text-emerald-800"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon
                className={`h-4 w-4 shrink-0 ${
                  isActive ? "text-emerald-700" : "text-slate-400 group-hover:text-slate-600"
                }`}
              />
              <span className="flex-1 truncate">{item.label}</span>
              {item.badge && (
                <span className="rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* CTA Explorer */}
      <div className="mx-3 mb-3">
        <Button
          asChild
          className="w-full justify-start rounded-xl bg-emerald-700 hover:bg-emerald-800"
        >
          <Link href="/explorer">
            <Compass className="mr-2 h-4 w-4" />
            Explorer BestRev
            <ExternalLink className="ml-auto h-3 w-3" />
          </Link>
        </Button>
      </div>

      {/* Profil en bas */}
      <div className="border-t p-3">
        <Link
          href="/users/profil"
          className="flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-slate-50"
        >
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-700 text-sm font-bold text-white">
            EA
          </div>
          <div className="min-w-0 flex-1 text-left">
            <div className="truncate text-sm font-semibold text-slate-900">
              Emmanuel A.
            </div>
            <div className="text-xs text-slate-500">Client</div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export function UserSidebar({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  return (
    <>
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r bg-white lg:block">
        <SidebarContent />
      </aside>

      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent onItemClick={() => onOpenChange(false)} />
        </SheetContent>
      </Sheet>
    </>
  );
}