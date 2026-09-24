import type {
  ReservationStatus,
  PaymentMethod,
  PaymentStatus,
  ReservationCategory,
} from "@/types/reservation";

export const STATUS_STYLES_RES: Record<
  ReservationStatus,
  { label: string; className: string }
> = {
  EN_ATTENTE: { label: "En attente", className: "bg-amber-50 text-amber-700 border-amber-200" },
  CONFIRMEE: { label: "Confirmée", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  EN_COURS: { label: "En cours", className: "bg-blue-50 text-blue-700 border-blue-200" },
  TERMINEE: { label: "Terminée", className: "bg-slate-100 text-slate-600 border-slate-200" },
  ANNULEE: { label: "Annulée", className: "bg-rose-50 text-rose-700 border-rose-200" },
};

export const PAYMENT_METHOD_STYLES: Record<
  PaymentMethod,
  { label: string; icon: string }
> = {
  CARTE_BANCAIRE: { label: "Carte bancaire", icon: "credit-card" },
  MOBILE_MONEY: { label: "Mobile Money", icon: "smartphone" },
  VIREMENT: { label: "Virement bancaire", icon: "landmark" },
};

export const PAYMENT_STATUS_STYLES: Record<
  PaymentStatus,
  { label: string; className: string }
> = {
  PAYE: { label: "Payé", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  EN_ATTENTE: { label: "En attente", className: "bg-amber-50 text-amber-700 border-amber-200" },
  REMBOURSE: { label: "Remboursé", className: "bg-slate-100 text-slate-600 border-slate-200" },
  ECHOUE: { label: "Échoué", className: "bg-rose-50 text-rose-700 border-rose-200" },
};

export const CATEGORY_STYLES_RES: Record<
  ReservationCategory,
  { label: string; className: string }
> = {
  HEBERGEMENT: { label: "Hébergement", className: "bg-blue-50 text-blue-700 border-blue-200" },
  RESTAURANT: { label: "Restaurant", className: "bg-orange-50 text-orange-700 border-orange-200" },
  LOISIR: { label: "Loisir", className: "bg-violet-50 text-violet-700 border-violet-200" },
};

export function formatAmount(amount: number, currency = "FCFA"): string {
  return `${amount.toLocaleString("fr-FR")} ${currency}`;
}

export function formatStayDates(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const sameDay = s.toDateString() === e.toDateString();

  const fmt = (d: Date) =>
    d.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });

  return sameDay ? fmt(s) : `${fmt(s)} – ${fmt(e)}`;
}