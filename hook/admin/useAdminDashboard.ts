"use client";

import { useUsersStore } from "@/store/useUsersStore";
import { useAdminEstablishmentsStore } from "@/store/useAdminEstablishmentsStore";
import { useReservationsStore } from "@/store/useReservationsStore";

export function useAdminDashboard() {
  const users = useUsersStore((s) => s.users);
  const establishments = useAdminEstablishmentsStore((s) => s.establishments);
  const reservations = useReservationsStore((s) => s.reservations);

  return {
    users: users.length,
    establishments: establishments.length,
    pending: establishments.filter((e) => e.status === "EN_ATTENTE").length,
    bookings: reservations.length,
    revenue: reservations
      .filter((r) => r.paymentStatus === "PAYE")
      .reduce((sum, r) => sum + r.totalAmount, 0),
  };
}