import Link from "next/link";
import {
  BarChart3,
  Building2,
  CalendarDays,
  ChevronRight,
  CreditCard,
  Globe2,
  LayoutDashboard,
  Menu,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";

const ownerLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/proprietaire", label: "Vue d'ensemble", icon: BarChart3 },
  { href: "/proprietaire/etablissements", label: "Établissements", icon: Building2 },
  { href: "/proprietaire/reservations", label: "Réservations", icon: CalendarDays },
  { href: "/proprietaire/paiements", label: "Paiements", icon: CreditCard },
  { href: "/proprietaire/statistiques", label: "Statistiques", icon: BarChart3 },
  { href: "/proprietaire/profil", label: "Profil", icon: Settings },
];

const adminLinks = [
  { href: "/admin", label: "Dashboard global", icon: ShieldCheck },
  { href: "/admin/utilisateurs", label: "Utilisateurs", icon: Users },
  { href: "/admin/etablissements", label: "Établissements", icon: Building2 },
  { href: "/admin/categories", label: "Catégories", icon: LayoutDashboard },
  { href: "/admin/geographie/pays", label: "Géographie", icon: Globe2 },
  { href: "/admin/reservations", label: "Réservations", icon: CalendarDays },
  { href: "/admin/paiements", label: "Paiements", icon: CreditCard },
  { href: "/admin/statistiques", label: "Statistiques", icon: BarChart3 },
  { href: "/admin/parametres", label: "Paramètres", icon: Settings },
];

export default function BackofficeShell({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 flex-col border-r border-slate-200 bg-slate-950 text-slate-300 lg:flex">
        <div className="flex h-20 items-center border-b border-white/10 px-7">
          <Link href="/dashboard" className="text-xl font-bold tracking-tight text-white">Best<span className="text-amber-400">Rev</span></Link>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-7">
          <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Espace propriétaire</p>
          <nav className="mt-3 space-y-1">
            {ownerLinks.map((link) => <NavLink key={link.href} {...link} />)}
          </nav>
          <p className="mt-9 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Administration</p>
          <nav className="mt-3 space-y-1">
            {adminLinks.map((link) => <NavLink key={link.href} {...link} />)}
          </nav>
        </div>
        <div className="border-t border-white/10 p-5 text-xs text-slate-500">© 2026 BestRev</div>
      </aside>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur sm:px-8">
          <div className="flex items-center gap-3"><Menu className="h-5 w-5 text-slate-500 lg:hidden" /><div><p className="text-xs font-medium uppercase tracking-widest text-amber-600">Back-office</p><p className="font-semibold text-slate-900">Espace de gestion</p></div></div>
          <div className="flex items-center gap-3"><div className="hidden text-right sm:block"><p className="text-sm font-semibold">Administrateur</p><p className="text-xs text-slate-500">admin@bestrev.com</p></div><div className="grid h-10 w-10 place-items-center rounded-full bg-amber-100 font-bold text-amber-800">AD</div></div>
        </header>
        <main className="min-h-[calc(100vh-5rem)] px-5 py-8 sm:px-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}

function NavLink({ href, label, icon: Icon }: { href: string; label: string; icon: React.ComponentType<{ className?: string }> }) {
  return <Link href={href} className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-white/10 hover:text-white"><Icon className="h-4 w-4 text-slate-500 group-hover:text-amber-400" /><span>{label}</span><ChevronRight className="ml-auto h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" /></Link>;
}
