"use client";

import { useEffect, useMemo } from "react";
import { useAuthStore } from "@/store/authStore";
import { useCustomerReservationsStore } from "@/store/useCustomerReservationsStore";
import { usePropertyStore } from "@/store/propertyStore";

export function useUserReservations() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const email = useAuthStore((state) => state.email);
  const reservations = useCustomerReservationsStore((state) => state.reservations);
  const hasLoaded = useCustomerReservationsStore((state) => state.hasLoaded);
  const loadedForEmail = useCustomerReservationsStore((state) => state.loadedForEmail);
  const isLoading = useCustomerReservationsStore((state) => state.isLoading);
  const error = useCustomerReservationsStore((state) => state.error);
  const loadMine = useCustomerReservationsStore((state) => state.loadMine);
  const resetMine = useCustomerReservationsStore((state) => state.resetMine);
  const propertyDataLoaded = usePropertyStore((state) => state.establishmentsLoaded);
  const propertyDataLoading = usePropertyStore((state) => state.establishmentsLoading);
  const propertyDataError = usePropertyStore((state) => state.establishmentsError);
  const fetchEstablishments = usePropertyStore((state) => state.fetchEstablishments);

  useEffect(() => {
    if (!isAuthenticated) {
      resetMine();
      return;
    }
    if (!hasLoaded || loadedForEmail !== email) {
      if (isLoading) return;
      void loadMine().catch(() => undefined);
    }
  }, [email, hasLoaded, isAuthenticated, isLoading, loadMine, loadedForEmail, resetMine]);

  useEffect(() => {
    if (isAuthenticated && !propertyDataLoaded && !propertyDataLoading) {
      void fetchEstablishments().catch(() => undefined);
    }
  }, [fetchEstablishments, isAuthenticated, propertyDataLoaded, propertyDataLoading]);

  const upcoming = useMemo(
    () => reservations
      .filter((reservation) =>
        reservation.status === "CONFIRMEE" || reservation.status === "EN_ATTENTE"
      )
      .sort((first, second) =>
        (first.start_date ?? "").localeCompare(second.start_date ?? "")
      ),
    [reservations]
  );

  return {
    reservations,
    upcoming,
    nextReservation: upcoming[0] ?? null,
    upcomingCount: upcoming.length,
    isLoading,
    error,
    propertyDataError,
    reload: loadMine,
  };
}
