"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  CalendarCheck,
  Compass,
  Heart,
  MapPin,
  Sparkles,
} from "lucide-react";
import { useFavorites, useUserAccountStore } from "@/store";
import { useAuthStore } from "@/store/authStore";
import { useUserReservations } from "../../../hook/useUserReservations";
import { UserStatCard, UserStatsGrid } from "@/components/users/commun/UserStatsGrid";
import { ReservationCard } from "@/components/users/commun/ReservationCard";
import { RecommendationsTabs } from "@/components/users/commun/RecommendationsTabs";
import { Button } from "@/components/ui/button";

export default function UserDashboardPage() {
  const { nextReservation, upcomingCount, isLoading, error } = useUserReservations();
  const favorites = useFavorites();
  const unreadCount = useUserAccountStore((state) => state.unreadCount);
  const profileFirstName = useUserAccountStore((state) => state.profile?.firstName);
  const authFirstName = useAuthStore((state) => state.firstName);
  const firstName = profileFirstName || authFirstName;

  const stats: UserStatCard[] = [
    {
      icon: CalendarCheck,
      label: "Réservations à venir",
      value: upcomingCount,
      href: "/users/reservations",
      color: "bg-sky-50 text-sky-700",
    },
    {
      icon: Heart,
      label: "Lieux favoris",
      value: favorites.length,
      href: "/users/favoris",
      color: "bg-rose-50 text-rose-700",
    },
    {
      icon: Bell,
      label: "Notifications non lues",
      value: unreadCount,
      href: "/users/notifications",
      color: "bg-amber-50 text-amber-700",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8">
      <section className="relative isolate overflow-hidden rounded-[28px] bg-gradient-to-br from-[#082b38] via-[#0d4b52] to-[#087e68] px-6 py-7 shadow-lg shadow-emerald-950/10 sm:px-9 sm:py-9 lg:px-11">
        <div aria-hidden="true" className="absolute -right-16 -top-28 -z-10 h-80 w-80 rounded-full border-[36px] border-white/[0.06]" />
        <div aria-hidden="true" className="absolute -bottom-36 right-28 -z-10 h-64 w-64 rounded-full bg-emerald-300/10 blur-3xl" />
        <div className="relative flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-50">
              <Sparkles className="h-3.5 w-3.5" />
              Votre espace personnel
            </div>
            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Bonjour{firstName ? ` ${firstName}` : ""} !
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-emerald-50/80 sm:text-base">
              Retrouvez vos réservations et vos adresses préférées. Votre prochaine belle découverte est peut-être tout près.
            </p>
            <Button asChild className="mt-6 h-11 rounded-xl bg-white px-5 font-semibold text-emerald-950 shadow-sm hover:bg-emerald-50">
              <Link href="/explorer">
                <Compass className="mr-2 h-4 w-4" />
                Explorer les établissements
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="hidden min-w-48 rounded-2xl border border-white/15 bg-white/[0.08] p-4 text-white backdrop-blur-sm sm:block">
            <div className="flex items-center gap-2 text-emerald-100/80">
              <MapPin className="h-4 w-4" />
              <span className="text-xs font-medium">Votre prochaine escapade</span>
            </div>
            <p className="mt-3 text-2xl font-semibold tracking-tight">
              {isLoading ? "…" : upcomingCount.toLocaleString("fr-FR")}
            </p>
            <p className="mt-1 text-xs text-emerald-50/70">
              réservation{upcomingCount === 1 ? "" : "s"} à venir
            </p>
          </div>
        </div>
      </section>

      <section aria-label="Résumé de votre activité">
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">En un coup d’œil</p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-900">Votre activité</h2>
          </div>
          <Link href="/users/reservations" className="hidden items-center gap-1 text-sm font-medium text-slate-500 transition hover:text-emerald-800 sm:inline-flex">
            Toutes mes réservations <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <UserStatsGrid cards={stats} />
      </section>

      {error && (
        <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          Les réservations n’ont pas pu être actualisées : {error}
        </div>
      )}

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(260px,0.8fr)]">
        <div className="min-w-0">
          <div className="mb-3 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">À venir</p>
              <h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-900">Votre prochain séjour</h2>
            </div>
            <Link href="/users/reservations" className="inline-flex items-center gap-1 text-sm font-medium text-emerald-800 transition hover:text-emerald-950">
              Tout voir <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          {isLoading ? (
            <div className="h-52 animate-pulse rounded-2xl border border-slate-200 bg-white" />
          ) : nextReservation ? (
            <ReservationCard reservation={nextReservation} />
          ) : (
            <div className="flex min-h-52 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-8 text-center">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
                <CalendarCheck className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-slate-900">Aucun séjour prévu pour le moment</h3>
              <p className="mt-1 max-w-sm text-sm leading-5 text-slate-500">
                Parcourez les établissements et trouvez votre prochaine adresse.
              </p>
              <Button asChild variant="outline" className="mt-4 rounded-xl border-emerald-200 text-emerald-800 hover:bg-emerald-50">
                <Link href="/explorer">Trouver un établissement</Link>
              </Button>
            </div>
          )}
        </div>

        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Accès rapide</p>
          <h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-900">Que souhaitez-vous faire ?</h2>
          <div className="mt-5 space-y-2">
            <QuickLink href="/explorer" icon={Compass} title="Explorer" description="Découvrez de nouveaux lieux" />
            <QuickLink href="/users/favoris" icon={Heart} title="Mes favoris" description={`${favorites.length} lieu${favorites.length === 1 ? "" : "x"} enregistré${favorites.length === 1 ? "" : "s"}`} />
            <QuickLink href="/users/notifications" icon={Bell} title="Notifications" description={unreadCount ? `${unreadCount} non lue${unreadCount > 1 ? "s" : ""}` : "Vous êtes à jour"} />
          </div>
        </aside>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">Sélection BestReserv</p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-900">Des idées pour votre prochaine sortie</h2>
            <p className="mt-1 text-sm text-slate-500">Des établissements sélectionnés pour vous inspirer.</p>
          </div>
          <Link href="/explorer" className="hidden items-center gap-1 text-sm font-medium text-emerald-800 transition hover:text-emerald-950 sm:inline-flex">
            Tout explorer <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <RecommendationsTabs />
      </section>
    </div>
  );
}

function QuickLink({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: typeof Compass;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:border-emerald-200 hover:bg-emerald-50/60"
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-50 text-slate-600 transition group-hover:bg-white group-hover:text-emerald-700">
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-slate-800">{title}</span>
        <span className="mt-0.5 block truncate text-xs text-slate-500">{description}</span>
      </span>
      <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:text-emerald-700" />
    </Link>
  );
}
