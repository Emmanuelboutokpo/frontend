import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AdminEstablishment,
  EstablishmentStats,
  EstablishmentFilters,
  EstablishmentStatus,
} from "@/types/establishment";

// =====================================================================
// MOCK DATA
// =====================================================================
const MOCK: AdminEstablishment[] = [
  {
    id: 1, name: "Hôtel Azalaï", slug: "hotel-azalai",
    category: "HEBERGEMENT", subcategory: "Hôtel",
    location: { country: "Bénin", city: "Cotonou", address: "Boulevard de la Marina" },
    owner: "BestRev", price: 45000, currency: "FCFA", priceUnit: "nuit",
    status: "PUBLIE", rating: 4.5, reviewCount: 128,
    images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200"],
    description: "Un hôtel moderne au cœur de Cotonou.",
    createdAt: "2025-04-12",
  },
  {
    id: 2, name: "Résidence du Lac", slug: "residence-du-lac",
    category: "HEBERGEMENT", subcategory: "Résidence",
    location: { country: "Bénin", city: "Porto-Novo", address: "Rue du Lac" },
    owner: "BestRev", price: 32000, currency: "FCFA", priceUnit: "nuit",
    status: "PUBLIE", rating: 4.2, reviewCount: 96,
    images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200"],
    description: "Résidence calme face au lac.",
    createdAt: "2025-03-03",
  },
  {
    id: 3, name: "Villa Paradis", slug: "villa-paradis",
    category: "HEBERGEMENT", subcategory: "Villa",
    location: { country: "Bénin", city: "Ouidah", address: "Route des Esclaves" },
    owner: "BestRev", price: 60000, currency: "FCFA", priceUnit: "nuit",
    status: "EN_ATTENTE", rating: 4.3, reviewCount: 74,
    images: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=200"],
    description: "Villa de luxe avec piscine privée.",
    createdAt: "2025-01-14",
  },
  {
    id: 4, name: "Le Goût Local", slug: "le-gout-local",
    category: "RESTAURANT", subcategory: "Restaurant",
    location: { country: "Bénin", city: "Abomey-Calavi", address: "Marché central" },
    owner: "BestRev", price: 5000, currency: "FCFA", priceUnit: "personne",
    status: "PUBLIE", rating: 4.6, reviewCount: 210,
    images: ["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200"],
    description: "Cuisine béninoise authentique.",
    createdAt: "2024-12-18",
  },
  {
    id: 5, name: "Aqua Park", slug: "aqua-park",
    category: "LOISIR", subcategory: "Parc d'attraction",
    location: { country: "Bénin", city: "Cotonou", address: "Zone des loisirs" },
    owner: "BestRev", price: 10000, currency: "FCFA", priceUnit: "personne",
    status: "PUBLIE", rating: 4.1, reviewCount: 56,
    images: ["https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=200"],
    description: "Parc aquatique familial.",
    createdAt: "2024-12-10",
  },
  {
    id: 6, name: "La Paillote", slug: "la-paillote",
    category: "RESTAURANT", subcategory: "Restaurant",
    location: { country: "Bénin", city: "Grand-Popo", address: "Bord de mer" },
    owner: "BestRev", price: 7000, currency: "FCFA", priceUnit: "personne",
    status: "REJETE", rating: 4.0, reviewCount: 32,
    images: ["https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200"],
    description: "Restaurant pieds dans l'eau.",
    createdAt: "2024-12-05",
  },
  {
    id: 7, name: "Musée de Ouidah", slug: "musee-ouidah",
    category: "LOISIR", subcategory: "Espace touristique",
    location: { country: "Bénin", city: "Ouidah", address: "Centre historique" },
    owner: "BestRev", price: 3500, currency: "FCFA", priceUnit: "personne",
    status: "SUSPENDU", rating: 4.3, reviewCount: 45,
    images: ["https://images.unsplash.com/photo-1564399579883-451a5d44ec08?w=200"],
    description: "Musée d'histoire et de mémoire.",
    createdAt: "2024-12-01",
  },
  {
    id: 8, name: "Terre d'Afrique", slug: "terre-afrique",
    category: "HEBERGEMENT", subcategory: "Auberge",
    location: { country: "Bénin", city: "Natitingou", address: "Route de l'Atacora" },
    owner: "BestRev", price: 28000, currency: "FCFA", priceUnit: "nuit",
    status: "PUBLIE", rating: 4.7, reviewCount: 89,
    images: ["https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=200"],
    description: "Auberge de charme en pleine nature.",
    createdAt: "2024-11-28",
  },
];

