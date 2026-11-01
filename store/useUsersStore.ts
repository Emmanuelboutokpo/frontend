import { create } from "zustand";
import { isTokenExpiredResponse, useAuthStore } from "@/store/authStore";
import type {
  AdminUserActivity,
  AdminUserFavorite,
  AdminUserReservation,
  User,
  UserFilters,
  UserId,
  UserRole,
  UserStats,
  UserStatus,
} from "@/types/users";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "https://bestreservs-api.onrender.com"
).replace(/\/+$/, "");
const USERS_PATH = "/api/v1/admin/users";
let listRequestId = 0;
let statsRequestId = 0;
let detailsRequestId = 0;

type ApiRecord = Record<string, unknown>;

type UserPage = {
  items: unknown[];
  total: number;
  limit: number;
  offset: number;
};

type UserDetails = {
  reservations: AdminUserReservation[];
  favorites: AdminUserFavorite[];
  activity: AdminUserActivity[];
};

type UserCreateInput = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

type UserUpdateInput = Partial<Pick<User, "firstName" | "lastName" | "email" | "phone">>;

interface UsersState {
  users: User[];
  total: number;
  stats: UserStats;
  filters: UserFilters;
  page: number;
  perPage: number;
  isLoading: boolean;
  isLoadingStats: boolean;
  isLoadingDetails: boolean;
  error: string | null;
  detailsError: string | null;
  userDetails: UserDetails | null;
  loadUsers: (filters: UserFilters, page: number, perPage: number) => Promise<void>;
  loadStats: () => Promise<void>;
  loadUserDetails: (id: UserId) => Promise<User>;
  addUser: (user: UserCreateInput) => Promise<User>;
  updateUser: (id: UserId, patch: UserUpdateInput) => Promise<User>;
  changeRole: (id: UserId, role: UserRole) => Promise<User>;
  changeStatus: (id: UserId, status: UserStatus) => Promise<User>;
  disableUser: (id: UserId) => Promise<void>;
  setFilters: (patch: Partial<UserFilters>) => void;
  resetFilters: () => void;
  setPage: (page: number) => void;
  setPerPage: (n: number) => void;
}

const initialFilters: UserFilters = {
  search: "",
  role: "ALL",
  status: "ALL",
  registrationDate: "all",
};

const emptyStats: UserStats = {
  total: 0,
  clients: 0,
  admins: 0,
  owners: 0,
  newThisMonth: 0,
  active: 0,
  inactive: 0,
  pending: 0,
  suspended: 0,
};

