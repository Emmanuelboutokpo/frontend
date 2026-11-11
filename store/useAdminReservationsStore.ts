import { create } from "zustand";
import { isTokenExpiredResponse, useAuthStore } from "@/store/authStore";
import type {
  AdminReservation,
  AdminReservationStats,
  ReservationStatus,
} from "@/types/reservation";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "https://bestreservs-api.onrender.com"
).replace(/\/+$/, "");
const ADMIN_RESERVATIONS_PATH = "/api/v1/admin/reservations";
const OWNER_RESERVATIONS_PATH = "/api/v1/owners/reservations";
let listRequestId = 0;
let recentRequestId = 0;
let statsRequestId = 0;
let detailsRequestId = 0;
let reservationsSearchCache: {
  key: string;
  reservations: AdminReservation[];
  loadedAt: number;
} | null = null;

function reservationsPath(): string {
  return useAuthStore.getState().role === "PROPRIETAIRE"
    ? OWNER_RESERVATIONS_PATH
    : ADMIN_RESERVATIONS_PATH;
}

type ApiRecord = Record<string, unknown>;

export interface AdminReservationFilters {
  search: string;
  status: ReservationStatus | "ALL";
  startDate: string;
  endDate: string;
}

interface ReservationPage {
  items: AdminReservation[];
  total: number;
  limit: number;
  offset: number;
}

interface AdminReservationsState {
  reservations: AdminReservation[];
  recentReservations: AdminReservation[];
  isLoadingRecentReservations: boolean;
  recentReservationsError: string | null;
  total: number;
  stats: AdminReservationStats;
  filters: AdminReservationFilters;
  page: number;
  perPage: number;
  isLoading: boolean;
  isLoadingStats: boolean;
  isLoadingDetails: boolean;
  error: string | null;
  statsError: string | null;
  detailsError: string | null;
  loadReservations: (
    filters: AdminReservationFilters,
    page: number,
    perPage: number,
  ) => Promise<void>;
  loadRecentReservations: () => Promise<void>;
  loadStats: (startDate?: string, endDate?: string) => Promise<void>;
  loadDetails: (id: string) => Promise<AdminReservation>;
  changeStatus: (id: string, status: ReservationStatus, reason?: string) => Promise<void>;
  recordRefund: (
    id: string,
    input: { external_reference: string; reason: string },
  ) => Promise<void>;
  setFilters: (patch: Partial<AdminReservationFilters>) => void;
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
}

const initialFilters: AdminReservationFilters = {
  search: "",
  status: "ALL",
  startDate: "",
  endDate: "",
};

const emptyStats: AdminReservationStats = {
  total: 0,
  pending: 0,
  confirmed: 0,
  ongoing: 0,
  completed: 0,
  cancelled: 0,
  paymentPending: 0,
  paid: 0,
  refunded: 0,
  grossPaid: 0,
  grossRefunded: 0,
};

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

function getErrorMessage(body: unknown, status: number): string {
  if (!isRecord(body)) return `La requête a échoué (${status}).`;
  const detail = body.detail ?? body.message;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    const messages = detail
      .map((item) => isRecord(item) ? item.msg : undefined)
      .filter((message): message is string => typeof message === "string");
    if (messages.length) return messages.join(", ");
  }
  return `La requête a échoué (${status}).`;
}

