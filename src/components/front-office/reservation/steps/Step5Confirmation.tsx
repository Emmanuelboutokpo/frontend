"use client";

import { MapPin, Calendar, Users, Bed, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  establishment: {
    name: string;
    address: string;
    image: string;
    categoryName: string;
  };
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number;
  room: string;
  client: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: string;
  };
  pricePerNight: number;
  subtotal: number;
  serviceFee: number;
  totalAmount: number;
  currency: string;
  isSubmitting?: boolean;
  onConfirm: () => void;
  onPrev: () => void;
}

export function Step4Confirmation({
  establishment,
  checkIn,
  checkOut,
  nights,
  adults,
  children,
  room,
  client,
  pricePerNight,
  subtotal,
  serviceFee,
  totalAmount,
  currency,
  isSubmitting,
  onConfirm,
  onPrev,
}: Props) {
  return (
    <div className="space-y-8">
      {/* Titre */}
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Vérifiez et confirmez
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Relisez les informations avant de valider votre réservation.
        </p>
      </header>

      {/* Établissement */}
      <section className="rounded-2xl border border-slate-200 bg-white">
        <div className="flex gap-4 p-5">
          <img
            src={establishment.image}
            alt={establishment.name}
            className="h-20 w-24 shrink-0 rounded-lg object-cover"
          />
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-bold text-slate-900">
              {establishment.name}
            </h2>
            <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
              <MapPin className="h-3 w-3" />
              {establishment.address}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-slate-100 p-5 sm:grid-cols-4">
          <InfoBox
            icon={Calendar}
            label="Arrivée"
            value={new Date(checkIn).toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "short",
            })}
          />
          <InfoBox
            icon={Calendar}
            label="Départ"
            value={new Date(checkOut).toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "short",
            })}
          />
          <InfoBox
            icon={Users}
            label="Voyageurs"
            value={`${adults}${children > 0 ? ` + ${children}` : ""}`}
          />
          <InfoBox
            icon={Bed}
            label="Chambre"
            value={room}
          />
        </div>
      </section>

      {/* Client */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-sm font-bold text-slate-900">
          Informations du client
        </h2>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <Row label="Nom complet" value={`${client.firstName} ${client.lastName}`} />
          <Row label="Email" value={client.email} />
          <Row label="Téléphone" value={client.phone} />
          <Row label="Pays" value={client.country} />
        </dl>
      </section>

      {/* Prix */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-sm font-bold text-slate-900">
          Détail du paiement        </h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-slate-600">
            <span>
              {pricePerNight.toLocaleString("fr-FR")} {currency} × {nights} nuit
              {nights > 1 ? "s" : ""}
            </span>
            <span className="font-semibold text-slate-900">
              {subtotal.toLocaleString("fr-FR")} {currency}
            </span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Frais de service</span>
            <span className="font-semibold text-slate-900">
              {serviceFee.toLocaleString("fr-FR")} {currency}
            </span>
          </div>
          <div className="flex justify-between border-t border-slate-100 pt-3 text-base font-bold">
            <span>Total à payer</span>
            <span className="text-emerald-800">
              {totalAmount.toLocaleString("fr-FR")} {currency}
            </span>
          </div>
        </div>
      </section>

      {/* Info */}
      <div className="flex items-start gap-2 rounded-xl bg-emerald-50 p-4 text-xs text-emerald-800">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
        <span>
          En confirmant, vous acceptez nos{" "}
          <a href="#" className="font-bold underline">
            conditions d'utilisation
          </a>{" "}
          et notre{" "}
          <a href="#" className="font-bold underline">
            politique d'annulation
          </a>
          .
        </span>
      </div>

      {/* Actions */}
      <div className="flex justify-between gap-3 pt-2">
        <Button
          variant="outline"
          onClick={onPrev}
          className="h-12 rounded-xl px-6"
        >
          Retour
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isSubmitting}
          className="h-12 rounded-xl bg-emerald-700 px-8 font-semibold hover:bg-emerald-800"
        >
          {isSubmitting ? "Traitement..." : "Confirmer la réservation"}
        </Button>
      </div>
    </div>
  );
}

function InfoBox({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Calendar;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <div className="mt-1 text-xs font-semibold text-slate-800">{value}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </dt>
      <dd className="mt-1 truncate text-sm font-semibold text-slate-800">
        {value}
      </dd>
    </div>
  );
}