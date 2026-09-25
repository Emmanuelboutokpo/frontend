"use client";

import Link from "next/link";
import { Calendar, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Reservation } from "@/types/reservation";

const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  EN_ATTENTE: { label: "En attente", className: "bg-amber-50 text-amber-700 border-amber-200" },
  CONFIRMEE: { label: "Confirmée", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  EN_COURS: { label: "En cours", className: "bg-blue-50 text-blue-700 border-blue-200" },
  TERMINEE: { label: "Terminée", className: "bg-slate-100 text-slate-600 border-slate-200" },
  ANNULEE: { label: "Annulée", className: "bg-rose-50 text-rose-700 border-rose-200" },
};

interface Props {
  reservation: Reservation;
}

export function ReservationCard({ reservation: r }: Props) {
  const status = STATUS_STYLES[r.status];

  return (
    <Card className="overflow-hidden rounded-2xl p-0 transition hover:shadow-md">
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="relative h-40 w-full shrink-0 sm:h-auto sm:w-48">
          <img
            src={r.establishment.image}
            alt={r.establishment.name}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between gap-3 p-4">
          <div>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="truncate text-sm font-bold text-slate-900">
                  {r.establishment.name}
                </h3>
                <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-500">
                  <MapPin className="h-3 w-3 text-emerald-600" />
                  {r.establishment.city}, {r.establishment.country}
                </p>
              </div>
              <Badge variant="outline" className={`shrink-0 text-[10px] font-semibold ${status.className}`}>
                {status.label}
              </Badge>
            </div>

            {/* Meta */}
            <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-slate-600">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-emerald-600" />
                {new Date(r.startDate).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}{" "}
                → {new Date(r.endDate).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3 text-emerald-600" />
                {r.guests.adults + r.guests.children} voyageur{r.guests.adults + r.guests.children > 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-end justify-between border-t border-slate-100 pt-3">
            <div>
              <span className="block text-[10px] uppercase text-slate-400">Total</span>
              <span className="text-sm font-bold text-emerald-800">
                {r.totalAmount.toLocaleString("fr-FR")} {r.currency}
              </span>
            </div>
            <Button asChild size="sm" variant="outline" className="rounded-lg text-xs">
              <Link href={`/reservations/${r.reference}`}>Voir détails</Link>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}