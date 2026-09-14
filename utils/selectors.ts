// =====================================================================
// SELECTORS — LandReservation
// Fonctions pures pour filtres, tri et agrégations
// =====================================================================

import type {
  PropertyData,
  Establishment,
  Category,
  SubCategory,
  Photo,
  Amenity,
  Review,
  SearchQuery,
  SearchFilters,
  Country,
  Department,
  Commune,
  District,
  Locality,
} from "../types/types";

// ---------------------------------------------------------------------
// RÉCUPÉRATION
// ---------------------------------------------------------------------

export const getCategoryById = (
  data: PropertyData,
  id: number
): Category | undefined => data.Categories.find((c) => c.id === id);

export const getSubCategoryById = (
  data: PropertyData,
  id: number | null
): SubCategory | undefined =>
  id ? data.SubCategories.find((sc) => sc.id === id) : undefined;

export const getEstablishmentById = (
  data: PropertyData,
  id: number
): Establishment | undefined => data.Establishments.find((e) => e.id === id);

export const getCoverPhoto = (
  data: PropertyData,
  establishmentId: number
): Photo | undefined =>
  data.Photos.find((p) => p.establishment_id === establishmentId && p.is_cover) ??
  data.Photos.find((p) => p.establishment_id === establishmentId);

export const getPhotos = (data: PropertyData, establishmentId: number): Photo[] =>
  data.Photos.filter((p) => p.establishment_id === establishmentId);

export const getAmenitiesByIds = (
  data: PropertyData,
  ids: number[]
): Amenity[] => data.Amenities.filter((a) => ids.includes(a.id));

export const getReviews = (
  data: PropertyData,
  establishmentId: number
): Review[] => data.Reviews.filter((r) => r.establishment_id === establishmentId);

// ---------------------------------------------------------------------
// GÉOGRAPHIE (résolution d'adresse complète)
// ---------------------------------------------------------------------
export interface FullLocation {
  country?: Country;
  department?: Department;
  commune?: Commune;
  district?: District;
  locality?: Locality;
}

export const resolveLocation = (
  data: PropertyData,
  est: Establishment
): FullLocation => ({
  country: data.Countries.find((c) => c.id === est.country_id),
  department: data.Departments.find((d) => d.id === est.department_id),
  commune: data.Communes.find((c) => c.id === est.commune_id),
  district: data.Districts.find((d) => d.id === est.district_id),
  locality: data.Localities.find((l) => l.id === est.locality_id),
});

// ---------------------------------------------------------------------
// FILTRES
// ---------------------------------------------------------------------
export const filterEstablishments = (
  data: PropertyData,
  query: SearchQuery,
  filters: SearchFilters
): Establishment[] => {
  let list = [...data.Establishments];

  // Statut : uniquement approuvés
  list = list.filter((e) => e.status === "APPROVED");

  // Catégorie
  if (query.categoryId) {
    list = list.filter((e) => e.category_id === query.categoryId);
  }

  // Sous-catégorie
  if (query.subcategoryId) {
    list = list.filter((e) => e.subcategory_id === query.subcategoryId);
  }

  // Localisation
  if (query.countryId) list = list.filter((e) => e.country_id === query.countryId);
  if (query.communeId) list = list.filter((e) => e.commune_id === query.communeId);
  if (query.localityId) list = list.filter((e) => e.locality_id === query.localityId);

  // Capacité
  if (query.guests > 0) {
    list = list.filter((e) => e.max_guests >= query.guests);
  }

  // Mot-clé
  if (query.keyword?.trim()) {
    const kw = query.keyword.toLowerCase();
    list = list.filter(
      (e) =>
        e.name.toLowerCase().includes(kw) ||
        e.description.toLowerCase().includes(kw) ||
        e.address.toLowerCase().includes(kw)
    );
  }

  // Filtres prix
  if (filters.priceMin != null) {
    list = list.filter((e) => (e.price_per_night ?? 0) >= filters.priceMin!);
  }
  if (filters.priceMax != null) {
    list = list.filter((e) => (e.price_per_night ?? 0) <= filters.priceMax!);
  }

  // Équipements
  if (filters.amenityIds.length > 0) {
    list = list.filter((e) =>
      filters.amenityIds.every((id) => e.amenity_ids.includes(id))
    );
  }

  // Chambres / SDB
  if (filters.bedrooms != null) {
    list = list.filter((e) => e.bedrooms >= filters.bedrooms!);
  }
  if (filters.bathrooms != null) {
    list = list.filter((e) => e.bathrooms >= filters.bathrooms!);
  }

  // Note minimum
  if (filters.ratingMin != null) {
    list = list.filter((e) => e.rating >= filters.ratingMin!);
  }

  // Disponibilité
  if (filters.onlyAvailable) {
    list = list.filter((e) => e.availability_status === "AVAILABLE");
  }

  // Tri
  switch (filters.sortBy) {
    case "price_asc":
      list.sort((a, b) => (a.price_per_night ?? 0) - (b.price_per_night ?? 0));
      break;
    case "price_desc":
      list.sort((a, b) => (b.price_per_night ?? 0) - (a.price_per_night ?? 0));
      break;
    case "rating_desc":
      list.sort((a, b) => b.rating - a.rating);
      break;
    case "recent":
      list.sort(
        (a, b) =>
          new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
      );
      break;
  }

  return list;
};

// ---------------------------------------------------------------------
// AGRÉGATIONS
// ---------------------------------------------------------------------
export const countByCategory = (
  data: PropertyData
): Record<number, number> => {
  const counts: Record<number, number> = {};
  for (const e of data.Establishments) {
    if (e.status !== "APPROVED") continue;
    counts[e.category_id] = (counts[e.category_id] ?? 0) + 1;
  }
  return counts;
};

export const countBySubCategory = (
  data: PropertyData
): Record<number, number> => {
  const counts: Record<number, number> = {};
  for (const e of data.Establishments) {
    if (e.status !== "APPROVED" || e.subcategory_id == null) continue;
    counts[e.subcategory_id] = (counts[e.subcategory_id] ?? 0) + 1;
  }
  return counts;
};

export const getPopularEstablishments = (
  data: PropertyData,
  limit = 5
): Establishment[] =>
  [...data.Establishments]
    .filter((e) => e.status === "APPROVED")
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);

export const getPriceRange = (
  data: PropertyData,
  categoryId?: number
): { min: number; max: number } => {
  const list = data.Establishments.filter(
    (e) =>
      e.status === "APPROVED" &&
      e.price_per_night != null &&
      (categoryId ? e.category_id === categoryId : true)
  );
  if (list.length === 0) return { min: 0, max: 0 };
  const prices = list.map((e) => e.price_per_night!);
  return { min: Math.min(...prices), max: Math.max(...prices) };
};

// ---------------------------------------------------------------------
// FORMATAGE
// ---------------------------------------------------------------------
export const formatPrice = (price: number | null, currency = "XOF"): string => {
  if (price == null) return "—";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatLocation = (
  data: PropertyData,
  est: Establishment
): string => {
  const loc = resolveLocation(data, est);
  return [loc.locality?.name, loc.commune?.name, loc.country?.name]
    .filter(Boolean)
    .join(", ");
};

export const slugify = (str: string): string =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");