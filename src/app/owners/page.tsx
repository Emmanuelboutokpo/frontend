"use client";

import { useEffect } from "react";
import { AlertTriangle, Building2, CalendarDays, Clock3, Wallet } from "lucide-react";
import { AdminPageHeader, StatsGrid, type StatCard } from "@/components/admin/commun";
import { CategoryPieChart } from "@/components/admin/dashboard/CategoryPieChart";
import { RecentActivities } from "@/components/admin/dashboard/RecentActivities";
import { ReservationsChart } from "@/components/admin/dashboard/ReservationsChart";
import { RevenueChart } from "@/components/admin/dashboard/RevenueChart";
import { TopDestinations } from "@/components/admin/dashboard/TopDestinations";
import { TopEstablishments } from "@/components/admin/dashboard/TopEstablishments";
import {
  analyticsNumber,
  useAdminAnalyticsStore,
} from "@/store/useAdminAnalyticsStore";
import { useAuthStore } from "@/store/authStore";

function metric(record: Record<string, unknown>, keys: string[]) {
  return analyticsNumber(record, keys) ?? "—";
}

function formatCurrency(value: number | "—") {
  return value === "—" ? value : `${value.toLocaleString("fr-FR")} XOF`;
}

export default function OwnerDashboardPage() {
  const data = useAdminAnalyticsStore((state) => state.data);
  const errors = useAdminAnalyticsStore((state) => state.errors);
  const isLoading = useAdminAnalyticsStore((state) => state.isLoading);
  const loadDashboard = useAdminAnalyticsStore((state) => state.loadDashboard);
  const firstName = useAuthStore((state) => state.firstName);
  const ownerName = firstName ? `Bonjour ${firstName}` : "Espace propriétaire";
  const establishmentTotal = metric(data.establishments, [
    "total_establishments", "establishments_count", "establishment_count", "total", "count",
  ]);
  const reservationTotal = metric(data.reservations, [
    "total_reservations", "reservations_count", "reservation_count", "total", "count",
  ]);
  const pendingReservations = metric(data.reservations, [
    "pending_reservations", "reservations_pending", "pending_count", "pending",
  ]);
  const revenueTotal = metric(data.revenue, [
    "total_revenue", "gross_revenue", "revenue", "total_paid", "paid_amount", "total", "amount",
  ]);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const cards: StatCard[] = [
    { icon: Building2, label: "Mes établissements", value: establishmentTotal, color: "bg-blue-50 text-blue-700" },
    { icon: CalendarDays, label: "Réservations", value: reservationTotal, color: "bg-violet-50 text-violet-700" },
    { icon: Clock3, label: "En attente", value: pendingReservations, color: "bg-amber-50 text-amber-700" },
    { icon: Wallet, label: "Revenus générés", value: formatCurrency(revenueTotal), color: "bg-emerald-50 text-emerald-700" },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        breadcrumbs={[{ label: "Dashboard" }]}
        title={ownerName}
        description="Suivez vos réservations, vos revenus et les performances de vos établissements."
      />
      {Object.entries(errors).length > 0 && (
        <div role="alert" className="space-y-1 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          <p className="flex items-center gap-2 font-semibold"><AlertTriangle className="h-4 w-4" />Certaines statistiques ne sont pas disponibles.</p>
          {Object.entries(errors).map(([key, error]) => <p key={key} className="text-xs">{key}: {error}</p>)}
        </div>
      )}
      <StatsGrid cards={cards} columns={4} loading={isLoading} />

      <div className="grid gap-4 xl:grid-cols-2">
        <ReservationsChart rows={data.reservationChart} error={errors.reservationChart} />
        <RevenueChart rows={data.revenueChart} error={errors.revenueChart} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <CategoryPieChart rows={data.categoryChart} error={errors.categoryChart} />
        <TopDestinations rows={data.destinations} error={errors.destinations} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <TopEstablishments
          rows={data.topEstablishments}
          error={errors.topEstablishments}
          href="/owners/etablissements"
        />
        <RecentActivities rows={data.activities} error={errors.activities} />
      </div>
    </div>
  );
}
