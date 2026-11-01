"use client";

import { useState } from "react";
import { Calendar, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { Establishment } from "@/types/types";

interface Props {
  establishment: Establishment;
  isAccommodation: boolean;
  checkIn: string;
  checkOut: string;
  startTime: string;
  endTime: string;
  adults: number;
  children: number;
  room: string;
  onCheckInChange: (v: string) => void;
  onCheckOutChange: (v: string) => void;
  onStartTimeChange: (v: string) => void;
  onEndTimeChange: (v: string) => void;
  onAdultsChange: (n: number) => void;
  onChildrenChange: (n: number) => void;
  onRoomChange: (v: string) => void;
  subtotal: number;
  nights: number;
  isCheckingAvailability?: boolean;
  availabilityMessage?: string;
  isAvailable?: boolean | null;
  onNext: () => void;
}

export function Step1StayDetails({
  establishment,
  isAccommodation,
  checkIn,
  checkOut,
  startTime,
  endTime,
  adults,
  children,
  room,
  onCheckInChange,
  onCheckOutChange,
  onStartTimeChange,
  onEndTimeChange,
  onAdultsChange,
  onChildrenChange,
  onRoomChange,
  subtotal,
  nights,
  isCheckingAvailability = false,
  availabilityMessage,
  isAvailable,
  onNext,
}: Props) {
  const [calendarTarget, setCalendarTarget] = useState<"checkIn" | "checkOut" | null>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const minDate =
    calendarTarget === "checkOut" && checkIn ? new Date(checkIn) : today;

  const canContinue = Boolean(checkIn) && (!isAccommodation || Boolean(checkOut) && nights >= 1);

  return (
    <div className="space-y-8">
      {/* Titre */}
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Détails du séjour
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {isAccommodation
            ? "Choisissez les dates de votre séjour et le nombre de voyageurs."
            : "Choisissez la date, l’horaire souhaité et le nombre de participants."}
        </p>
      </header>

      {/* Dates */}
      <section className="rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-sm font-bold text-slate-900">{isAccommodation ? "Dates du séjour" : "Date de votre réservation"}</h2>
        </div>
        <div className={`grid divide-x divide-slate-100 ${isAccommodation ? "grid-cols-2" : "grid-cols-1"}`}>
          <button
            type="button"
            onClick={() => setCalendarTarget("checkIn")}
            className="px-5 py-4 text-left transition hover:bg-slate-50"
          >
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <Calendar className="h-3 w-3" />
              Arrivée
            </div>
            <div className="mt-1.5 text-sm font-semibold text-slate-900">
              {checkIn
                ? new Date(checkIn).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "Sélectionner"}
            </div>
          </button>

          {isAccommodation && (
            <button
              type="button"
              onClick={() => setCalendarTarget("checkOut")}
              className="px-5 py-4 text-left transition hover:bg-slate-50"
            >
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <Calendar className="h-3 w-3" />
                Départ
              </div>
              <div className="mt-1.5 text-sm font-semibold text-slate-900">
                {checkOut
                  ? new Date(checkOut).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "Sélectionner"}
              </div>
            </button>
          )}
        </div>
        {!isAccommodation && (
          <div className="grid grid-cols-2 divide-x divide-slate-100 border-t border-slate-100">
            <label className="px-5 py-4 text-left">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Heure d’arrivée</span>
              <input aria-label="Heure d’arrivée souhaitée" type="time" value={startTime} onChange={(event) => onStartTimeChange(event.target.value)} className="mt-1.5 w-full bg-transparent text-sm font-semibold text-slate-900 outline-none" />
            </label>
            <label className="px-5 py-4 text-left">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Heure de fin (optionnelle)</span>
              <input aria-label="Heure de fin souhaitée" type="time" value={endTime} onChange={(event) => onEndTimeChange(event.target.value)} className="mt-1.5 w-full bg-transparent text-sm font-semibold text-slate-900 outline-none" />
            </label>
          </div>
        )}
      </section>

      {/* Voyageurs */}
      <section className="rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-sm font-bold text-slate-900">{isAccommodation ? "Voyageurs" : "Participants"}</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {isAccommodation ? (
            <>
              <CounterRow label="Adultes" hint="13 ans et plus" value={adults} min={1} max={100 - children} onChange={onAdultsChange} />
              <CounterRow label="Enfants" hint="0 - 12 ans" value={children} min={0} max={100 - adults} onChange={onChildrenChange} />
            </>
          ) : (
            <CounterRow label="Nombre de participants" hint="Nombre total de personnes" value={adults} min={1} max={100} onChange={onAdultsChange} />
          )}
        </div>
      </section>

      {/* Unité réservée */}
      {isAccommodation && <section className="rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-sm font-bold text-slate-900">Type de chambre souhaité (optionnel)</h2>
        </div>
        <div className="p-5">
          <Input value={room === "unspecified" ? "" : room} onChange={(event) => onRoomChange(event.target.value)} maxLength={100} placeholder="Ex. chambre double, suite..." className="h-11 rounded-xl" />
          <p className="mt-2 text-xs text-slate-500">Votre préférence sera transmise à l’établissement, sans garantir sa disponibilité.</p>
        </div>
      </section>}

      {/* Résumé prix */}
      {isAccommodation && nights > 0 && (
        <section className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">{nights} nuit{nights > 1 ? "s" : ""}</span>
            <span className="font-bold text-slate-900">{subtotal > 0 ? `${subtotal.toLocaleString("fr-FR")} ${establishment.currency}` : "Montant calculé à l’étape suivante"}</span>
          </div>
        </section>
      )}

      {availabilityMessage && (
        <p role={isAvailable === false ? "alert" : "status"} className={`rounded-xl p-4 text-sm ${
          isAvailable === false ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-800"
        }`}>{availabilityMessage}</p>
      )}

      {/* Actions */}
      <div className="flex justify-end pt-2">
        <Button
          onClick={onNext}
          disabled={!canContinue || isCheckingAvailability}
          className="h-12 rounded-xl bg-emerald-700 px-8 font-semibold hover:bg-emerald-800 disabled:opacity-50"
        >
          {isCheckingAvailability ? "Vérification et calcul du devis..." : "Vérifier la disponibilité"}
        </Button>
      </div>

      {/* Calendar */}
      <Dialog
        open={calendarTarget !== null}
        onOpenChange={(o) => !o && setCalendarTarget(null)}
      >
        <DialogContent className="w-fit max-w-[calc(100%-2rem)] rounded-2xl p-2 sm:p-4">
          <DialogTitle>
            {calendarTarget === "checkIn" ? "Date d'arrivée" : "Date de départ"}
          </DialogTitle>
          <CalendarPicker
            mode="single"
            selected={
              calendarTarget === "checkIn" && checkIn
                ? new Date(checkIn)
                : calendarTarget === "checkOut" && checkOut
                ? new Date(checkOut)
                : undefined
            }
            onSelect={(date) => {
              if (!date) return;
              const v = date.toISOString().slice(0, 10);
              if (calendarTarget === "checkIn") {
                onCheckInChange(v);
                if (checkOut && date >= new Date(checkOut)) onCheckOutChange("");
              } else if (isAccommodation) {
                onCheckOutChange(v);
              }
              setCalendarTarget(null);
            }}
            disabled={{ before: minDate }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CounterRow({
  label, hint, value, min, max, onChange,
}: {
  label: string;
  hint: string;
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex items-center justify-between px-5 py-4">
      <div>
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        <p className="text-xs text-slate-500">{hint}</p>
      </div>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="h-8 w-8 rounded-full"
        >
          <Minus className="h-3.5 w-3.5" />
        </Button>
        <span className="w-6 text-center text-sm font-bold">{value}</span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="h-8 w-8 rounded-full"
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}