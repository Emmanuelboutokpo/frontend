import Link from 'next/link'
import { Facebook, Globe2, Instagram, Mail, MapPin, Phone, Youtube } from 'lucide-react'

const navigation = [
  { label: 'Accueil', href: '/' },
  { label: 'Explorer', href: '/explorer' },
  { label: 'À propos', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function Footer() {
  const year = new Date().getFullYear()
  return <footer id="contact" className="bg-[#042849] text-white">
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12 lg:py-14">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.35fr_0.8fr_0.9fr_1fr]">
        <div>
          <Link href="/" className="flex shrink-0 items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a7692] focus-visible:ring-offset-2">
           <img src="/images/bestreservlogo.png" alt="BestReserv" className="h-13 w-auto object-contain sm:h-11" />
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-6 text-white/70">La plateforme de référence pour découvrir et réserver les meilleures adresses au Bénin.</p>
          <div className="mt-5 flex items-center gap-2">
            <a href="#" aria-label="Facebook" className="grid h-8 w-8 place-items-center rounded-full border border-white/20 text-white/80 transition hover:border-[#f6ad2e] hover:text-[#f6ad2e]">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="#" aria-label="Instagram" className="grid h-8 w-8 place-items-center rounded-full border border-white/20 text-white/80 transition hover:border-[#f6ad2e] hover:text-[#f6ad2e]">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="#" aria-label="Notre site" className="grid h-8 w-8 place-items-center rounded-full border border-white/20 text-white/80 transition hover:border-[#f6ad2e] hover:text-[#f6ad2e]">
              <Globe2 className="h-4 w-4" />
            </a>
            <a href="#" aria-label="YouTube" className="grid h-8 w-8 place-items-center rounded-full border border-white/20 text-white/80 transition hover:border-[#f6ad2e] hover:text-[#f6ad2e]">
              <Youtube className="h-4 w-4" />
            </a>
          </div>
        </div>
        <div>
          <h2 className="text-sm font-extrabold">Navigation</h2>
          <ul className="mt-4 space-y-2.5">
            {navigation.map((item) => <li key={item.label}><Link href={item.href} className="text-sm text-white/70 transition hover:text-[#f6ad2e]">{item.label}</Link></li>)}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-extrabold">Légal</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-white/70">
            <li>
              <a href="#" className="transition hover:text-[#f6ad2e]">Conditions d&apos;utilisation</a>
            </li>
            <li>
              <a href="#" className="transition hover:text-[#f6ad2e]">Politique de confidentialité</a>
            </li>
            <li>
              <a href="#" className="transition hover:text-[#f6ad2e]">Mentions légales</a>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-extrabold">Contact</h2>
          <ul className="mt-4 space-y-3 text-sm text-white/75">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#f6ad2e]" />Cotonou, Bénin</li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-[#f6ad2e]" />
              <a href="mailto:contact@bestreserv.com" className="hover:text-[#f6ad2e]">contact@bestreserv.com</a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-[#f6ad2e]" />
              <a href="tel:+2290123456789" className="hover:text-[#f6ad2e]">+229 0196673274</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-10 flex flex-col gap-2 border-t border-white/15 pt-5 text-center text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
        <span>© {year} BestReserv. Tous droits réservés.</span>
      </div>
    </div>
  </footer>
}
