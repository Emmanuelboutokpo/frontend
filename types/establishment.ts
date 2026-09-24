import type { Establishment } from "./types";

export type EstablishmentStatus = "PUBLIE" | "EN_ATTENTE" | "REJETE" | "SUSPENDU";
export type EstablishmentCategory = "HEBERGEMENT" | "RESTAURANT" | "LOISIR";

export interface AdminEstablishment {
  id: number;
  name: string;
  slug: string;
  category: EstablishmentCategory;
  subcategory: string;
  location: {
    country: string;
    city: string;
    address: string;
  };
  owner: string;
  price: number;
  currency: string;
  priceUnit: "nuit" | "personne" | "mois";
  status: EstablishmentStatus;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  createdAt: string;
}

export interface EstablishmentStats {
  total: number;
  enAttente: number;
  publies: number;
  rejetes: number;
  suspendus: number;
}

export interface EstablishmentFilters {
  search: string;
  category: EstablishmentCategory | "ALL";
  status: EstablishmentStatus | "ALL";
  country: string | "ALL";
  city: string | "ALL";
}

export const STATUS_STYLES_EST: Record<
  EstablishmentStatus,
  { label: string; className: string }
> = {
  PUBLIE: {
    label: "Publié",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  EN_ATTENTE: {
    label: "En attente",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  REJETE: {
    label: "Rejeté",
    className: "bg-rose-50 text-rose-700 border-rose-200",
  },
  SUSPENDU: {
    label: "Suspendu",
    className: "bg-rose-50 text-rose-700 border-rose-200",
  },
};

export const CATEGORY_STYLES_EST: Record<
  EstablishmentCategory,
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