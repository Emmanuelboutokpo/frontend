export type ValidationStatus = "EN_ATTENTE" | "EN_REVISION" | "VALIDE" | "REJETE";
export type ValidationCategory = "HEBERGEMENT" | "RESTAURANT" | "LOISIR";

export interface ValidationDocument {
  id: number;
  name: string;
  fileName: string;
  fileSize: string; // "2.4 Mo"
  url: string;
}

export interface ValidationEstablishment {
  id: number;
  name: string;
  slug: string;
  description: string;
  category: ValidationCategory;
  subcategory: string;
  city: string;
  country: string;
  address: string;
  phone: string;
  website: string;
  price: number;
  currency: string;
  priceUnit: "nuit" | "personne" | "mois";
  images: string[];
  documents: ValidationDocument[];
  owner: {
    name: string;
    email: string;
    phone: string;
    initials: string;
  };
  submittedAt: string; // ISO
  status: ValidationStatus;
  rating: number;
  reviewCount: number;
}

export interface ValidationStats {
  enAttente: number;
  valides: number;
  rejetes: number;
  enRevision: number;
  total: number;
}

export interface ValidationFilters {
  search: string;
  category: ValidationCategory | "ALL";
  city: string | "ALL";
  submissionDate: "all" | "today" | "week" | "month" | "year";
}