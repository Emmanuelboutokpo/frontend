"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePropertyStore, useFilteredEstablishmentsPaginated } from "@/store";

export function Pagination() {
  const { page, totalPages, total } = useFilteredEstablishmentsPaginated();
  const setPage = usePropertyStore((s) => s.setPage);

  if (totalPages <= 1) {
    return null; // Pas besoin de pagination si une seule page
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="mt-8 flex items-center justify-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        disabled={page <= 1}
        onClick={() => setPage(Math.max(1, page - 1))}
        aria-label="Page précédente"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {pages.map((p) => {
        const isActive = p === page;
        return (
          <Button
            key={p}
            variant={isActive ? "default" : "ghost"}
            size="icon"
            className={`h-8 w-8 font-semibold ${
              isActive
                ? "bg-emerald-800 text-white hover:bg-emerald-900"
                : "text-slate-700 hover:bg-muted"
            }`}
            onClick={() => setPage(p)}
          >
            {p}
          </Button>
        );
      })}

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        disabled={page >= totalPages}
        onClick={() => setPage(Math.min(totalPages, page + 1))}
        aria-label="Page suivante"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}