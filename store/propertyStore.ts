// =====================================================================
// STORE ZUSTAND — LandReservation
// =====================================================================

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  Amenity,
  Category,
  Commune,
  Country,
  Department,
  District,
  Establishment,
  EntityId,
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
  getPriceRange,
  countByCategory,
} from "../utils/selectors";

import {
  extractEstablishmentItems,
  extractPhotos,
  getCollectionPagination,
  getCollectionTotal,
  normalizeApiAmenity,
  normalizeApiCategory,
  normalizeApiCountry,
  normalizeApiSubCategory,
  normalizeEstablishmentList,
  normalizeReviews,
  requestEstablishmentsApi,
  unwrapApiValue,
} from "../lib/establishments-api";

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
  popularEstablishments: Establishment[];
  popularLoading: boolean;
  nearbyEstablishments: Establishment[];
  similarEstablishments: Establishment[];
  nearbyOnly: boolean;
  establishmentsLoaded: boolean;
  establishmentsLoading: boolean;
  establishmentsError: string | null;

  // État UI & Sélection
  selectedEstablishmentId: EntityId | null;
  favoriteIds: EntityId[];

  // Recherche & Filtres globaux
  searchQuery: SearchQuery;
  searchFilters: SearchFilters;
  page: number;
  pageSize: number;

  // Actions
  selectEstablishment: (id: EntityId | null) => void;
  toggleFavorite: (id: EntityId) => void;
  isFavorite: (id: EntityId) => boolean;

  setSearchQuery: (query: Partial<SearchQuery>) => void;
  setSearchFilters: (filters: Partial<SearchFilters>) => void;
  setCategory: (categoryId?: EntityId | null) => void;
  setSortBy: (sortBy?: SearchFilters["sortBy"]) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  resetFilters: () => void;
  reset: () => void;
  fetchEstablishments: (query?: SearchQuery) => Promise<void>;
  fetchPopularEstablishments: () => Promise<Establishment[]>;
  fetchNearbyEstablishments: (
    latitude: number,
    longitude: number,
    radiusKm?: number
  ) => Promise<Establishment[]>;
  fetchEstablishmentBySlug: (slug: string) => Promise<Establishment>;
  fetchEstablishmentReviews: (establishmentId: EntityId) => Promise<void>;
  fetchSimilarEstablishments: (establishmentId: EntityId) => Promise<Establishment[]>;
}

function mergeById<T extends { id: EntityId }>(current: T[], incoming: T[]): T[] {
  const merged = new Map(current.map((item) => [item.id, item]));
  incoming.forEach((item) => merged.set(item.id, item));
  return Array.from(merged.values());
}

function updateDataWithApiEstablishments(
  current: PropertyData,
  body: unknown,
  replace = false
): { data: PropertyData; establishments: Establishment[] } {
  const rawItems = extractEstablishmentItems(body);
  const establishments = normalizeEstablishmentList(body, current);
  const photos = rawItems.flatMap((item, index) =>
    extractPhotos(item, establishments[index]?.id ?? 0)
  );
  const categories = rawItems
    .map((item) => normalizeApiCategory(
      typeof item === "object" && item !== null && "category" in item
        ? item.category
        : undefined
    ))
    .filter((item): item is Category => item !== undefined);
  const subcategories = rawItems
    .map((item) => normalizeApiSubCategory(
      typeof item === "object" && item !== null && "subcategory" in item
        ? item.subcategory
        : undefined
    ))
    .filter((item): item is SubCategory => item !== undefined);
  const amenities = rawItems.flatMap((item) => {
    if (typeof item !== "object" || item === null || !("amenities" in item) || !Array.isArray(item.amenities)) {
      return [];
    }
    return item.amenities
      .map(normalizeApiAmenity)
      .filter((amenity): amenity is Amenity => amenity !== undefined);
  });
  const countries = rawItems
    .map((item) =>
      typeof item === "object" && item !== null && "location" in item
        ? normalizeApiCountry(item.location)
        : undefined
    )
    .filter((country): country is Country => country !== undefined);
  const mergeReferences = <T extends { id: EntityId }>(existing: T[], incoming: T[]) =>
    replace && incoming.length > 0
      ? mergeById([], incoming)
      : mergeById(existing, incoming);
  return {
    establishments,
    data: {
      ...current,
      Categories: mergeReferences(current.Categories, categories),
      SubCategories: mergeReferences(current.SubCategories, subcategories),
      Amenities: mergeReferences(current.Amenities, amenities),
      Countries: mergeReferences(current.Countries, countries),
      Establishments: replace
        ? establishments
        : mergeById(current.Establishments, establishments),
      Photos: replace ? photos : mergeById(current.Photos, photos),
    },
  };
}

