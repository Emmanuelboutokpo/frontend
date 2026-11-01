"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Loader2, LogOut, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";

export function AdminAccountMenu({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const firstName = useAuthStore((state) => state.firstName);
  const lastName = useAuthStore((state) => state.lastName);
  const email = useAuthStore((state) => state.email);
  const avatar = useAuthStore((state) => state.avatar);
  const role = useAuthStore((state) => state.role);
  const signOut = useAuthStore((state) => state.signOut);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const name = [firstName, lastName].filter(Boolean).join(" ") || email?.split("@")[0] || "Administrateur";

  const initials = [firstName?.[0], lastName?.[0]].filter(Boolean).join("").toUpperCase()
    || email?.slice(0, 2).toUpperCase()
    || "AD";
  const roleLabel = role === "ADMIN" ? "Administrateur" : role === "PROPRIETAIRE" ? "Propriétaire" : "Utilisateur";

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "La déconnexion a échoué.");
    } finally {
      router.replace("/");
      setIsSigningOut(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          disabled={isSigningOut}
          className={compact
            ? "flex h-auto w-full justify-start gap-3 rounded-lg px-2 py-2 text-left hover:bg-slate-50"
            : "h-auto gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1.5 hover:border-emerald-200 hover:bg-emerald-50"}
        >
          {avatar ? (
            <img src={avatar} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover" />
          ) : (
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-700 text-xs font-bold text-white">
              {initials}
            </span>
          )}
          <span className={`min-w-0 flex-1 text-left ${compact ? "" : "hidden sm:block"}`}>
            <span className="block truncate text-xs font-semibold text-slate-900">{name}</span>
            <span className="block truncate text-[10px] text-slate-500">{roleLabel}</span>
          </span>
          {isSigningOut
            ? <Loader2 className="h-4 w-4 shrink-0 animate-spin text-slate-400" />
            : <ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-400" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={compact ? "start" : "end"} side={compact ? "top" : "bottom"} className="w-64 rounded-xl">
        <DropdownMenuLabel className="font-normal">
          <span className="block truncate text-sm font-semibold text-slate-900">{name}</span>
          <span className="block truncate text-xs text-slate-500">{email ?? ""}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/admin/profil" className="cursor-pointer">
            <UserRound className="h-4 w-4" />
            Mon profil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem disabled={isSigningOut} onSelect={() => void handleSignOut()} className="cursor-pointer text-rose-700 focus:text-rose-700">
          {isSigningOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
          Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
