"use client";

import { List, Map, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
 import { useUIStore } from "@/store/useUIStore";
import {
  usePropertyStore,
  useFilteredEstablishments,
  useCommunes,
  useCountries,
} from "@/store";
 
export function ResultsHeader() {
  const filtered = useFilteredEstablishments();
  const searchQuery = usePropertyStore((s) => s.searchQuery);
  const setSortBy = usePropertyStore((s) => s.setSortBy);
  const viewMode = useUIStore((s) => s.explorerViewMode);
  const setViewMode = useUIStore((s) => s.setExplorerViewMode);
  const communes = useCommunes();
  const countries = useCountries();

  const activeCommune = searchQuery.communeId
    ? communes.find((c) => c.id === searchQuery.communeId)?.name
    : null;

  const activeCountry = searchQuery.countryId
    ? countries.find((c) => c.id === searchQuery.countryId)?.name
    : null;

  let locationText = "Toutes les destinations";
  if (activeCommune && activeCountry) {
    locationText = `${activeCommune}, ${activeCountry}`;
  } else if (activeCommune) {
    locationText = activeCommune;
  } else if (activeCountry) {
    locationText = activeCountry;
  }

  return (
    <div className="sm:mb-4 flex gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="hidden sm:block">
        <h2 className="text-lg font-semibold">
          {filtered.length} établissement{filtered.length > 1 ? "s" : ""} trouvé
          {filtered.length > 1 ? "s" : ""}
        </h2>
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 text-emerald-700" />
          {locationText}
        </p>
      </div>

       <div className=" items-center gap-1 rounded-md border p-2 sm:p-0.5 sm:flex">
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            className={`h-8 gap-1.5 ${
              viewMode === "list" ? "bg-emerald-800 text-white hover:bg-emerald-900" : ""
            }`}
            onClick={() => setViewMode("list")}
          >
            <List className="h-3.5 w-3.5" />
            Liste
          </Button>
          <Button
            variant={viewMode === "map" ? "default" : "ghost"}
            size="sm"
            className={`h-8 gap-1.5 ${
              viewMode === "map"
                ? "bg-emerald-800 text-white hover:bg-emerald-900"
                : "text-muted-foreground"
            }`}
            onClick={() => setViewMode("map")}
          >
            <Map className="h-3.5 w-3.5" />
            Carte
          </Button>
        </div>
    </div>
  );
}