import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  ValidationEstablishment,
  ValidationStats,
  ValidationFilters,
  ValidationStatus,
} from "@/types/validation";

// =====================================================================
// MOCK DATA
// =====================================================================
const MOCK: ValidationEstablishment[] = [
  {
    id: 1,
    name: "Le Coton Bleu",
    slug: "le-coton-bleu",
    description: "Un restaurant en bord de mer offrant une cuisine locale et internationale dans un cadre élégant et chaleureux.",
    category: "RESTAURANT",
    subcategory: "Restaurant",
    city: "Cotonou", country: "Bénin",
    address: "Route des Pêches, Cotonou, Bénin",
    phone: "+229 97 12 34 56",
    website: "https://lecotonbleu.bj",
    price: 5000, currency: "FCFA", priceUnit: "personne",
    images: [
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400",
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400",
      "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400",
      "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=400",
      "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400",
    ],
    documents: [
      { id: 1, name: "Registre de commerce", fileName: "registre.pdf", fileSize: "2.4 Mo", url: "#" },
      { id: 2, name: "Pièce d'identité (propriétaire)", fileName: "identite.pdf", fileSize: "1.8 Mo", url: "#" },
      { id: 3, name: "Attestation fiscale", fileName: "fiscale.pdf", fileSize: "1.1 Mo", url: "#" },
      { id: 4, name: "Certificat d'hygiène", fileName: "hygiene.pdf", fileSize: "1.6 Mo", url: "#" },
    ],
    owner: { name: "Koffi D.", email: "koffi@gmail.com", phone: "+229 97 12 34 56", initials: "KD" },
    submittedAt: "2026-09-20T14:32:00",
    status: "EN_ATTENTE",
    rating: 4.6, reviewCount: 24,
  },
  {
    id: 2,
    name: "Aqua Park",
    slug: "aqua-park",
    description: "Parc aquatique familial avec toboggans, piscines et espaces de détente pour tous les âges.",
    category: "LOISIR",
    subcategory: "Parc d'attraction",
    city: "Ouidah", country: "Bénin",
    address: "Route de la Plage, Ouidah",
    phone: "+229 96 45 78 12",
    website: "https://aquapark.bj",
    price: 10000, currency: "FCFA", priceUnit: "personne",
    images: [
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400",
      "https://images.unsplash.com/photo-1583226387328-6b2f56b98d1a?w=400",
    ],
    documents: [
      { id: 1, name: "Registre de commerce", fileName: "registre.pdf", fileSize: "1.9 Mo", url: "#" },
      { id: 2, name: "Autorisation d'exploitation", fileName: "autorisation.pdf", fileSize: "1.2 Mo", url: "#" },
    ],
    owner: { name: "Aminata S.", email: "aminata@gmail.com", phone: "+229 96 45 78 12", initials: "AS" },
    submittedAt: "2026-09-18T10:15:00",
    status: "EN_ATTENTE",
    rating: 4.1, reviewCount: 56,
  },
  {
    id: 3,
    name: "Villa des Palmiers",
    slug: "villa-des-palmiers",
    description: "Villa de luxe avec piscine privée, idéale pour les familles et les séjours d'exception.",
    category: "HEBERGEMENT",
    subcategory: "Villa",
    city: "Porto-Novo", country: "Bénin",
    address: "Avenue Jean Bayol, Porto-Novo",
    phone: "+229 95 32 11 22",
    website: "https://villapalmiers.bj",
    price: 65000, currency: "FCFA", priceUnit: "nuit",
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400",
    ],
    documents: [
      { id: 1, name: "Titre de propriété", fileName: "titre.pdf", fileSize: "3.2 Mo", url: "#" },
      { id: 2, name: "Pièce d'identité", fileName: "identite.pdf", fileSize: "1.5 Mo", url: "#" },
      { id: 3, name: "Attestation fiscale", fileName: "fiscale.pdf", fileSize: "1.0 Mo", url: "#" },
    ],
    owner: { name: "Jean B.", email: "jeanb@gmail.com", phone: "+229 95 32 11 22", initials: "JB" },
    submittedAt: "2026-09-15T09:20:00",
    status: "EN_ATTENTE",
    rating: 4.8, reviewCount: 42,
  },
  {
    id: 4,
    name: "Le Goût Local",
    slug: "le-gout-local",
    description: "Cuisine africaine authentique dans une ambiance conviviale et colorée.",
    category: "RESTAURANT",
    subcategory: "Restaurant",
    city: "Abomey-Calavi", country: "Bénin",
    address: "Marché central, Abomey-Calavi",
    phone: "+229 94 55 66 77",
    website: "https://goutlocal.bj",
    price: 5000, currency: "FCFA", priceUnit: "personne",
    images: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400",
    ],
    documents: [
      { id: 1, name: "Registre de commerce", fileName: "registre.pdf", fileSize: "2.1 Mo", url: "#" },
      { id: 2, name: "Certificat d'hygiène", fileName: "hygiene.pdf", fileSize: "1.3 Mo", url: "#" },
    ],
    owner: { name: "Marie K.", email: "marie@gmail.com", phone: "+229 94 55 66 77", initials: "MK" },
    submittedAt: "2026-09-12T16:45:00",
    status: "EN_ATTENTE",
    rating: 4.6, reviewCount: 210,
  },
  {
    id: 5,
    name: "Résidence du Lac",
    slug: "residence-du-lac",
    description: "Un séjour inoubliable au bord du lac Nokoué, avec vue imprenable et services premium.",
    category: "HEBERGEMENT",
    subcategory: "Résidence",
    city: "Cotonou", country: "Bénin",
    address: "Boulevard de la Marina, Cotonou",
    phone: "+229 97 88 99 00",
    website: "https://residencelac.bj",
    price: 40000, currency: "FCFA", priceUnit: "nuit",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400",
    ],
    documents: [
      { id: 1, name: "Titre de propriété", fileName: "titre.pdf", fileSize: "2.8 Mo", url: "#" },
      { id: 2, name: "Pièce d'identité", fileName: "identite.pdf", fileSize: "1.4 Mo", url: "#" },
    ],
    owner: { name: "Paul H.", email: "paul@gmail.com", phone: "+229 97 88 99 00", initials: "PH" },
    submittedAt: "2026-09-10T11:30:00",
    status: "EN_ATTENTE",
    rating: 4.4, reviewCount: 88,
  },
];

