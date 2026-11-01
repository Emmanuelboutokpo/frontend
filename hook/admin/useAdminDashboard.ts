"use client";

import { useEffect } from "react";
import {
  analyticsNumber,
  useAdminAnalyticsStore,
} from "@/store/useAdminAnalyticsStore";

function metric(records: Record<string, unknown>[], keys: string[]): number | "—" {
  for (const record of records) {
    const value = analyticsNumber(record, keys);
    if (value !== null) return value;
  }
  return "—";
}

export function useAdminDashboard() {
  const data = useAdminAnalyticsStore((state) => state.data);
  const errors = useAdminAnalyticsStore((state) => state.errors);
  const isLoading = useAdminAnalyticsStore((state) => state.isLoading);
  const loadDashboard = useAdminAnalyticsStore((state) => state.loadDashboard);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  return {
    users: metric([data.overview, data.users], ["total_users", "users_count", "user_count", "users", "total"]),
    establishments: metric([data.overview, data.establishments], ["total_establishments", "establishments_count", "establishment_count", "establishments", "total"]),
    pending: metric([data.overview, data.establishments], ["pending_establishments", "establishments_pending", "pending", "pending_count"]),
    bookings: metric([data.overview, data.reservations], ["total_reservations", "reservations_count", "reservation_count", "reservations", "total"]),
    revenue: metric([data.overview, data.revenue], ["gross_revenue", "total_revenue", "revenue", "total_paid", "paid_amount", "gross_paid"]),
    data,
    errors,
    isLoading,
  };
}
