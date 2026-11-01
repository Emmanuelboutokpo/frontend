// =====================================================================
// TYPES — LandReservation.com
// =====================================================================

// ---------------------------------------------------------------------
// GÉOGRAPHIE
// ---------------------------------------------------------------------
import { Wifi, Waves, Snowflake, Check, ShieldCheck } from "lucide-react";

// Mock records use numbers; the establishments API uses UUID strings.
export type EntityId = number | string;

export interface Country {
  id: EntityId;
  name: string;
  iso_code: string;
  lat: number;
  lng: number;
}

export interface Department {
  id: EntityId;
  country_id: EntityId;
  name: string;
  capital: string;
  lat: number;
  lng: number;
}

export interface Commune {
  id: EntityId;
  department_id: EntityId;
  name: string;
  type: "Urbaine" | "Rurale";
  lat: number;
  lng: number;
}

export interface District {
  id: EntityId;
  commune_id: EntityId;
  name: string;
  lat: number;
  lng: number;
}

export interface Locality {
  id: EntityId;
  district_id: EntityId;
  name: string;
  type: "Quartier" | "Village" | "Ville";
  lat: number;
  lng: number;
}

// ---------------------------------------------------------------------
// ACTEURS
// ---------------------------------------------------------------------
export interface Owner {
  id: EntityId;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
}

export interface Tenant {
  id: EntityId;
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
  id: EntityId;
  name: string;
  slug: string;
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
  id: EntityId;
  category_id: EntityId;
  name: string;
  slug: string;
  icon: string;
}

// ---------------------------------------------------------------------
// RÉFÉRENTIELS
// ---------------------------------------------------------------------
export interface Amenity {
  id: EntityId;
  name: string;
  slug: string;
  icon: string;
}

export interface PaymentCondition {
  id: EntityId;
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
  id: EntityId;
  category_id: EntityId;
  subcategory_id: EntityId | null; // null pour Restaurant
  category?: Category;
  subcategory?: SubCategory;
  owner_id: EntityId;
  tenant_id: EntityId | null;

  name: string;
  slug: string;
  description: string;
  address: string;

  // Géographie
  location_id?: EntityId;
  location_name?: string;
  country_id: EntityId;
  department_id: EntityId;
  commune_id: EntityId;
  district_id: EntityId;
  locality_id: EntityId;
  lat: number;
  lng: number;

  // Statut
  status: EstablishmentStatus;
  availability_status: AvailabilityStatus;

  // Prix
  price?: number;
  price_unit?: string;
  price_per_night: number | null;
  price_per_month: number | null;
  currency: string;
  owner?: {
    first_name: string;
    last_name: string;
    avatar_url?: string | null;
  } | null;
  payment_conditions?: PaymentCondition[];

  // Caractéristiques
  bedrooms: number;
  rooms_count?: number;
  bathrooms: number;
  beds: number;
  bed_type: string | null;
  area: number;
  max_guests: number;

  // Évaluation
  rating: number;
  review_count?: number;
  ratings_detail: RatingsDetail;

  // Dates
  published_at: string;
  updated_at: string;

  // Relations (IDs)
  amenity_ids: EntityId[];
  payment_condition_ids: EntityId[];
  photo_ids: EntityId[];
  video_ids: EntityId[];
  review_ids: EntityId[];

  // Champs spécifiques restaurant / loisir
  cuisine_type?: string;
  opening_hours?: string | Record<string, unknown> | null;
  phone?: string | null;
}

// ---------------------------------------------------------------------
// MÉDIAS
// ---------------------------------------------------------------------
export interface Photo {
  id: EntityId;
  establishment_id: EntityId;
  url: string;
  width_ratio: number;
  height_ratio: number;
  is_cover: boolean;
}

export interface Video {
  id: EntityId;
  establishment_id: EntityId;
  title: string;
  url: string;
  thumbnail: string;
  duration: string;
}

// ---------------------------------------------------------------------
// AVIS
// ---------------------------------------------------------------------
export interface Review {
  id: EntityId;
  establishment_id: EntityId;
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
  id: EntityId;
  establishment_id: EntityId;
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
  categoryId?: EntityId;
  subcategoryId?: EntityId;
  locationId?: EntityId;
  destination?: string;
  countryId?: EntityId;
  communeId?: EntityId;
  localityId?: EntityId;
  checkIn?: string;
  checkOut?: string;
  reservationDate?: string;
  arrivalTime?: string;
  activityDate?: string;
  activityTypeId?: EntityId;
  participants?: number;
  guests: number;
  keyword?: string;
}

export interface SearchFilters {
  priceMin?: number;
  priceMax?: number;
  amenityIds: EntityId[];
  bedrooms?: number;
  bathrooms?: number;
  ratingMin?: number;
  onlyAvailable: boolean;
  sortBy?: "price_asc" | "price_desc" | "rating_desc" | "recent";
}