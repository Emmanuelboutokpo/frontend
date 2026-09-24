import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Reservation,
  ReservationStats,
  ReservationFilters,
  ReservationStatus,
} from "@/types/reservation";

// =====================================================================
// MOCK DATA
// =====================================================================
const MOCK: Reservation[] = [
  {
    id: 1,
    reference: "#BR-2026-0012",
    client: { name: "Jean Dupont", email: "jean@gmail.com", phone: "+229 97 12 34 56", initials: "JD" },
    establishment: {
      id: 1, name: "Hôtel Azalaï", city: "Cotonou", country: "Bénin",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200",
      rating: 4.5, reviewCount: 128,
    },
    category: "HEBERGEMENT",
    startDate: "2026-04-12", endDate: "2026-04-15",
    nights: 3,
    guests: { adults: 2, children: 0 },
    room: "Suite Deluxe",
    options: ["Petit-déjeuner", "Wi-Fi", "Piscine"],
    totalAmount: 135000,
    currency: "FCFA",
    paymentMethod: "CARTE_BANCAIRE",
    paymentStatus: "PAYE",
    paymentRef: "**** 4242",
    paidAt: "2026-04-12T14:35:00",
    status: "CONFIRMEE",
    createdAt: "2026-04-01T10:00:00",
  },
  {
    id: 2,
    reference: "#BR-2026-0011",
    client: { name: "Marie K.", email: "marie@gmail.com", phone: "+229 96 45 78 12", initials: "MK" },
    establishment: {
      id: 4, name: "Le Goût Local", city: "Abomey-Calavi", country: "Bénin",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200",
      rating: 4.6, reviewCount: 210,
    },
    category: "RESTAURANT",
    startDate: "2026-09-18", endDate: "2026-09-18",
    nights: 1,
    guests: { adults: 2, children: 0 },
    room: "Table pour 2",
    options: ["Menu dégustation"],
    totalAmount: 25000,
    currency: "FCFA",
    paymentMethod: "MOBILE_MONEY",
    paymentStatus: "EN_ATTENTE",
    paymentRef: "MTN **** 1234",
    status: "EN_ATTENTE",
    createdAt: "2026-09-15T09:00:00",
  },
  {
    id: 3,
    reference: "#BR-2026-0010",
    client: { name: "Paul H.", email: "paul@gmail.com", phone: "+229 64 32 11 22", initials: "PH" },
    establishment: {
      id: 5, name: "Aqua Park", city: "Cotonou", country: "Bénin",
      image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=200",
      rating: 4.1, reviewCount: 56,
    },
    category: "LOISIR",
    startDate: "2026-12-10", endDate: "2026-12-10",
    nights: 1,
    guests: { adults: 4, children: 0 },
    room: "Pass journée",
    options: [],
    totalAmount: 40000,
    currency: "FCFA",
    paymentMethod: "MOBILE_MONEY",
    paymentStatus: "PAYE",
    paymentRef: "Moov **** 5678",
    paidAt: "2026-12-01T10:00:00",
    status: "EN_COURS",
    createdAt: "2026-11-20T14:00:00",
  },
  {
    id: 4,
    reference: "#BR-2026-0009",
    client: { name: "Sophie L.", email: "sophie@gmail.com", phone: "+229 67 89 45 21", initials: "SL" },
    establishment: {
      id: 2, name: "Résidence du Lac", city: "Porto-Novo", country: "Bénin",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200",
      rating: 4.2, reviewCount: 96,
    },
    category: "HEBERGEMENT",
    startDate: "2026-04-20", endDate: "2026-04-22",
    nights: 2,
    guests: { adults: 1, children: 1 },
    room: "Chambre double",
    options: ["Petit-déjeuner"],
    totalAmount: 120000,
    currency: "FCFA",
    paymentMethod: "VIREMENT",
    paymentStatus: "PAYE",
    paymentRef: "Virement ****",
    paidAt: "2026-04-18T09:00:00",
    status: "CONFIRMEE",
    createdAt: "2026-04-10T11:00:00",
  },
  {
    id: 5,
    reference: "#BR-2026-0008",
    client: { name: "Luc A.", email: "luc@gmail.com", phone: "+229 61 23 45 67", initials: "LA" },
    establishment: {
      id: 3, name: "Villa Paradis", city: "Ouidah", country: "Bénin",
      image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=200",
      rating: 4.3, reviewCount: 74,
    },
    category: "HEBERGEMENT",
    startDate: "2026-01-14", endDate: "2026-01-16",
    nights: 2,
    guests: { adults: 2, children: 0 },
    room: "Villa entière",
    options: ["Piscine privée"],
    totalAmount: 90000,
    currency: "FCFA",
    paymentMethod: "CARTE_BANCAIRE",
    paymentStatus: "PAYE",
    paymentRef: "**** 1234",
    paidAt: "2026-01-10T16:00:00",
    status: "TERMINEE",
    createdAt: "2026-01-05T08:30:00",
  },
  {
    id: 6,
    reference: "#BR-2026-0007",
    client: { name: "Aminata S.", email: "aminata@gmail.com", phone: "+229 62 34 56 78", initials: "AS" },
    establishment: {
      id: 8, name: "Terre d'Afrique", city: "Natitingou", country: "Bénin",
      image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=200",
      rating: 4.7, reviewCount: 89,
    },
    category: "LOISIR",
    startDate: "2026-05-05", endDate: "2026-05-05",
    nights: 1,
    guests: { adults: 3, children: 0 },
    room: "Excursion",
    options: [],
    totalAmount: 30000,
    currency: "FCFA",
    paymentMethod: "MOBILE_MONEY",
    paymentStatus: "REMBOURSE",
    paymentRef: "MTN **** 0000",
    status: "ANNULEE",
    createdAt: "2026-04-28T12:00:00",
  },
];

