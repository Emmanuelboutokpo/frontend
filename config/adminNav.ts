import {
  LayoutDashboard,
  Users,
  Building2,
  CheckCircle2,
  CalendarDays,
  Settings,
  ExternalLink,
  HelpCircle,
} from "lucide-react";

export const adminNav = [
  {
    section: "Principal",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
      { label: "Utilisateurs", href: "/admin/users", icon: Users },
      { label: "Établissements", href: "/admin/etablissements", icon: Building2 },
      // { label: "Validations", href: "/admin/validations", icon: CheckCircle2, badge: 12 },
      { label: "Réservations", href: "/admin/reservations", icon: CalendarDays },
      { label: "Paramètres", href: "/admin/settings", icon: Settings },
    ],
  },
  {
    section: "Autres",
    items: [
      { label: "Voir le site", href: "/", icon: ExternalLink, external: true },
      { label: "Aide & support", href: "/admin/aide", icon: HelpCircle },
    ],
  },
];