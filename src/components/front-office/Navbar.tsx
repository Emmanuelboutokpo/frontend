"use client";

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { SearchFields } from '@/components/front-office/SearchFields'
import AuthDialog from '@/components/front-office/AuthDialog'
import { useAuthStore } from '../../../store/authStore'
import { CalendarDays, Heart, LogOut, Search, UserRound } from 'lucide-react'

const navItems = [
  { name: 'Tous les propriétés', href: '/pages/front-office' },
  { name: 'Hébergements', href: '/pages/front-office/hebergement' },
  { name: 'Restaurants', href: '/pages/front-office/restaurant' },
  { name: 'Loisirs', href: '/pages/front-office/loisir' },
]

function FavoritesButton({ mobile = false }: { mobile?: boolean }) {
  const router = useRouter()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const [authOpen, setAuthOpen] = useState(false)

 
  return <>
    <Button type="button" variant="ghost" size="icon" aria-label="Favoris" className={mobile ? 'rounded-full bg-gray-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 lg:hidden' : 'rounded-full bg-gray-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'}>
      <Link href="/pages/front-office/compte/favoris" aria-label="Voir vos favoris">
      <Heart className="h-5 w-5" />
      </Link>
    </Button>
    <AuthDialog open={authOpen} onOpenChange={setAuthOpen} onAuthenticated={() => router.push('/pages/front-office/compte/favoris')} title="Connectez-vous pour accéder à vos favoris" />
  </>
}

