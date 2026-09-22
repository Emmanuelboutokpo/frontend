"use client";

import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import type { Establishment, Photo } from "@/types/types";

interface FavoriteMiniCardProps {
  establishment: Establishment;
  coverPhoto?: Photo;
  detailUrl: string;
  location: string;
  priceUnit?: "nuit" | "mois" | "personne";
}

export function FavoriteMiniCard({
  establishment,
  coverPhoto,
  detailUrl,
  location,
  priceUnit = "nuit",
}: FavoriteMiniCardProps) {
  const price =
    establishment.price_per_night ?? establishment.price_per_month ?? 0;

  const unit = establishment.price_per_night
    ? "nuit"
    : establishment.price_per_month
    ? "mois"
    : priceUnit;

  return (
    <Link
      href={detailUrl}
      className="group flex gap-3 rounded-2xl border border-slate-200 bg-white p-3 transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
    >
      {/* Photo */}
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
        {coverPhoto?.url ? (
          <img
            src={coverPhoto.url}
            alt={establishment.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center text-slate-300">
            <MapPin className="h-6 w-6" />
          </div>
        )}
      </div>

      {/* Infos */}
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <h3 className="line-clamp-1 text-sm font-bold text-slate-900 transition group-hover:text-emerald-700">
            {establishment.name}
          </h3>
          <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-500">
            <MapPin className="h-3 w-3 shrink-0 text-emerald-600" />
            <span className="truncate">{location}</span>
          </p>
        </div>

        <div className="flex items-end justify-between">
          <div className="flex items-center gap-1 text-[11px]">
            <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
            <span className="font-bold text-slate-700">
              {establishment.rating.toFixed(1)}
            </span>
          </div>

          <p className="text-xs font-bold text-emerald-800">
            {price > 0
              ? `${price.toLocaleString("fr-FR")} ${establishment.currency}`
              : "Sur demande"}
            {price > 0 && (
              <span className="ml-1 text-[10px] font-normal text-slate-400">
                / {unit}
              </span>
            )}
          </p>
        </div>
      </div>
    </Link>
  );
}