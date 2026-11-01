export type ReservationStatus =
  | "EN_ATTENTE"
  | "CONFIRMEE"
  | "EN_COURS"
  | "TERMINEE"
  | "REFUSEE"
  | "ANNULEE"
  | "EXPIREE";

export type PaymentMethod =
  | "CARTE_BANCAIRE"
  | "MOBILE_MONEY"
  | "VIREMENT"
  | "SUR_PLACE";

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

export interface AdminReservation {
  id: string;
  reference: string;
  establishmentId: string;
  establishmentName: string | null;
  establishmentCity: string | null;
  establishmentAddress: string | null;
  establishmentCategory: string | null;
  establishmentDescription: string | null;
  establishmentPrice: number | null;
  establishmentRating: number | null;
  establishmentImage: string | null;
  establishmentImages: string[];
  category: string | null;
  reservationDate: string | null;
  startDate: string | null;
  endDate: string | null;
  startTime: string | null;
  endTime: string | null;
  quantity: number;
  nights: number | null;
  adults: number;
  children: number;
  roomOrUnit: string | null;
  options: Record<string, unknown> | null;
  specialRequests: string | null;
  subtotal: number;
  serviceFee: number;
  total: number;
  currency: string;
  paymentMethod: PaymentMethod | null;
  paymentStatus: PaymentStatus;
  status: ReservationStatus;
  cancelledAt: string | null;
  cancellationReason: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
  clientFirstName: string;
  clientLastName: string;
  clientEmail: string;
  clientPhone: string | null;
  paymentProvider: string | null;
  paymentReference: string | null;
  paidAt: string | null;
}

export interface AdminReservationStats {
  total: number;
  pending: number;
  confirmed: number;
  ongoing: number;
  completed: number;
  cancelled: number;
  paymentPending: number;
  paid: number;
  refunded: number;
  grossPaid: number;
  grossRefunded: number;
}