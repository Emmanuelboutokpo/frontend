"use client";

import {
  Users,
  Building2,
  Clock,
  CalendarDays,
  Wallet,
  AlertTriangle,
} from "lucide-react";

import { ReservationsChart } from "@/components/admin/dashboard/ReservationsChart";
import { CategoryPieChart } from "@/components/admin/dashboard/CategoryPieChart";
import { LatestBookingsTable } from "@/components/admin/dashboard/LatestBookingsTable";
import { PendingEstablishments } from "@/components/admin/dashboard/PendingEstablishments";
import { TopDestinations } from "@/components/admin/dashboard/TopDestinations";
import { TopEstablishments } from "@/components/admin/dashboard/TopEstablishments";
import { RecentActivities } from "@/components/admin/dashboard/RecentActivities";
import { useAdminDashboard } from "../../../hook/admin/useAdminDashboard";
import { AdminPageHeader, StatCard, StatsGrid } from "@/components/admin/commun";
import { useAuthStore } from "@/store/authStore";


export default function AdminDashboardPage() {
  const stats = useAdminDashboard();
  const firstName = useAuthStore((state) => state.firstName);
  const lastName = useAuthStore((state) => state.lastName);
  const administratorName = [firstName, lastName].filter(Boolean).join(" ");

  const statCards: StatCard[] = [
    {
      icon: Users,
      label: "Utilisateurs",
      value: stats.users,
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      icon: Building2,
      label: "Établissements",
      value: stats.establishments,
      color: "bg-blue-50 text-blue-700",
    },
    {
      icon: Clock,
      label: "En attente",
      value: stats.pending,
      color: "bg-amber-50 text-amber-700",
    },
    {
      icon: CalendarDays,
      label: "Réservations",
      value: stats.bookings,
      color: "bg-violet-50 text-violet-700",
    },
    {
      icon: Wallet,
      label: "Revenus",
      value: stats.revenue,
      color: "bg-rose-50 text-rose-700",
      isCurrency: true,
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        breadcrumbs={[{ label: "Dashboard" }]}
        title={administratorName ? `Bonjour ${administratorName}` : "Dashboard"}
        description="Vue d’ensemble de l’activité de la plateforme."
      />

      {Object.entries(stats.errors).length > 0 && (
        <div role="alert" className="space-y-1 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          <p className="flex items-center gap-2 font-semibold"><AlertTriangle className="h-4 w-4" />Certaines statistiques ne sont pas disponibles.</p>
          {Object.entries(stats.errors).map(([key, error]) => <p key={key} className="text-xs">{key}: {error}</p>)}
        </div>
      )}

      <StatsGrid cards={statCards} columns={5} loading={stats.isLoading} />

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <ReservationsChart rows={stats.data.reservationChart} error={stats.errors.reservationChart} />
        <CategoryPieChart rows={stats.data.categoryChart} error={stats.errors.categoryChart} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <LatestBookingsTable />
        <PendingEstablishments />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1.5fr_0.8fr]">
        <TopDestinations rows={stats.data.destinations} error={stats.errors.destinations} />
        <TopEstablishments rows={stats.data.topEstablishments} error={stats.errors.topEstablishments} />
        <RecentActivities rows={stats.data.activities} error={stats.errors.activities} />
      </div>
    </div>
  );
}