function buildEstablishmentQueryParams(query?: SearchQuery): URLSearchParams {
  const params = new URLSearchParams();
  if (!query) return params;

  const values: Array<[string, EntityId | number | undefined]> = [
    ["q", query.keyword?.trim() || undefined],
    ["category_id", query.categoryId],
    ["subcategory_id", query.subcategoryId],
    ["location_id", query.locationId],
    ["check_in", query.checkIn],
    ["check_out", query.checkOut],
    ["reservation_date", query.reservationDate],
    ["arrival_time", query.arrivalTime],
    ["activity_date", query.activityDate],
    ["activity_type_id", query.activityTypeId],
    ["guests", query.guests || undefined],
    ["participants", query.participants || undefined],
  ];
  values.forEach(([key, value]) => {
    if (value !== undefined && value !== "") params.set(key, String(value));
  });
  return params;
}

async function fetchAllEstablishmentItems(params: URLSearchParams): Promise<unknown[]> {
  const firstPage = await requestEstablishmentsApi("", params);
  const items = extractEstablishmentItems(firstPage);
  const pagination = getCollectionPagination(firstPage);
  const total = pagination.total ?? getCollectionTotal(firstPage);

  if (total === undefined || total <= items.length) return items;
  if (!pagination.limit || pagination.limit < 1) {
    throw new Error("L’API a renvoyé une pagination invalide pour les établissements.");
  }

  let offset = (pagination.offset ?? 0) + items.length;
  while (items.length < total) {
    const pageParams = new URLSearchParams(params);
    pageParams.set("limit", String(pagination.limit));
    pageParams.set("offset", String(offset));
    const pageBody = await requestEstablishmentsApi("", pageParams);
    const pageItems = extractEstablishmentItems(pageBody);
    if (pageItems.length === 0) {
      throw new Error("L’API a renvoyé une page vide avant la fin des établissements.");
    }

    items.push(...pageItems);
    const pageOffset = getCollectionPagination(pageBody).offset;
    if (pageOffset !== undefined && pageOffset !== offset) {
      throw new Error("L’API a renvoyé un offset inattendu pour les établissements.");
    }
    offset += pageItems.length;
  }

  return items;
}

