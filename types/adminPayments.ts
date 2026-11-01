export type AdminPaymentStatus = "EN_ATTENTE" | "PAYE" | "REMBOURSE" | "ECHOUE";

export interface AdminPaymentClient {
  id: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
}

export interface AdminPaymentReservation {
  id: string | null;
  reference: string;
  status: string | null;
  category: string | null;
  reservationDate: string | null;
  startDate: string | null;
  endDate: string | null;
  startTime: string | null;
  endTime: string | null;
  quantity: number | null;
  nights: number | null;
  adults: number | null;
  children: number | null;
  roomOrUnit: string | null;
  options: unknown;
  specialRequests: string | null;
  subtotal: number | null;
  serviceFee: number | null;
  total: number | null;
  currency: string | null;
  paymentMethod: string | null;
  createdAt: string | null;
  establishmentName: string | null;
  establishmentCity: string | null;
  establishmentAddress: string | null;
  establishmentImage: string | null;
  establishmentImages: string[];
}

export interface AdminPayment {
  id: string;
  transactionId: string | null;
  transactionRef: string;
  reservationReference: string;
  amount: number;
  currency: string;
  status: AdminPaymentStatus;
  provider: string | null;
  paymentType: string | null;
  userId: string | null;
  reservationId: string | null;
  client: AdminPaymentClient | null;
  reservation: AdminPaymentReservation | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminPaymentStats {
  [key: string]: unknown;
}

export interface AdminPaymentCurrencyStats {
  currency: string;
  totalCount: number | null;
  totalAmount: number | null;
  byStatus: Record<string, {
    count: number | null;
    amount: number | null;
  }>;
}

export interface AdminPaymentFilters {
  search: string;
  status: AdminPaymentStatus | "ALL";
  provider: string | "ALL";
  type: string | "ALL";
  startDate: string;
  endDate: string;
}
