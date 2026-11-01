import { create } from "zustand";
import { isTokenExpiredResponse, useAuthStore } from "@/store/authStore";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "https://bestreservs-api.onrender.com"
).replace(/\/+$/, "");
const API_PATH = "";

export type CustomerReservationStatus =
  | "EN_ATTENTE"
  | "CONFIRMEE"
  | "EN_COURS"
  | "TERMINEE"
  | "REFUSEE"
  | "ANNULEE"
  | "EXPIREE";

export type ReservationPaymentMethod =
  | "CARTE_BANCAIRE"
  | "MOBILE_MONEY"
  | "VIREMENT"
  | "SUR_PLACE";

export type CustomerPaymentStatus = "EN_ATTENTE" | "PAYE" | "REMBOURSE" | "ECHOUE";

export interface CustomerReservation {
  id: string;
  reference: string;
  establishment_id: string;
  category: string | null;
  reservation_date: string | null;
  start_date: string | null;
  end_date: string | null;
  start_time: string | null;
  end_time: string | null;
  quantity: number;
  nights: number | null;
  adults: number;
  children: number;
  room_or_unit: string | null;
  options: Record<string, unknown> | null;
  special_requests: string | null;
  subtotal: number;
  service_fee: number;
  total: number;
  currency: string;
  payment_method: ReservationPaymentMethod | null;
  payment_status: string;
  status: CustomerReservationStatus;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReservationCreatePayload {
  establishment_id: string;
  start_date: string;
  end_date?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  quantity: number;
  adults: number;
  children: number;
  room_or_unit?: string | null;
  options?: Record<string, unknown> | null;
  special_requests?: string | null;
  payment_method?: ReservationPaymentMethod | null;
}

export interface ReservationQuote {
  establishment_id: string;
  category_kind: string;
  start_date: string;
  end_date: string | null;
  start_time: string | null;
  end_time: string | null;
  nights: number | null;
  quantity: number;
  adults: number;
  children: number;
  price_unit: string;
  unit_label: string;
  unit_price: number;
  price_units: number;
  base_subtotal: number;
  options_total: number;
  options_breakdown: Record<string, unknown>[];
  subtotal: number;
  service_fee_percent: number;
  service_fee: number;
  tax_percent: number;
  tax_amount: number;
  discount_amount: number;
  total: number;
  commission_rate: number;
  commission_amount: number;
  partner_amount: number;
  currency: string;
}

export interface PublicAvailability {
  establishment_id: string;
  available: boolean;
  availability_status: string;
  start_date: string;
  end_date: string | null;
  start_time: string | null;
  end_time: string | null;
  remaining_capacity: number | null;
}

export interface PaymentCheckout {
  transaction_ref: string;
  public_key: string;
  partner_id: string;
  amount: number;
  currency: string;
  status: CustomerPaymentStatus;
  sandbox: boolean;
  provider_transaction_id: string | null;
  requires_widget: boolean;
}

export interface ConfirmedPayment {
  transaction_ref: string;
  reservation_reference: string;
  amount: number;
  currency: string;
  status: CustomerPaymentStatus;
  provider: string | null;
  created_at: string;
  updated_at: string;
}

interface CustomerReservationsState {
  reservations: CustomerReservation[];
  total: number;
  hasLoaded: boolean;
  loadedForEmail: string | null;
  isLoading: boolean;
  error: string | null;
  selectedReservation: CustomerReservation | null;
  isDetailLoading: boolean;
  detailError: string | null;
  availability: PublicAvailability | null;
  isCheckingAvailability: boolean;
  quote: ReservationQuote | null;
  isQuoting: boolean;
  quoteError: string | null;
  isCreating: boolean;
  createError: string | null;
  isCreatingCheckout: boolean;
  checkoutError: string | null;
  isConfirmingPayment: boolean;
  paymentConfirmationError: string | null;
  isCancelling: boolean;
  cancelError: string | null;
  loadMine: () => Promise<void>;
  resetMine: () => void;
  loadByReference: (reference: string) => Promise<CustomerReservation>;
  checkAvailability: (payload: ReservationCreatePayload) => Promise<PublicAvailability>;
  getQuote: (payload: ReservationCreatePayload) => Promise<ReservationQuote>;
  create: (payload: ReservationCreatePayload, idempotencyKey: string) => Promise<CustomerReservation>;
  createCheckout: (
    reservationId: string,
    paymentMethod: Extract<ReservationPaymentMethod, "CARTE_BANCAIRE" | "MOBILE_MONEY">,
    idempotencyKey: string,
  ) => Promise<PaymentCheckout>;
  confirmCheckout: (transactionRef: string, providerTransactionId: string) => Promise<ConfirmedPayment>;
  cancel: (reservationId: string, reason: string) => Promise<CustomerReservation>;
  clearQuote: () => void;
}

type ApiRecord = Record<string, unknown>;

function isRecord(value: unknown): value is ApiRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function unwrap(body: unknown): unknown {
  let value = body;
  for (let depth = 0; depth < 3 && isRecord(value); depth += 1) {
    const nested = value.data ?? value.result;
    if (nested === undefined || nested === value) break;
    value = nested;
  }
  return value;
}

function errorMessage(body: unknown, status: number): string {
  if (!isRecord(body)) return `La requête a échoué (${status}).`;
  const detail = body.detail ?? body.message;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    const messages = detail
      .map((item) => (isRecord(item) ? item.msg : null))
      .filter((message): message is string => typeof message === "string");
    if (messages.length) return messages.join(", ");
  }
  return `La requête a échoué (${status}).`;
}