// ---------------------------------------------------------------------
// STORE
// ---------------------------------------------------------------------
export const usePropertyStore = create<PropertyState>()(
  persist(
    (set, get) => ({
      data: {
        Countries: [],
        Departments: [],
        Communes: [],
        Districts: [],
        Localities: [],
        Owners: [],
        Tenants: [],
        Categories: [],
        SubCategories: [],
        Amenities: [],
        PaymentConditions: [],
        Establishments: [],
        Photos: [],
        Reviews: [],
        Videos: [],
        Availability: [],
      },
      popularEstablishments: [],
      popularLoading: false,
      nearbyEstablishments: [],
      similarEstablishments: [],
      nearbyOnly: false,
      establishmentsLoaded: false,
      establishmentsLoading: false,
      establishmentsError: null,
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
          nearbyOnly: false,
          nearbyEstablishments: [],
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
          nearbyOnly: false,
          nearbyEstablishments: [],
          searchQuery: initialSearchQuery,
          searchFilters: initialSearchFilters,
          page: 1,
        }),

      fetchEstablishments: async (query) => {
        set((state) => ({
          establishmentsLoading: true,
          establishmentsError: null,
          nearbyEstablishments: [],
          nearbyOnly: false,
          ...(query
            ? {
                establishmentsLoaded: false,
                data: {
                  ...state.data,
                  Establishments: [],
                  Photos: [],
                },
              }
            : {}),
        }));
        try {
          const items = await fetchAllEstablishmentItems(buildEstablishmentQueryParams(query));
          const result = updateDataWithApiEstablishments(get().data, { items }, true);
          set({
            data: result.data,
            nearbyOnly: false,
            establishmentsLoaded: true,
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Impossible de charger les établissements.";
          set({ establishmentsError: message });
          throw error;
        } finally {
          set({ establishmentsLoading: false });
        }
      },

      fetchPopularEstablishments: async () => {
        set({ establishmentsError: null, popularLoading: true });
        try {
          const body = await requestEstablishmentsApi("/popular");
          const result = updateDataWithApiEstablishments(get().data, body);
          set({ data: result.data, popularEstablishments: result.establishments });
          return result.establishments;
        } catch (error) {
          const message = error instanceof Error ? error.message : "Impossible de charger les établissements populaires.";
          set({ establishmentsError: message });
          throw error;
        } finally {
          set({ popularLoading: false });
        }
      },

      fetchNearbyEstablishments: async (latitude, longitude, radiusKm = 10) => {
        set({
          establishmentsError: null,
          nearbyEstablishments: [],
          nearbyOnly: false,
        });
        try {
          const params = new URLSearchParams({
            latitude: String(latitude),
            longitude: String(longitude),
            radius_km: String(radiusKm),
          });
          const body = await requestEstablishmentsApi("/nearby", params);
          const result = updateDataWithApiEstablishments(get().data, body);
          set({
            data: result.data,
            nearbyEstablishments: result.establishments,
            nearbyOnly: true,
            establishmentsLoaded: true,
          });
          return result.establishments;
        } catch (error) {
          const message = error instanceof Error ? error.message : "Impossible de charger les établissements proches.";
          set({ establishmentsError: message });
          throw error;
        }
      },

      fetchEstablishmentBySlug: async (slug) => {
        set({ establishmentsError: null });
        try {
          const body = await requestEstablishmentsApi(`/${encodeURIComponent(slug)}`);
          const item = unwrapApiValue(body);
          const result = updateDataWithApiEstablishments(get().data, { items: [item] });
          const establishment = result.establishments[0];
          if (!establishment) {
            throw new Error("L’API n’a renvoyé aucun établissement.");
          }
          set({ data: result.data });
          return establishment;
        } catch (error) {
          const message = error instanceof Error ? error.message : "Impossible de charger cet établissement.";
          set({ establishmentsError: message });
          throw error;
        }
      },

      fetchEstablishmentReviews: async (establishmentId) => {
        set({ establishmentsError: null });
        try {
          const body = await requestEstablishmentsApi(`/${establishmentId}/reviews`);
          const reviews = normalizeReviews(body, establishmentId);
          const reviewCount = getCollectionTotal(body);
          set((state) => ({
            data: {
              ...state.data,
              Reviews: mergeById(state.data.Reviews, reviews),
              Establishments: state.data.Establishments.map((establishment) =>
                establishment.id === establishmentId
                  ? {
                      ...establishment,
                      review_ids: reviews.map((review) => review.id),
                      review_count: reviewCount ?? Math.max(establishment.review_count ?? 0, reviews.length),
                    }
                  : establishment
              ),
            },
          }));
        } catch (error) {
          const message = error instanceof Error ? error.message : "Impossible de charger les avis.";
          set({ establishmentsError: message });
          throw error;
        }
      },

      fetchSimilarEstablishments: async (establishmentId) => {
        set({ establishmentsError: null, similarEstablishments: [] });
        try {
          const body = await requestEstablishmentsApi(`/${establishmentId}/similar`);
          const result = updateDataWithApiEstablishments(get().data, body);
          set({ data: result.data, similarEstablishments: result.establishments });
          return result.establishments;
        } catch (error) {
          const message = error instanceof Error ? error.message : "Impossible de charger les établissements similaires.";
          set({ establishmentsError: message });
          throw error;
        }
      },
    }),
    {
      name: "lr-property-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        favoriteIds: state.favoriteIds,
      }),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as { favoriteIds?: unknown } | undefined;
        const favoriteIds = Array.isArray(persisted?.favoriteIds)
          ? persisted.favoriteIds.filter(
            (id): id is EntityId =>
              (typeof id === "number" && Number.isFinite(id)) ||
              (typeof id === "string" && id.length > 0)
            )
          : currentState.favoriteIds;

        return { ...currentState, favoriteIds };
      },
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

export const useCategoryById = (id?: EntityId | null): Category | undefined =>
  usePropertyStore((s) =>
    id ? s.data.Categories.find((c) => c.id === id) : undefined
  );


export const useSubCategories = (categoryId?: EntityId): SubCategory[] =>
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
  id: EntityId | null
): Establishment | undefined =>
  usePropertyStore((s) =>
    id ? s.data.Establishments.find((e) => e.id === id) : undefined
  );

