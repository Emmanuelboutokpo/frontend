export type UserId = string;
export type UserRole = "CLIENT" | "ADMIN" | "PROPRIETAIRE";
export type UserStatus = "ACTIF" | "INACTIF" | "EN_ATTENTE" | "SUSPENDU";

export interface User {
  id: UserId;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  provider: string;
  avatar?: string;
  registrationDate?: string;
  lastLogin?: string;
  createdAt: string;
}

export interface UserStats {
  total: number;
  clients: number;
  admins: number;
  owners: number;
  newThisMonth: number;
  active: number;
  inactive: number;
  pending: number;
  suspended: number;
}

export interface UserFilters {
  search: string;
  role: UserRole | "ALL";
  status: UserStatus | "ALL";
  registrationDate: string;
}

export interface AdminUserReservation {
  id: string;
  reference?: string;
  status?: string;
  total_amount?: number;
  currency?: string;
  created_at?: string;
  start_date?: string;
  end_date?: string;
  [key: string]: unknown;
}

export interface AdminUserFavorite {
  id: string;
  establishment_id: string;
  note: string | null;
  created_at: string;
}

export interface AdminUserActivity {
  id: string;
  action: string;
  description: string | null;
  entity_type: string | null;
  entity_id: string | null;
  created_at: string;
}
