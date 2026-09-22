"use client";

import Link from "next/link";
import { CalendarDays, MapPin, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Establishment, Photo } from "@/types/types";
import { Booking } from "@/store";
 
const STATUS_MAP: Record<
  Booking["status"],
  { label: string; className: string }
> = {
  pending: {
    label: "En attente",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  paid: {
    label: "Confirmée",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  
  cancelled: {
    label: "Annulée",
    className: "bg-rose-50 text-rose-700 border-rose-200",
  },
};

interface BookingRowProps {
  booking: Booking;
  establishment?: Establishment;
  coverPhoto?: Photo;
  detailUrl?: string;
  onCancel: (id: string) => void;
}

export function BookingRow({
  booking,
  establishment,
  coverPhoto,
  detailUrl,
  onCancel,
}: BookingRowProps) {
  const status = STATUS_MAP[booking.status];

  const nights = Math.max(
    0,
    Math.ceil(
      (new Date(booking.checkOut).getTime() -
        new Date(booking.checkIn).getTime()) /
        86400000
    )
  );

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:shadow-md sm:flex-row">
      {/* Photo */}
      <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-24 sm:w-32">
        {coverPhoto?.url ? (
          <img
            src={coverPhoto.url}
            alt={establishment?.name ?? "Réservation"}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="grid h-full place-items-center text-slate-300">
            <MapPin className="h-6 w-6" />
          </div>
        )}
      </div>

      {/* Infos */}
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              {detailUrl ? (
                <Link
                  href={detailUrl}
                  className="line-clamp-1 text-sm font-bold text-slate-900 hover:text-emerald-700"
                >
                  {establishment?.name ?? "Établissement"}
                </Link>
              ) : (
                <h3 className="line-clamp-1 text-sm font-bold">
                  {establishment?.name ?? "Établissement"}
                </h3>
              )}
              <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-500">
                <MapPin className="h-3 w-3 shrink-0 text-emerald-600" />
                {establishment?.address ?? "Adresse inconnue"}
              </p>
            </div>
            <Badge
              variant="outline"
              className={`shrink-0 text-[10px] font-semibold ${status.className}`}
            >
              {status.label}
            </Badge>
          </div>

          <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-slate-600">
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3 w-3 text-emerald-600" />
              {new Date(booking.checkIn).toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "short",
              })}{" "}
              →{" "}
              {new Date(booking.checkOut).toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "short",
              })}
              <span className="text-slate-400">({nights} nuits)</span>
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3 text-emerald-600" />
              {booking.guests} voyageur{booking.guests > 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Prix + actions */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
          <div>
            <span className="block text-[10px] uppercase tracking-wide text-slate-400">
              Total
            </span>
            <span className="text-sm font-bold text-emerald-800">
              {booking.amount.toLocaleString("fr-FR")} {booking.currency}
            </span>
          </div>

          {booking.status !== "cancelled" &&
            booking.status !== "paid" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCancel(booking.id)}
                className="text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700"
              >
                <X className="mr-1 h-3 w-3" />
                Annuler
              </Button>
            )}
        </div>
      </div>
    </div>
  );
}