export const useEstablishmentsByCategory = (
  categoryId: EntityId
): Establishment[] =>
  usePropertyStore((s) =>
    s.data.Establishments.filter((e) => e.category_id === categoryId)
  );

export const useEstablishmentsBySubCategory = (
  subcategoryId: EntityId
): Establishment[] =>
  usePropertyStore((s) =>
    s.data.Establishments.filter((e) => e.subcategory_id === subcategoryId)
  );

// --- Médias ---
export const usePhotosByEstablishment = (establishmentId: EntityId): Photo[] =>
  usePropertyStore((s) =>
    s.data.Photos.filter((p) => p.establishment_id === establishmentId)
  );

export const useCoverPhoto = (
  establishmentId: EntityId
): Photo | undefined =>
  usePropertyStore((s) => getCoverPhoto(s.data, establishmentId));

export const useVideosByEstablishment = (establishmentId: EntityId): Video[] =>
  usePropertyStore((s) =>
    s.data.Videos.filter((v) => v.establishment_id === establishmentId)
  );

export const useReviewsByEstablishment = (establishmentId: EntityId): Review[] =>
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

export const useDepartments = (countryId?: EntityId): Department[] =>
  usePropertyStore((s) =>
    countryId
      ? s.data.Departments.filter((d) => d.country_id === countryId)
      : s.data.Departments
  );

export const useCommunes = (departmentId?: EntityId): Commune[] =>
  usePropertyStore((s) =>
    departmentId
      ? s.data.Communes.filter((c) => c.department_id === departmentId)
      : s.data.Communes
  );

export const useDistricts = (communeId?: EntityId): District[] =>
  usePropertyStore((s) =>
    communeId
      ? s.data.Districts.filter((d) => d.commune_id === communeId)
      : s.data.Districts
  );

export const useLocalities = (districtId?: EntityId): Locality[] =>
  usePropertyStore((s) =>
    districtId
      ? s.data.Localities.filter((l) => l.district_id === districtId)
      : s.data.Localities
  );

// --- Acteurs ---
export const useOwners = (): Owner[] => usePropertyStore((s) => s.data.Owners);
export const useTenants = (): Tenant[] => usePropertyStore((s) => s.data.Tenants);

// --- Favoris ---
export const useFavorites = (): EntityId[] =>
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
  const nearbyEstablishments = usePropertyStore((s) => s.nearbyEstablishments)
  const nearbyOnly = usePropertyStore((s) => s.nearbyOnly)

  return useMemo(() => {
    const filtered = filterEstablishments(
      data,
      searchQuery,
      searchFilters
    )
    return nearbyOnly
      ? filtered.filter((establishment) =>
          nearbyEstablishments.some((nearby) => nearby.id === establishment.id)
        )
      : filtered
  }, [data, searchQuery, searchFilters, nearbyEstablishments, nearbyOnly])
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
  const nearbyEstablishments = usePropertyStore((s) => s.nearbyEstablishments);
  const nearbyOnly = usePropertyStore((s) => s.nearbyOnly);

  const matchingEstablishments = filterEstablishments(data, searchQuery, searchFilters);
  const filtered = nearbyOnly
    ? matchingEstablishments.filter((establishment) =>
        nearbyEstablishments.some((nearby) => nearby.id === establishment.id)
      )
    : matchingEstablishments;
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const startIndex = (page - 1) * pageSize;
  const items = filtered.slice(startIndex, startIndex + pageSize);

  return { items, total, page, pageSize, totalPages };
};

/**
 * Comptage dynamique d'établissements approuvés par catégorie
 */


export const useCategoryCounts = (): Record<string, number> => {
  const data = usePropertyStore((s) => s.data)

  return useMemo(() => {
    return countByCategory(data)
  }, [data])
}

/**
 * Comptage dynamique d'établissements approuvés par équipement
 */
 
export const useAmenityCounts = (): Record<string, number> => {
  const establishments = usePropertyStore(
    (s) => s.data.Establishments
  )

  return useMemo(() => {
    const counts: Record<string, number> = {}

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
  categoryId?: EntityId
): { min: number; max: number } => {
  const data = usePropertyStore((s) => s.data)

  return useMemo(() => {
    return getPriceRange(data, categoryId)
  }, [data, categoryId])
}