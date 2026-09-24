import type { ValidationStatus, ValidationCategory } from "@/types/validation";

export const STATUS_STYLES_VAL: Record<
  ValidationStatus,
  { label: string; className: string }
> = {
  EN_ATTENTE: {
    label: "En attente",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  EN_REVISION: {
    label: "En révision",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  VALIDE: {
    label: "Validé",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  REJETE: {
    label: "Rejeté",
    className: "bg-rose-50 text-rose-700 border-rose-200",
  },
};

export const CATEGORY_STYLES_VAL: Record<
  ValidationCategory,
  { label: string; className: string }
> = {
  HEBERGEMENT: {
    label: "Hébergement",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  RESTAURANT: {
    label: "Restaurant",
    className: "bg-orange-50 text-orange-700 border-orange-200",
  },
  LOISIR: {
    label: "Loisir",
    className: "bg-violet-50 text-violet-700 border-violet-200",
  },
};