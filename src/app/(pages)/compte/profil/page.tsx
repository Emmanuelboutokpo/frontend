"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Edit3,
  Heart,
  LogOut,
  Mail,
  MapPin,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import AuthDialog from "@/components/front-office/AuthDialog";
import { EditProfileModal } from "@/components/front-office/EditProfileModal";
import { FavoriteMiniCard } from "@/components/front-office/FavoriteMiniCard";
import { BookingRow } from "@/components/front-office/BookingRow";

import { useAuthStore, useBookingStore, usePropertyStore } from "@/store";
import { getCoverPhoto } from "@/utils/selectors";

type Tab = "reservations" | "favorites";

export default function ProfilePage() {
  const data = usePropertyStore((s) => s.data);
  const favoriteIds = usePropertyStore((s) => s.favoriteIds);

  const {
    isAuthenticated,
    email,
    firstName,
    lastName,
    avatar,
    updateProfile,
   } = useAuthStore();

  const bookings = useBookingStore((s) => s.bookings);
  const cancelBooking = useBookingStore((s) => s.cancelBooking);

  const [activeTab, setActiveTab] = useState<Tab>("reservations");
  const [editOpen, setEditOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(!isAuthenticated);

  // =====================================================================
  // HELPERS
  // =====================================================================
  const initials = `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();

  const getEstablishment = (id: number) =>
    data.Establishments.find((e) => (e.id) === id);

  const getDetailUrl = (establishmentId: number) => {
    const est = getEstablishment(establishmentId);
    if (!est) return "/pages/";

    const category = data.Categories.find((c) => c.id === est.category_id);
    const subcategory = data.SubCategories.find(
      (sc) => sc.id === est.subcategory_id
    );

    const parts = ["/pages/", category?.slug ?? "hebergement"];
    if (subcategory?.slug) parts.push(subcategory.slug);
    parts.push(est.slug);

    return parts.join("/");
  };

  const getLocation = (establishmentId: number) => {
    const est = getEstablishment(establishmentId);
    if (!est) return "";

    const commune = data.Communes.find((c) => c.id === est.commune_id);
    const country = data.Countries.find((c) => c.id === est.country_id);

    return [commune?.name, country?.name].filter(Boolean).join(", ");
  };

  // =====================================================================
  // FAVORIS
  // =====================================================================
  const favoriteEstablishments = useMemo(
    () =>
      favoriteIds
        .map((id) => data.Establishments.find((e) => e.id === id))
        .filter((e): e is NonNullable<typeof e> => Boolean(e)),
    [favoriteIds, data.Establishments]
  );

  // =====================================================================
  // SI NON CONNECTÉ
  // =====================================================================
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-16 text-slate-900 sm:px-6 lg:px-12">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-emerald-100">
            <UserRound className="h-8 w-8 text-emerald-700" />
          </div>
          <h1 className="text-2xl font-bold">Connectez-vous</h1>
          <p className="mt-2 text-sm text-slate-500">
            Accédez à vos réservations, favoris et informations personnelles.
          </p>
          <Button
            className="mt-6 rounded-full bg-emerald-700 hover:bg-emerald-800"
            onClick={() => setAuthOpen(true)}
          >
            Se connecter
          </Button>
        </div>

        <AuthDialog
          open={authOpen}
          onOpenChange={setAuthOpen}
          title="Connectez-vous pour accéder à votre profil"
        />
      </main>
    );
  }

  // =====================================================================
  // RENDER
  // =====================================================================
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-5xl">
        {/* ============================================================ */}
        {/* RETOUR                                                       */}
        {/* ============================================================ */}
        <Link
          href="/pages"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à l'accueil
        </Link>

        {/* ============================================================ */}
        {/* CARTE PROFIL                                                 */}
        {/* ============================================================ */}
        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {/* Bandeau supérieur */}
          <div className="h-24 bg-gradient-to-r from-emerald-700 to-emerald-500" />

          <div className="px-6 pb-6 sm:px-10 sm:pb-8">
            <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              {/* Avatar + identité */}
              <div className="flex items-end gap-4">
                {avatar ? (
                  <img
                    src={avatar}
                    alt="Photo de profil"
                    className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-md"
                  />
                ) : (
                  <div className="grid h-24 w-24 place-items-center rounded-full border-4 border-white bg-emerald-100 text-2xl font-bold text-emerald-700 shadow-md">
                    {initials || <UserRound className="h-8 w-8" />}
                  </div>
                )}

                <div className="pb-1">
                  <h1 className="text-2xl font-bold">
                    {firstName} {lastName}
                  </h1>
                  <p className="mt-0.5 flex items-center gap-1.5 text-sm text-slate-500">
                    <Mail className="h-3.5 w-3.5" />
                    {email}
                  </p>
                </div>
              </div>

              {/* Bouton Modifier */}
              <Button
                onClick={() => setEditOpen(true)}
                className="rounded-xl bg-emerald-700 hover:bg-emerald-800"
              >
                <Edit3 className="mr-2 h-4 w-4" />
                Modifier mes informations
              </Button>
            </div>

            {/* Stats rapides */}
            <div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5 sm:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Réservations</p>
                <p className="mt-1 text-xl font-bold">{bookings.length}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Favoris</p>
                <p className="mt-1 text-xl font-bold">
                  {favoriteEstablishments.length}
                </p>
              </div>
              <div className="hidden rounded-xl bg-slate-50 p-3 sm:block">
                <p className="text-xs text-slate-500">Membre depuis</p>
                <p className="mt-1 text-xl font-bold">2025</p>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* ONGLETS                                                      */}
        {/* ============================================================ */}
        <div className="mt-8 flex gap-1 rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
          <button
            onClick={() => setActiveTab("reservations")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              activeTab === "reservations"
                ? "bg-emerald-700 text-white shadow"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <CalendarDays className="h-4 w-4" />
            Mes réservations
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                activeTab === "reservations"
                  ? "bg-white/20"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {bookings.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("favorites")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              activeTab === "favorites"
                ? "bg-emerald-700 text-white shadow"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Heart className="h-4 w-4" />
            Mes favoris
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                activeTab === "favorites"
                  ? "bg-white/20"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {favoriteEstablishments.length}
            </span>
          </button>
        </div>

        {/* ============================================================ */}
        {/* CONTENU ONGLET                                               */}
        {/* ============================================================ */}
        <div className="mt-6">
          {/* Réservations */}
          {activeTab === "reservations" && (
            <div className="space-y-3">
              {bookings.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
                  <CalendarDays className="mx-auto h-10 w-10 text-slate-300" />
                  <h3 className="mt-3 text-sm font-semibold">
                    Aucune réservation
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Vous n'avez pas encore effectué de réservation.
                  </p>
                  <Button
                    asChild
                    className="mt-4 rounded-full bg-emerald-700 hover:bg-emerald-800"
                  >
                    <Link href="/pages/explorer">Explorer les établissements</Link>
                  </Button>
                </div>
              ) : (
                bookings.map((booking) => (
                  <BookingRow
                    key={booking.id}
                    booking={booking}
                    establishment={getEstablishment(parseInt(booking.id))}
                    coverPhoto={getCoverPhoto(data, parseInt(booking.id))}
                    detailUrl={getDetailUrl((parseInt(booking.id)))}
                    onCancel={cancelBooking}
                  />
                ))
              )}
            </div>
          )}

          {/* Favoris */}
          {activeTab === "favorites" && (
            <div>
              {favoriteEstablishments.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
                  <Heart className="mx-auto h-10 w-10 text-slate-300" />
                  <h3 className="mt-3 text-sm font-semibold">
                    Aucun favori
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Ajoutez des établissements à vos favoris pour les retrouver
                    ici.
                  </p>
                  <Button
                    asChild
                    className="mt-4 rounded-full bg-emerald-700 hover:bg-emerald-800"
                  >
                    <Link href="/pages/explorer">Explorer</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {favoriteEstablishments.map((est) => (
                    <FavoriteMiniCard
                      key={est.id}
                      establishment={est}
                      coverPhoto={getCoverPhoto(data, est.id)}
                      detailUrl={getDetailUrl(est.id)}
                      location={getLocation(est.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ============================================================ */}
        {/* DÉCONNEXION                                                  */}
        {/* ============================================================ */}
        <div className="mt-10 flex justify-center">
          <Button
            variant="ghost"
             className="text-sm text-slate-500 hover:text-rose-600"
             onClick={() => setAuthOpen(false)}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Se déconnecter
          </Button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MODALS                                                       */}
      {/* ============================================================ */}
      <EditProfileModal
        open={editOpen}
        onOpenChange={setEditOpen}
        initialValues={{
          email: email ?? "",
          firstName: firstName ?? "",
          lastName: lastName ?? "",
        }}
        onSubmit={updateProfile}
      />

      <AuthDialog
        open={authOpen}
        onOpenChange={setAuthOpen}
        title="Connectez-vous pour accéder à votre profil"
      />
    </main>
  );
}