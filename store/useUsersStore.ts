import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, UserStats, UserFilters, UserRole } from "@/types/users";

// =====================================================================
// MOCK DATA — à remplacer par un vrai backend
// =====================================================================
const MOCK_USERS: User[] = [
  {
    id: 1, firstName: "Jean", lastName: "Dupont",
    email: "jean@gmail.com", phone: "+229 97 12 34 56",
    role: "CLIENT", status: "ACTIF",
    avatar: "https://i.pravatar.cc/100?img=12",
    registrationDate: "2025-04-12", lastLogin: new Date(Date.now() - 7200000).toISOString(),
    createdAt: "2025-04-12",
  },
  {
    id: 2, firstName: "Marie", lastName: "K.",
    email: "marie@gmail.com", phone: "+229 96 45 78 12",
    role: "CLIENT", status: "ACTIF",
    avatar: "https://i.pravatar.cc/100?img=45",
    registrationDate: "2025-03-03", lastLogin: new Date(Date.now() - 86400000).toISOString(),
    createdAt: "2025-03-03",
  },
  {
    id: 3, firstName: "Admin", lastName: "BestRev",
    email: "admin@bestrev.com", phone: "+229 95 00 00 00",
    role: "ADMIN", status: "ACTIF",
    avatar: "https://i.pravatar.cc/100?img=33",
    registrationDate: "2025-01-15", lastLogin: new Date(Date.now() - 300000).toISOString(),
    createdAt: "2025-01-15",
  },
  {
    id: 4, firstName: "Paul", lastName: "H.",
    email: "paul@gmail.com", phone: "+229 64 32 11 22",
    role: "CLIENT", status: "INACTIF",
    avatar: "https://i.pravatar.cc/100?img=15",
    registrationDate: "2024-02-20", lastLogin: new Date(Date.now() - 12 * 86400000).toISOString(),
    createdAt: "2024-02-20",
  },
  {
    id: 5, firstName: "Sophie", lastName: "L.",
    email: "sophie@gmail.com", phone: "+229 67 89 45 21",
    role: "CLIENT", status: "ACTIF",
    avatar: "https://i.pravatar.cc/100?img=32",
    registrationDate: "2025-01-05", lastLogin: new Date(Date.now() - 10800000).toISOString(),
    createdAt: "2025-01-05",
  },
  {
    id: 6, firstName: "Luc", lastName: "A.",
    email: "luc@gmail.com", phone: "+229 61 23 45 67",
    role: "PROPRIETAIRE", status: "EN_ATTENTE",
    avatar: "https://i.pravatar.cc/100?img=14",
    registrationDate: "2024-12-22", lastLogin: new Date(Date.now() - 172800000).toISOString(),
    createdAt: "2024-12-22",
  },
  {
    id: 7, firstName: "Aminata", lastName: "S.",
    email: "aminata@gmail.com", phone: "+229 62 34 56 78",
    role: "CLIENT", status: "ACTIF",
    avatar: "https://i.pravatar.cc/100?img=47",
    registrationDate: "2024-12-18", lastLogin: new Date(Date.now() - 14400000).toISOString(),
    createdAt: "2024-12-18",
  },
  {
    id: 8, firstName: "Koffi", lastName: "D.",
    email: "koffi@gmail.com", phone: "+229 90 11 22 33",
    role: "CLIENT", status: "SUSPENDU",
    avatar: "https://i.pravatar.cc/100?img=8",
    registrationDate: "2024-12-10", lastLogin: new Date(Date.now() - 8 * 86400000).toISOString(),
    createdAt: "2024-12-10",
  },
  // Ajoute d'autres users pour tester la pagination
  ...Array.from({ length: 20 }, (_, i) => ({
    id: 100 + i,
    firstName: `User${i + 1}`,
    lastName: "Test",
    email: `user${i + 1}@test.com`,
    phone: `+229 90 00 00 ${String(i).padStart(2, "0")}`,
    role: (i % 5 === 0 ? "ADMIN" : "CLIENT") as UserRole,
    status: "ACTIF" as const,
    registrationDate: "2025-01-01",
    lastLogin: new Date().toISOString(),
    createdAt: "2025-01-01",
  })),
];

// =====================================================================
// STORE
// =====================================================================
interface UsersState {
  users: User[];
  filters: UserFilters;
  page: number;
  perPage: number;