// =====================================================================
// STORE
// =====================================================================
interface State {
  establishments: AdminEstablishment[];
  filters: EstablishmentFilters;
  page: number;
  perPage: number;

  add: (data: Omit<AdminEstablishment, "id" | "createdAt" | "rating" | "reviewCount">) => void;
  update: (id: number, patch: Partial<AdminEstablishment>) => void;
  remove: (id: number) => void;
  changeStatus: (id: number, status: EstablishmentStatus) => void;

  setFilters: (patch: Partial<EstablishmentFilters>) => void;
  resetFilters: () => void;
  setPage: (p: number) => void;
  setPerPage: (n: number) => void;

  getFiltered: () => AdminEstablishment[];
  getStats: () => EstablishmentStats;
}

const initialFilters: EstablishmentFilters = {
  search: "",
  category: "ALL",
  status: "ALL",
  country: "ALL",
  city: "ALL",
};

export const useAdminEstablishmentsStore = create<State>()(
  persist(
    (set, get) => ({
      establishments: MOCK,
      filters: initialFilters,
      page: 1,
      perPage: 8,

      add: (data) => {
        const newEst: AdminEstablishment = {
          ...data,
          id: Date.now(),
          rating: 0,
          reviewCount: 0,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ establishments: [newEst, ...s.establishments] }));
      },

      update: (id, patch) =>
        set((s) => ({
          establishments: s.establishments.map((e) =>
            e.id === id ? { ...e, ...patch } : e
          ),
        })),

      remove: (id) =>
        set((s) => ({
          establishments: s.establishments.filter((e) => e.id !== id),
        })),

      changeStatus: (id, status) =>
        set((s) => ({
          establishments: s.establishments.map((e) =>
            e.id === id ? { ...e, status } : e
          ),
        })),

      setFilters: (patch) =>
        set((s) => ({
          filters: { ...s.filters, ...patch },
          page: 1,
        })),

      resetFilters: () => set({ filters: initialFilters, page: 1 }),

      setPage: (p) => set({ page: p }),
      setPerPage: (n) => set({ perPage: n, page: 1 }),

      getFiltered: () => {
        const { establishments, filters } = get();
        return establishments.filter((e) => {
          if (filters.search) {
            const q = filters.search.toLowerCase();
            if (
              !e.name.toLowerCase().includes(q) &&
              !e.location.city.toLowerCase().includes(q)
            )
              return false;
          }
          if (filters.category !== "ALL" && e.category !== filters.category)
            return false;
          if (filters.status !== "ALL" && e.status !== filters.status)
            return false;
          if (filters.country !== "ALL" && e.location.country !== filters.country)
            return false;
          if (filters.city !== "ALL" && e.location.city !== filters.city)
            return false;
          return true;
        });
      },

      getStats: () => {
        const list = get().establishments;
        return {
          total: list.length,
          enAttente: list.filter((e) => e.status === "EN_ATTENTE").length,
          publies: list.filter((e) => e.status === "PUBLIE").length,
          rejetes: list.filter((e) => e.status === "REJETE").length,
          suspendus: list.filter((e) => e.status === "SUSPENDU").length,
        };
      },
    }),
    {
      name: "lr-admin-establishments",
      partialize: (s) => ({ establishments: s.establishments }),
    }
  )
);