function isRecord(value: unknown): value is ApiRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function unwrap(body: unknown): unknown {
  let value = body;
  for (let depth = 0; depth < 3 && isRecord(value); depth += 1) {
    if (!("data" in value) || value.data === value) break;
    value = value.data;
  }
  return value;
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function asCount(value: unknown): number {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toRole(value: unknown): UserRole {
  return value === "ADMIN" || value === "PROPRIETAIRE" ? value : "CLIENT";
}

function toStatus(value: unknown): UserStatus {
  return value === "INACTIF" || value === "EN_ATTENTE" || value === "SUSPENDU"
    ? value
    : "ACTIF";
}

function normalizeUser(value: unknown): User {
  if (!isRecord(value) || typeof value.id !== "string" || typeof value.email !== "string") {
    throw new Error("L’API a renvoyé un utilisateur invalide.");
  }

  const profile = isRecord(value.profile) ? value.profile : {};
  const firstName = asString(profile.firstName ?? value.firstName ?? value.first_name);
  const lastName = asString(profile.lastName ?? value.lastName ?? value.last_name);

  return {
    id: value.id,
    firstName,
    lastName,
    email: value.email,
    phone: asString(profile.phone ?? value.phone),
    role: toRole(value.role),
    status: toStatus(value.status),
    provider: asString(value.provider),
    avatar: asString(profile.img ?? value.avatar ?? value.picture) || undefined,
    registrationDate: asString(value.created_at ?? value.createdAt) || undefined,
    lastLogin: asString(value.last_login ?? value.lastLogin) || undefined,
    createdAt: asString(value.created_at ?? value.createdAt),
  };
}

function normalizeList<T>(body: unknown): T[] {
  const value = unwrap(body);
  if (Array.isArray(value)) return value as T[];
  if (isRecord(value) && Array.isArray(value.items)) return value.items as T[];
  throw new Error("L’API a renvoyé une liste invalide.");
}

function normalizePage(body: unknown): UserPage {
  const value = unwrap(body);
  if (!isRecord(value) || !Array.isArray(value.items)) {
    throw new Error("L’API a renvoyé une page d’utilisateurs invalide.");
  }
  return {
    items: value.items,
    total: asCount(value.total),
    limit: asCount(value.limit),
    offset: asCount(value.offset),
  };
}

function normalizeStats(body: unknown): UserStats {
  const value = unwrap(body);
  if (!isRecord(value)) throw new Error("L’API a renvoyé des statistiques invalides.");
  const clients = asCount(value.clients);
  const admins = asCount(value.admins);
  return {
    total: asCount(value.total),
    clients,
    admins,
    owners: Math.max(0, asCount(value.total) - clients - admins),
    newThisMonth: asCount(value.created_last_30_days),
    active: asCount(value.active),
    inactive: asCount(value.inactive),
    pending: asCount(value.pending),
    suspended: asCount(value.suspended),
  };
}

function getErrorMessage(body: unknown, status: number): string {
  if (!isRecord(body)) return `La requête a échoué (${status}).`;
  const detail = body.detail ?? body.message;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    const messages = detail
      .map((item) => isRecord(item) ? item.msg : undefined)
      .filter((message): message is string => typeof message === "string" && message.length > 0);
    if (messages.length > 0) return messages.join(", ");
  }
  return `La requête a échoué (${status}).`;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = useAuthStore.getState().accessToken;
  if (!token) throw new Error("Une session administrateur est requise.");

  const response = await fetch(`${API_URL}${USERS_PATH}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });
  const body: unknown = await response.json().catch(() => null);
  if (isTokenExpiredResponse(response.status, body) && useAuthStore.getState().accessToken === token) {
    useAuthStore.getState().expireSession();
  }
  if (!response.ok) throw new Error(getErrorMessage(body, response.status));
  return body as T;
}

function userPath(id: UserId): string {
  return `/${encodeURIComponent(id)}`;
}

function upsertUser(users: User[], user: User): User[] {
  const exists = users.some((item) => item.id === user.id);
  return exists
    ? users.map((item) => item.id === user.id ? user : item)
    : [user, ...users];
}

async function refreshStatsAfterMutation(get: () => UsersState) {
  try {
    await get().loadStats();
  } catch {
    // loadStats stores the API error for the page to display.
  }
}

export const useUsersStore = create<UsersState>((set, get) => ({
  users: [],
  total: 0,
  stats: emptyStats,
  filters: initialFilters,
  page: 1,
  perPage: 8,
  isLoading: false,
  isLoadingStats: false,
  isLoadingDetails: false,
  error: null,
  detailsError: null,
  userDetails: null,

  loadUsers: async (filters, page, perPage) => {
    const requestId = ++listRequestId;
    set({ isLoading: true, error: null, filters, page, perPage });
    try {
      const params = new URLSearchParams({
        limit: String(perPage),
        offset: String((page - 1) * perPage),
      });
      if (filters.search.trim()) params.set("search", filters.search.trim());
      if (filters.role !== "ALL") params.set("role", filters.role);
      if (filters.status !== "ALL") params.set("status", filters.status);
      const result = normalizePage(await request<unknown>(`?${params.toString()}`));
      if (requestId === listRequestId) {
        set({ users: result.items.map(normalizeUser), total: result.total });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Impossible de charger les utilisateurs.";
      if (requestId === listRequestId) set({ error: message });
      throw error;
    } finally {
      if (requestId === listRequestId) set({ isLoading: false });
    }
  },

  loadStats: async () => {
    const requestId = ++statsRequestId;
    set({ isLoadingStats: true, error: null });
    try {
      const result = await request<unknown>("/stats");
      if (requestId === statsRequestId) set({ stats: normalizeStats(result) });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Impossible de charger les statistiques utilisateurs.";
      if (requestId === statsRequestId) set({ error: message });
      throw error;
    } finally {
      if (requestId === statsRequestId) set({ isLoadingStats: false });
    }
  },

  loadUserDetails: async (id) => {
    const requestId = ++detailsRequestId;
    set({ isLoadingDetails: true, detailsError: null, userDetails: null });
    try {
      const encodedId = userPath(id);
      const [userBody, reservationsBody, favoritesBody, activityBody] = await Promise.all([
        request<unknown>(encodedId),
        request<unknown>(`${encodedId}/reservations?limit=100&offset=0`),
        request<unknown>(`${encodedId}/favorites`),
        request<unknown>(`${encodedId}/activity`),
      ]);
      const user = normalizeUser(unwrap(userBody));
      const userDetails = {
        reservations: normalizeList<AdminUserReservation>(reservationsBody),
        favorites: normalizeList<AdminUserFavorite>(favoritesBody),
        activity: normalizeList<AdminUserActivity>(activityBody),
      };
      if (requestId === detailsRequestId) {
        set({ userDetails, users: upsertUser(get().users, user) });
      }
      return user;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Impossible de charger le détail utilisateur.";
      if (requestId === detailsRequestId) set({ detailsError: message });
      throw error;
    } finally {
      if (requestId === detailsRequestId) set({ isLoadingDetails: false });
    }
  },

  addUser: async (input) => {
    const body = await request<unknown>("", {
      method: "POST",
      body: JSON.stringify(input),
    });
    const user = normalizeUser(unwrap(body));
    set((state) => ({ users: upsertUser(state.users, user), total: state.total + 1 }));
    await refreshStatsAfterMutation(get);
    return user;
  },

  updateUser: async (id, patch) => {
    const apiPatch = {
      ...(patch.firstName !== undefined ? { firstName: patch.firstName } : {}),
      ...(patch.lastName !== undefined ? { lastName: patch.lastName } : {}),
      ...(patch.email !== undefined ? { email: patch.email } : {}),
      ...(patch.phone !== undefined ? { phone: patch.phone } : {}),
    };
    const body = await request<unknown>(userPath(id), {
      method: "PATCH",
      body: JSON.stringify(apiPatch),
    });
    const user = normalizeUser(unwrap(body));
    set((state) => ({ users: upsertUser(state.users, user) }));
    return user;
  },

  changeRole: async (id, role) => {
    const body = await request<unknown>(`${userPath(id)}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    });
    const user = normalizeUser(unwrap(body));
    set((state) => ({ users: upsertUser(state.users, user) }));
    return user;
  },

  changeStatus: async (id, status) => {
    const body = await request<unknown>(`${userPath(id)}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    const user = normalizeUser(unwrap(body));
    set((state) => ({ users: upsertUser(state.users, user) }));
    await refreshStatsAfterMutation(get);
    return user;
  },

  disableUser: async (id) => {
    await request<unknown>(userPath(id), { method: "DELETE" });
    set((state) => ({
      users: state.users.filter((user) => user.id !== id),
      total: Math.max(0, state.total - 1),
    }));
    await refreshStatsAfterMutation(get);
  },

  setFilters: (patch) => set((state) => ({
    filters: { ...state.filters, ...patch },
    page: 1,
  })),
  resetFilters: () => set({ filters: initialFilters, page: 1 }),
  setPage: (page) => set({ page }),
  setPerPage: (perPage) => set({ perPage, page: 1 }),
}));
