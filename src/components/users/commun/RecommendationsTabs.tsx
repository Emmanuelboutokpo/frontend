"use client";

import { useMemo, useState } from "react";
import { MapPin, Star, Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { usePropertyStore } from "@/store";
import { getCoverPhoto } from "@/utils/selectors";
import type { Establishment } from "@/types/types";

// =====================================================================
// TYPES
// =====================================================================
interface RecommendationCardProps {
  establishment: Establishment;
  coverUrl?: string;
  city: string;
  country: string;
  href: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

// =====================================================================
// CARTE RECOMMANDATION
// =====================================================================
function RecommendationCard({
  establishment,
  coverUrl,
  city,
  country,
  href,
  isFavorite,
  onToggleFavorite,
}: RecommendationCardProps) {
  const price =
    establishment.price_per_night ?? establishment.price_per_month ?? 0;
  const priceUnit = establishment.price_per_night
    ? "nuit"
    : establishment.price_per_month
    ? "mois"
    : "personne";

  return (
    <Card className="group overflow-hidden rounded-2xl p-0 transition hover:-translate-y-0.5 hover:shadow-md">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <Link href={href}>
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={establishment.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="grid h-full place-items-center text-slate-300">
              <MapPin className="h-8 w-8" />
            </div>
          )}
        </Link>

        {/* Badge note */}
        <div className="absolute left-2.5 top-2.5 flex items-center gap-1 rounded-md bg-white/95 px-2 py-1 text-[10px] font-bold shadow-sm backdrop-blur">
          <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
          {establishment.rating.toFixed(1)}
          <span className="text-slate-400">
            ({establishment.review_ids.length})
          </span>
        </div>

        {/* Favori */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleFavorite();
          }}
          className="absolute right-2.5 top-2.5 grid h-8 w-8 place-items-center rounded-full bg-white/95 shadow-sm backdrop-blur transition hover:scale-110"
          aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <Heart
            className={`h-4 w-4 ${
              isFavorite ? "fill-rose-500 text-rose-500" : "text-slate-600"
            }`}
          />
        </button>
      </div>

      {/* Contenu */}
      <div className="p-3">
        <Link href={href}>
          <h3 className="truncate text-sm font-bold text-slate-900 transition hover:text-emerald-700">
            {establishment.name}
          </h3>
        </Link>

        <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-500">
          <MapPin className="h-3 w-3 shrink-0 text-emerald-600" />
          <span className="truncate">
            {city}, {country}
          </span>
        </p>

        <p className="mt-2 text-sm font-bold text-emerald-800">
          {price > 0
            ? `${price.toLocaleString("fr-FR")} ${establishment.currency}`
            : "Sur demande"}
          {price > 0 && (
            <span className="ml-1 text-[10px] font-normal text-slate-400">
              / {priceUnit}
            </span>
          )}
        </p>
      </div>
    </Card>
  );
}

// =====================================================================
// COMPOSANT PRINCIPAL
// =====================================================================
export function RecommendationsTabs() {
  const data = usePropertyStore((s) => s.data);
  const favoriteIds = usePropertyStore((s) => s.favoriteIds);
  const toggleFavorite = usePropertyStore((s) => s.toggleFavorite);

  const [activeCategory, setActiveCategory] = useState<
    "HEBERGEMENT" | "RESTAURANT" | "LOISIR"
  >("HEBERGEMENT");

  // Récupère les 4 établissements les mieux notés par catégorie
  const recommendations = useMemo(() => {
    const catId =
      activeCategory === "HEBERGEMENT"
        ? 1
        : activeCategory === "RESTAURANT"
        ? 2
        : 3;

    return [...data.Establishments]
      .filter((e) => e.status === "APPROVED" && e.category_id === catId)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 4);
  }, [data.Establishments, activeCategory]);

  const tabs = [
    { value: "HEBERGEMENT", label: "Hébergements" },
    { value: "RESTAURANT", label: "Restaurants" },
    { value: "LOISIR", label: "Loisirs" },
  ] as const;

  return (
    <div>
      {/* Tabs */}
      <div className="mb-4 flex items-center gap-1 overflow-x-auto border-b border-slate-100 scrollbar-hide">
        {tabs.map((tab) => {
          const isActive = activeCategory === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveCategory(tab.value)}
              className={`shrink-0 border-b-2 px-3 py-2 text-xs font-semibold transition ${
                isActive
                  ? "border-emerald-600 text-emerald-700"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Grille */}
      {recommendations.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 py-10 text-center">
          <p className="text-xs text-slate-400">
            Aucune recommandation dans cette catégorie
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {recommendations.map((e) => {
            const cover = getCoverPhoto(data, e.id);
            const category = data.Categories.find(
              (c) => c.id === e.category_id
            );
            const subcategory = data.SubCategories.find(
              (sc) => sc.id === e.subcategory_id
            );
            const commune = data.Communes.find((c) => c.id === e.commune_id);
            const country = data.Countries.find((c) => c.id === e.country_id);

            const parts = ["/explorer", category?.slug ?? "hebergement"];
            if (subcategory?.slug) parts.push(subcategory.slug);
            parts.push(e.slug);
            const href = parts.join("/");

            return (
              <RecommendationCard
                key={e.id}
                establishment={e}
                coverUrl={cover?.url}
                city={commune?.name ?? ""}
                country={country?.name ?? ""}
                href={href}
                isFavorite={favoriteIds.includes(e.id)}
                onToggleFavorite={() => toggleFavorite(e.id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}