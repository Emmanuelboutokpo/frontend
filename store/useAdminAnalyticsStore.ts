import { create } from "zustand";
import { isTokenExpiredResponse, useAuthStore } from "@/store/authStore";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "https://bestreservs-api.onrender.com"
).replace(/\/+$/, "");
const ADMIN_BASE_PATH = "/api/v1/admin/stats";
const OWNER_BASE_PATH = "/api/v1/owners/stats";

export type AnalyticsRecord = Record<string, unknown>;

export interface AdminAnalyticsData {
  overview: AnalyticsRecord;
  users: AnalyticsRecord;
  establishments: AnalyticsRecord;
  reservations: AnalyticsRecord;
  revenue: AnalyticsRecord;
  destinations: AnalyticsRecord[];
  topEstablishments: AnalyticsRecord[];
  activities: AnalyticsRecord[];
  reservationChart: AnalyticsRecord[];
  categoryChart: AnalyticsRecord[];
  revenueChart: AnalyticsRecord[];
}

type AnalyticsKey = keyof AdminAnalyticsData;
type AnalyticsErrors = Partial<Record<AnalyticsKey, string>>;

function analyticsBasePath(): string {
  return useAuthStore.getState().role === "PROPRIETAIRE"
    ? OWNER_BASE_PATH
    : ADMIN_BASE_PATH;
}

interface AdminAnalyticsState {
  data: AdminAnalyticsData;
  errors: AnalyticsErrors;
  isLoading: boolean;
  loadDashboard: () => Promise<void>;
}

const emptyData: AdminAnalyticsData = {
  overview: {},
  users: {},
  establishments: {},
  reservations: {},
  revenue: {},
  destinations: [],
  topEstablishments: [],
  activities: [],
  reservationChart: [],
  categoryChart: [],
  revenueChart: [],
};

function isRecord(value: unknown): value is AnalyticsRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function unwrap(body: unknown): unknown {
  let value = body;
  for (let depth = 0; depth < 3 && isRecord(value) && "data" in value; depth += 1) {
    value = value.data;
  }
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
  const response = await fetch(`${API_URL}${analyticsBasePath()}${path}`, {
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
  });
  const body: unknown = await response.json().catch(() => null);
  if (isTokenExpiredResponse(response.status, body) && useAuthStore.getState().accessToken === token) {
    useAuthStore.getState().expireSession();
  }
  if (!response.ok) throw new Error(errorMessage(body, response.status));
  return unwrap(body);
}

function asRecord(value: unknown, label: string): AnalyticsRecord {
  if (!isRecord(value)) throw new Error(`L’API a renvoyé une réponse ${label} invalide.`);
  return value;
}

function asRows(value: unknown, label: string): AnalyticsRecord[] {
  if (Array.isArray(value)) {
    if (value.every(isRecord)) return value;
    throw new Error(`L’API a renvoyé des éléments ${label} invalides.`);
  }
  if (!isRecord(value)) throw new Error(`L’API a renvoyé une liste ${label} invalide.`);
  for (const key of ["items", "results", "data", "series", "points", "breakdown", "categories", "destinations", "establishments", "activities"]) {
    if (Array.isArray(value[key])) return asRows(value[key], label);
  }
  const labels = value.labels ?? value.periods ?? value.months;
  const values = value.values ?? value.counts ?? value.reservations ?? value.revenue;
  if (Array.isArray(labels) && Array.isArray(values) && labels.length === values.length) {
    return labels.map((entry, index) => ({
      label: entry,
      value: values[index],
    }));
  }
  if (Array.isArray(value.datasets)) {
    const dataset = value.datasets.find(isRecord);
    if (dataset) return asRows(dataset, label);
  }
  if (Array.isArray(value.values)) {
    return value.values.filter(isRecord);
  }
  const entries = Object.values(value);
  if (entries.every(isRecord)) return entries;
  throw new Error(`Le format de la liste ${label} n’est pas reconnu.`);
}

export function analyticsNumber(record: AnalyticsRecord, keys: string[]): number | null {
  const queue = [record];
  for (let depth = 0; depth < 3 && queue.length > 0; depth += 1) {
    const current = queue.shift();
    if (!current) break;
    for (const key of keys) {
      const value = current[key];
      if (typeof value === "number" && Number.isFinite(value)) return value;
      if (typeof value === "string" && value.trim() && Number.isFinite(Number(value))) return Number(value);
    }
    queue.push(...Object.values(current).filter(isRecord));
  }
  return null;
}

export function analyticsArray(record: AnalyticsRecord, keys: string[]): AnalyticsRecord[] {
  for (const key of keys) {
    const value = record[key];
    if (Array.isArray(value)) return value.filter(isRecord);
  }
  return [];
}

export function analyticsString(record: AnalyticsRecord, keys: string[]): string | null {
  for (const key of keys) if (typeof record[key] === "string") return record[key] as string;
  return null;
}

export const useAdminAnalyticsStore = create<AdminAnalyticsState>((set) => ({
  data: emptyData,
  errors: {},
  isLoading: false,

  loadDashboard: async () => {
    set({ isLoading: true, errors: {} });
    const isOwner = useAuthStore.getState().role === "PROPRIETAIRE";
    const requests: { key: AnalyticsKey; path: string; kind: "record" | "rows" }[] = isOwner
      ? [
          { key: "establishments", path: "/establishments", kind: "record" },
          { key: "reservations", path: "/reservations", kind: "record" },
          { key: "revenue", path: "/revenue", kind: "record" },
          { key: "destinations", path: "/top-destinations?limit=5", kind: "rows" },
          { key: "topEstablishments", path: "/top-establishments?limit=5", kind: "rows" },
          { key: "activities", path: "/recent-activities?limit=5&offset=0", kind: "rows" },
          { key: "reservationChart", path: "/charts/reservations?period=month", kind: "rows" },
          { key: "categoryChart", path: "/charts/categories", kind: "rows" },
          { key: "revenueChart", path: "/charts/revenue?period=month&currency=XOF", kind: "rows" },
        ]
      : [
          { key: "overview", path: "/overview", kind: "record" },
          { key: "users", path: "/users", kind: "record" },
          { key: "establishments", path: "/establishments", kind: "record" },
          { key: "revenue", path: "/revenue", kind: "record" },
          { key: "destinations", path: "/top-destinations?limit=4", kind: "rows" },
          { key: "topEstablishments", path: "/top-establishments?limit=4", kind: "rows" },
          { key: "activities", path: "/recent-activities?limit=4&offset=0", kind: "rows" },
          { key: "categoryChart", path: "/charts/categories", kind: "rows" },
        ];

    const results = await Promise.all(requests.map(async ({ key, path, kind }) => {
      try {
        const body = await request(path);
        const value = kind === "record" ? asRecord(body, key) : asRows(body, key);
        return { key, value, error: null };
      } catch (error) {
        return {
          key,
          value: null,
          error: error instanceof Error ? error.message : `Impossible de charger ${key}.`,
        };
      }
    }));

    set((state) => {
      const data = { ...state.data };
      const errors: AnalyticsErrors = {};
      for (const result of results) {
        if (result.value !== null) {
          (data[result.key] as unknown) = result.value;
        } else if (result.error) {
          errors[result.key] = result.error;
        }
      }
      return { data, errors, isLoading: false };
    });
  },
}));
