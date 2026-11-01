"use client";

import { Bell, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useUserAccountStore } from "@/store/userAccountStore";

export function UserTopbar({ onMenuClick }: { onMenuClick: () => void }) {
  const profile = useUserAccountStore((state) => state.profile);
  const unreadCount = useUserAccountStore((state) => state.unreadCount);
  const firstName = useAuthStore((state) => state.firstName);
  const lastName = useAuthStore((state) => state.lastName);
  const avatar = useAuthStore((state) => state.avatar);
  const role = useAuthStore((state) => state.role);
  const displayName = [profile?.firstName || firstName, profile?.lastName || lastName]
    .filter(Boolean)
    .join(" ");
  const initials = [profile?.firstName || firstName, profile?.lastName || lastName]
    .map((name) => name?.[0] ?? "")
    .join("")
    .toUpperCase() || "U";
  const roleLabel = role === "PROPRIETAIRE" ? "Propriétaire" : "Client";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuClick}
        className="lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Recherche */}
      <div className="relative hidden flex-1 max-w-md md:block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          placeholder="Rechercher..."
          className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-emerald-500 focus:bg-white"
        />
      </div>

      <div className="flex flex-1 items-center justify-end gap-2 md:flex-none">
        {/* Notifications */}
        <Button variant="ghost" size="icon" asChild className="relative">
          <Link
            href="/users/notifications"
            aria-label={
              unreadCount > 0
                ? `Notifications, ${unreadCount} non lue${unreadCount > 1 ? "s" : ""}`
                : "Notifications"
            }
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 grid min-h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </Link>
        </Button>

        {/* Profil */}
        <Link
          href="/users/profil"
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1.5 transition hover:border-emerald-200 hover:bg-emerald-50"
        >
          {avatar ? (
            <img src={avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
          ) : (
            <div className="grid h-8 w-8 place-items-center rounded-full bg-emerald-700 text-xs font-bold text-white">
              {initials}
            </div>
          )}
          <div className="hidden text-left sm:block">
            <div className="max-w-40 truncate text-xs font-semibold text-slate-900">
              {displayName || profile?.email || "Mon compte"}
            </div>
            <div className="text-[10px] text-slate-500">{roleLabel}</div>
          </div>
        </Link>
      </div>
    </header>
  );
}