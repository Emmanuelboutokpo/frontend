// =====================================================================
// TYPES — LandReservation.com
// Alignés sur le mock propertyData
// =====================================================================

// ---------------------------------------------------------------------
// GÉOGRAPHIE
// ---------------------------------------------------------------------
import { Wifi, Waves, Snowflake, Check, ShieldCheck } from "lucide-react";

export interface Country {
  id: number;
  name: string;
  iso_code: string;
  lat: number;
  lng: number;
}

export interface Department {
  id: number;
  country_id: number;
  name: string;
  capital: string;
  lat: number;
  lng: number;
}

export interface Commune {
  id: number;
  department_id: number;
  name: string;
  type: "Urbaine" | "Rurale";
  lat: number;
  lng: number;
}

export interface District {
  id: number;
  commune_id: number;
  name: string;
  lat: number;
  lng: number;
}

export interface Locality {
  id: number;
  district_id: number;
  name: string;
  type: "Quartier" | "Village" | "Ville";
  lat: number;
  lng: number;
}

// ---------------------------------------------------------------------
// ACTEURS
// ---------------------------------------------------------------------
export interface Owner {
  id: number;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
}

export interface Tenant {
  id: number;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
}

// ---------------------------------------------------------------------
// CATÉGORIES
// ---------------------------------------------------------------------
export type CategorySlug = "hebergement" | "restaurant" | "loisir";

export interface Category {
  id: number;
  name: string;
  slug: CategorySlug;
  icon: string;
  has_subcategories: boolean;
  description: string;
}

export interface EstablishmentCardProps {
  establishment: Establishment;
  coverPhoto?: Photo;
  categorySlug: string;
  subcategorySlug?: string;
  typeName: string;
  location: string;
}

export const amenityIconMap: Record<string, any> = {
  wifi: Wifi,
  climatisation: Snowflake,
  piscine: Waves,
  securite: ShieldCheck,
  default: Check,
};

export interface SubCategory {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  icon: string;
}

// ---------------------------------------------------------------------
// RÉFÉRENTIELS
// ---------------------------------------------------------------------
export interface Amenity {
  id: number;
  name: string;
  slug: string;
  icon: string;
}

export interface PaymentCondition {
  id: number;
  name: string;
}

// ---------------------------------------------------------------------
// ÉTABLISSEMENT
// ---------------------------------------------------------------------
export type EstablishmentStatus = "PENDING" | "APPROVED" | "REJECTED";
export type AvailabilityStatus = "AVAILABLE" | "RENTED" | "UNAVAILABLE";

export interface RatingsDetail {
  accuracy: number;
  cleanliness: number;
  checkin: number;
  communication: number;
  location: number;
  value: number;
}

export interface Establishment {
  id: number;
  category_id: number;
  subcategory_id: number | null; // null pour Restaurant
  owner_id: number;
  tenant_id: number | null;

  name: string;
  slug: string;
  description: string;
  address: string;

  // Géographie
  country_id: number;
  department_id: number;
  commune_id: number;
  district_id: number;
  locality_id: number;
  lat: number;
  lng: number;

  // Statut
  status: EstablishmentStatus;
  availability_status: AvailabilityStatus;

  // Prix
  price_per_night: number | null;
  price_per_month: number | null;
  currency: string;

  // Caractéristiques
  bedrooms: number;
  bathrooms: number;
  beds: number;
  bed_type: string | null;
  area: number;
  max_guests: number;

  // Évaluation
  rating: number;
  ratings_detail: RatingsDetail;

  // Dates
  published_at: string;
  updated_at: string;

  // Relations (IDs)
  amenity_ids: number[];
  payment_condition_ids: number[];
  photo_ids: number[];
  video_ids: number[];
  review_ids: number[];

  // Champs spécifiques restaurant / loisir
  cuisine_type?: string;
  opening_hours?: string;
  phone?: string | null;
}

// ---------------------------------------------------------------------
// MÉDIAS
// ---------------------------------------------------------------------
export interface Photo {
  id: number;
  establishment_id: number;
  url: string;
  width_ratio: number;
  height_ratio: number;
  is_cover: boolean;
}

export interface Video {
  id: number;
  establishment_id: number;
  title: string;
  url: string;
  thumbnail: string;
  duration: string;
}

// ---------------------------------------------------------------------
// AVIS
// ---------------------------------------------------------------------
export interface Review {
  id: number;
  establishment_id: number;
  author_name: string;
  avatar: string;
  rating: number;
  comment: string;
  created_at: string;
  years_as_member: number;
}

// ---------------------------------------------------------------------
// DISPONIBILITÉ
// ---------------------------------------------------------------------
export interface Availability {
  id: number;
  establishment_id: number;
  date: string; // ISO
  is_blocked: boolean;
  price_override: number | null;
}

// ---------------------------------------------------------------------
// STRUCTURE GLOBALE
// ---------------------------------------------------------------------
export interface PropertyData {
  Countries: Country[];
  Departments: Department[];
  Communes: Commune[];
  Districts: District[];
  Localities: Locality[];

  Owners: Owner[];
  Tenants: Tenant[];

  Categories: Category[];
  SubCategories: SubCategory[];

  Amenities: Amenity[];
  PaymentConditions: PaymentCondition[];

  Establishments: Establishment[];
  Photos: Photo[];
  Videos: Video[];
  Reviews: Review[];
  Availability: Availability[];
}

// ---------------------------------------------------------------------
// FILTRES & RECHERCHE
// ---------------------------------------------------------------------
export interface SearchQuery {
  categoryId?: number;
  subcategoryId?: number;
  countryId?: number;
  communeId?: number;
  localityId?: number;
  checkIn?: string;
  checkOut?: string;
  guests: number;
  keyword?: string;
}

export interface SearchFilters {
  priceMin?: number;
  priceMax?: number;
  amenityIds: number[];
  bedrooms?: number;
  bathrooms?: number;
  ratingMin?: number;
  onlyAvailable: boolean;
  sortBy?: "price_asc" | "price_desc" | "rating_desc" | "recent";
}