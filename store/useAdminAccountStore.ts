import { create } from "zustand";
import { isTokenExpiredResponse, useAuthStore } from "@/store/authStore";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "https://bestreservs-api.onrender.com"
).replace(/\/+$/, "");
const ADMIN_ACCOUNTS_PATH = "/api/v1/accounts";
const OWNER_ACCOUNTS_PATH = "/api/v1/owners/accounts";

function accountsPath(): string {
  return useAuthStore.getState().role === "PROPRIETAIRE"
    ? OWNER_ACCOUNTS_PATH
    : ADMIN_ACCOUNTS_PATH;
}

type ApiRecord = Record<string, unknown>;

export type AdminAccountProfile = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatar: string | null;
};

type AdminAccountState = {
  profile: AdminAccountProfile | null;
  isLoading: boolean;
  error: string | null;
  loadProfile: () => Promise<void>;
  updateProfile: (patch: Pick<AdminAccountProfile, "firstName" | "lastName" | "email" | "phone">) => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
  deleteAvatar: () => Promise<void>;
  changePassword: (newPassword: string, confirmPassword: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  reset: () => void;
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

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
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

async function request(path: string, options: RequestInit = {}): Promise<unknown> {
  const token = useAuthStore.getState().accessToken;
  if (!token) throw new Error("Une session administrateur est requise.");

  const response = await fetch(`${API_URL}${accountsPath()}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.body instanceof FormData ? {} : options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });
  const body: unknown = await response.json().catch(() => null);
  if (isTokenExpiredResponse(response.status, body) && useAuthStore.getState().accessToken === token) {
    useAuthStore.getState().expireSession();
  }
  if (!response.ok) throw new Error(getErrorMessage(body, response.status));
  return body;
}

function mapProfile(body: unknown, fallback?: AdminAccountProfile): AdminAccountProfile {
  const value = unwrap(body);
  if (!isRecord(value)) {
    if (fallback) return fallback;
    throw new Error("L’API a renvoyé un profil administrateur invalide.");
  }
  const nestedProfile = isRecord(value.profile) ? value.profile : {};
  const id = value.id;
  if (id === undefined && !fallback) {
    throw new Error("La réponse du profil administrateur ne contient pas son identifiant.");
  }

  const avatarValue = nestedProfile.img ?? nestedProfile.avatar ?? value.avatar ?? value.picture;

  return {
    id: id === undefined ? fallback!.id : String(id),
    email: asString(value.email) || fallback?.email || "",
    firstName: asString(nestedProfile.firstName ?? nestedProfile.first_name ?? value.firstName ?? value.first_name)
      || fallback?.firstName || "",
    lastName: asString(nestedProfile.lastName ?? nestedProfile.last_name ?? value.lastName ?? value.last_name)
      || fallback?.lastName || "",
    phone: asString(nestedProfile.phone ?? value.phone) || fallback?.phone || "",
    avatar: avatarValue === null
      ? null
      : asString(avatarValue) || fallback?.avatar || null,
  };
}

function syncAuthProfile(profile: AdminAccountProfile) {
  useAuthStore.getState().updateProfile({
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
  });
  useAuthStore.setState({ avatar: profile.avatar });
}

function profilePath(profile: AdminAccountProfile): string {
  return `/${encodeURIComponent(profile.id)}`;
}

export const useAdminAccountStore = create<AdminAccountState>((set, get) => ({
  profile: null,
  isLoading: false,
  error: null,

  reset: () => set({ profile: null, isLoading: false, error: null }),

  loadProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const profile = mapProfile(await request("/me"));
      set({ profile });
      syncAuthProfile(profile);
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Impossible de charger le profil administrateur." });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateProfile: async (patch) => {
    const currentProfile = get().profile;
    if (!currentProfile) throw new Error("Le profil administrateur doit être chargé avant sa modification.");
    set({ error: null });
    try {
      const response = await request(profilePath(currentProfile), {
        method: "PATCH",
        body: JSON.stringify(patch),
      });
      const profile = mapProfile(response, { ...currentProfile, ...patch });
      set({ profile });
      syncAuthProfile(profile);
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Impossible de modifier le profil administrateur." });
      throw error;
    }
  },

  uploadAvatar: async (file) => {
    const profile = get().profile;
    if (!profile) throw new Error("Le profil administrateur doit être chargé avant l’envoi d’une photo.");
    set({ error: null });
    const formData = new FormData();
    formData.append("avatar", file);
    try {
      const response = await request(`${profilePath(profile)}/avatar`, {
        method: "POST",
        body: formData,
      });
      const updatedProfile = mapProfile(response, profile);
      set({ profile: updatedProfile });
      syncAuthProfile(updatedProfile);
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Impossible de téléverser la photo." });
      throw error;
    }
  },

  deleteAvatar: async () => {
    const profile = get().profile;
    if (!profile) throw new Error("Le profil administrateur doit être chargé avant la suppression de sa photo.");
    set({ error: null });
    try {
      const response = await request(`${profilePath(profile)}/avatar`, { method: "DELETE" });
      const updatedProfile = mapProfile(response, { ...profile, avatar: null });
      set({ profile: updatedProfile });
      syncAuthProfile(updatedProfile);
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Impossible de supprimer la photo." });
      throw error;
    }
  },

  changePassword: async (newPassword, confirmPassword) => {
    const profile = get().profile;
    if (!profile) throw new Error("Le profil administrateur doit être chargé avant le changement de mot de passe.");
    set({ error: null });
    try {
      await request(`${profilePath(profile)}/password`, {
        method: "PUT",
        body: JSON.stringify({ new_password: newPassword, confirm_password: confirmPassword }),
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Impossible de modifier le mot de passe." });
      throw error;
    }
  },

  deleteAccount: async () => {
    const profile = get().profile;
    if (!profile) throw new Error("Le profil administrateur doit être chargé avant la suppression du compte.");
    set({ error: null });
    try {
      await request(profilePath(profile), { method: "DELETE" });
      set({ profile: null });
      useAuthStore.getState().clearSession();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Impossible de supprimer le compte administrateur." });
      throw error;
    }
  },
}));
