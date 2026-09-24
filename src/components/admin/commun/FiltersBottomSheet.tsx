"use client";

import { useState, ReactNode } from "react";
import { SlidersHorizontal, X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface Props {
  children: ReactNode;
  activeCount?: number;
  onReset?: () => void;
  triggerLabel?: string;
  title?: string;
  height?: string;
}

export function FiltersBottomSheet({
  children,
  activeCount = 0,
  onReset,
  triggerLabel = "Filtres",
  title = "Filtres",
  height = "85vh",
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="relative h-11 w-11 shrink-0 rounded-xl border-slate-200"
        aria-label={triggerLabel}
      >
        <SlidersHorizontal className="h-4 w-4" />
        {activeCount > 0 && (
          <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-emerald-700 px-1.5 text-[10px] font-bold text-white">
            {activeCount}
          </span>
        )}
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className="w-full rounded-t-3xl border-t-0 p-0 lg:hidden"
          style={{ height }}
        >
          <div className="flex h-full flex-col">
            <div className="flex justify-center pt-3 pb-1">
              <div className="h-1.5 w-10 rounded-full bg-slate-300" />
            </div>

            <SheetHeader className="border-b px-5 py-3">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                  className="h-9 w-9 rounded-full"
                >
                  <X className="h-5 w-5 text-slate-600" />
                </Button>

                <div className="flex flex-col items-center">
                  <SheetTitle className="text-base font-semibold">
                    {title}
                  </SheetTitle>
                  {activeCount > 0 && (
                    <span className="text-[11px] text-slate-500">
                      {activeCount} actif{activeCount > 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                {onReset ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onReset}
                    className="h-9 gap-1 rounded-full px-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
                  >
                    <RotateCcw className="h-3 w-3" /> Effacer
                  </Button>
                ) : (
                  <div className="w-9" />
                )}
              </div>
            </SheetHeader>

            <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5 lr-scrollbar">
              {children}
            </div>

            <div className="border-t bg-white px-5 py-4">
              <Button
                onClick={() => setOpen(false)}
                className="w-full rounded-xl bg-emerald-700 py-6 font-semibold hover:bg-emerald-800"
              >
                Voir les résultats
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}