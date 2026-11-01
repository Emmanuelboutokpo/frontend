import {
  LayoutDashboard,
  Users,
  Building2,
  CheckCircle2,
  ListTree,
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
      { label: "Référentiels", href: "/admin/referentiels", icon: ListTree },
      { label: "Établissements", href: "/admin/etablissements", icon: Building2 },
      { label: "Réservations", href: "/admin/reservations", icon: CalendarDays },
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