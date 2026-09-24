'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import AuthDialog from '@/components/front-office/AuthDialog'
 import { CalendarDays, Heart, LogOut, Menu, UserRound, X } from 'lucide-react'
import { useAuthStore } from '@/store'

const navItems = [
  { name: 'Accueil', href: '/' },
  { name: 'Explorer', href: '/explorer' },
  { name: 'À propos', href: '/about' },
  { name: 'Contact', href: '/contact' },
]


function AccountButton() {
  const router = useRouter()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const firstName = useAuthStore((state) => state.firstName)
  const lastName = useAuthStore((state) => state.lastName)
  const avatar = useAuthStore((state) => state.avatar)
  const signOut = useAuthStore((state) => state.signOut)
  const [authOpen, setAuthOpen] = useState(false)
  const initials = `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase() || 'U'

  if (!isAuthenticated) return <>
    <Button type="button" onClick={() => setAuthOpen(true)} className="h-9 rounded-full bg-black px-5 text-xs font-bold text-white shadow-sm hover:bg-[#0a3d71]">Se connecter</Button><AuthDialog open={authOpen} onOpenChange={setAuthOpen} title="Connectez-vous à votre compte" /></>

  return <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button type="button" variant="ghost" className="h-9 gap-2 px-2 text-black hover:bg-gray-100">
        {avatar ? <img src={avatar} alt="" className="h-9 w-9 rounded-full object-cover" /> :
          <span className="grid h-6 w-6 place-items-center rounded-full bg-black text-[10px] font-bold text-white">
            {initials}
          </span>}
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-56 rounded-xl">
      <DropdownMenuLabel className="font-bold">
        {firstName} {lastName}
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem onSelect={() => router.push('/compte/reservations')}>
        <CalendarDays className="h-4 w-4" />
        Mes réservations
      </DropdownMenuItem>
      <DropdownMenuItem onSelect={() => router.push('/compte/favoris')}>
        <Heart className="h-4 w-4" />
        Mes Favoris
      </DropdownMenuItem>
      <DropdownMenuItem onSelect={() => router.push('/compte/profil')}>
        <UserRound className="h-4 w-4" />Mon profil</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem variant="destructive" onSelect={() => { signOut(); router.push('/') }}>
        <LogOut className="h-4 w-4" />Déconnexion
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
}

export default function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const isActive = (href: string) => href === '/' ? pathname === href : pathname.startsWith(href)

  return <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-md">
    <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-5 px-5 sm:px-8 lg:px-16">
      <Link href="/" className="flex shrink-0 items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a7692] focus-visible:ring-offset-2">
        <img src="/images/bestreservlogo.png" alt="BestReserv" className="h-13 w-auto object-contain sm:h-11" />
      </Link>
      <nav className="hidden items-center gap-6 lg:flex">
        {navItems.map((item) =>
          <Link key={item.name} href={item.href} className={`relative py-6 text-xs font-bold transition ${isActive(item.href) ? 'text-emerald-500' : 'text-slate-600 hover:text-emerald-500'}`}>
            {item.name}{isActive(item.href) && <span className="absolute inset-x-0 bottom-4 h-0.5 rounded-full bg-emerald-500" />}
          </Link>)}
      </nav>
      <div className="hidden items-center gap-3 lg:flex">
       
        <Select defaultValue="français">
          <SelectTrigger className="h-8 border-0 bg-transparent px-0 font-semibold shadow-none focus-visible:ring-0"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="français">Français</SelectItem>
            <SelectItem value="anglais">Anglais</SelectItem>
          </SelectContent>
        </Select>
     
        <AccountButton />
      </div>
      <div className="flex items-center gap-2 lg:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button type="button" variant="ghost" size="icon" aria-label="Ouvrir le menu" className="h-9 w-9 rounded-full border border-slate-200 text-[#09234a]">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[min(22rem,90vw)] p-0">
            <SheetHeader className="flex h-[68px] flex-row items-center justify-between border-b border-slate-100 px-5 text-left">
              <SheetTitle>
                <Link href="/" onClick={() => setMobileOpen(false)}>
                  <img src="/images/bestreservlogo.png" alt="BestReserv" className="h-9 w-auto" />
                </Link>
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 p-4">
              {navItems.map((item) =>
                <Link key={item.name} href={item.href} onClick={() => setMobileOpen(false)} className={`rounded-xl px-4 py-3 text-sm font-bold ${isActive(item.href) ? 'bg-[#e9f7f7] text-emerald-500' : 'text-blck hover:bg-emerald-500'}`}>
                  {item.name}
                </Link>)}
            </nav>
            <div className="border-t border-slate-100 p-4">
              <AccountButton />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  </header>
}
