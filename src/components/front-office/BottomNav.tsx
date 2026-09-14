"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CalendarDays, BedDouble, Heart, Home, LogOut, Sparkles, UserRound, Utensils } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuthStore } from "../../../store/authStore";

const navItems = [
  { name: "Accueil", href: "/pages/front-office", icon: Home },
  { name: "Hébergements", href: "/pages/front-office/hebergement", icon: BedDouble },
  { name: "Restaurants", href: "/pages/front-office/restaurant", icon: Utensils },
  { name: "Loisirs", href: "/pages/front-office/loisir", icon: Sparkles },
];


const BottomNav = ( ) =>{
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const firstName = useAuthStore((state) => state.firstName);
  const lastName = useAuthStore((state) => state.lastName);
  const email = useAuthStore((state) => state.email);
  const avatar = useAuthStore((state) => state.avatar);
  const signOut = useAuthStore((state) => state.signOut);
  const initials = `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase() || 'U';

  return (
    // 👇 lg:hidden : visible UNIQUEMENT sur mobile + fixed en bas
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background lg:hidden">
      {/* safe-area pour iPhone (encoche) */}
      <div className="mx-auto flex h-16 max-w-md items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/pages/front-office' && pathname.startsWith(`${item.href}/`))
          const Icon = item.icon;

          return (
            <Button
              key={item.href}
              variant="ghost"
              asChild
              className={`relative flex h-full flex-1 flex-col gap-0.5 rounded-none ${
                isActive ? "text-emerald-700" : "text-muted-foreground"
              }`}
            >
              <Link href={item.href}>
                <Icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{item.name}</span>
              </Link>
            </Button>
          );
        })}
        <Button
          type="button"
          variant="ghost"
          onClick={() => setProfileOpen(true)}
          className={`relative flex h-full flex-1 flex-col gap-0.5 rounded-none ${profileOpen ? "text-emerald-700" : "text-muted-foreground"}`}
        >
          <UserRound className="h-5 w-5"/>
          <span className="text-[10px] font-medium">Profil</span>
        </Button>
      </div>
      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="w-[calc(100%-2rem)] rounded-2xl p-5 sm:max-w-sm lg:hidden">
          <DialogHeader className="text-left">
            <DialogTitle className="flex items-center gap-3">
              {avatar ? <img src={avatar} alt="" className="h-11 w-11 rounded-full object-cover" /> : <span className="grid h-11 w-11 place-items-center rounded-full bg-emerald-700 font-bold text-white">{initials}</span>}
              <span className="min-w-0"><span className="block truncate">{isAuthenticated ? `${firstName ?? ''} ${lastName ?? ''}` : 'Mon profil'}</span><span className="block truncate text-xs font-normal text-slate-500">{isAuthenticated ? email : 'Connectez-vous pour continuer'}</span></span>
            </DialogTitle>
            <DialogDescription>Gérez votre compte et retrouvez vos activités.</DialogDescription>
          </DialogHeader>
          {isAuthenticated ? <div className="grid gap-2 pt-2">
            <Button asChild variant="outline" className="h-12 justify-start rounded-xl"><a href="/pages/front-office/compte/reservations"><CalendarDays className="mr-3 h-4 w-4 text-emerald-700" />Mes réservations</a></Button>
            <Button asChild variant="outline" className="h-12 justify-start rounded-xl"><a href="/pages/front-office/compte/profil"><UserRound className="mr-3 h-4 w-4 text-emerald-700" />Informations personnelles</a></Button>
            <Button type="button" variant="outline" onClick={() => { signOut(); setProfileOpen(false) }} className="h-12 justify-start rounded-xl text-red-600 hover:text-red-700"><LogOut className="mr-3 h-4 w-4" />Déconnexion</Button>
          </div> : <Button asChild className="mt-2 h-12 w-full rounded-xl bg-emerald-700"><a href="/pages/front-office/signin">Se connecter</a></Button>}
        </DialogContent>
      </Dialog>
    </nav>
  );
}

export default BottomNav