"use client";

import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
 import { ResultsHeader } from "./ResultsHeader";

export function MobileHeader({ isMap, onOpenFilters }: { isMap : Boolean; onOpenFilters: () => void }) {
   
  return (
    <div className="sticky top-17 z-30 border-b bg-background/95 px-4 py-3 backdrop-blur">
      <div className="flex items-center justify-between gap-2">
        {/* Retour */}
         <Button
          variant="outline"
          size="icon"
           className="h-10 w-10 shrink-0"
          aria-label="Filtres"
          onClick={onOpenFilters}
        >
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
         <ResultsHeader />
        </div>
    </div>
  );
}