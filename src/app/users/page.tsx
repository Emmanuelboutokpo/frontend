"use client";

import { CalendarCheck, Heart, Star } from "lucide-react";
import { useFavorites } from "@/store";
import { useUserReservations } from "../../../hook/useUserReservations";
import { UserStatCard, UserStatsGrid } from "@/components/users/commun/UserStatsGrid";
import { UserSection } from "@/components/users/commun/UserSection";
import { ReservationCard } from "@/components/users/commun/ReservationCard";
import { WelcomeBanner } from "@/components/users/commun/WelcomeBanner";
import { RecommendationsTabs } from "@/components/users/commun/RecommendationsTabs";

export default function UserDashboardPage() {
  const { nextReservation, upcomingCount } = useUserReservations();
  const favorites = useFavorites();

  const stats: UserStatCard[] = [
    { icon: CalendarCheck, label: "Réservations à venir", value: upcomingCount, href: "/users/reservations", color: "bg-blue-50 text-blue-700" },
    { icon: Heart, label: "Favoris enregistrés", value: favorites.length, href: "/users/favorites", color: "bg-rose-50 text-rose-700" },
    { icon: Star, label: "Avis laissés", value: 4, color: "bg-amber-50 text-amber-700" },
  ];

  return (
    <div className="space-y-6">
      <WelcomeBanner />

      <UserStatsGrid cards={stats} />

      {nextReservation && (
        <UserSection
          title="Votre prochaine réservation"
          action={{ label: "Voir toutes", href: "/users/reservations" }}
        >
          <ReservationCard reservation={nextReservation} />
        </UserSection>
      )}

      <UserSection
        title="Recommandations pour vous"
        action={{ label: "Voir tout", href: "/explorer" }}
      >
        <RecommendationsTabs />
      </UserSection>
    </div>
  );
}