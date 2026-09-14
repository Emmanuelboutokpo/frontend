// =====================================================================
// STORE ZUSTAND — LandReservation
// =====================================================================

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { propertyData } from "../data/propertyData";
import { Amenity, Category, Commune, Country, Department, District, Establishment, Locality, Owner, PaymentCondition, Photo, PropertyData, Review, SubCategory, Tenant, Video } from "../types/types";
 
// ---------------------------------------------------------------------
// STATE
// ---------------------------------------------------------------------
interface PropertyState {
  // Data brute
  data: PropertyData;

  // État UI
  selectedEstablishmentId: number | null;
  favoriteIds: number[];

  // Actions
  selectEstablishment: (id: number | null) => void;
  toggleFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
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

      selectEstablishment: (id) => set({ selectedEstablishmentId: id }),

      toggleFavorite: (id) =>
        set((s) => ({
          favoriteIds: s.favoriteIds.includes(id)
            ? s.favoriteIds.filter((f) => f !== id)
            : [...s.favoriteIds, id],
        })),

      isFavorite: (id) => get().favoriteIds.includes(id),

      reset: () =>
        set({
          selectedEstablishmentId: null,
          favoriteIds: [],
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

export const useSubCategories = (categoryId?: number): SubCategory[] =>
  usePropertyStore((s) =>
    categoryId
      ? s.data.SubCategories.filter((sc) => sc.category_id === categoryId)
      : s.data.SubCategories
  );

// --- Établissements ---
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
  usePropertyStore((s) =>
    s.data.Establishments.filter((e) => s.favoriteIds.includes(e.id))
  );