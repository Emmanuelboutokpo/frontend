export type ReservationStatus =
  | "EN_ATTENTE"
  | "CONFIRMEE"
  | "EN_COURS"
  | "TERMINEE"
  | "ANNULEE";

export type PaymentMethod =
  | "CARTE_BANCAIRE"
  | "MOBILE_MONEY"
  | "VIREMENT";

export type PaymentStatus = "PAYE" | "EN_ATTENTE" | "REMBOURSE" | "ECHOUE";

export type ReservationCategory = "HEBERGEMENT" | "RESTAURANT" | "LOISIR";

export interface Reservation {
  id: number;
  reference: string; // #BR-2026-0012
  client: {
    name: string;
    email: string;
    phone: string;
    initials: string;
  };
  establishment: {
    id: number;
    name: string;
    city: string;
    country: string;
    image: string;
    rating: number;
    reviewCount: number;
  };
  category: ReservationCategory;
  startDate: string; // ISO
  endDate: string;   // ISO
  nights: number;
  guests: { adults: number; children: number };
  room: string;
  options: string[];
  totalAmount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentRef: string; // **** 4242
  paidAt?: string;
  status: ReservationStatus;
  createdAt: string;
}

export interface ReservationStats {
  total: number;
  confirmees: number;
  enAttente: number;
  annulees: number;
  terminees: number;
  revenue: number;
}

export interface ReservationFilters {
  search: string;
  category: ReservationCategory | "ALL";
  status: ReservationStatus | "ALL";
  period: "all" | "today" | "week" | "month" | "year";
}