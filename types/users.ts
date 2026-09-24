export type UserRole = "CLIENT" | "ADMIN" | "PROPRIETAIRE";
export type UserStatus = "ACTIF" | "INACTIF" | "EN_ATTENTE" | "SUSPENDU";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  registrationDate?: string; // ISO
  lastLogin?: string;       // ISO
  createdAt: string;
}

export interface UserStats {
  total: number;
  clients: number;
  admins: number;
  owners: number;
  newThisMonth: number;
}

export interface UserFilters {
  search: string;
  role: UserRole | "ALL";
  status: UserStatus | "ALL";
  registrationDate: string; // "all" | "today" | "week" | "month" | "year"
}