import {
  LayoutDashboard,
  Users,
  Building2,
  ListTree,
  CheckCircle2,
  CalendarDays,
  ReceiptText,
  Settings,
  UserRound,
  ExternalLink,
  HelpCircle,
} from "lucide-react";

export const adminNav = [
  {
    section: "Principal",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
      { label: "Utilisateurs", href: "/admin/users", icon: Users },
      { label: "Validations", href: "/admin/validations", icon: CheckCircle2 },
      { label: "Établissements", href: "/admin/etablissements", icon: Building2 },
      { label: "Transactions", href: "/admin/transactions", icon: ReceiptText },
      { label: "Paramètres", href: "/admin/settings", icon: Settings },
      { label: "Mon profil", href: "/admin/profil", icon: UserRound },
    ],
  },
  {
    section: "Autres",
    items: [
      { label: "Voir le site", href: "/", icon: ExternalLink, external: true },
    ],
  },
];

export const ownersNav = [
  {
    section: "Espace propriétaire",
    items: [
      { label: "Dashboard", href: "/owners", icon: LayoutDashboard, exact: true },
      { label: "Mes clients", href: "/owners/users", icon: Users },
      { label: "Référentiels", href: "/owners/referentiels", icon: ListTree },
      { label: "Mes établissements", href: "/owners/etablissements", icon: Building2 },
      { label: "Réservations", href: "/owners/reservations", icon: CalendarDays },
      { label: "Transactions", href: "/owners/transactions", icon: ReceiptText },
      { label: "Mon profil", href: "/owners/profil", icon: UserRound },
    ],
  },
  {
    section: "Autres",
    items: [
      { label: "Voir le site", href: "/", icon: ExternalLink, external: true },
    ],
  },
];