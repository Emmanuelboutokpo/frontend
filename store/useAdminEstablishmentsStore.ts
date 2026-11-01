import { create } from "zustand";
import { isTokenExpiredResponse, useAuthStore } from "@/store/authStore";
import type {
  AdminAmenity,
  AdminCategory,
  AdminEstablishment,
  AdminLocation,
  AdminSubcategory,
  AvailabilityStatus,
  EstablishmentStats,
  EstablishmentStatus,
  PriceUnit,
} from "@/types/establishment";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "https://bestreservs-api.onrender.com"
).replace(/\/+$/, "");
const ESTABLISHMENTS_PATH = "/admin/establishments";
const PAGE_LIMIT = 100;
type ApiRecord = Record<string, unknown>;
let establishmentListRequestId = 0;

interface State {
  establishments: AdminEstablishment[];
  total: number;
  stats: EstablishmentStats;
  categories: AdminCategory[];
  locations: AdminLocation[];
  amenities: AdminAmenity[];
  page: number;
  perPage: number;
  search: string;
  statusFilter: EstablishmentStatus | "ALL";
  categoryFilter: string | "ALL";
  isLoading: boolean;
  error: string | null;
  loadEstablishments: () => Promise<void>;
  loadStats: () => Promise<void>;
  loadReferences: () => Promise<void>;
  loadDetails: (id: string) => Promise<AdminEstablishment>;
  createEstablishment: (payload: EstablishmentPayload) => Promise<AdminEstablishment>;
  updateEstablishment: (id: string, payload: Partial<EstablishmentPayload>) => Promise<AdminEstablishment>;
  removeEstablishment: (id: string) => Promise<void>;
  changeStatus: (id: string, status: EstablishmentStatus) => Promise<void>;
  changeAvailability: (id: string, status: AvailabilityStatus) => Promise<void>;
  addPhotos: (id: string, files: File[], coverIndex?: number) => Promise<void>;
  deletePhoto: (photoId: string) => Promise<void>;
  setCoverPhoto: (photoId: string) => Promise<void>;
  addAmenities: (id: string, amenityIds: string[]) => Promise<void>;
  removeAmenity: (id: string, amenityId: string) => Promise<void>;
  createCategory: (name: string, icon?: string) => Promise<void>;
  updateCategory: (id: string, patch: { name?: string; icon?: string }) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  createSubcategory: (categoryId: string, name: string, icon?: string) => Promise<void>;
  updateSubcategory: (id: string, patch: { category_id?: string; name?: string; icon?: string }) => Promise<void>;
  deleteSubcategory: (id: string) => Promise<void>;
  createLocation: (payload: Record<string, unknown>) => Promise<void>;
  updateLocation: (id: string, patch: Record<string, unknown>) => Promise<void>;
  deleteLocation: (id: string) => Promise<void>;
  createAmenity: (name: string, icon?: string) => Promise<void>;
  updateAmenity: (id: string, patch: { name?: string; icon?: string }) => Promise<void>;
  deleteAmenity: (id: string) => Promise<void>;
  setSearch: (search: string) => void;
  setStatusFilter: (status: EstablishmentStatus | "ALL") => void;
  setCategoryFilter: (categoryId: string | "ALL") => void;
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
}

export interface EstablishmentPayload {
  category_id: string;
  subcategory_id?: string | null;
  location_id: string;
  address: string;
  name: string;
  slug?: string | null;
  description?: string | null;
  price?: number | null;
  price_per_night?: number | null;
  price_per_month?: number | null;
  price_unit?: PriceUnit | null;
  currency?: string;
  capacity?: number | null;
  rooms_count?: number | null;
  cuisine_type?: string | null;
  area?: number | null;
  latitude?: number | null;
  longitude?: number | null;
}

