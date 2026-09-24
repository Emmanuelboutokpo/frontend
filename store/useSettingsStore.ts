import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  GeneralSettings,
  PaymentSettings,
  NotificationSettings,
  ServiceStatus,
} from "@/types/settings";

// =====================================================================
// DEFAULTS
// =====================================================================
const DEFAULT_GENERAL: GeneralSettings = {
  platformName: "BestRev",
  description: "Explorez. Réservez. Vivez mieux.",
  siteUrl: "https://bestrev.com",
  contactEmail: "contact@bestrev.com",
  phone: "+229 97 12 34 56",
  address: "Cotonou, Bénin",
  timezone: "(UTC+01:00) Afrique/Porto-Novo",
};

const DEFAULT_PAYMENT: PaymentSettings = {
  methods: [
    { id: "mobile-money", name: "Mobile Money (Moov, MTN)", description: "Actif · Frais : 1.5%", enabled: true, color: "bg-blue-100 text-blue-700" },
    { id: "card", name: "Carte bancaire (Stripe)", description: "Actif · Frais : 2.9% + 100 FCFA", enabled: true, color: "bg-rose-100 text-rose-700" },
    { id: "transfer", name: "Virement bancaire", description: "Actif", enabled: true, color: "bg-emerald-100 text-emerald-700" },
  ],
  commissionRate: 10,
  minWithdrawal: 5000,
  withdrawalDelay: 3,
};

const DEFAULT_NOTIFICATIONS: NotificationSettings = {
  channels: [
    { id: "new-booking", label: "Nouvelles réservations", description: "Être notifié lors d'une nouvelle réservation", enabled: true },
    { id: "pending-establishment", label: "Établissement en attente", description: "Notification pour les établissements à valider", enabled: true },
    { id: "cancel", label: "Annulation de réservation", description: "Notification en cas d'annulation", enabled: true },
    { id: "weekly-report", label: "Rapports hebdomadaires", description: "Recevoir un résumé chaque semaine", enabled: true },
    { id: "system-alerts", label: "Alertes système", description: "Notifications importantes du système", enabled: true },
  ],
  adminEmail: "admin@bestrev.com",
  reportFrequency: "weekly",
};

const SERVICES: ServiceStatus[] = [
  { id: "db", label: "Base de données", status: "OPERATIONAL" },
  { id: "booking", label: "Service de réservation", status: "OPERATIONAL" },
  { id: "payment", label: "Service de paiement", status: "OPERATIONAL" },
  { id: "email", label: "Service d'email", status: "OPERATIONAL" },
  { id: "storage", label: "Stockage des fichiers", status: "OPERATIONAL" },
  { id: "api", label: "API", status: "OPERATIONAL" },
];

// =====================================================================
// STORE
// =====================================================================
interface State {
  general: GeneralSettings;
  payment: PaymentSettings;
  notifications: NotificationSettings;
  services: ServiceStatus[];
  lastMaintenance: string;

  updateGeneral: (patch: Partial<GeneralSettings>) => void;
  updatePayment: (patch: Partial<PaymentSettings>) => void;
  updateNotifications: (patch: Partial<NotificationSettings>) => void;
  toggleChannel: (id: string) => void;
  togglePaymentMethod: (id: string) => void;
  updatePassword: (newPassword: string) => void;
}

export const useSettingsStore = create<State>()(
  persist(
    (set) => ({
      general: DEFAULT_GENERAL,
      payment: DEFAULT_PAYMENT,
      notifications: DEFAULT_NOTIFICATIONS,
      services: SERVICES,
      lastMaintenance: "2026-09-12T02:00:00",

      updateGeneral: (patch) =>
        set((s) => ({ general: { ...s.general, ...patch } })),

      updatePayment: (patch) =>
        set((s) => ({ payment: { ...s.payment, ...patch } })),

      updateNotifications: (patch) =>
        set((s) => ({ notifications: { ...s.notifications, ...patch } })),

      toggleChannel: (id) =>
        set((s) => ({
          notifications: {
            ...s.notifications,
            channels: s.notifications.channels.map((c) =>
              c.id === id ? { ...c, enabled: !c.enabled } : c
            ),
          },
        })),

      togglePaymentMethod: (id) =>
        set((s) => ({
          payment: {
            ...s.payment,
            methods: s.payment.methods.map((m) =>
              m.id === id ? { ...m, enabled: !m.enabled } : m
            ),
          },
        })),

      updatePassword: (newPassword) => {
        // Mock : à remplacer par un vrai appel API
        console.log("Password updated");
      },
    }),
    {
      name: "lr-admin-settings",
      partialize: (s) => ({
        general: s.general,
        payment: s.payment,
        notifications: s.notifications,
      }),
    }
  )
);