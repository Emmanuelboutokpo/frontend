// features/explorer/components/mobile/MobileLayout.tsx
"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { MobileHeader } from "./MobileHeader";
import { MobileFiltersModal } from "./MobileFiltersModal";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pagination } from "./Pagination";
import { EstablishmentGrid } from "./EstablishmentGrid";
import { useUIStore } from "@/store/useUIStore";
import {
  usePropertyStore,
  useFilteredEstablishments,
} from "@/store";

const MapView = dynamic(
  () => import("./MapView").then((m) => m.MapView),
  { ssr: false }
);

export function MobileLayout() {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const viewMode = useUIStore((s) => s.explorerViewMode);
  const isMap = viewMode === "map";
  const filtered = useFilteredEstablishments();

  return (
    <div className="sm:hidden min-h-screen bg-background pb-20">
      {/* Header avec bouton carte */}
      <section className=" relative h-72 items-center  isolate overflow-visible bg-[url('/images/hero12.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#042d5d]/90 via-[#0b4771]/60 to-[#081d39]/15" />
        <div className="relative pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <p className="text-blue-200 text-sm mb-2">Explorer</p>
          <h1 className="max-w-xl text-2xl font-bold leading-tight text-white lg:text-4xl">
            Trouvez un endroit idéal avec <span className="block text-[#ffc24b]">BestReservs</span>
          </h1>
          <p className="mt-2 text-sm text-white/85 lg:text-base">
            Hébergements, restaurants, loisirs... tout en un seul endroit.
          </p>
        </div>
      </section>

      <MobileHeader onOpenFilters={() => setFiltersOpen(true)} isMap={isMap} />

      <main className="min-w-0">

        {isMap ? (
          // 🗺️ Mode CARTE : la carte prend toute la place
          <main>
            <div className="mt-4 px-4">
              <MapView />
            </div>
          </main>
        ) : (

          <>
            <main className="px-4 pt-4">
              <div className="pb-4">
                <h2 className="text-lg font-semibold">
                  {filtered.length} établissement{filtered.length > 1 ? "s" : ""} trouvé
                  {filtered.length > 1 ? "s" : ""}
                </h2>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 text-emerald-700" />
                  Toutes les destinations
                </p>
              </div>
              <EstablishmentGrid />
              <Pagination />
            </main>

          </>
        )}
      </main>

      {/* Modal Filtres plein écran (Airbnb-style) */}
      <MobileFiltersModal
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
      />
    </div>
  );
}