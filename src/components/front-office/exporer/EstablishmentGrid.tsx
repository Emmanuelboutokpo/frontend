"use client";

import {
  usePropertyStore,
  useFilteredEstablishmentsPaginated,
} from "@/store";

import { formatLocation } from "@/utils/selectors";
import { SearchX, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import PropertyShowcase from "../PropertyShowcase";
import { useMemo } from "react";

export function EstablishmentGrid() {
  const data = usePropertyStore((s) => s.data);
  const resetFilters = usePropertyStore((s) => s.resetFilters);
  const { items, total } = useFilteredEstablishmentsPaginated();

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-muted/20 py-16 text-center">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-muted text-muted-foreground">
          <SearchX className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-lg font-bold text-slate-800">
          Aucun établissement trouvé
        </h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Aucun résultat ne correspond à vos filtres actuels. Essayez d'élargir votre recherche.
        </p>
        <Button
          onClick={resetFilters}
          className="mt-5 gap-2 rounded-xl bg-emerald-800 hover:bg-emerald-900"
        >
          <RotateCcw className="h-4 w-4" />
          Réinitialiser tous les filtres
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {items.map((est) => {
        const photos = useMemo(() => Object.fromEntries(data.Photos.filter((photo) => photo.is_cover).map((photo) => [photo.establishment_id, photo])), [data.Photos])
        const subcategorySlugs = useMemo(() => Object.fromEntries(data.SubCategories.map((subcategory) => [subcategory.id, subcategory.slug])), [data.SubCategories])
        
        const category = data.Categories.find((c) => c.id === est.category_id);
        const subcategory = data.SubCategories.find(
          (sc) => sc.id === est.subcategory_id
        );
        const location = formatLocation(data, est) || est.address;

        return (
           <PropertyShowcase
              key={est.id}
              property={est}
              photo={photos[est.id]}
              subcategorySlugs={subcategorySlugs}
              typeName={subcategory?.name ?? category?.name ?? "Établissement"}
              location={location}
            />
        );
      })}
    </div>
  );
}