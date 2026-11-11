import { create } from "zustand";
import { isTokenExpiredResponse, useAuthStore } from "@/store/authStore";
import type {
  AdminPayment,
  AdminPaymentClient,
  AdminPaymentCurrencyStats,
  AdminPaymentFilters,
  AdminPaymentReservation,
  AdminPaymentStats,
} from "@/types/adminPayments";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "https://bestreservs-api.onrender.com"
).replace(/\/+$/, "");
const ADMIN_PAYMENTS_PATH = "/api/v1/admin/payments";
const OWNER_PAYMENTS_PATH = "/api/v1/owners/payments";
let listRequestId = 0;
let statsRequestId = 0;
let detailsRequestId = 0;

type ApiRecord = Record<string, unknown>;

function paymentsPath(): string {
  return useAuthStore.getState().role === "PROPRIETAIRE"
    ? OWNER_PAYMENTS_PATH
    : ADMIN_PAYMENTS_PATH;
}

interface PaymentPage {
  items: AdminPayment[];
  total: number;
  limit: number;
  offset: number;
}

interface AdminPaymentsState {
  payments: AdminPayment[];
  total: number;
  stats: AdminPaymentStats;
  filters: AdminPaymentFilters;
  page: number;
  perPage: number;
  isLoading: boolean;
  isLoadingStats: boolean;
  isLoadingDetails: boolean;
  error: string | null;
  statsError: string | null;
  detailsError: string | null;
  selectedPayment: AdminPayment | null;
  loadPayments: (filters: AdminPaymentFilters, page: number, perPage: number) => Promise<void>;
  loadStats: (filters?: Partial<AdminPaymentFilters>) => Promise<void>;
  loadDetails: (id: string) => Promise<AdminPayment>;
  setFilters: (patch: Partial<AdminPaymentFilters>) => void;
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
}

const initialFilters: AdminPaymentFilters = {
  search: "",
  status: "ALL",
  provider: "ALL",
  type: "ALL",
  startDate: "",
  endDate: "",
};

function isRecord(value: unknown): value is ApiRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function unwrap(body: unknown): unknown {
  let value = body;
  for (let depth = 0; depth < 3 && isRecord(value) && "data" in value; depth += 1) value = value.data;
  return value;
}

function errorMessage(body: unknown, status: number): string {
  if (!isRecord(body)) return `La requête a échoué (${status}).`;
  const detail = body.detail ?? body.message;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    const messages = detail.map((item) => isRecord(item) ? item.msg : null).filter((value): value is string => typeof value === "string");
    if (messages.length) return messages.join(", ");
  }
  return `La requête a échoué (${status}).`;
}

async function request(path: string): Promise<unknown> {
  const token = useAuthStore.getState().accessToken;
  if (!token) throw new Error("Une session administrateur est requise.");
  const response = await fetch(`${API_URL}${paymentsPath()}${path}`, {
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
  });
  const body: unknown = await response.json().catch(() => null);
  if (isTokenExpiredResponse(response.status, body) && useAuthStore.getState().accessToken === token) {
    useAuthStore.getState().expireSession();
  }
  if (!response.ok) throw new Error(errorMessage(body, response.status));
  return unwrap(body);
}

function firstValue(value: ApiRecord, keys: string[]): unknown {
  for (const key of keys) if (value[key] !== undefined && value[key] !== null) return value[key];
  return null;
}

function stringField(value: ApiRecord, keys: string[], label: string): string {
  const field = firstValue(value, keys);
  if (typeof field !== "string") throw new Error(`L’API a renvoyé un champ ${label} invalide.`);
  return field;
}