function DesktopAccountMenu() {
  const router = useRouter()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const firstName = useAuthStore((state) => state.firstName)
  const lastName = useAuthStore((state) => state.lastName)
  const email = useAuthStore((state) => state.email)
  const avatar = useAuthStore((state) => state.avatar)
  const signOut = useAuthStore((state) => state.signOut)
  const [authOpen, setAuthOpen] = useState(false)
  const initials = `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase() || 'U'

  if (!isAuthenticated) return <>
    <Button type="button" onClick={() => setAuthOpen(true)} className="rounded-sm bg-black px-6 font-semibold text-white hover:bg-gray-800">Sign in</Button>
    <AuthDialog open={authOpen} onOpenChange={setAuthOpen} title="Connectez-vous à votre compte" />
  </>

  return <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button type="button" variant="ghost" aria-label="Ouvrir le menu du compte">
        {avatar ? <img src={avatar} alt={`${firstName ?? ''} ${lastName ?? ''}`} className="h-8 w-8 rounded-full object-cover" /> : <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-700 text-xs font-bold text-white">{initials}</span>}
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-64">
      <DropdownMenuLabel className="flex items-center gap-3 py-3">
        {avatar ? <img src={avatar} alt="" className="h-10 w-10 rounded-full object-cover" /> : <span className="grid h-10 w-10 place-items-center rounded-full bg-emerald-700 font-bold text-white">{initials}</span>}
        <span className="min-w-0"><span className="block truncate font-semibold">{firstName} {lastName}</span></span>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem onSelect={() => router.push('/pages/front-office/compte/reservations')}><CalendarDays />Mes réservations</DropdownMenuItem>
      <DropdownMenuItem onSelect={() => router.push('/pages/front-office/compte/profil')}><UserRound />Informations personnelles</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem variant="destructive" onSelect={() => { signOut(); router.push('/pages/front-office') }}><LogOut />Déconnexion</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
}

const Navbar = () => {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [destination, setDestination] = useState('')
  const [date, setDate] = useState<Date>()
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [guestsOpen, setGuestsOpen] = useState(false)
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const [pets, setPets] = useState(0)
  const calendarRef = useRef<HTMLDivElement>(null)
  const guestsRef = useRef<HTMLDivElement>(null)
  const mobileCalendarRef = useRef<HTMLDivElement>(null)
  const mobileGuestsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileMenuOpen])

  useEffect(() => {
    const closePopups = (event: MouseEvent) => {
      const target = event.target as Node
      if (!calendarRef.current?.contains(target) && !mobileCalendarRef.current?.contains(target)) setCalendarOpen(false)
      if (!guestsRef.current?.contains(target) && !mobileGuestsRef.current?.contains(target)) setGuestsOpen(false)
    }

    document.addEventListener('mousedown', closePopups)
    return () => document.removeEventListener('mousedown', closePopups)
  }, [])

  const isActiveLink = (href: string) =>
    pathname === href || (href !== '/pages/front-office' && pathname.startsWith(`${href}/`))

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setCalendarOpen(false)
    setGuestsOpen(false)
    setMobileSearchOpen(false)

    const categoryPath = ['/pages/front-office/hebergement', '/pages/front-office/restaurant', '/pages/front-office/loisir'].find((path) => pathname.startsWith(path))
    const params = new URLSearchParams()
    if (destination.trim()) params.set('destination', destination.trim())
    if (date) params.set('date', date.toISOString())
    params.set('voyageurs', String(adults + children))
    if (pets > 0) params.set('animaux', String(pets))
    router.push(`${categoryPath ?? '/pages/front-office'}${params.toString() ? `?${params.toString()}` : ''}`)
  }

  const updateGuests = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    value: number,
    minimum: number,
  ) => setter((current) => Math.max(minimum, current + value))

  const searchProps = {
    destination,
    onDestinationChange: setDestination,
    date,
    onDateChange: setDate,
    calendarOpen,
    onCalendarOpenChange: setCalendarOpen,
    guestsOpen,
    onGuestsOpenChange: setGuestsOpen,
    adults,
    children,
    pets,
    setAdults,
    setChildren,
    setPets,
    onUpdateGuests: updateGuests,
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 lg:px-16">
        <Link href="/pages/front-office/" className="flex shrink-0 items-center rounded-lg p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600">
          <img src="/images/bestreservlogo.png" alt="BestReservs" className="h-12 w-auto object-contain sm:h-11" />
        </Link>

        <form onSubmit={handleSearch} className="hidden min-w-0 flex-1 items-center justify-center px-2 lg:flex">
          <div className="flex w-full max-w-xl items-center gap-0.5 rounded-full border border-slate-200 bg-slate-50 p-0.5 shadow-sm">
            <SearchFields {...searchProps} mode="desktop" calendarRef={calendarRef} guestsRef={guestsRef} />
          </div>
        </form>

        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <div className="flex items-center gap-2">
            
            <FavoritesButton mobile />
            {/* <Button asChild className="rounded-sm bg-emerald-800 px-3 text-xs font-semibold text-white hover:bg-emerald-700 sm:px-6 sm:text-sm lg:hidden">
              <Link href="/pages/front-office/partner">Devenir partenaire</Link>
            </Button> */}
          </div>
          <SheetContent side="right">
            <SheetHeader className="border-b border-slate-200 pb-4">
              <SheetTitle>
                <Link href="/pages/front-office/" onClick={() => setMobileMenuOpen(false)}>
                  <img src="/images/bestreservlogo.png" alt="BestReservs" className="h-10 w-auto object-contain" />
                </Link>
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col items-start gap-2">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)} className={`rounded-md px-4 pt-2 text-lg font-medium transition-colors ${isActiveLink(item.href) ? 'bg-emerald-100 text-emerald-900' : 'hover:bg-slate-100'}`}>
                  {item.name}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <nav className="hidden items-center gap-1 lg:flex">
          <FavoritesButton />
          {/* <Button asChild className="rounded-sm border border-black bg-white px-6 font-semibold text-black hover:bg-emerald-800 hover:text-white">
            <Link href="/pages/front-office/partner">Devenir partenaire</Link>
          </Button> */}
          <DesktopAccountMenu />
        </nav>
      </div>

      <Dialog open={mobileSearchOpen} onOpenChange={setMobileSearchOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="mx-auto mb-2 flex items-center justify-center gap-2 rounded-full border-slate-300 py-5 text-sm font-semibold text-slate-700 lg:hidden">
            <span>Commencer votre recherche</span>
            <Search className="h-4 w-4 text-emerald-950" />
          </Button>
        </DialogTrigger>
        <DialogContent className="flex h-[100dvh] max-h-none w-screen max-w-none flex-col overflow-y-auto rounded-none border-0 p-5 sm:p-8 lg:hidden">
          <DialogHeader className="border-b border-slate-100 pb-5 pr-8 text-left">
            <DialogTitle className="text-xl text-slate-900">Commencer votre recherche</DialogTitle>
            <DialogDescription className="mt-1 text-sm leading-5 text-slate-500">Trouvez l&apos;endroit idéal pour votre prochain séjour.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSearch} className="flex flex-1 flex-col gap-5 py-6">
            <div className="space-y-5">
              <SearchFields {...searchProps} mode="mobile" calendarRef={mobileCalendarRef} guestsRef={mobileGuestsRef} />
            </div>
            <Button type="submit" className="mt-auto h-12 w-full rounded-xl bg-emerald-700 text-base font-semibold text-white shadow-sm hover:bg-emerald-800">
              <Search className="h-5 w-5" />
              Rechercher
            </Button>
          </form>
      
        </DialogContent>
      </Dialog>

      <div className="mx-auto hidden max-w-7xl items-center justify-center gap-1 px-4 lg:flex">
        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={`border-b-2 px-4 py-2 text-sm font-semibold transition-colors ${isActiveLink(item.href) ? 'border-black' : 'border-transparent text-slate-600 hover:border-black hover:text-black'}`}>
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Navbar
