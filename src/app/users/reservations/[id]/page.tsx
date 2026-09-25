"use client";

import { useParams } from "next/navigation";
import { ArrowLeft, Download, MapPin, Star, Calendar, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useUserReservations } from "../../../../../hook/useUserReservations";

export default function ReservationDetailPage() {
  const { reference } = useParams();
  const { reservations } = useUserReservations();
  const r = reservations.find((x) => x.reference === reference);

  if (!r) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-slate-400">Réservation introuvable</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/users/reservations"
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-emerald-700"
          >
            <ArrowLeft className="h-3 w-3" /> Retour à mes réservations
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">
            Réservation {r.reference}
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Réservée le {new Date(r.createdAt).toLocaleDateString("fr-FR")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">Confirmée</Badge>
          <Button variant="outline" size="sm" className="rounded-xl">
            <Download className="mr-1.5 h-3.5 w-3.5" /> Télécharger
          </Button>
        </div>
      </div>

      {/* Établissement */}
      <Card className="overflow-hidden rounded-2xl p-0">
        <div className="flex flex-col sm:flex-row">
          <img
            src={r.establishment.image}
            alt={r.establishment.name}
            className="h-40 w-full object-cover sm:h-auto sm:w-56"
          />
          <div className="flex flex-1 flex-col justify-between gap-3 p-5">
            <div>
              <h2 className="text-lg font-bold">{r.establishment.name}</h2>
              <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                <MapPin className="h-3 w-3 text-emerald-600" />
                {r.establishment.city}, {r.establishment.country}
              </p>
              <div className="mt-2 flex items-center gap-1 text-xs">
                <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                <span className="font-semibold">{r.establishment.rating.toFixed(1)}</span>
                <span className="text-slate-400">({r.establishment.reviewCount} avis)</span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-fit rounded-xl">
              Voir l'établissement
            </Button>
          </div>
        </div>
      </Card>

      {/* Détails du séjour */}
      <Card className="rounded-2xl p-5">
        <h3 className="mb-4 text-base font-bold">Détails du séjour</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <InfoBox icon={Calendar} label="Arrivée" value={new Date(r.startDate).toLocaleDateString("fr-FR")} />
          <InfoBox icon={Calendar} label="Départ" value={new Date(r.endDate).toLocaleDateString("fr-FR")} />
          <InfoBox icon={Users} label="Voyageurs" value={`${r.guests.adults} adultes`} />
          <InfoBox icon={Star} label="Chambre" value={r.room} />
        </div>
      </Card>

      {/* Paiement */}
      <Card className="rounded-2xl p-5">
        <h3 className="mb-4 text-base font-bold">Récapitulatif du paiement</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Hébergement ({r.nights} nuits)</span>
            <span className="font-semibold">{r.totalAmount.toLocaleString("fr-FR")} FCFA</span>
          </div>
          <div className="flex justify-between border-t pt-2 text-base font-bold">
            <span>Total</span>
            <span className="text-emerald-800">{r.totalAmount.toLocaleString("fr-FR")} FCFA</span>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" className="rounded-xl">Contacter l'établissement</Button>
        <Button variant="outline" className="rounded-xl">Modifier la réservation</Button>
        <Button variant="outline" className="rounded-xl text-rose-600 hover:bg-rose-50">
          Annuler la réservation
        </Button>
      </div>
    </div>
  );
}

function InfoBox({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
      <Icon className="h-4 w-4 text-emerald-700" />
      <div className="mt-2 text-[10px] uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-0.5 text-xs font-semibold text-slate-800">{value}</div>
    </div>
  );
}