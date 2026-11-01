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
  checkOut: string | null;
  nights: number;
  startTime: string | null;
  endTime: string | null;
  isAccommodation: boolean;
  adults: number;
  children: number;
  room: string;
  unitPrice: number;
  unitLabel: string;
  priceUnits: number;
  subtotal: number;
  serviceFee: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  specialRequests: string;
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
  startTime,
  endTime,
  isAccommodation,
  adults,
  children,
  room,
  unitPrice,
  unitLabel,
  priceUnits,
  subtotal,
  serviceFee,
  taxAmount,
  discountAmount,
  totalAmount,
  specialRequests,
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
          Vérifiez votre réservation
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Relisez les informations avant de créer votre réservation et de procéder au paiement.
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
            <p className="mt-1 text-[11px] text-slate-500">{establishment.categoryName}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-slate-100 p-5 sm:grid-cols-4">
          <InfoBox
            icon={Calendar}
            label={checkOut ? "Arrivée" : "Date"}
            value={new Date(checkIn).toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "short",
            })}
          />
          {checkOut && <InfoBox icon={Calendar} label="Départ" value={new Date(checkOut).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })} />}
          {nights > 0 && <InfoBox icon={Calendar} label="Durée" value={`${nights} nuit${nights > 1 ? "s" : ""}`} />}
          {startTime && <InfoBox icon={Calendar} label="Heure" value={startTime} />}
          {endTime && <InfoBox icon={Calendar} label="Fin" value={endTime} />}
          <InfoBox
            icon={Users}
            label={isAccommodation ? "Voyageurs" : "Participants"}
            value={isAccommodation && children > 0 ? `${adults} adulte${adults > 1 ? "s" : ""} + ${children} enfant${children > 1 ? "s" : ""}` : `${adults + (isAccommodation ? children : 0)}`}
          />
          {room && room !== "unspecified" && <InfoBox icon={Bed} label="Préférence" value={room} />}
        </div>
      </section>

      {/* Prix */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-sm font-bold text-slate-900">
          Détail du devis
        </h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-slate-600">
            <span>{unitPrice > 0 ? `${unitPrice.toLocaleString("fr-FR")} ${currency} × ${priceUnits} ${unitLabel}` : "Montant calculé par l’établissement"}</span>
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
          {taxAmount > 0 && <div className="flex justify-between text-slate-600"><span>Taxes</span><span className="font-semibold text-slate-900">{taxAmount.toLocaleString("fr-FR")} {currency}</span></div>}
          {discountAmount > 0 && <div className="flex justify-between text-emerald-700"><span>Remise</span><span className="font-semibold">−{discountAmount.toLocaleString("fr-FR")} {currency}</span></div>}
          <div className="flex justify-between border-t border-slate-100 pt-3 text-base font-bold">
            <span>Total estimé</span>
            <span className="text-emerald-800">
              {totalAmount.toLocaleString("fr-FR")} {currency}
            </span>
          </div>
        </div>
      </section>

      {specialRequests && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-bold text-slate-900">Demande particulière</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">{specialRequests}</p>
        </section>
      )}

      {/* Info */}
      <div className="flex items-start gap-2 rounded-xl bg-emerald-50 p-4 text-xs text-emerald-800">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
        <span>
          Votre réservation restera en attente tant que le paiement KKiaPay n’aura pas été vérifié. L’établissement pourra ensuite la traiter depuis son espace d’administration.
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
          {isSubmitting ? "Création de la réservation..." : "Créer la réservation et continuer vers le paiement"}
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