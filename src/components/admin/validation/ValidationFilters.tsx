"use client";

import { Search, RotateCcw, SlidersHorizontal, X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useState } from "react";
import { useValidationsStore } from "@/store/useValidationsStore";

const CITIES = ["Cotonou", "Porto-Novo", "Ouidah", "Abomey-Calavi", "Natitingou"];

export function ValidationFilters() {
  const filters = useValidationsStore((s) => s.filters);
  const setFilters = useValidationsStore((s) => s.setFilters);
  const resetFilters = useValidationsStore((s) => s.resetFilters);
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      {/* DESKTOP */}
      <div className="hidden flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 lg:flex lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            placeholder="Rechercher un établissement, un propriétaire..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-emerald-500 focus:bg-white"
          />
        </div>

        <Select value={filters.category} onValueChange={(v) => setFilters({ category: v as any })}>
          <SelectTrigger className="h-10 w-[150px] rounded-xl"><SelectValue placeholder="Catégorie" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Toutes</SelectItem>
            <SelectItem value="HEBERGEMENT">Hébergement</SelectItem>
            <SelectItem value="RESTAURANT">Restaurant</SelectItem>
            <SelectItem value="LOISIR">Loisir</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.city} onValueChange={(v) => setFilters({ city: v })}>
          <SelectTrigger className="h-10 w-[140px] rounded-xl"><SelectValue placeholder="Ville" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Toutes</SelectItem>
            {CITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={filters.submissionDate} onValueChange={(v) => setFilters({ submissionDate: v as any })}>
          <SelectTrigger className="h-10 w-[170px] rounded-xl"><SelectValue placeholder="Date de soumission" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les dates</SelectItem>
            <SelectItem value="today">Aujourd'hui</SelectItem>
            <SelectItem value="week">7 derniers jours</SelectItem>
            <SelectItem value="month">30 derniers jours</SelectItem>
            <SelectItem value="year">Cette année</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={resetFilters} className="h-10 rounded-xl">
          <RotateCcw className="mr-2 h-3.5 w-3.5" /> Réinitialiser
        </Button>

        <Button variant="outline" className="h-10 rounded-xl">
          <Download className="mr-2 h-3.5 w-3.5" /> Exporter
        </Button>
      </div>

      {/* MOBILE */}
      <div className="flex gap-2 lg:hidden">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            placeholder="Rechercher..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-emerald-500"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setSheetOpen(true)}
          className="h-11 w-11 shrink-0 rounded-xl"
          aria-label="Filtres"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* BOTTOM SHEET mobile */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="bottom" className="h-[80vh] w-full rounded-t-3xl border-t-0 p-0 [&>button]:hidden lg:hidden">
          <div className="flex h-full flex-col">
            <div className="flex justify-center pt-3 pb-1">
              <div className="h-1.5 w-10 rounded-full bg-slate-300" />
            </div>

            <div className="flex items-center justify-between border-b px-5 py-3">
              <button onClick={() => setSheetOpen(false)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-slate-100">
                <X className="h-5 w-5 text-slate-600" />
              </button>
              <h3 className="text-base font-semibold">Filtres</h3>
              <button onClick={resetFilters} className="text-xs font-semibold text-emerald-700 hover:underline">
                Effacer
              </button>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5 lr-scrollbar">
              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">Catégorie</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { v: "ALL", l: "Toutes" },
                    { v: "HEBERGEMENT", l: "Hébergement" },
                    { v: "RESTAURANT", l: "Restaurant" },
                    { v: "LOISIR", l: "Loisir" },
                  ].map((c) => (
                    <button
                      key={c.v}
                      onClick={() => setFilters({ category: c.v as any })}
                      className={`rounded-xl border px-3 py-2.5 text-sm font-medium ${
                        filters.category === c.v
                          ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                          : "border-slate-200"
                      }`}
                    >
                      {c.l}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">Ville</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setFilters({ city: "ALL" })}
                    className={`rounded-xl border px-3 py-2.5 text-sm font-medium ${
                      filters.city === "ALL"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                        : "border-slate-200"
                    }`}
                  >
                    Toutes
                  </button>
                  {CITIES.map((c) => (
                    <button
                      key={c}
                      onClick={() => setFilters({ city: c })}
                      className={`rounded-xl border px-3 py-2.5 text-sm font-medium ${
                        filters.city === c
                          ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                          : "border-slate-200"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t bg-white px-5 py-4">
              <Button onClick={() => setSheetOpen(false)} className="w-full rounded-xl bg-emerald-700 py-6 font-semibold hover:bg-emerald-800">
                Voir les résultats
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}