async function request(path: string, options: RequestInit = {}): Promise<unknown> {
  const token = useAuthStore.getState().accessToken;
  if (!token) throw new Error("Une session administrateur est requise.");

  const response = await fetch(`${API_URL}${reservationsPath()}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
  const body: unknown = await response.json().catch(() => null);
  if (isTokenExpiredResponse(response.status, body) && useAuthStore.getState().accessToken === token) {
    useAuthStore.getState().expireSession();
  }
  if (!response.ok) throw new Error(getErrorMessage(body, response.status));
  return unwrap(body);
}

function stringValue(value: unknown, field: string): string {
  if (typeof value !== "string") throw new Error(`L’API a renvoyé un champ ${field} invalide.`);
  return value;
}

function nullableString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function numberValue(value: unknown, field: string): number {
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(number)) throw new Error(`L’API a renvoyé un champ ${field} invalide.`);
  return number;
}

function nullableNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? number : null;
}

function imageUrls(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (typeof item === "string") return item ? [item] : [];
    if (!isRecord(item)) return [];
    const url = nullableString(item.url ?? item.photo_url ?? item.image_url);
    return url ? [url] : [];
  });
}

function normalizeSearchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("fr")
    .trim()
    .replace(/\s+/g, " ");
}

function matchesReservationSearch(reservation: AdminReservation, search: string): boolean {
  const fullName = `${reservation.clientFirstName} ${reservation.clientLastName}`;
  const reverseName = `${reservation.clientLastName} ${reservation.clientFirstName}`;
  const searchableValues = [
    reservation.reference,
    reservation.id,
    reservation.clientFirstName,
    reservation.clientLastName,
    fullName,
    reverseName,
    reservation.clientEmail,
    reservation.clientPhone ?? "",
    reservation.establishmentName ?? "",
  ];
  return searchableValues.some((value) => normalizeSearchText(value).includes(search));
}

function stringFrom(value: unknown, keys: string[]): string | null {
  if (!isRecord(value)) return null;
  for (const key of keys) {
    const candidate = value[key];
    if (typeof candidate === "string" && candidate.trim()) return candidate;
  }
  return null;
}

function normalizeReservation(value: unknown): AdminReservation {
  if (!isRecord(value)) throw new Error("L’API a renvoyé une réservation invalide.");
  const status = stringValue(value.status, "status");
  const paymentStatus = stringValue(value.payment_status, "payment_status");
  const paymentMethod = nullableString(value.payment_method);
  const reservationStatuses: ReservationStatus[] = [
    "EN_ATTENTE", "CONFIRMEE", "EN_COURS", "TERMINEE", "REFUSEE", "ANNULEE", "EXPIREE",
  ];
  const paymentStatuses = ["EN_ATTENTE", "PAYE", "REMBOURSE", "ECHOUE"];
  const paymentMethods = ["CARTE_BANCAIRE", "MOBILE_MONEY", "VIREMENT", "SUR_PLACE"];

  if (!reservationStatuses.includes(status as ReservationStatus)) {
    throw new Error(`Statut de réservation inconnu : ${status}.`);
  }
  if (!paymentStatuses.includes(paymentStatus)) {
    throw new Error(`Statut de paiement inconnu : ${paymentStatus}.`);
  }
  if (paymentMethod && !paymentMethods.includes(paymentMethod)) {
    throw new Error(`Mode de paiement inconnu : ${paymentMethod}.`);
  }

  const options = value.options;
  if (options !== null && options !== undefined && !isRecord(options)) {
    throw new Error("L’API a renvoyé des options de réservation invalides.");
  }
  const establishment = isRecord(value.establishment)
    ? value.establishment
    : isRecord(value.property)
      ? value.property
      : isRecord(value.establishment_details)
        ? value.establishment_details
        : {};
  const establishmentPhotos = imageUrls(establishment.photos ?? establishment.images);
  const establishmentImages = [
    ...imageUrls(establishment.images),
    ...establishmentPhotos,
    ...imageUrls(value.establishment_images ?? value.establishment_photos),
  ].filter((url, index, urls) => urls.indexOf(url) === index);
  const rawPhotos = Array.isArray(establishment.photos)
    ? establishment.photos
    : Array.isArray(establishment.images)
      ? establishment.images
      : value.establishment_photos;
  const coverPhoto = Array.isArray(rawPhotos)
    ? rawPhotos.find((photo) => isRecord(photo) && Boolean(photo.is_cover ?? photo.is_cover_photo ?? photo.is_cover_image))
    : undefined;
  const coverPhotoUrl = isRecord(coverPhoto)
    ? nullableString(coverPhoto.url ?? coverPhoto.photo_url ?? coverPhoto.image_url)
    : null;
  const establishmentImage = stringFrom(establishment, [
    "cover_image", "cover_image_url", "main_image", "image_url", "image", "photo_url",
  ]) ?? stringFrom(value, [
    "establishment_image", "establishment_image_url", "establishment_cover_image", "property_image",
  ]) ?? coverPhotoUrl ?? establishmentImages[0] ?? null;
  const location = establishment.location;
  const establishmentCity = stringFrom(establishment, ["city", "city_name"])
    ?? stringFrom(location, ["city", "name"])
    ?? nullableString(typeof location === "string" ? location : null)
    ?? stringFrom(value, ["establishment_city", "city"]);

  return {
    id: stringValue(value.id, "id"),
    reference: stringValue(value.reference, "reference"),
    establishmentId: stringValue(value.establishment_id ?? establishment.id, "establishment_id"),
    establishmentName: stringFrom(establishment, ["name", "title", "establishment_name"])
      ?? stringFrom(value, ["establishment_name", "property_name"]),
    establishmentCity,
    establishmentAddress: stringFrom(establishment, ["address", "full_address"])
      ?? stringFrom(location, ["address", "full_address"])
      ?? stringFrom(value, ["establishment_address", "address"]),
    establishmentCategory: stringFrom(establishment, ["category", "category_name"])
      ?? stringFrom(value, ["establishment_category", "category_name"]),
    establishmentDescription: stringFrom(establishment, ["description", "summary"])
      ?? stringFrom(value, ["establishment_description"]),
    establishmentPrice: nullableNumber(establishment.price ?? establishment.price_per_night ?? value.establishment_price),
    establishmentRating: nullableNumber(establishment.rating ?? establishment.average_rating ?? value.establishment_rating),
    establishmentImage,
    establishmentImages: establishmentImage && !establishmentImages.includes(establishmentImage)
      ? [establishmentImage, ...establishmentImages]
      : establishmentImages,
    category: nullableString(value.category),
    reservationDate: nullableString(value.reservation_date),
    startDate: nullableString(value.start_date),
    endDate: nullableString(value.end_date),
    startTime: nullableString(value.start_time),
    endTime: nullableString(value.end_time),
    quantity: numberValue(value.quantity, "quantity"),
    nights: nullableNumber(value.nights),
    adults: numberValue(value.adults, "adults"),
    children: numberValue(value.children, "children"),
    roomOrUnit: nullableString(value.room_or_unit),
    options: isRecord(options) ? options : null,
    specialRequests: nullableString(value.special_requests),
    subtotal: numberValue(value.subtotal, "subtotal"),
    serviceFee: numberValue(value.service_fee, "service_fee"),
    total: numberValue(value.total, "total"),
    currency: stringValue(value.currency, "currency"),
    paymentMethod: paymentMethod as AdminReservation["paymentMethod"],
    paymentStatus: paymentStatus as AdminReservation["paymentStatus"],
    status: status as ReservationStatus,
    cancelledAt: nullableString(value.cancelled_at),
    cancellationReason: nullableString(value.cancellation_reason),
    createdAt: stringValue(value.created_at, "created_at"),
    updatedAt: stringValue(value.updated_at, "updated_at"),
    userId: stringValue(value.user_id, "user_id"),
    clientFirstName: stringValue(value.client_first_name, "client_first_name"),
    clientLastName: stringValue(value.client_last_name, "client_last_name"),
    clientEmail: stringValue(value.client_email, "client_email"),
    clientPhone: nullableString(value.client_phone),
    paymentProvider: nullableString(value.payment_provider),
    paymentReference: nullableString(value.payment_reference),
    paidAt: nullableString(value.paid_at),
  };
}

function normalizeStats(value: unknown): AdminReservationStats {
  if (!isRecord(value)) throw new Error("L’API a renvoyé des statistiques de réservation invalides.");
  return {
    total: numberValue(value.total, "total"),
    pending: numberValue(value.pending, "pending"),
    confirmed: numberValue(value.confirmed, "confirmed"),
    ongoing: numberValue(value.ongoing, "ongoing"),
    completed: numberValue(value.completed, "completed"),
    cancelled: numberValue(value.cancelled, "cancelled"),
    paymentPending: numberValue(value.payment_pending, "payment_pending"),
    paid: numberValue(value.paid, "paid"),
    refunded: numberValue(value.refunded, "refunded"),
    grossPaid: numberValue(value.gross_paid, "gross_paid"),
    grossRefunded: numberValue(value.gross_refunded, "gross_refunded"),
  };
}

function upsertReservation(
  reservations: AdminReservation[],
  reservation: AdminReservation,
): AdminReservation[] {
  const exists = reservations.some((item) => item.id === reservation.id);
  return exists
    ? reservations.map((item) => item.id === reservation.id ? reservation : item)
    : [reservation, ...reservations];
}

export const useAdminReservationsStore = create<AdminReservationsState>((set, get) => ({
  reservations: [],
  recentReservations: [],
  isLoadingRecentReservations: false,
  recentReservationsError: null,
  total: 0,
  stats: emptyStats,
  filters: initialFilters,
  page: 1,
  perPage: 20,
  isLoading: false,
  isLoadingStats: false,
  isLoadingDetails: false,
  error: null,
  statsError: null,
  detailsError: null,

  loadReservations: async (filters, page, perPage) => {
    const requestId = ++listRequestId;
    set({ isLoading: true, error: null, filters, page, perPage });
    try {
      if (filters.search.trim()) {
        const search = normalizeSearchText(filters.search);
        const cacheKey = JSON.stringify([filters.status, filters.startDate, filters.endDate]);
        let allReservations = reservationsSearchCache?.key === cacheKey
          && Date.now() - reservationsSearchCache.loadedAt < 30_000
          ? reservationsSearchCache.reservations
          : null;

        if (!allReservations) {
          const params = new URLSearchParams({ page: "1", page_size: "100" });
          if (filters.status !== "ALL") params.set("status", filters.status);
          if (filters.startDate) params.set("start_date", filters.startDate);
          if (filters.endDate) params.set("end_date", filters.endDate);
          const firstBody = await request(`?${params.toString()}`);
          if (!isRecord(firstBody) || !Array.isArray(firstBody.items)) {
            throw new Error("L’API a renvoyé une liste de réservations invalide.");
          }

          allReservations = firstBody.items.map(normalizeReservation);
          const total = numberValue(firstBody.total, "total");
          for (let currentPage = 2; allReservations.length < total; currentPage += 1) {
            if (requestId !== listRequestId) return;
            params.set("page", String(currentPage));
            const nextBody = await request(`?${params.toString()}`);
            if (!isRecord(nextBody) || !Array.isArray(nextBody.items) || nextBody.items.length === 0) {
              throw new Error("L’API a renvoyé une liste de réservations incomplète.");
            }
            allReservations.push(...nextBody.items.map(normalizeReservation));
          }
          reservationsSearchCache = { key: cacheKey, reservations: allReservations, loadedAt: Date.now() };
        }

        if (requestId !== listRequestId) return;
        const matchingReservations = allReservations.filter((reservation) =>
          matchesReservationSearch(reservation, search),
        );
        const startIndex = (page - 1) * perPage;
        set({
          reservations: matchingReservations.slice(startIndex, startIndex + perPage),
          total: matchingReservations.length,
        });
        return;
      }

      const params = new URLSearchParams({
        page: String(page),
        page_size: String(perPage),
      });
      if (filters.status !== "ALL") params.set("status", filters.status);
      if (filters.startDate) params.set("start_date", filters.startDate);
      if (filters.endDate) params.set("end_date", filters.endDate);
      const body = await request(`?${params.toString()}`);
      if (!isRecord(body) || !Array.isArray(body.items)) {
        throw new Error("L’API a renvoyé une liste de réservations invalide.");
      }
      const reservations = body.items.map(normalizeReservation);
      if (requestId === listRequestId) {
        set({
          reservations,
          total: numberValue(body.total, "total"),
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Le chargement des réservations a échoué.";
      if (requestId === listRequestId) set({ error: message });
      throw error;
    } finally {
      if (requestId === listRequestId) set({ isLoading: false });
    }
  },

  loadRecentReservations: async () => {
    const requestId = ++recentRequestId;
    set({ isLoadingRecentReservations: true, recentReservationsError: null });
    try {
      const body = await request("?page=1&page_size=5");
      if (!isRecord(body) || !Array.isArray(body.items)) {
        throw new Error("L’API a renvoyé une liste de réservations récentes invalide.");
      }
      const reservations = body.items.map(normalizeReservation);
      if (requestId === recentRequestId) set({ recentReservations: reservations });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Le chargement des réservations récentes a échoué.";
      if (requestId === recentRequestId) set({ recentReservationsError: message });
      throw error;
    } finally {
      if (requestId === recentRequestId) set({ isLoadingRecentReservations: false });
    }
  },

  loadStats: async (startDate, endDate) => {
    const requestId = ++statsRequestId;
    set({ isLoadingStats: true, statsError: null });
    try {
      const params = new URLSearchParams();
      if (startDate) params.set("start_date", startDate);
      if (endDate) params.set("end_date", endDate);
      const query = params.size ? `?${params.toString()}` : "";
      const stats = normalizeStats(await request(`/stats${query}`));
      if (requestId === statsRequestId) set({ stats });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Le chargement des statistiques a échoué.";
      if (requestId === statsRequestId) set({ statsError: message });
      throw error;
    } finally {
      if (requestId === statsRequestId) set({ isLoadingStats: false });
    }
  },

  loadDetails: async (id) => {
    const requestId = ++detailsRequestId;
    set({ isLoadingDetails: true, detailsError: null });
    try {
      const reservation = normalizeReservation(await request(`/${encodeURIComponent(id)}`));
      if (requestId === detailsRequestId) {
        set((state) => ({ reservations: upsertReservation(state.reservations, reservation) }));
      }
      return reservation;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Le détail de la réservation n’a pas pu être chargé.";
      if (requestId === detailsRequestId) set({ detailsError: message });
      throw error;
    } finally {
      if (requestId === detailsRequestId) set({ isLoadingDetails: false });
    }
  },

  changeStatus: async (id, status, reason) => {
    const body = await request(`/${encodeURIComponent(id)}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, ...(reason?.trim() ? { reason: reason.trim() } : {}) }),
    });
    const reservation = normalizeReservation(body);
    reservationsSearchCache = null;
    set((state) => ({ reservations: upsertReservation(state.reservations, reservation) }));
    try {
      await get().loadStats();
    } catch {
      // The stats request stores its error separately from the successful status change.
    }
  },

  recordRefund: async (id, input) => {
    const body = await request(`/${encodeURIComponent(id)}/refund`, {
      method: "POST",
      body: JSON.stringify({
        confirmation: "REFUNDED",
        external_reference: input.external_reference.trim(),
        reason: input.reason.trim(),
      }),
    });
    const reservation = normalizeReservation(body);
    reservationsSearchCache = null;
    set((state) => ({ reservations: upsertReservation(state.reservations, reservation) }));
    try {
      await get().loadStats();
    } catch {
      // The stats request stores its error separately from the successful refund recording.
    }
  },

  setFilters: (patch) => set((state) => ({
    filters: { ...state.filters, ...patch },
    page: 1,
  })),
  setPage: (page) => set({ page }),
  setPerPage: (perPage) => set({ perPage, page: 1 }),
}));
