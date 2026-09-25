"use client";

import { useReservationsStore } from "@/store/useReservationsStore";
import { useMemo } from "react";

export function useUserReservations() {
  const allReservations = useReservationsStore((s) => s.reservations);

  // ⚠️ En prod, filtrer par user connecté
  const reservations = allReservations;

  const upcoming = useMemo(
    () =>
      reservations
        .filter((r) => r.status === "CONFIRMEE" || r.status === "EN_ATTENTE")
        .sort(
          (a, b) =>
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        ),
    [reservations]
  );

  return {
    reservations,
    upcoming,
    nextReservation: upcoming[0] ?? null,
    upcomingCount: upcoming.length,
  };
}