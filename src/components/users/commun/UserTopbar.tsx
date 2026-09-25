"use client";

import { Bell, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function UserTopbar({ onMenuClick }: { onMenuClick: () => void }) {
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
          <Link href="/notifications">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500" />
          </Link>
        </Button>

        {/* Profil */}
        <Link
          href="/profile"
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1.5 transition hover:border-emerald-200 hover:bg-emerald-50"
        >
          <div className="grid h-8 w-8 place-items-center rounded-full bg-emerald-700 text-xs font-bold text-white">
            EA
          </div>
          <div className="hidden text-left sm:block">
            <div className="text-xs font-semibold text-slate-900">Emmanuel A.</div>
            <div className="text-[10px] text-slate-500">Client</div>
          </div>
        </Link>
      </div>
    </header>
  );
}