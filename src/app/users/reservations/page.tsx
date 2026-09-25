"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CalendarCheck, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import AuthDialog from "@/components/front-office/AuthDialog";
import PropertyShowcase from "@/components/front-office/PropertyShowcase";

import { TabsBar, type Tab } from "@/components/admin/commun";

import { useAuthStore, useBookingStore, usePropertyStore } from "@/store";
import { formatLocation } from "@/utils/selectors";
import { UserPageHeader } from "@/components/users/commun/UserPageHeader";
import { UserEmptyState } from "@/components/users/commun/UserEmptyState";

// =====================================================================
// TAB MAPPING : status booking → tab
// =====================================================================
const getTabForStatus = (status: string): string => {
  if (status === "paid" || status === "pending") return "upcoming";
  if (status === "cancelled") return "cancelled";
  return "all";
};

export default function UserReservationsPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const data = usePropertyStore((s) => s.data);
  const bookings = useBookingStore((s) => s.bookings);

  const [authOpen, setAuthOpen] = useState(false);
  const [tab, setTab] = useState("all");

  // Auth
  useEffect(() => {
    if (!isAuthenticated) setAuthOpen(true);
  }, [isAuthenticated]);

  // ----- Maps précalculés -----
  const photos = useMemo(
    () =>
      Object.fromEntries(
        data.Photos.filter((p) => p.is_cover).map((p) => [p.establishment_id, p])
      ),
    [data.Photos]
  );

  const subcategorySlugs = useMemo(
    () => Object.fromEntries(data.SubCategories.map((sc) => [sc.id, sc.slug])),
    [data.SubCategories]
  );

  // ----- Enrichit les bookings avec l'établissement complet -----
  const enrichedBookings = useMemo(() => {
    return bookings
      .map((b) => {
        const establishment = data.Establishments.find(
          (e) => e.name === b.propertyName
        );
        if (!establishment) return null;
        return { booking: b, establishment };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
  }, [bookings, data.Establishments]);

  // ----- Filtrage par tab -----
  const filtered = useMemo(() => {
    if (tab === "all") return enrichedBookings;
    if (tab === "upcoming")
      return enrichedBookings.filter(
        (x) => x.booking.status === "paid" || x.booking.status === "pending"
      );
    if (tab === "cancelled")
      return enrichedBookings.filter((x) => x.booking.status === "cancelled");
    return enrichedBookings;
  }, [enrichedBookings, tab]);

  // ----- Tabs -----
  const tabs: Tab[] = [
    { value: "all", label: "Toutes", count: enrichedBookings.length },
    {
      value: "upcoming",
      label: "À venir",
      count: enrichedBookings.filter(
        (x) => x.booking.status === "paid" || x.booking.status === "pending"
      ).length,
    },
    {
      value: "cancelled",
      label: "Annulées",
      count: enrichedBookings.filter(
        (x) => x.booking.status === "cancelled"
      ).length,
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map(({ booking, establishment }) => {
              const category = data.Categories.find(
                (c) => c.id === establishment.category_id
              );
              const subcategory = data.SubCategories.find(
                (sc) => sc.id === establishment.subcategory_id
              );
              const location =
                formatLocation(data, establishment) ||
                booking.propertyAddress;

              return (
                <PropertyShowcase
                  key={booking.id}
                  property={establishment}
                  photo={photos[establishment.id]}
                  subcategorySlugs={subcategorySlugs}
                  typeName={
                    subcategory?.name ?? category?.name ?? "Établissement"
                  }
                  location={location}
                />
              );
            })}
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