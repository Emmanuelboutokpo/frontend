import { create } from "zustand";
import { isTokenExpiredResponse, useAuthStore } from "@/store/authStore";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "https://bestreservs-api.onrender.com"
).replace(/\/+$/, "");
const APPLICATION_PATH = "/api/v1/owners/applications";

export type OwnerApplicationStatus = "EN_ATTENTE" | "APPROUVE" | "REJETE";

export interface OwnerApplication {
  id: string;
  owner_id: string;
  status: OwnerApplicationStatus;
  submitted_at: string;
  reviewed_at: string | null;
  rejection_reason: string | null;
  registry_document_url: string;
  partnership_document_url: string;
}

interface OwnerApplicationState {
  application: OwnerApplication | null;
  isLoading: boolean;
  error: string | null;
  loadMyApplication: () => Promise<OwnerApplication | null>;
  submitApplication: (registryDocument: File, partnershipDocument: File) => Promise<OwnerApplication>;
  reset: () => void;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function unwrap(body: unknown): unknown {
  let value = body;
  for (let depth = 0; depth < 3 && isRecord(value) && "data" in value; depth += 1) {
    value = value.data;
  }
  return value;
}

function mapApplication(body: unknown): OwnerApplication {
  const value = unwrap(body);
  if (
    !isRecord(value) ||
    typeof value.id !== "string" ||
    typeof value.owner_id !== "string" ||
    (value.status !== "EN_ATTENTE" && value.status !== "APPROUVE" && value.status !== "REJETE") ||
    typeof value.submitted_at !== "string" ||
    typeof value.registry_document_url !== "string" ||
    typeof value.partnership_document_url !== "string"
  ) {
    throw new Error("L’API a renvoyé un dossier propriétaire invalide.");
  }
  return {
    id: value.id,
    owner_id: value.owner_id,
    status: value.status,
    submitted_at: value.submitted_at,
    reviewed_at: typeof value.reviewed_at === "string" ? value.reviewed_at : null,
    rejection_reason: typeof value.rejection_reason === "string" ? value.rejection_reason : null,
    registry_document_url: value.registry_document_url,
    partnership_document_url: value.partnership_document_url,
  };
}

function errorMessage(body: unknown, status: number): string {
  if (!isRecord(body)) return `La requête a échoué (${status}).`;
  const detail = body.detail ?? body.message;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    const messages = detail
      .map((item) => isRecord(item) ? item.msg : null)
      .filter((message): message is string => typeof message === "string");
    if (messages.length) return messages.join(", ");
  }
  return `La requête a échoué (${status}).`;
}

async function request(
  path: string,
  options: RequestInit = {},
  allowNotFound = false,
): Promise<unknown | null> {
  const token = useAuthStore.getState().accessToken;
  if (!token) throw new Error("Une session propriétaire est requise.");
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;
  const response = await fetch(`${API_URL}${APPLICATION_PATH}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(isFormData || !options.body ? {} : { "Content-Type": "application/json" }),
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
  const body: unknown = await response.json().catch(() => null);
  if (allowNotFound && response.status === 404) return null;
  if (isTokenExpiredResponse(response.status, body) && useAuthStore.getState().accessToken === token) {
    useAuthStore.getState().expireSession();
  }
  if (!response.ok) throw new Error(errorMessage(body, response.status));
  return body;
}

export const useOwnerApplicationStore = create<OwnerApplicationState>((set) => ({
  application: null,
  isLoading: false,
  error: null,

  reset: () => set({ application: null, isLoading: false, error: null }),

  loadMyApplication: async () => {
    set({ isLoading: true, error: null });
    try {
      const body = await request("/me", {}, true);
      const application = body === null ? null : mapApplication(body);
      set({ application });
      return application;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Impossible de charger votre dossier propriétaire." });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  submitApplication: async (registryDocument, partnershipDocument) => {
    set({ isLoading: true, error: null });
    const formData = new FormData();
    formData.append("registry_document", registryDocument);
    formData.append("partnership_document", partnershipDocument);
    try {
      const body = await request("", { method: "POST", body: formData });
      if (body === null) throw new Error("L’API n’a pas renvoyé le dossier créé.");
      const application = mapApplication(body);
      set({ application });
      return application;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Impossible d’envoyer votre dossier propriétaire." });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));
