"use client";

import { useState } from "react";
import { Calendar, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { Establishment } from "@/types/types";

interface Props {
  establishment: Establishment;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  room: string;
  onCheckInChange: (v: string) => void;
  onCheckOutChange: (v: string) => void;
  onAdultsChange: (n: number) => void;
  onChildrenChange: (n: number) => void;
  onRoomChange: (v: string) => void;
  subtotal: number;
  nights: number;
  onNext: () => void;
}

export function Step1StayDetails({
  establishment,
  checkIn,
  checkOut,
  adults,
  children,
  room,
  onCheckInChange,
  onCheckOutChange,
  onAdultsChange,
  onChildrenChange,
  onRoomChange,
  subtotal,
  nights,
  onNext,
}: Props) {
  const [calendarTarget, setCalendarTarget] = useState<"checkIn" | "checkOut" | null>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const minDate =
    calendarTarget === "checkOut" && checkIn ? new Date(checkIn) : today;

  const canContinue = checkIn && checkOut && nights >= 1;

  return (
    <div className="space-y-8">
      {/* Titre */}
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Détails du séjour
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Choisissez vos dates et le nombre de voyageurs.
        </p>
      </header>

      {/* Dates */}
      <section className="rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-sm font-bold text-slate-900">Dates du séjour</h2>
        </div>
        <div className="grid grid-cols-2 divide-x divide-slate-100">
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
        </div>
      </section>

      {/* Voyageurs */}
      <section className="rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-sm font-bold text-slate-900">Voyageurs</h2>
        </div>
        <div className="divide-y divide-slate-100">
          <CounterRow
            label="Adultes"
            hint="13 ans et plus"
            value={adults}
            min={1}
            onChange={onAdultsChange}
          />
          <CounterRow
            label="Enfants"
            hint="0 - 12 ans"
            value={children}
            min={0}
            onChange={onChildrenChange}
          />
        </div>
      </section>

      {/* Chambre */}
      <section className="rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-sm font-bold text-slate-900">Chambre</h2>
        </div>
        <div className="p-5">
          <Select value={room} onValueChange={onRoomChange}>
            <SelectTrigger className="h-11 rounded-xl">
              <SelectValue placeholder="Sélectionner une chambre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Chambre Standard</SelectItem>
              <SelectItem value="deluxe">Chambre Deluxe</SelectItem>
              <SelectItem value="suite">Suite Junior</SelectItem>
              <SelectItem value="suite-senior">Suite Senior</SelectItem>
            </SelectContent>
          </Select>
          <p className="mt-2 text-xs text-slate-500">
            1 lit double · Vue piscine · Petit-déjeuner inclus
          </p>
        </div>
      </section>

      {/* Résumé prix */}
      {nights > 0 && (
        <section className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">
              {establishment.price_per_night?.toLocaleString("fr-FR")}{" "}
              {establishment.currency} × {nights} nuit{nights > 1 ? "s" : ""}
            </span>
            <span className="font-bold text-slate-900">
              {subtotal.toLocaleString("fr-FR")} {establishment.currency}
            </span>
          </div>
        </section>
      )}

      {/* Actions */}
      <div className="flex justify-end pt-2">
        <Button
          onClick={onNext}
          disabled={!canContinue}
          className="h-12 rounded-xl bg-emerald-700 px-8 font-semibold hover:bg-emerald-800 disabled:opacity-50"
        >
          Continuer
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
              } else {
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
  label, hint, value, min, onChange,
}: {
  label: string;
  hint: string;
  value: number;
  min: number;
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
          onClick={() => onChange(value + 1)}
          className="h-8 w-8 rounded-full"
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}