function nullableString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function nullableNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function nestedRecord(value: ApiRecord, keys: string[]): ApiRecord | null {
  for (const key of keys) {
    if (isRecord(value[key])) return value[key] as ApiRecord;
  }
  return null;
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

function normalizeClient(
  payment: ApiRecord,
  reservation: ApiRecord | null,
): AdminPaymentClient | null {
  const client = nestedRecord(payment, ["client", "customer", "user"])
    ?? (reservation ? nestedRecord(reservation, ["client", "customer", "user"]) : null);
  const source = client ?? payment;
  const profile = nestedRecord(source, ["profile"]) ?? {};
  const firstName = firstValue(source, ["first_name", "firstName"])
    ?? firstValue(profile, ["first_name", "firstName"]);
  const lastName = firstValue(source, ["last_name", "lastName"])
    ?? firstValue(profile, ["last_name", "lastName"]);
  const email = firstValue(source, ["email", "client_email", "customer_email"])
    ?? firstValue(profile, ["email"]);
  const phone = firstValue(source, ["phone", "phone_number", "client_phone", "customer_phone"])
    ?? firstValue(profile, ["phone"]);
  const id = firstValue(source, ["id", "user_id", "userId", "client_id"]);
  const hasClientData = [id, firstName, lastName, email, phone].some((field) => field !== null);
  if (!hasClientData) return null;

  return {
    id: typeof id === "string" || typeof id === "number" ? String(id) : null,
    firstName: typeof firstName === "string" ? firstName : "",
    lastName: typeof lastName === "string" ? lastName : "",
    email: typeof email === "string" ? email : "",
    phone: nullableString(phone),
  };
}

function normalizeReservation(
  payment: ApiRecord,
  reservation: ApiRecord | null,
): AdminPaymentReservation | null {
  const source = reservation ?? payment;
  const establishment = nestedRecord(source, ["establishment", "property"]);
  const photos = imageUrls(establishment?.photos);
  const images = [
    ...imageUrls(establishment?.images),
    ...photos,
  ].filter((url, index, allUrls) => allUrls.indexOf(url) === index);
  const coverPhoto = Array.isArray(establishment?.photos)
    ? establishment.photos.find((photo) => isRecord(photo) && Boolean(photo.is_cover ?? photo.is_cover_photo ?? photo.is_cover_image))
    : undefined;
  const coverPhotoUrl = isRecord(coverPhoto)
    ? nullableString(coverPhoto.url ?? coverPhoto.photo_url ?? coverPhoto.image_url)
    : null;
  const establishmentImage = establishment
    ? nullableString(establishment.cover_image ?? establishment.image_url ?? establishment.image ?? establishment.photo_url)
      ?? coverPhotoUrl
      ?? images[0]
      ?? null
    : nullableString(firstValue(source, ["establishment_image", "establishment_image_url", "property_image", "image_url"]));
  const reservationId = firstValue(source, ["id", "reservation_id", "reservationId"]);
  const reference = firstValue(source, ["reference", "reservation_reference", "reservation_ref"])
    ?? firstValue(payment, ["reservation_reference", "reservation_ref"]);
  const hasReservationData = reservation !== null || reservationId !== null || reference !== null
    || firstValue(source, ["start_date", "startDate", "end_date", "endDate"]) !== null;
  if (!hasReservationData) return null;

  return {
    id: typeof reservationId === "string" || typeof reservationId === "number" ? String(reservationId) : null,
    reference: typeof reference === "string" ? reference : "",
    status: nullableString(firstValue(source, ["status", "reservation_status"])),
    category: nullableString(firstValue(source, ["category", "establishment_category"])),
    reservationDate: nullableString(firstValue(source, ["reservation_date", "reservationDate"])),
    startDate: nullableString(firstValue(source, ["start_date", "startDate", "check_in"])),
    endDate: nullableString(firstValue(source, ["end_date", "endDate", "check_out"])),
    startTime: nullableString(firstValue(source, ["start_time", "startTime"])),
    endTime: nullableString(firstValue(source, ["end_time", "endTime"])),
    quantity: nullableNumber(firstValue(source, ["quantity"])),
    nights: nullableNumber(firstValue(source, ["nights"])),
    adults: nullableNumber(firstValue(source, ["adults", "adult_count"])),
    children: nullableNumber(firstValue(source, ["children", "child_count"])),
    roomOrUnit: nullableString(firstValue(source, ["room_or_unit", "roomOrUnit", "room"])),
    options: firstValue(source, ["options", "extras"]),
    specialRequests: nullableString(firstValue(source, ["special_requests", "specialRequests"])),
    subtotal: nullableNumber(firstValue(source, ["subtotal"])),
    serviceFee: nullableNumber(firstValue(source, ["service_fee", "serviceFee"])),
    total: nullableNumber(firstValue(source, ["total", "total_amount"])),
    currency: nullableString(firstValue(source, ["currency"]) ?? firstValue(payment, ["currency"])),
    paymentMethod: nullableString(firstValue(source, ["payment_method", "paymentMethod"])),
    createdAt: nullableString(firstValue(source, ["created_at", "createdAt"])),
    establishmentName: establishment
      ? nullableString(firstValue(establishment, ["name", "title"]))
      : nullableString(firstValue(source, ["establishment_name", "property_name"])),
    establishmentCity: establishment
      ? nullableString(firstValue(establishment, ["city", "location"]))
      : nullableString(firstValue(source, ["establishment_city", "property_city"])),
    establishmentAddress: establishment
      ? nullableString(firstValue(establishment, ["address"]))
      : nullableString(firstValue(source, ["establishment_address", "property_address"])),
    establishmentImage,
    establishmentImages: establishmentImage && !images.includes(establishmentImage)
      ? [establishmentImage, ...images]
      : images,
  };
}

function normalizePayment(value: unknown): AdminPayment {
  if (!isRecord(value)) throw new Error("L’API a renvoyé une transaction invalide.");
  const nestedPayment = nestedRecord(value, ["payment", "transaction"]);
  const payment = nestedPayment ? { ...value, ...nestedPayment } : value;
  const nestedReservation = nestedRecord(payment, ["reservation", "booking"]);
  const status = stringField(payment, ["status", "payment_status"], "status");
  if (!["EN_ATTENTE", "PAYE", "REMBOURSE", "ECHOUE"].includes(status)) {
    throw new Error(`Statut de paiement inconnu : ${status}.`);
  }
  const amountValue = firstValue(payment, ["amount", "total", "gross_amount"]);
  const amount = typeof amountValue === "number" ? amountValue : Number(amountValue);
  if (!Number.isFinite(amount)) throw new Error("L’API a renvoyé un montant de transaction invalide.");
  const id = firstValue(payment, ["id", "transaction_id", "payment_id"]);
  const userId = firstValue(payment, ["user_id", "userId", "client_id", "customer_id"]);
  const reservationId = firstValue(payment, ["reservation_id", "reservationId"])
    ?? (nestedReservation ? firstValue(nestedReservation, ["id", "reservation_id", "reservationId"]) : null);
  const client = normalizeClient(payment, nestedReservation);
  const transactionRef = stringField(payment, ["transaction_ref", "transaction_reference", "reference"], "transaction_ref");
  const reservationReference = firstValue(payment, ["reservation_reference", "reservation_ref"])
    ?? (nestedReservation ? firstValue(nestedReservation, ["reference", "reservation_reference", "reservation_ref"]) : null);
  return {
    id: typeof id === "string" || typeof id === "number" ? String(id) : transactionRef,
    transactionId: typeof id === "string" || typeof id === "number" ? String(id) : null,
    transactionRef,
    reservationReference: typeof reservationReference === "string" ? reservationReference : "",
    amount,
    currency: stringField(payment, ["currency"], "currency"),
    status: status as AdminPayment["status"],
    provider: nullableString(firstValue(payment, ["provider", "payment_provider"])),
    paymentType: nullableString(firstValue(payment, ["type", "payment_type"])),
    userId: typeof userId === "string" || typeof userId === "number" ? String(userId) : client?.id ?? null,
    reservationId: typeof reservationId === "string" || typeof reservationId === "number" ? String(reservationId) : null,
    client,
    reservation: normalizeReservation(payment, nestedReservation),
    createdAt: stringField(payment, ["created_at", "createdAt"], "created_at"),
    updatedAt: stringField(payment, ["updated_at", "updatedAt"], "updated_at"),
  };
}

function getItems(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (isRecord(value)) {
    for (const key of ["items", "payments", "transactions", "results"]) {
      if (Array.isArray(value[key])) return value[key] as unknown[];
      if (isRecord(value[key]) && Array.isArray((value[key] as ApiRecord).items)) {
        return (value[key] as ApiRecord).items as unknown[];
      }
    }
  }
  throw new Error("L’API a renvoyé une liste de transactions invalide.");
}

function getTotal(value: unknown, fallbackCount: number): number {
  if (!isRecord(value)) return fallbackCount;
  for (const key of ["total", "total_count", "count"]) {
    const total = Number(value[key]);
    if (Number.isFinite(total)) return total;
  }
  return fallbackCount;
}

function numericValue(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizedStatKey(key: string): string {
  return key.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function findStatValue(source: unknown, key: string): unknown {
  let current = source;
  for (const part of key.split(".")) {
    if (!isRecord(current)) return undefined;
    const wantedKey = normalizedStatKey(part);
    const foundKey = Object.keys(current).find((candidate) => normalizedStatKey(candidate) === wantedKey);
    if (!foundKey) return undefined;
    current = current[foundKey];
  }
  return current;
}

function numericStat(value: unknown): number | null {
  const direct = numericValue(value);
  if (direct !== null) return direct;
  if (!isRecord(value)) return null;
  for (const key of ["count", "total", "value", "amount", "gross_amount"]) {
    const result = numericValue(value[key]);
    if (result !== null) return result;
  }
  return null;
}

export function readPaymentStat(stats: AdminPaymentStats, keys: string[]): number | null {
  for (const key of keys) {
    const result = numericStat(findStatValue(stats, key));
    if (result !== null) return result;
  }

  const containers = [
    "counts",
    "totals",
    "summary",
    "stats",
    "statistics",
    "payment_stats",
    "by_status",
    "status_counts",
    "status_breakdown",
    "payments_by_status",
    "payment_counts",
  ];
  for (const container of containers) {
    const nested = findStatValue(stats, container);
    if (!isRecord(nested)) continue;
    for (const key of keys) {
      const result = numericStat(findStatValue(nested, key));
      if (result !== null) return result;
    }
  }

  return null;
}

export function readPaymentCurrencyStats(
  stats: AdminPaymentStats,
  field: "payments_by_currency" | "refunds_by_currency",
): AdminPaymentCurrencyStats[] {
  const currencies = stats[field];
  if (!isRecord(currencies)) return [];

  return Object.entries(currencies).flatMap(([currency, value]) => {
    if (!isRecord(value)) return [];
    const rawStatuses = isRecord(value.by_status) ? value.by_status : {};
    const byStatus = Object.fromEntries(
      Object.entries(rawStatuses)
        .filter((entry): entry is [string, ApiRecord] => isRecord(entry[1]))
        .map(([status, statusValue]) => [
          status,
          {
            count: numericValue(statusValue.count),
            amount: numericValue(statusValue.amount),
          },
        ]),
    );
    const totalCount = numericValue(value.total_count)
      ?? Object.values(byStatus).reduce((total, status) => total + (status.count ?? 0), 0);
    const totalAmount = numericValue(value.confirmed_amount)
      ?? numericValue(value.refunded_amount)
      ?? Object.values(byStatus).reduce((total, status) => total + (status.amount ?? 0), 0);

    return [{
      currency,
      totalCount,
      totalAmount,
      byStatus,
    }];
  });
}

export const useAdminPaymentsStore = create<AdminPaymentsState>((set, get) => ({
  payments: [],
  total: 0,
  stats: {},
  filters: initialFilters,
  page: 1,
  perPage: 20,
  isLoading: false,
  isLoadingStats: false,
  isLoadingDetails: false,
  error: null,
  statsError: null,
  detailsError: null,
  selectedPayment: null,

  loadPayments: async (filters, page, perPage) => {
    const requestId = ++listRequestId;
    set({ isLoading: true, error: null, filters, page, perPage });
    try {
      const params = new URLSearchParams({ page: String(page), page_size: String(perPage) });
      if (filters.search.trim()) params.set("search", filters.search.trim());
      if (filters.status !== "ALL") params.set("status", filters.status);
      if (filters.provider !== "ALL") params.set("provider", filters.provider);
      if (filters.type !== "ALL") params.set("type", filters.type);
      if (filters.startDate) params.set("start_date", filters.startDate);
      if (filters.endDate) params.set("end_date", filters.endDate);
      const body = await request(`?${params.toString()}`);
      const payments = getItems(body).map(normalizePayment);
      if (requestId === listRequestId) set({ payments, total: getTotal(body, payments.length) });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Le chargement des transactions a échoué.";
      if (requestId === listRequestId) set({ error: message });
      throw error;
    } finally {
      if (requestId === listRequestId) set({ isLoading: false });
    }
  },

  loadStats: async (filters = {}) => {
    const requestId = ++statsRequestId;
    set({ isLoadingStats: true, statsError: null, stats: {} });
    try {
      const params = new URLSearchParams();
      if (filters.startDate) params.set("start_date", filters.startDate);
      if (filters.endDate) params.set("end_date", filters.endDate);
      if (filters.provider && filters.provider !== "ALL") params.set("provider", filters.provider);
      if (filters.status && filters.status !== "ALL") params.set("status", filters.status);
      if (filters.type && filters.type !== "ALL") params.set("type", filters.type);
      const suffix = params.size ? `?${params.toString()}` : "";
      const body = await request(`/stats${suffix}`);
      const stats = unwrap(body);
      if (!isRecord(stats)) throw new Error("L’API a renvoyé des statistiques de paiement invalides.");
      if (requestId === statsRequestId) set({ stats });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Le chargement des statistiques de paiement a échoué.";
      if (requestId === statsRequestId) set({ statsError: message });
      throw error;
    } finally {
      if (requestId === statsRequestId) set({ isLoadingStats: false });
    }
  },

  loadDetails: async (id) => {
    const requestId = ++detailsRequestId;
    set({ isLoadingDetails: true, detailsError: null, selectedPayment: null });
    try {
      const payment = normalizePayment(await request(`/${encodeURIComponent(id)}`));
      if (requestId === detailsRequestId) set({ selectedPayment: payment });
      return payment;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Le détail de la transaction n’a pas pu être chargé.";
      if (requestId === detailsRequestId) set({ detailsError: message });
      throw error;
    } finally {
      if (requestId === detailsRequestId) set({ isLoadingDetails: false });
    }
  },

  setFilters: (patch) => set((state) => ({ filters: { ...state.filters, ...patch }, page: 1 })),
  setPage: (page) => set({ page }),
  setPerPage: (perPage) => set({ perPage, page: 1 }),
}));
