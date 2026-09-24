"use client";

import {
  Users,
  Building2,
  Clock,
  CalendarDays,
  Wallet,
  TrendingUp,
} from "lucide-react";

import { ReservationsChart } from "@/components/admin/dashboard/ReservationsChart";
import { CategoryPieChart } from "@/components/admin/dashboard/CategoryPieChart";
import { LatestBookingsTable } from "@/components/admin/dashboard/LatestBookingsTable";
import { PendingEstablishments } from "@/components/admin/dashboard/PendingEstablishments";
import { TopDestinations } from "@/components/admin/dashboard/TopDestinations";
import { RecentActivities } from "@/components/admin/dashboard/RecentActivities";
import { useAdminDashboard } from "../../../hook/admin/useAdminDashboard";
import { AdminPageHeader, StatCard, StatsGrid } from "@/components/admin/commun";
 

export default function AdminDashboardPage() {
  const stats = useAdminDashboard();

  const statCards: StatCard[] = [
    {
      icon: Users,
      label: "Utilisateurs",
      value: stats.users,
      trend: 12,
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      icon: Building2,
      label: "Établissements",
      value: stats.establishments,
      trend: 8,
      color: "bg-blue-50 text-blue-700",
    },
    {
      icon: Clock,
      label: "En attente",
      value: stats.pending,
      trend: -5,
      color: "bg-amber-50 text-amber-700",
    },
    {
      icon: CalendarDays,
      label: "Réservations",
      value: stats.bookings,
      trend: 18,
      color: "bg-violet-50 text-violet-700",
    },
    {
      icon: Wallet,
      label: "Revenus (FCFA)",
      value: stats.revenue,
      trend: 22,
      color: "bg-rose-50 text-rose-700",
      isCurrency: true,
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        breadcrumbs={[{ label: "Dashboard" }]}
        title="Bonjour Mathias 👋"
        description="Voici un aperçu de l'activité de la plateforme aujourd'hui."
        actions={[
          {
            label: "21 Sept. 2026",
            icon: CalendarDays,
            variant: "outline",
            onClick: () => console.log("Date picker"),
          },
        ]}
      />

      <StatsGrid cards={statCards} columns={5} />

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <ReservationsChart />
        <CategoryPieChart />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <LatestBookingsTable />
        <PendingEstablishments />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1.5fr_0.8fr]">
        <TopDestinations />
        <RecentActivities />
        <DashboardPromoCard />
      </div>
    </div>
  );
}

function DashboardPromoCard() {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5">
      <div className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-emerald-100">
        <TrendingUp className="h-5 w-5 text-emerald-700" />
      </div>
      <div>
        <h3 className="text-base font-bold text-slate-900">
          La plateforme grandit chaque jour !
        </h3>
        <p className="mt-2 text-xs text-slate-500">
          Merci de contribuer à un tourisme plus accessible.
        </p>
      </div>
    </div>
  );
}