// =====================================================================
// STORE
// =====================================================================
interface State {
  validations: ValidationEstablishment[];
  filters: ValidationFilters;
  page: number;
  perPage: number;

  approve: (id: number, comment?: string) => void;
  reject: (id: number, comment?: string) => void;
  setRevision: (id: number, comment?: string) => void;
  updateStatus: (id: number, status: ValidationStatus, comment?: string) => void;

  setFilters: (patch: Partial<ValidationFilters>) => void;
  resetFilters: () => void;
  setPage: (p: number) => void;
  setPerPage: (n: number) => void;

  getFiltered: (tab?: ValidationStatus | "ALL") => ValidationEstablishment[];
  getStats: () => ValidationStats;
}

const initialFilters: ValidationFilters = {
  search: "",
  category: "ALL",
  city: "ALL",
  submissionDate: "all",
};

export const useValidationsStore = create<State>()(
  persist(
    (set, get) => ({
      validations: MOCK,
      filters: initialFilters,
      page: 1,
      perPage: 5,

      approve: (id, comment) =>
        set((s) => ({
          validations: s.validations.map((v) =>
            v.id === id ? { ...v, status: "VALIDE" } : v
          ),
        })),

      reject: (id, comment) =>
        set((s) => ({
          validations: s.validations.map((v) =>
            v.id === id ? { ...v, status: "REJETE" } : v
          ),
        })),

      setRevision: (id, comment) =>
        set((s) => ({
          validations: s.validations.map((v) =>
            v.id === id ? { ...v, status: "EN_REVISION" } : v
          ),
        })),

      updateStatus: (id, status, comment) =>
        set((s) => ({
          validations: s.validations.map((v) =>
            v.id === id ? { ...v, status } : v
          ),
        })),

      setFilters: (patch) =>
        set((s) => ({ filters: { ...s.filters, ...patch }, page: 1 })),

      resetFilters: () => set({ filters: initialFilters, page: 1 }),

      setPage: (p) => set({ page: p }),
      setPerPage: (n) => set({ perPage: n, page: 1 }),

      getFiltered: (tab = "ALL") => {
        const { validations, filters } = get();
        const now = new Date();

        return validations.filter((v) => {
          if (tab !== "ALL" && v.status !== tab) return false;

          if (filters.search) {
            const q = filters.search.toLowerCase();
            if (
              !v.name.toLowerCase().includes(q) &&
              !v.owner.name.toLowerCase().includes(q) &&
              !v.owner.email.toLowerCase().includes(q)
            )
              return false;
          }

          if (filters.category !== "ALL" && v.category !== filters.category)
            return false;

          if (filters.city !== "ALL" && v.city !== filters.city) return false;

          if (filters.submissionDate !== "all") {
            const d = new Date(v.submittedAt);
            const days = (now.getTime() - d.getTime()) / 86400000;
            if (filters.submissionDate === "today" && days > 1) return false;
            if (filters.submissionDate === "week" && days > 7) return false;
            if (filters.submissionDate === "month" && days > 30) return false;
            if (filters.submissionDate === "year" && days > 365) return false;
          }

          return true;
        });
      },

      getStats: () => {
        const list = get().validations;
        return {
          total: list.length,
          enAttente: list.filter((v) => v.status === "EN_ATTENTE").length,
          valides: list.filter((v) => v.status === "VALIDE").length,
          rejetes: list.filter((v) => v.status === "REJETE").length,
          enRevision: list.filter((v) => v.status === "EN_REVISION").length,
        };
      },
    }),
    {
      name: "lr-admin-validations",
      partialize: (s) => ({ validations: s.validations }),
    }
  )
);