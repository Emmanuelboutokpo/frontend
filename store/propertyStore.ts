// =====================================================================
// STORE ZUSTAND — LandReservation
// =====================================================================

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { propertyData } from "../data/propertyData";
import {
  Amenity,
  Category,
  Commune,
  Country,
  Department,
  District,
  Establishment,
  Locality,
  Owner,
  PaymentCondition,
  Photo,
  PropertyData,
  Review,
  SearchFilters,
  SearchQuery,
  SubCategory,
  Tenant,
  Video,
} from "../types/types";
import {
  filterEstablishments,
  getCoverPhoto,
  formatLocation,
  getPriceRange,
  countByCategory,
} from "../utils/selectors";
import { useShallow } from "zustand/react/shallow"
import { useMemo } from "react"
// ---------------------------------------------------------------------
// VALEURS PAR DÉFAUT
// ---------------------------------------------------------------------
const initialSearchQuery: SearchQuery = {
  categoryId: undefined,
  subcategoryId: undefined,
  countryId: undefined,
  communeId: undefined,
  localityId: undefined,
  checkIn: undefined,
  checkOut: undefined,
  guests: 0,
  keyword: "",
};

const initialSearchFilters: SearchFilters = {
  priceMin: undefined,
  priceMax: undefined,
  amenityIds: [],
  bedrooms: undefined,
  bathrooms: undefined,
  ratingMin: undefined,
  onlyAvailable: false,
  sortBy: "rating_desc",
};

// ---------------------------------------------------------------------
// STATE
// ---------------------------------------------------------------------
export interface PropertyState {
  // Data brute
  data: PropertyData;

  // État UI & Sélection
  selectedEstablishmentId: number | null;
  favoriteIds: number[];

  // Recherche & Filtres globaux
  searchQuery: SearchQuery;
  searchFilters: SearchFilters;
  page: number;
  pageSize: number;

  // Actions
  selectEstablishment: (id: number | null) => void;
  toggleFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;

  setSearchQuery: (query: Partial<SearchQuery>) => void;
  setSearchFilters: (filters: Partial<SearchFilters>) => void;
  setCategory: (categoryId?: number | null) => void;
  setSortBy: (sortBy?: SearchFilters["sortBy"]) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  resetFilters: () => void;
  reset: () => void;
}

// ---------------------------------------------------------------------
// STORE
// ---------------------------------------------------------------------
export const usePropertyStore = create<PropertyState>()(
  persist(
    (set, get) => ({
      data: propertyData as PropertyData,
      selectedEstablishmentId: null,
      favoriteIds: [],

      searchQuery: initialSearchQuery,
      searchFilters: initialSearchFilters,
      page: 1,
      pageSize: 6,

      selectEstablishment: (id) => set({ selectedEstablishmentId: id }),

      toggleFavorite: (id) =>
        set((s) => ({
          favoriteIds: s.favoriteIds.includes(id)
            ? s.favoriteIds.filter((f) => f !== id)
            : [...s.favoriteIds, id],
        })),

      isFavorite: (id) => get().favoriteIds.includes(id),

      setSearchQuery: (query) =>
        set((s) => ({
          searchQuery: { ...s.searchQuery, ...query },
          page: 1, // Réinitialiser à la page 1 lors d'une nouvelle recherche
        })),

      setSearchFilters: (filters) =>
        set((s) => ({
          searchFilters: { ...s.searchFilters, ...filters },
          page: 1,
        })),

      setCategory: (categoryId) =>
        set((s) => ({
          searchQuery: {
            ...s.searchQuery,
            categoryId: categoryId ?? undefined,
            subcategoryId: undefined, // Réinitialiser la sous-catégorie si la catégorie change
          },
          page: 1,
        })),

      setSortBy: (sortBy) =>
        set((s) => ({
          searchFilters: { ...s.searchFilters, sortBy },
        })),

      setPage: (page) => set({ page }),

      setPageSize: (pageSize) => set({ pageSize, page: 1 }),

      resetFilters: () =>
        set({
          searchQuery: initialSearchQuery,
          searchFilters: initialSearchFilters,
          page: 1,
        }),

      reset: () =>
        set({
          selectedEstablishmentId: null,
          favoriteIds: [],
          searchQuery: initialSearchQuery,
          searchFilters: initialSearchFilters,
          page: 1,
        }),
    }),
    {
      name: "lr-property-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        favoriteIds: state.favoriteIds,
      }),
    }
  )
);

// =====================================================================
// SÉLECTEURS RAPIDES (hooks)
// =====================================================================

// --- Data globale ---
export const usePropertyData = () => usePropertyStore((s) => s.data);

// --- Catégories ---
export const useCategories = (): Category[] =>
  usePropertyStore((s) => s.data.Categories);

export const useCategoryBySlug = (slug: string): Category | undefined =>
  usePropertyStore((s) => s.data.Categories.find((c) => c.slug === slug));

export const useCategoryById = (id?: number | null): Category | undefined =>
  usePropertyStore((s) =>
    id ? s.data.Categories.find((c) => c.id === id) : undefined
  );


export const useSubCategories = (categoryId?: number): SubCategory[] =>
  usePropertyStore(
    useShallow((s) =>
      categoryId
        ? s.data.SubCategories.filter(
            (sc) => sc.category_id === categoryId
          )
        : s.data.SubCategories
    )
  )

// --- Établissements bruts ---
export const useEstablishments = (): Establishment[] =>
  usePropertyStore((s) => s.data.Establishments);

export const useEstablishmentById = (
  id: number | null
): Establishment | undefined =>
  usePropertyStore((s) =>
    id ? s.data.Establishments.find((e) => e.id === id) : undefined
  );