// =====================================================================
// STORE
// =====================================================================
interface State {
  reservations: Reservation[];
  filters: ReservationFilters;
  page: number;
  perPage: number;

  addReservation: (r: Omit<Reservation, "id" | "createdAt">) => void;
  updateReservation: (id: number, patch: Partial<Reservation>) => void;
  cancelReservation: (id: number, reason: string, comment?: string) => void;
  updateStatus: (id: number, status: ReservationStatus) => void;

  setFilters: (patch: Partial<ReservationFilters>) => void;
  resetFilters: () => void;
  setPage: (p: number) => void;
  setPerPage: (n: number) => void;

  getFiltered: (tab?: ReservationStatus | "ALL") => Reservation[];
  getStats: () => ReservationStats;
}

const initialFilters: ReservationFilters = {
  search: "",
  category: "ALL",
  status: "ALL",
  period: "all",
};

export const useReservationsStore = create<State>()(
  persist(
    (set, get) => ({
      reservations: MOCK,
      filters: initialFilters,
      page: 1,
      perPage: 6,

      addReservation: (r) =>
        set((s) => ({
          reservations: [
            { ...r, id: Date.now(), createdAt: new Date().toISOString() },
            ...s.reservations,
          ],
        })),

      updateReservation: (id, patch) =>
        set((s) => ({
          reservations: s.reservations.map((r) =>
            r.id === id ? { ...r, ...patch } : r
          ),
        })),

      cancelReservation: (id, reason, comment) =>
        set((s) => ({
          reservations: s.reservations.map((r) =>
            r.id === id ? { ...r, status: "ANNULEE" } : r
          ),
        })),

      updateStatus: (id, status) =>
        set((s) => ({
          reservations: s.reservations.map((r) =>
            r.id === id ? { ...r, status } : r
          ),
        })),

      setFilters: (patch) =>
        set((s) => ({ filters: { ...s.filters, ...patch }, page: 1 })),

      resetFilters: () => set({ filters: initialFilters, page: 1 }),

      setPage: (p) => set({ page: p }),
      setPerPage: (n) => set({ perPage: n, page: 1 }),

      getFiltered: (tab = "ALL") => {
        const { reservations, filters } = get();
        const now = new Date();

        return reservations.filter((r) => {
          if (tab !== "ALL" && r.status !== tab) return false;

          if (filters.search) {
            const q = filters.search.toLowerCase();
            if (
              !r.reference.toLowerCase().includes(q) &&
              !r.client.name.toLowerCase().includes(q) &&
              !r.client.email.toLowerCase().includes(q) &&
              !r.establishment.name.toLowerCase().includes(q)
            )
              return false;
          }

          if (filters.category !== "ALL" && r.category !== filters.category)
            return false;

          if (filters.status !== "ALL" && r.status !== filters.status)
            return false;

          if (filters.period !== "all") {
            const d = new Date(r.createdAt);
            const days = (now.getTime() - d.getTime()) / 86400000;
            if (filters.period === "today" && days > 1) return false;
            if (filters.period === "week" && days > 7) return false;
            if (filters.period === "month" && days > 30) return false;
            if (filters.period === "year" && days > 365) return false;
          }

          return true;
        });
      },

      getStats: () => {
        const list = get().reservations;
        return {
          total: list.length,
          confirmees: list.filter((r) => r.status === "CONFIRMEE").length,
          enAttente: list.filter((r) => r.status === "EN_ATTENTE").length,
          annulees: list.filter((r) => r.status === "ANNULEE").length,
          terminees: list.filter((r) => r.status === "TERMINEE").length,
          revenue: list
            .filter((r) => r.paymentStatus === "PAYE")
            .reduce((sum, r) => sum + r.totalAmount, 0),
        };
      },
    }),
    {
      name: "lr-admin-reservations",
      partialize: (s) => ({ reservations: s.reservations }),
    }
  )
);