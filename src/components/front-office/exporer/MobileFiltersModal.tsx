// features/explorer/components/mobile/MobileFiltersModal.tsx
"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent,} from "@/components/ui/sheet";
import { FiltersSidebar } from "./FiltersSidebar";


interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileFiltersModal({ open, onOpenChange }: Props) {
 
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[80vh] w-full rounded-t-3xl border-t-0 p-0 [&>button]:hidden"
      >
        <div className="flex h-full flex-col">
          {/* ===== DRAG HANDLE ===== */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="h-1.5 w-10 rounded-full bg-muted-foreground/30" />
          </div>

          {/* ===== HEADER ===== */}
          <div className="flex items-center justify-between border-b px-5 py-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-9 w-9 rounded-full"
              aria-label="Fermer"
            >
              <X className="h-5 w-5" />
            </Button>       
          </div>

          {/* ===== CONTENU SCROLLABLE ===== */}
          <div className="flex-1 overflow-y-auto px-5 py-5 lr-scrollbar">
            <FiltersSidebar />
          </div>

          {/* ===== FOOTER STICKY ===== */}
          <div className="border-t bg-background px-5 py-4 shadow-[0_-4px_12px_rgba(0,0,0,0.04)]">
            <Button
              className="w-full bg-emerald-800 py-6 text-base font-semibold shadow-lg hover:bg-emerald-900"
              onClick={() => onOpenChange(false)}
            >
              Afficher les résultats
              {/* {activeFiltersCount > 0 && (
                <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                  {activeFiltersCount}
                </span>
              )} */}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}