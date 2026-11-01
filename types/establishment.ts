export type EstablishmentStatus = "PUBLIE" | "EN_ATTENTE" | "REJETE" | "SUSPENDU";
export type EstablishmentCategory = string;
export type AvailabilityStatus = "AVAILABLE" | "RENTED" | "UNAVAILABLE";
export type EntityUuid = string;
export type PriceUnit =
  | "NUIT"
  | "PERSONNE"
  | "MOIS"
  | "PERSONNE_NUIT"
  | "GROUPE"
  | "PRESTATION"
  | "HEURE"
  | "CRENEAU";

export interface AdminPhoto {
  id: EntityUuid;
  url: string;
  is_cover?: boolean;
}

export interface AdminAmenity {
  id: EntityUuid;
  name: string;
  icon: string | null;
}

export interface AdminEstablishment {
  id: EntityUuid;
  name: string;
  slug: string;
  categoryId: EntityUuid;
  category: string;
  subcategoryId: EntityUuid | null;
  subcategory: string;
  locationId: EntityUuid;
  location: { country: string; city: string; address: string };
  owner: string;
  price: number;
  pricePerNight: number | null;
  pricePerMonth: number | null;
  currency: string;
  priceUnit: PriceUnit | null;
  status: EstablishmentStatus;
  availabilityStatus: AvailabilityStatus;
  rating: number;
  reviewCount: number;
  images: string[];
  photos: AdminPhoto[];
  amenities: AdminAmenity[];
  description: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  capacity: number | null;
  roomsCount: number | null;
  cuisineType: string | null;
  area: number | null;
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

export interface AdminCategory {
  id: EntityUuid;
  name: string;
  icon: string | null;
  subcategories?: AdminSubcategory[];
}

export interface AdminSubcategory {
  id: EntityUuid;
  category_id: EntityUuid;
  name: string;
  icon: string | null;
}

export type LocationType = "COUNTRY" | "REGION" | "CITY" | "DISTRICT" | "NEIGHBORHOOD";

export interface AdminLocation {
  id: EntityUuid;
  name: string;
  type: LocationType;
  parent_id: EntityUuid | null;
  country_code: string;
  latitude: number | null;
  longitude: number | null;
  timezone: string | null;
  population: number | null;
  metadata_json: Record<string, unknown> | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const STATUS_STYLES_EST: Record<
  EstablishmentStatus,
  { label: string; className: string }
> = {
  PUBLIE: { label: "Publié", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  EN_ATTENTE: { label: "En attente", className: "bg-amber-50 text-amber-700 border-amber-200" },
  REJETE: { label: "Rejeté", className: "bg-rose-50 text-rose-700 border-rose-200" },
  SUSPENDU: { label: "Suspendu", className: "bg-rose-50 text-rose-700 border-rose-200" },
};

export const CATEGORY_STYLES_EST: Record<
  string,
  { label: string; className: string }
> = {
  HEBERGEMENT: { label: "Hébergement", className: "bg-blue-50 text-blue-700 border-blue-200" },
  RESTAURANT: { label: "Restaurant", className: "bg-orange-50 text-orange-700 border-orange-200" },
  LOISIR: { label: "Loisir", className: "bg-violet-50 text-violet-700 border-violet-200" },
};
