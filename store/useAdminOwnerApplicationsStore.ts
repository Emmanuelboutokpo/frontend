import { create } from "zustand";
import { isTokenExpiredResponse, useAuthStore } from "@/store/authStore";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "https://bestreservs-api.onrender.com"
).replace(/\/+$/, "");
const APPLICATIONS_PATH = "/api/v1/admin/owner-applications";

export type AdminOwnerApplicationStatus = "EN_ATTENTE" | "APPROUVE" | "REJETE";
export type OwnerApplicationDecision = "APPROUVE" | "REJETE";

export interface AdminOwnerApplication {
  id: string;
  owner_id: string;
  owner: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    img: string | null;
    city: string | null;
  };
  status: AdminOwnerApplicationStatus;
  submitted_at: string;
  reviewed_at: string | null;
  rejection_reason: string | null;
  registry_document_url: string;
  partnership_document_url: string;
}

interface AdminOwnerApplicationsState {
  applications: AdminOwnerApplication[];
  isLoading: boolean;
  error: string | null;
  getApplication: (applicationId: string) => Promise<AdminOwnerApplication>;
  loadApplications: (
    status: AdminOwnerApplicationStatus | "ALL",
    limit: number,
    offset: number,
  ) => Promise<void>;
  updateApplication: (
    applicationId: string,
    decision: OwnerApplicationDecision,
    rejectionReason?: string,
  ) => Promise<void>;
}

type ApiRecord = Record<string, unknown>;
let listRequestId = 0;

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
      .map((item) => isRecord(item) ? item.msg : null)
      .filter((message): message is string => typeof message === "string");
    if (messages.length) return messages.join(", ");
  }
  return `La requête a échoué (${status}).`;
}

async function request(path: string, options: RequestInit = {}): Promise<unknown> {
  const token = useAuthStore.getState().accessToken;
  if (!token) throw new Error("Une session administrateur est requise.");
  const response = await fetch(`${API_URL}${APPLICATIONS_PATH}${path}`, {
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
  return unwrap(body);
}

function normalizeApplication(value: unknown): AdminOwnerApplication {
  if (!isRecord(value) || typeof value.id !== "string" || typeof value.owner_id !== "string") {
    throw new Error("L’API a renvoyé un dossier partenaire invalide.");
  }
  if (
    value.status !== "EN_ATTENTE" &&
    value.status !== "APPROUVE" &&
    value.status !== "REJETE"
  ) {
    throw new Error("L’API a renvoyé un statut de dossier partenaire invalide.");
  }
  if (!isRecord(value.owner)) {
    throw new Error("L’API a renvoyé un profil partenaire invalide.");
  }
  const owner = value.owner;
  if (typeof owner.id !== "string" || typeof owner.email !== "string") {
    throw new Error("L’API a renvoyé un profil partenaire invalide.");
  }
  if (typeof value.submitted_at !== "string" || typeof value.registry_document_url !== "string" || typeof value.partnership_document_url !== "string") {
    throw new Error("Le dossier partenaire ne contient pas les documents requis.");
  }

  return {
    id: value.id,
    owner_id: value.owner_id,
    owner: {
      id: owner.id,
      email: owner.email,
      firstName: typeof owner.firstName === "string" ? owner.firstName : null,
      lastName: typeof owner.lastName === "string" ? owner.lastName : null,
      phone: typeof owner.phone === "string" ? owner.phone : null,
      img: typeof owner.img === "string" ? owner.img : null,
      city: typeof owner.city === "string" ? owner.city : null,
    },
    status: value.status,
    submitted_at: value.submitted_at,
    reviewed_at: typeof value.reviewed_at === "string" ? value.reviewed_at : null,
    rejection_reason: typeof value.rejection_reason === "string" ? value.rejection_reason : null,
    registry_document_url: value.registry_document_url,
    partnership_document_url: value.partnership_document_url,
  };
}

export const useAdminOwnerApplicationsStore = create<AdminOwnerApplicationsState>((set) => ({
  applications: [],
  isLoading: false,
  error: null,

  getApplication: async (applicationId) => {
    const body = await request(`/${encodeURIComponent(applicationId)}`);
    return normalizeApplication(body);
  },

  loadApplications: async (status, limit, offset) => {
    const requestId = ++listRequestId;
    set({ isLoading: true, error: null });
    const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
    if (status !== "ALL") params.set("status", status);
    try {
      const body = await request(`?${params.toString()}`);
      if (!Array.isArray(body)) throw new Error("L’API a renvoyé une liste de dossiers partenaires invalide.");
      const applications = body.map(normalizeApplication);
      if (requestId === listRequestId) set({ applications });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Impossible de charger les dossiers partenaires.";
      if (requestId === listRequestId) set({ error: message });
      throw error;
    } finally {
      if (requestId === listRequestId) set({ isLoading: false });
    }
  },

  updateApplication: async (applicationId, decision, rejectionReason) => {
    await request(`/${encodeURIComponent(applicationId)}`, {
      method: "PATCH",
      body: JSON.stringify({
        decision,
        ...(decision === "REJETE"
          ? { rejection_reason: rejectionReason?.trim() || null }
          : {}),
      }),
    });
    set((state) => ({
      applications: state.applications.map((application) =>
        application.id === applicationId
          ? {
              ...application,
              status: decision,
              reviewed_at: new Date().toISOString(),
              rejection_reason: decision === "REJETE" ? rejectionReason?.trim() || null : null,
            }
          : application,
      ),
    }));
  },
}));
