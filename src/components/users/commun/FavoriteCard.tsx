"use client";

import Link from "next/link";
import { Heart, MapPin, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Props {
  id: number;
  name: string;
  image: string;
  city: string;
  country: string;
  rating: number;
  reviewCount: number;
  price: number;
  currency: string;
  priceUnit: string;
  href: string;
  onRemove: () => void;
}

export function FavoriteCard({
  name, image, city, country, rating, reviewCount,
  price, currency, priceUnit, href, onRemove,
}: Props) {
  return (
    <Card className="group overflow-hidden rounded-2xl p-0 transition hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Link href={href}>
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </Link>

        <button
          onClick={(e) => { e.preventDefault(); onRemove(); }}
          className="absolute right-2.5 top-2.5 grid h-8 w-8 place-items-center rounded-full bg-white/95 shadow-sm backdrop-blur transition hover:scale-110"
          aria-label="Retirer des favoris"
        >
          <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />
        </button>

        <div className="absolute left-2.5 top-2.5 flex items-center gap-1 rounded-md bg-white/95 px-2 py-1 text-[10px] font-bold shadow-sm backdrop-blur">
          <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
          {rating.toFixed(1)}
          <span className="text-slate-400">({reviewCount})</span>
        </div>
      </div>

      <div className="p-3">
        <Link href={href}>
          <h3 className="truncate text-sm font-bold text-slate-900 hover:text-emerald-700">
            {name}
          </h3>
        </Link>
        <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-500">
          <MapPin className="h-3 w-3 text-emerald-600" />
          {city}, {country}
        </p>
        <p className="mt-2 text-sm font-bold text-emerald-800">
          {price.toLocaleString("fr-FR")} {currency}
          <span className="ml-1 text-[10px] font-normal text-slate-400">/ {priceUnit}</span>
        </p>
      </div>
    </Card>
  );
}