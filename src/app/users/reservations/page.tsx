"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CalendarCheck, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import AuthDialog from "@/components/front-office/AuthDialog";
import { TabsBar, type Tab } from "@/components/admin/commun";

import { useAuthStore } from "@/store";
import { useUserReservations } from "../../../../hook/useUserReservations";
import { UserPageHeader } from "@/components/users/commun/UserPageHeader";
import { UserEmptyState } from "@/components/users/commun/UserEmptyState";
import { ReservationCard } from "@/components/users/commun/ReservationCard";

// =====================================================================
// TAB MAPPING : status booking → tab
// =====================================================================
export default function UserReservationsPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { reservations, isLoading, error, propertyDataError, reload } = useUserReservations();

  const [authOpen, setAuthOpen] = useState(false);
  const [tab, setTab] = useState("all");

  // Auth
  useEffect(() => {
    if (!isAuthenticated) setAuthOpen(true);
  }, [isAuthenticated]);

  // ----- Filtrage par tab -----
  const filtered = useMemo(() => {
    if (tab === "all") return reservations;
    if (tab === "upcoming")
      return reservations.filter(
        (reservation) => reservation.status === "CONFIRMEE" || reservation.status === "EN_ATTENTE" || reservation.status === "EN_COURS"
      );
    if (tab === "cancelled")
      return reservations.filter((reservation) => reservation.status === "ANNULEE");
    return reservations;
  }, [reservations, tab]);

  // ----- Tabs -----
  const tabs: Tab[] = [
    { value: "all", label: "Toutes", count: reservations.length },
    {
      value: "upcoming",
      label: "À venir",
      count: reservations.filter(
        (reservation) => reservation.status === "CONFIRMEE" || reservation.status === "EN_ATTENTE" || reservation.status === "EN_COURS"
      ).length,
    },
    {
      value: "cancelled",
      label: "Annulées",
      count: reservations.filter((reservation) => reservation.status === "ANNULEE").length,
    },
  ];

  // =====================================================================
  // RENDER
  // =====================================================================
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Retour */}
        <Link
          href="/users/"
          className="mb-4 inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-emerald-700"
        >
          <ArrowLeft className="h-3 w-3" />
          Retour au tableau de bord
        </Link>

        {/* Header */}
        <UserPageHeader
          title="Mes réservations"
          description="Suivez vos séjours et retrouvez vos prochaines expériences."
          actions={
            <Button
              asChild
              className="rounded-xl bg-emerald-700 hover:bg-emerald-800"
            >
              <Link href="/explorer">
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle réservation
              </Link>
            </Button>
          }
        />

        {/* Tabs */}
        <div className="mb-6">
          <TabsBar tabs={tabs} active={tab} onChange={setTab} />
        </div>

        {/* Contenu */}
        {isAuthenticated && propertyDataError && (
          <p role="status" className="mb-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
            Les réservations sont chargées, mais certains détails d’établissement ne sont pas disponibles.
          </p>
        )}
        {!isAuthenticated ? (
          <UserEmptyState
            icon={CalendarCheck}
            title="Connectez-vous pour voir vos réservations"
            description="Votre historique sera conservé et accessible depuis tous vos appareils."
            action={{
              label: "Se connecter",
              onClick: () => setAuthOpen(true),
            }}
          />
        ) : isLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">Chargement de vos réservations...</div>
        ) : error ? (
          <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">
            <p>{error}</p>
            <Button variant="outline" className="mt-4" onClick={() => void reload().catch(() => undefined)}>Réessayer</Button>
          </div>
        ) : filtered.length === 0 ? (
          <UserEmptyState
            icon={CalendarCheck}
            title="Aucune réservation"
            description="Explorez nos établissements et réservez l'adresse qui vous convient."
            action={{
              label: "Explorer les établissements",
              href: "/explorer",
            }}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {filtered.map((reservation) => <ReservationCard key={reservation.id} reservation={reservation} />)}
          </div>
        )}
      </div>

      {/* Auth modal */}
      <AuthDialog
        open={authOpen}
        onOpenChange={setAuthOpen}
        title="Connectez-vous pour voir vos réservations"
      />
    </main>
  );
}