function isRecord(value: unknown): value is ApiRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function unwrap(body: unknown): unknown {
  let value = body;
  for (let depth = 0; depth < 3 && isRecord(value) && "data" in value; depth += 1) {
    value = value.data;
  }
  return value;
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function list(value: unknown): unknown[] {
  const body = unwrap(value);
  if (Array.isArray(body)) return body;
  if (isRecord(body) && Array.isArray(body.items)) return body.items;
  throw new Error("L’API a renvoyé une liste invalide.");
}

function toPhoto(value: unknown, index: number): AdminEstablishment["photos"][number] {
  if (!isRecord(value)) throw new Error("L’API a renvoyé une photo invalide.");
  return {
    id: asString(value.id, `photo-${index}`),
    url: asString(value.url ?? value.photo_url),
    is_cover: Boolean(value.is_cover ?? value.is_cover_photo ?? value.is_cover_image),
  };
}

function normalizeEstablishment(value: unknown): AdminEstablishment {
  if (!isRecord(value) || typeof value.id !== "string") {
    throw new Error("L’API a renvoyé un établissement invalide.");
  }
  const category = isRecord(value.category) ? value.category : {};
  const subcategory = isRecord(value.subcategory) ? value.subcategory : {};
  const location = isRecord(value.location) ? value.location : {};
  const owner = isRecord(value.owner) ? value.owner : {};
  const photos = Array.isArray(value.photos)
    ? value.photos.map(toPhoto)
    : isRecord(value.cover_photo)
      ? [toPhoto(value.cover_photo, 0)]
      : [];
  const amenities = Array.isArray(value.amenities)
    ? value.amenities.filter(isRecord).map((item) => ({
        id: asString(item.id),
        name: asString(item.name),
        icon: typeof item.icon === "string" ? item.icon : null,
      }))
    : [];
  const price = asNumber(value.price);

  return {
    id: value.id,
    name: asString(value.name),
    slug: asString(value.slug),
    categoryId: asString(value.category_id ?? category.id),
    category: asString(category.name, asString(value.category_name, "—")),
    subcategoryId: typeof value.subcategory_id === "string" ? value.subcategory_id : null,
    subcategory: asString(subcategory.name, asString(value.subcategory_name, "—")),
    locationId: asString(value.location_id ?? location.id),
    location: {
      country: asString(location.country ?? location.name ?? location.country_code),
      city: asString(location.city ?? location.name),
      address: asString(value.address),
    },
    owner: asString(owner.name ?? owner.email ?? value.owner_name, "—"),
    price: price ?? 0,
    pricePerNight: asNumber(value.price_per_night),
    pricePerMonth: asNumber(value.price_per_month),
    currency: asString(value.currency, "XOF"),
    priceUnit: typeof value.price_unit === "string" ? value.price_unit as PriceUnit : null,
    status: isEstablishmentStatus(value.status) ? value.status : "EN_ATTENTE",
    availabilityStatus: isAvailabilityStatus(value.availability_status) ? value.availability_status : "UNAVAILABLE",
    rating: asNumber(value.rating) ?? 0,
    reviewCount: asNumber(value.reviews_count) ?? 0,
    images: photos.map((photo) => photo.url).filter(Boolean),
    photos,
    amenities,
    description: asString(value.description),
    address: asString(value.address),
    latitude: asNumber(value.latitude),
    longitude: asNumber(value.longitude),
    capacity: asNumber(value.capacity),
    roomsCount: asNumber(value.rooms_count),
    cuisineType: typeof value.cuisine_type === "string" ? value.cuisine_type : null,
    area: asNumber(value.area),
    createdAt: asString(value.created_at),
  };
}

function isEstablishmentStatus(value: unknown): value is EstablishmentStatus {
  return value === "PUBLIE" || value === "EN_ATTENTE" || value === "REJETE" || value === "SUSPENDU";
}

function isAvailabilityStatus(value: unknown): value is AvailabilityStatus {
  return value === "AVAILABLE" || value === "RENTED" || value === "UNAVAILABLE";
}

function normalizeCategory(value: unknown): AdminCategory {
  if (!isRecord(value) || typeof value.id !== "string") throw new Error("Catégorie invalide reçue de l’API.");
  return {
    id: value.id,
    name: asString(value.name),
    icon: typeof value.icon === "string" ? value.icon : null,
    subcategories: Array.isArray(value.subcategories)
      ? value.subcategories.filter(isRecord).map(normalizeSubcategory)
      : [],
  };
}

function normalizeSubcategory(value: unknown): AdminSubcategory {
  if (!isRecord(value) || typeof value.id !== "string") throw new Error("Sous-catégorie invalide reçue de l’API.");
  return {
    id: value.id,
    category_id: asString(value.category_id),
    name: asString(value.name),
    icon: typeof value.icon === "string" ? value.icon : null,
  };
}

function normalizeAmenity(value: unknown): AdminAmenity {
  if (!isRecord(value) || typeof value.id !== "string") throw new Error("Équipement invalide reçu de l’API.");
  return { id: value.id, name: asString(value.name), icon: typeof value.icon === "string" ? value.icon : null };
}

function normalizeLocation(value: unknown): AdminLocation {
  if (!isRecord(value) || typeof value.id !== "string") throw new Error("Lieu invalide reçu de l’API.");
  return {
    id: value.id,
    name: asString(value.name),
    type: value.type as AdminLocation["type"],
    parent_id: typeof value.parent_id === "string" ? value.parent_id : null,
    country_code: asString(value.country_code),
    latitude: asNumber(value.latitude),
    longitude: asNumber(value.longitude),
    timezone: typeof value.timezone === "string" ? value.timezone : null,
    population: asNumber(value.population),
    metadata_json: isRecord(value.metadata_json) ? value.metadata_json : null,
    is_active: Boolean(value.is_active),
    created_at: asString(value.created_at),
    updated_at: asString(value.updated_at),
  };
}

async function request(path: string, options: RequestInit = {}): Promise<unknown> {
  const token = useAuthStore.getState().accessToken;
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(!isFormData && options.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    if (isTokenExpiredResponse(response.status, body) && token && useAuthStore.getState().accessToken === token) {
      useAuthStore.getState().expireSession();
    }
    const detail = isRecord(body) ? body.detail ?? body.message : null;
    const message = typeof detail === "string"
      ? detail
      : Array.isArray(detail)
        ? detail.map((item) => isRecord(item) ? asString(item.msg) : "").filter(Boolean).join(", ")
        : `La requête a échoué (${response.status}).`;
    throw new Error(message || `La requête a échoué (${response.status}).`);
  }
  return unwrap(body);
}

async function reloadReferences(set: (state: Partial<State>) => void) {
  const [categoriesResult, locationsResult, subcategoriesResult, amenitiesResult] = await Promise.all([
    request("/api/v1/categories?limit=100"),
    request("/api/v1/locations?limit=100"),
    request("/api/v1/subcategories?limit=100"),
    request("/amenities?limit=100"),
  ]);
  const categoryRows = list(categoriesResult).map(normalizeCategory);
  const subcategories = list(subcategoriesResult).map(normalizeSubcategory);
  const categories = categoryRows.map((category) => ({
    ...category,
    subcategories: subcategories.filter((subcategory) => subcategory.category_id === category.id),
  }));
  const locations = list(locationsResult).map(normalizeLocation);
  const amenities = list(amenitiesResult).map(normalizeAmenity);
  set({ categories, locations, amenities });
}

export const useAdminEstablishmentsStore = create<State>((set, get) => ({
  establishments: [],
  total: 0,
  stats: { total: 0, enAttente: 0, publies: 0, rejetes: 0, suspendus: 0 },
  categories: [],
  locations: [],
  amenities: [],
  page: 1,
  perPage: 20,
  search: "",
  statusFilter: "ALL",
  categoryFilter: "ALL",
  isLoading: false,
  error: null,

  loadEstablishments: async () => {
    const requestId = ++establishmentListRequestId;
    set({ isLoading: true, error: null });
    try {
      const { search, statusFilter, categoryFilter, page, perPage } = get();
      const params = new URLSearchParams({ limit: String(perPage), offset: String((page - 1) * perPage) });
      if (search.trim().length >= 2) params.set("q", search.trim());
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      if (categoryFilter !== "ALL") params.set("category_id", categoryFilter);
      const response = await request(`${ESTABLISHMENTS_PATH}?${params}`);
      if (!isRecord(response) || !Array.isArray(response.items)) throw new Error("L’API a renvoyé une page d’établissements invalide.");
      if (requestId === establishmentListRequestId) {
        set({
          establishments: response.items.map(normalizeEstablishment),
          total: Number(response.total) || 0,
          isLoading: false,
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Le chargement des établissements a échoué.";
      if (requestId === establishmentListRequestId) set({ error: message, isLoading: false });
      throw error;
    }
  },

  loadStats: async () => {
    try {
      const statuses: { key: keyof Omit<EstablishmentStats, "total">; status: EstablishmentStatus }[] = [
        { key: "enAttente", status: "EN_ATTENTE" },
        { key: "publies", status: "PUBLIE" },
        { key: "rejetes", status: "REJETE" },
        { key: "suspendus", status: "SUSPENDU" },
      ];
      const responses = await Promise.all([
        request(`${ESTABLISHMENTS_PATH}?limit=1`),
        ...statuses.map(({ status }) => request(`${ESTABLISHMENTS_PATH}?limit=1&status=${status}`)),
      ]);
      const counts = responses.map((response) => {
        if (!isRecord(response) || typeof response.total !== "number") {
          throw new Error("L’API a renvoyé des statistiques d’établissements invalides.");
        }
        return response.total;
      });
      set({
        stats: {
          total: counts[0],
          enAttente: counts[1],
          publies: counts[2],
          rejetes: counts[3],
          suspendus: counts[4],
        },
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Le chargement des statistiques a échoué." });
      throw error;
    }
  },

  loadReferences: async () => {
    try {
      await reloadReferences(set);
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Le chargement des référentiels a échoué." });
      throw error;
    }
  },

  loadDetails: async (id) => normalizeEstablishment(await request(`${ESTABLISHMENTS_PATH}/${id}`)),
  createEstablishment: async (payload) => {
    const result = normalizeEstablishment(await request(ESTABLISHMENTS_PATH, { method: "POST", body: JSON.stringify(payload) }));
    await get().loadEstablishments();
    return result;
  },
  updateEstablishment: async (id, payload) => {
    const result = normalizeEstablishment(await request(`${ESTABLISHMENTS_PATH}/${id}`, { method: "PATCH", body: JSON.stringify(payload) }));
    await get().loadEstablishments();
    return result;
  },
  removeEstablishment: async (id) => {
    await request(`${ESTABLISHMENTS_PATH}/${id}`, { method: "DELETE" });
    await get().loadEstablishments();
  },
  changeStatus: async (id, status) => {
    await request(`${ESTABLISHMENTS_PATH}/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
    await get().loadEstablishments();
  },
  changeAvailability: async (id, availability_status) => {
    await request(`${ESTABLISHMENTS_PATH}/${id}/availability`, { method: "PATCH", body: JSON.stringify({ availability_status }) });
    await get().loadEstablishments();
  },
  addPhotos: async (id, files, coverIndex) => {
    if (!files.length) return;
    const before = await get().loadDetails(id);
    const existingPhotoIds = new Set(before.photos.map((photo) => photo.id));
    const body = new FormData();
    files.forEach((file) => body.append("files", file));
    await request(`${ESTABLISHMENTS_PATH}/${id}/photos`, { method: "POST", body });
    const updated = await get().loadDetails(id);
    const addedPhotos = updated.photos.filter((photo) => !existingPhotoIds.has(photo.id));
    if (coverIndex !== undefined) {
      const cover = addedPhotos[coverIndex];
      if (!cover) {
        throw new Error("Les photos ont été envoyées, mais la photo choisie pour la couverture est introuvable.");
      }
      await request(`/admin/photos/${cover.id}/cover`, { method: "PATCH" });
    }
    await get().loadEstablishments();
  },
  deletePhoto: async (photoId) => {
    await request(`/admin/photos/${photoId}`, { method: "DELETE" });
    await get().loadEstablishments();
  },
  setCoverPhoto: async (photoId) => {
    await request(`/admin/photos/${photoId}/cover`, { method: "PATCH" });
    await get().loadEstablishments();
  },
  addAmenities: async (id, amenityIds) => {
    if (!amenityIds.length) return;
    await request(`${ESTABLISHMENTS_PATH}/${id}/amenities`, { method: "POST", body: JSON.stringify({ amenity_ids: amenityIds }) });
    await get().loadEstablishments();
  },
  removeAmenity: async (id, amenityId) => {
    await request(`${ESTABLISHMENTS_PATH}/${id}/amenities/${amenityId}`, { method: "DELETE" });
    await get().loadEstablishments();
  },
  createCategory: async (name, icon) => {
    await request("/api/v1/admin/categories", { method: "POST", body: JSON.stringify({ name, icon: icon || null }) });
    await get().loadReferences();
  },
  updateCategory: async (id, patch) => {
    await request(`/api/v1/admin/categories/${id}`, { method: "PATCH", body: JSON.stringify(patch) });
    await get().loadReferences();
  },
  deleteCategory: async (id) => {
    await request(`/api/v1/admin/categories/${id}`, { method: "DELETE" });
    await get().loadReferences();
  },
  createSubcategory: async (categoryId, name, icon) => {
    await request(`/api/v1/admin/categories/${categoryId}/subcategories`, { method: "POST", body: JSON.stringify({ name, icon: icon || null }) });
    await get().loadReferences();
  },
  updateSubcategory: async (id, patch) => {
    await request(`/api/v1/admin/subcategories/${id}`, { method: "PATCH", body: JSON.stringify(patch) });
    await get().loadReferences();
  },
  deleteSubcategory: async (id) => {
    await request(`/api/v1/admin/subcategories/${id}`, { method: "DELETE" });
    await get().loadReferences();
  },
  createLocation: async (payload) => {
    await request("/api/v1/locations", { method: "POST", body: JSON.stringify(payload) });
    await get().loadReferences();
  },
  updateLocation: async (id, patch) => {
    await request(`/api/v1/locations/${id}`, { method: "PATCH", body: JSON.stringify(patch) });
    await get().loadReferences();
  },
  deleteLocation: async (id) => {
    await request(`/api/v1/locations/${id}`, { method: "DELETE" });
    await get().loadReferences();
  },
  createAmenity: async (name, icon) => {
    await request("/admin/amenities", { method: "POST", body: JSON.stringify({ name, icon: icon || null }) });
    await get().loadReferences();
  },
  updateAmenity: async (id, patch) => {
    await request(`/admin/amenities/${id}`, { method: "PATCH", body: JSON.stringify(patch) });
    await get().loadReferences();
  },
  deleteAmenity: async (id) => {
    await request(`/admin/amenities/${id}`, { method: "DELETE" });
    await get().loadReferences();
  },
  setSearch: (search) => set({ search, page: 1 }),
  setStatusFilter: (statusFilter) => set({ statusFilter, page: 1 }),
  setCategoryFilter: (categoryFilter) => set({ categoryFilter, page: 1 }),
  setPage: (page) => set({ page }),
  setPerPage: (perPage) => set({ perPage, page: 1 }),
}));
