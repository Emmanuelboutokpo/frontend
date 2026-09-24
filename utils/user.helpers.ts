import type { User, UserStatus, UserRole } from "@/types/users";

// ---------------------------------------------------------------------
// Formatage des dates
// ---------------------------------------------------------------------
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatRelativeTime(iso?: string): string {
  if (!iso) return "Jamais";
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return "À l'instant";
  if (minutes < 60) return `Il y a ${minutes} min`;
  if (hours < 24) return `Il y a ${hours} h`;
  if (days < 30) return `Il y a ${days} j`;
  return formatDate(iso);
}

// ---------------------------------------------------------------------
// Initiales
// ---------------------------------------------------------------------
export function getInitials(firstName: string, lastName: string): string {
  return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
}

// ---------------------------------------------------------------------
// Styles des statuts
// ---------------------------------------------------------------------
export const STATUS_STYLES: Record<
  UserStatus,
  { label: string; className: string; dot: string }
> = {
  ACTIF: {
    label: "Actif",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  INACTIF: {
    label: "Inactif",
    className: "bg-rose-50 text-rose-700 border-rose-200",
    dot: "bg-rose-500",
  },
  EN_ATTENTE: {
    label: "En attente",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  SUSPENDU: {
    label: "Suspendu",
    className: "bg-rose-50 text-rose-700 border-rose-200",
    dot: "bg-rose-500",
  },
};

// ---------------------------------------------------------------------
// Styles des rôles
// ---------------------------------------------------------------------
export const ROLE_STYLES: Record<
  UserRole,
  { label: string; className: string }
> = {
  CLIENT: {
    label: "Client",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  ADMIN: {
    label: "Admin",
    className: "bg-violet-50 text-violet-700 border-violet-200",
  },
  PROPRIETAIRE: {
    label: "Propriétaire",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
};

// ---------------------------------------------------------------------
// Couleurs d'avatar (fallback)
// ---------------------------------------------------------------------
const AVATAR_COLORS = [
  "bg-emerald-100 text-emerald-700",
  "bg-blue-100 text-blue-700",
  "bg-rose-100 text-rose-700",
  "bg-amber-100 text-amber-700",
  "bg-violet-100 text-violet-700",
];

export function getAvatarColor(id: number): string {
  return AVATAR_COLORS[id % AVATAR_COLORS.length];
}