async function request(path: string, options: RequestInit = {}): Promise<unknown> {
  const token = useAuthStore.getState().accessToken;
  if (!token) throw new Error("Connectez-vous pour gérer vos réservations.");
  const response = await fetch(`${API_URL}${API_PATH}${path}`, {
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
  if (!response.ok) throw new Error(errorMessage(body, response.status));
  return unwrap(body);
}

function numberValue(value: unknown, fallback = 0): number {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function nullableString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function normalizeReservation(value: unknown): CustomerReservation {
  if (!isRecord(value) || typeof value.id !== "string" || typeof value.reference !== "string") {
    throw new Error("L’API a renvoyé une réservation invalide.");
  }
  return {
    id: value.id,
    reference: value.reference,
    establishment_id: typeof value.establishment_id === "string" ? value.establishment_id : "",
    category: nullableString(value.category),
    reservation_date: nullableString(value.reservation_date),
    start_date: nullableString(value.start_date),
    end_date: nullableString(value.end_date),
    start_time: nullableString(value.start_time),
    end_time: nullableString(value.end_time),
    quantity: numberValue(value.quantity, 1),
    nights: value.nights == null ? null : numberValue(value.nights),
    adults: numberValue(value.adults, 1),
    children: numberValue(value.children),
    room_or_unit: nullableString(value.room_or_unit),
    options: isRecord(value.options) ? value.options : null,
    special_requests: nullableString(value.special_requests),
    subtotal: numberValue(value.subtotal),
    service_fee: numberValue(value.service_fee),
    total: numberValue(value.total),
    currency: typeof value.currency === "string" ? value.currency : "XOF",
    payment_method: typeof value.payment_method === "string" ? value.payment_method as ReservationPaymentMethod : null,
    payment_status: typeof value.payment_status === "string" ? value.payment_status : "EN_ATTENTE",
    status: typeof value.status === "string" ? value.status as CustomerReservationStatus : "EN_ATTENTE",
    cancelled_at: nullableString(value.cancelled_at),
    cancellation_reason: nullableString(value.cancellation_reason),
    created_at: typeof value.created_at === "string" ? value.created_at : "",
    updated_at: typeof value.updated_at === "string" ? value.updated_at : "",
  };
}

function normalizeAvailability(value: unknown): PublicAvailability {
  if (!isRecord(value) || typeof value.available !== "boolean") {
    throw new Error("L’API a renvoyé une disponibilité invalide.");
  }
  return {
    establishment_id: typeof value.establishment_id === "string" ? value.establishment_id : "",
    available: value.available,
    availability_status: typeof value.availability_status === "string" ? value.availability_status : "",
    start_date: typeof value.start_date === "string" ? value.start_date : "",
    end_date: nullableString(value.end_date),
    start_time: nullableString(value.start_time),
    end_time: nullableString(value.end_time),
    remaining_capacity: value.remaining_capacity == null ? null : numberValue(value.remaining_capacity),
  };
}

function normalizeQuote(value: unknown): ReservationQuote {
  if (!isRecord(value) || typeof value.establishment_id !== "string" || typeof value.total === "undefined") {
    throw new Error("L’API a renvoyé un devis invalide.");
  }
  return {
    establishment_id: value.establishment_id,
    category_kind: typeof value.category_kind === "string" ? value.category_kind : "",
    start_date: typeof value.start_date === "string" ? value.start_date : "",
    end_date: nullableString(value.end_date),
    start_time: nullableString(value.start_time),
    end_time: nullableString(value.end_time),
    nights: value.nights == null ? null : numberValue(value.nights),
    quantity: numberValue(value.quantity, 1),
    adults: numberValue(value.adults, 1),
    children: numberValue(value.children),
    price_unit: typeof value.price_unit === "string" ? value.price_unit : "",
    unit_label: typeof value.unit_label === "string" ? value.unit_label : "",
    unit_price: numberValue(value.unit_price),
    price_units: numberValue(value.price_units),
    base_subtotal: numberValue(value.base_subtotal),
    options_total: numberValue(value.options_total),
    options_breakdown: Array.isArray(value.options_breakdown) ? value.options_breakdown.filter(isRecord) : [],
    subtotal: numberValue(value.subtotal),
    service_fee_percent: numberValue(value.service_fee_percent),
    service_fee: numberValue(value.service_fee),
    tax_percent: numberValue(value.tax_percent),
    tax_amount: numberValue(value.tax_amount),
    discount_amount: numberValue(value.discount_amount),
    total: numberValue(value.total),
    commission_rate: numberValue(value.commission_rate),
    commission_amount: numberValue(value.commission_amount),
    partner_amount: numberValue(value.partner_amount),
    currency: typeof value.currency === "string" ? value.currency : "XOF",
  };
}

function normalizePaymentStatus(value: unknown): CustomerPaymentStatus {
  if (value === "EN_ATTENTE" || value === "PAYE" || value === "REMBOURSE" || value === "ECHOUE") {
    return value;
  }
  throw new Error("L’API a renvoyé un statut de paiement invalide.");
}

function normalizeCheckout(value: unknown): PaymentCheckout {
  if (
    !isRecord(value) ||
    typeof value.transaction_ref !== "string" ||
    typeof value.public_key !== "string" ||
    typeof value.partner_id !== "string" ||
    typeof value.sandbox !== "boolean" ||
    typeof value.requires_widget !== "boolean"
  ) {
    throw new Error("L’API a renvoyé une initialisation de paiement invalide.");
  }
  const amount = numberValue(value.amount, Number.NaN);
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error("Le montant renvoyé pour le paiement est invalide.");
  }
  return {
    transaction_ref: value.transaction_ref,
    public_key: value.public_key,
    partner_id: value.partner_id,
    amount,
    currency: typeof value.currency === "string" ? value.currency : "XOF",
    status: normalizePaymentStatus(value.status),
    sandbox: value.sandbox,
    provider_transaction_id: nullableString(value.provider_transaction_id),
    requires_widget: value.requires_widget,
  };
}

function normalizeConfirmedPayment(value: unknown): ConfirmedPayment {
  if (
    !isRecord(value) ||
    typeof value.transaction_ref !== "string" ||
    typeof value.reservation_reference !== "string" ||
    typeof value.amount === "undefined" ||
    typeof value.currency !== "string" ||
    typeof value.created_at !== "string" ||
    typeof value.updated_at !== "string"
  ) {
    throw new Error("L’API a renvoyé une confirmation de paiement invalide.");
  }
  return {
    transaction_ref: value.transaction_ref,
    reservation_reference: value.reservation_reference,
    amount: numberValue(value.amount, Number.NaN),
    currency: value.currency,
    status: normalizePaymentStatus(value.status),
    provider: nullableString(value.provider),
    created_at: value.created_at,
    updated_at: value.updated_at,
  };
}

function buildAvailabilityQuery(payload: ReservationCreatePayload): string {
  const params = new URLSearchParams({
    establishment_id: payload.establishment_id,
    start_date: payload.start_date,
    quantity: String(payload.quantity),
    adults: String(payload.adults),
    children: String(payload.children),
  });
  if (payload.end_date) params.set("end_date", payload.end_date);
  if (payload.start_time) params.set("start_time", payload.start_time);
  if (payload.end_time) params.set("end_time", payload.end_time);
  return params.toString();
}

export const useCustomerReservationsStore = create<CustomerReservationsState>((set) => ({
  reservations: [],
  total: 0,
  hasLoaded: false,
  loadedForEmail: null,
  isLoading: false,
  error: null,
  selectedReservation: null,
  isDetailLoading: false,
  detailError: null,
  availability: null,
  isCheckingAvailability: false,
  quote: null,
  isQuoting: false,
  quoteError: null,
  isCreating: false,
  createError: null,
  isCreatingCheckout: false,
  checkoutError: null,
  isConfirmingPayment: false,
  paymentConfirmationError: null,
  isCancelling: false,
  cancelError: null,

  loadMine: async () => {
    const email = useAuthStore.getState().email;
    set((state) => ({
      isLoading: true,
      error: null,
      ...(state.loadedForEmail !== email ? { reservations: [], total: 0 } : {}),
    }));
    try {
      const pageSize = 100;
      const body = await request(`/users/me/reservations?page=1&page_size=${pageSize}`);
      if (!isRecord(body) || !Array.isArray(body.items)) {
        throw new Error("L’API a renvoyé une liste de réservations invalide.");
      }
      const total = numberValue(body.total, body.items.length);
      const reservations = body.items.map(normalizeReservation);
      const pages = Math.ceil(total / Math.max(1, numberValue(body.limit, pageSize)));
      for (let page = 2; page <= pages; page += 1) {
        const nextPage = await request(`/users/me/reservations?page=${page}&page_size=${pageSize}`);
        if (!isRecord(nextPage) || !Array.isArray(nextPage.items)) {
          throw new Error("L’API a renvoyé une page de réservations invalide.");
        }
        reservations.push(...nextPage.items.map(normalizeReservation));
      }
      set({ reservations, total, isLoading: false, hasLoaded: true, loadedForEmail: email });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Impossible de charger vos réservations.";
      set({ isLoading: false, error: message, hasLoaded: true, loadedForEmail: email });
      throw error;
    }
  },

  resetMine: () => set({
    reservations: [],
    total: 0,
    isLoading: false,
    error: null,
    hasLoaded: false,
    loadedForEmail: null,
    selectedReservation: null,
    detailError: null,
  }),

  loadByReference: async (reference) => {
    set({ isDetailLoading: true, detailError: null, selectedReservation: null });
    try {
      const body = await request(`/users/me/reservations/${encodeURIComponent(reference)}`);
      const reservation = normalizeReservation(body);
      set({ selectedReservation: reservation, isDetailLoading: false });
      return reservation;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Impossible de charger cette réservation.";
      set({ isDetailLoading: false, detailError: message });
      throw error;
    }
  },

  checkAvailability: async (payload) => {
    set({ isCheckingAvailability: true, availability: null });
    try {
      const body = await request(`/reservations/check-availability?${buildAvailabilityQuery(payload)}`);
      const availability = normalizeAvailability(body);
      set({ availability, isCheckingAvailability: false });
      return availability;
    } catch (error) {
      set({ isCheckingAvailability: false });
      throw error;
    }
  },

  getQuote: async (payload) => {
    set({ isQuoting: true, quoteError: null, quote: null });
    try {
      const body = await request("/reservations/quote", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const quote = normalizeQuote(body);
      set({ quote, isQuoting: false });
      return quote;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Impossible de calculer le devis.";
      set({ isQuoting: false, quoteError: message });
      throw error;
    }
  },

  create: async (payload, idempotencyKey) => {
    set({ isCreating: true, createError: null });
    try {
      const body = await request("/reservations", {
        method: "POST",
        headers: { "Idempotency-Key": idempotencyKey },
        body: JSON.stringify(payload),
      });
      const reservation = normalizeReservation(body);
      set((state) => {
        const alreadyLoaded = state.reservations.some((item) => item.id === reservation.id);
        return {
          reservations: [reservation, ...state.reservations.filter((item) => item.id !== reservation.id)],
          total: alreadyLoaded ? state.total : state.total + 1,
          selectedReservation: reservation,
          isCreating: false,
        };
      });
      return reservation;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Impossible de créer la réservation.";
      set({ isCreating: false, createError: message });
      throw error;
    }
  },

  createCheckout: async (reservationId, paymentMethod, idempotencyKey) => {
    set({ isCreatingCheckout: true, checkoutError: null });
    try {
      const body = await request("/api/v1/payments/checkout", {
        method: "POST",
        headers: { "Idempotency-Key": idempotencyKey },
        body: JSON.stringify({
          reservation_id: reservationId,
          payment_method: paymentMethod,
        }),
      });
      const checkout = normalizeCheckout(body);
      set({ isCreatingCheckout: false });
      return checkout;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Impossible d’initialiser le paiement.";
      set({ isCreatingCheckout: false, checkoutError: message });
      throw error;
    }
  },

  confirmCheckout: async (transactionRef, providerTransactionId) => {
    set({ isConfirmingPayment: true, paymentConfirmationError: null });
    try {
      const body = await request("/api/v1/payments/confirm", {
        method: "POST",
        body: JSON.stringify({
          transaction_ref: transactionRef,
          provider_transaction_id: providerTransactionId,
        }),
      });
      const payment = normalizeConfirmedPayment(body);
      set({ isConfirmingPayment: false });
      return payment;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Impossible de vérifier le paiement.";
      set({ isConfirmingPayment: false, paymentConfirmationError: message });
      throw error;
    }
  },

  cancel: async (reservationId, reason) => {
    set({ isCancelling: true, cancelError: null });
    try {
      const body = await request(`/users/me/reservations/${encodeURIComponent(reservationId)}/cancel`, {
        method: "POST",
        body: JSON.stringify({ reason }),
      });
      const reservation = normalizeReservation(body);
      set((state) => ({
        reservations: state.reservations.map((item) => item.id === reservation.id ? reservation : item),
        selectedReservation: reservation,
        isCancelling: false,
      }));
      return reservation;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Impossible d’annuler la réservation.";
      set({ isCancelling: false, cancelError: message });
      throw error;
    }
  },

  clearQuote: () => set({ quote: null, quoteError: null, availability: null }),
}));