export const useEstablishmentsByCategory = (
  categoryId: number
): Establishment[] =>
  usePropertyStore((s) =>
    s.data.Establishments.filter((e) => e.category_id === categoryId)
  );

export const useEstablishmentsBySubCategory = (
  subcategoryId: number
): Establishment[] =>
  usePropertyStore((s) =>
    s.data.Establishments.filter((e) => e.subcategory_id === subcategoryId)
  );

// --- Médias ---
export const usePhotosByEstablishment = (establishmentId: number): Photo[] =>
  usePropertyStore((s) =>
    s.data.Photos.filter((p) => p.establishment_id === establishmentId)
  );

export const useCoverPhoto = (
  establishmentId: number
): Photo | undefined =>
  usePropertyStore((s) => getCoverPhoto(s.data, establishmentId));

export const useVideosByEstablishment = (establishmentId: number): Video[] =>
  usePropertyStore((s) =>
    s.data.Videos.filter((v) => v.establishment_id === establishmentId)
  );

export const useReviewsByEstablishment = (establishmentId: number): Review[] =>
  usePropertyStore((s) =>
    s.data.Reviews.filter((r) => r.establishment_id === establishmentId)
  );

// --- Référentiels ---
export const useAmenities = (): Amenity[] =>
  usePropertyStore((s) => s.data.Amenities);

export const usePaymentConditions = (): PaymentCondition[] =>
  usePropertyStore((s) => s.data.PaymentConditions);

// --- Géographie ---
export const useCountries = (): Country[] =>
  usePropertyStore((s) => s.data.Countries);

export const useDepartments = (countryId?: number): Department[] =>
  usePropertyStore((s) =>
    countryId
      ? s.data.Departments.filter((d) => d.country_id === countryId)
      : s.data.Departments
  );

export const useCommunes = (departmentId?: number): Commune[] =>
  usePropertyStore((s) =>
    departmentId
      ? s.data.Communes.filter((c) => c.department_id === departmentId)
      : s.data.Communes
  );

export const useDistricts = (communeId?: number): District[] =>
  usePropertyStore((s) =>
    communeId
      ? s.data.Districts.filter((d) => d.commune_id === communeId)
      : s.data.Districts
  );

export const useLocalities = (districtId?: number): Locality[] =>
  usePropertyStore((s) =>
    districtId
      ? s.data.Localities.filter((l) => l.district_id === districtId)
      : s.data.Localities
  );

// --- Acteurs ---
export const useOwners = (): Owner[] => usePropertyStore((s) => s.data.Owners);
export const useTenants = (): Tenant[] => usePropertyStore((s) => s.data.Tenants);

// --- Favoris ---
export const useFavorites = (): number[] =>
  usePropertyStore((s) => s.favoriteIds);



export const useFavoriteEstablishments = (): Establishment[] =>
  usePropertyStore(
    useShallow((s) =>
      s.data.Establishments.filter((e) => s.favoriteIds.includes(e.id))
    )
  );

// =====================================================================
// SÉLECTEURS DE RECHERCHE, FILTRES & PAGINATION
// =====================================================================

export const useSearchQuery = () => usePropertyStore((s) => s.searchQuery);
export const useSearchFilters = () => usePropertyStore((s) => s.searchFilters);

/**
 * Établissements filtrés et triés selon les filtres globaux actifs
 */

export const useFilteredEstablishments = (): Establishment[] => {
  const data = usePropertyStore((s) => s.data)
  const searchQuery = usePropertyStore((s) => s.searchQuery)
  const searchFilters = usePropertyStore((s) => s.searchFilters)

  return useMemo(() => {
    return filterEstablishments(
      data,
      searchQuery,
      searchFilters
    )
  }, [data, searchQuery, searchFilters])
}

/**
 * Établissements filtrés paginés selon la page courante
 */

export const useFilteredEstablishmentsPaginated = (): {
  items: Establishment[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
} => {
  const data = usePropertyStore((s) => s.data);
  const searchQuery = usePropertyStore((s) => s.searchQuery);
  const searchFilters = usePropertyStore((s) => s.searchFilters);
  const page = usePropertyStore((s) => s.page);
  const pageSize = usePropertyStore((s) => s.pageSize);

  const filtered = filterEstablishments(data, searchQuery, searchFilters);
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const startIndex = (page - 1) * pageSize;
  const items = filtered.slice(startIndex, startIndex + pageSize);

  return { items, total, page, pageSize, totalPages };
};

/**
 * Comptage dynamique d'établissements approuvés par catégorie
 */


export const useCategoryCounts = (): Record<number, number> => {
  const data = usePropertyStore((s) => s.data)

  return useMemo(() => {
    return countByCategory(data)
  }, [data])
}

/**
 * Comptage dynamique d'établissements approuvés par équipement
 */
 
export const useAmenityCounts = (): Record<number, number> => {
  const establishments = usePropertyStore(
    (s) => s.data.Establishments
  )

  return useMemo(() => {
    const counts: Record<number, number> = {}

    for (const est of establishments) {
      if (est.status !== "APPROVED") continue

      for (const aid of est.amenity_ids) {
        counts[aid] = (counts[aid] ?? 0) + 1
      }
    }

    return counts
  }, [establishments])
}

/**
 * Fourchette globale de prix disponible
 */
 
export const useGlobalPriceRange = (
  categoryId?: number
): { min: number; max: number } => {
  const data = usePropertyStore((s) => s.data)

  return useMemo(() => {
    return getPriceRange(data, categoryId)
  }, [data, categoryId])
}