  // CRUD
  addUser: (user: Omit<User, "id" | "createdAt">) => User;
  updateUser: (id: number, patch: Partial<User>) => void;
  deleteUser: (id: number) => void;
  changeRole: (id: number, role: UserRole) => void;
  toggleStatus: (id: number) => void;

  // Filtres & pagination
  setFilters: (patch: Partial<UserFilters>) => void;
  resetFilters: () => void;
  setPage: (page: number) => void;
  setPerPage: (n: number) => void;

  // Sélecteurs calculés (via hook)
  getFilteredUsers: () => User[];
  getStats: () => UserStats;
}

const initialFilters: UserFilters = {
  search: "",
  role: "ALL",
  status: "ALL",
  registrationDate: "all",
};

export const useUsersStore = create<UsersState>()(
  persist(
    (set, get) => ({
      users: MOCK_USERS,
      filters: initialFilters,
      page: 1,
      perPage: 8,

      // ------------------------------------------------------------------
      // CRUD
      // ------------------------------------------------------------------
      addUser: (user) => {
        const newUser: User = {
          ...user,
          id: Date.now(),
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ users: [newUser, ...s.users] }));
        return newUser;
      },

      updateUser: (id, patch) =>
        set((s) => ({
          users: s.users.map((u) => (u.id === id ? { ...u, ...patch } : u)),
        })),

      deleteUser: (id) =>
        set((s) => ({ users: s.users.filter((u) => u.id !== id) })),

      changeRole: (id, role) =>
        set((s) => ({
          users: s.users.map((u) => (u.id === id ? { ...u, role } : u)),
        })),

      toggleStatus: (id) =>
        set((s) => ({
          users: s.users.map((u) =>
            u.id === id
              ? {
                  ...u,
                  status: u.status === "ACTIF" ? "SUSPENDU" : "ACTIF",
                }
              : u
          ),
        })),

      // ------------------------------------------------------------------
      // FILTRES
      // ------------------------------------------------------------------
      setFilters: (patch) =>
        set((s) => ({
          filters: { ...s.filters, ...patch },
          page: 1, // reset page quand on filtre
        })),

      resetFilters: () => set({ filters: initialFilters, page: 1 }),

      setPage: (page) => set({ page }),

      setPerPage: (n) => set({ perPage: n, page: 1 }),

      // ------------------------------------------------------------------
      // SÉLECTEURS
      // ------------------------------------------------------------------
      getFilteredUsers: () => {
        const { users, filters } = get();
        const now = new Date();

        return users.filter((u) => {
          // Search
          if (filters.search) {
            const q = filters.search.toLowerCase();
            const match =
              u.firstName.toLowerCase().includes(q) ||
              u.lastName.toLowerCase().includes(q) ||
              u.email.toLowerCase().includes(q) ||
              u.phone.includes(q);
            if (!match) return false;
          }

          // Rôle
          if (filters.role !== "ALL" && u.role !== filters.role) return false;

          // Statut
          if (filters.status !== "ALL" && u.status !== filters.status)
            return false;

          // Date d'inscription
          if (filters.registrationDate !== "all") {
            const regDate = new Date(u.registrationDate || u.createdAt);
            const diffDays =
              (now.getTime() - regDate.getTime()) / (1000 * 60 * 60 * 24);
            if (filters.registrationDate === "today" && diffDays > 1) return false;
            if (filters.registrationDate === "week" && diffDays > 7) return false;
            if (filters.registrationDate === "month" && diffDays > 30) return false;
            if (filters.registrationDate === "year" && diffDays > 365) return false;
          }

          return true;
        });
      },

      getStats: () => {
        const { users } = get();
        const now = new Date();
        const thisMonth = users.filter((u) => {
          const d = new Date(u.registrationDate || u.createdAt);
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        });

        return {
          total: users.length,
          clients: users.filter((u) => u.role === "CLIENT").length,
          admins: users.filter((u) => u.role === "ADMIN").length,
          owners: users.filter((u) => u.role === "PROPRIETAIRE").length,
          newThisMonth: thisMonth.length,
        };
      },
    }),
    {
      name: "lr-users",
      partialize: (state) => ({ users: state.users }),
    }
  )
);