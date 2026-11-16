"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePropertyStore, useFilteredEstablishmentsPaginated } from "@/store";

export function Pagination() {
  const { page, totalPages, total, pageSize } = useFilteredEstablishmentsPaginated();
  const setPage = usePropertyStore((s) => s.setPage);
  const isLoading = usePropertyStore((s) => s.establishmentsLoading);

  if (totalPages <= 1) {
    return null; // Pas besoin de pagination si une seule page
  }

  const visiblePageCount = 5;
  const windowStart = Math.max(1, Math.min(page - 2, totalPages - visiblePageCount + 1));
  const windowEnd = Math.min(totalPages, windowStart + visiblePageCount - 1);
  const pages = Array.from({ length: windowEnd - windowStart + 1 }, (_, index) => windowStart + index);
  const firstItem = (page - 1) * pageSize + 1;
  const lastItem = Math.min(page * pageSize, total);

  return (
    <nav aria-label="Pagination des établissements" className="mt-8 flex flex-col items-center gap-3">
      <p className="text-xs text-muted-foreground">
        Affichage de {firstItem} à {lastItem} sur {total} établissement{total > 1 ? "s" : ""}
      </p>
      <div className="flex items-center justify-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          disabled={isLoading || page <= 1}
          onClick={() => setPage(Math.max(1, page - 1))}
          aria-label="Page précédente"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {windowStart > 1 && (
          <>
            <PageButton page={1} currentPage={page} disabled={isLoading} onSelect={setPage} />
            {windowStart > 2 && <span className="px-1 text-muted-foreground" aria-hidden="true">…</span>}
          </>
        )}
        {pages.map((currentPage) => (
          <PageButton key={currentPage} page={currentPage} currentPage={page} disabled={isLoading} onSelect={setPage} />
        ))}
        {windowEnd < totalPages && (
          <>
            {windowEnd < totalPages - 1 && <span className="px-1 text-muted-foreground" aria-hidden="true">…</span>}
            <PageButton page={totalPages} currentPage={page} disabled={isLoading} onSelect={setPage} />
          </>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          disabled={isLoading || page >= totalPages}
          onClick={() => setPage(Math.min(totalPages, page + 1))}
          aria-label="Page suivante"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </nav>
  );
}

function PageButton({
  page,
  currentPage,
  disabled,
  onSelect,
}: {
  page: number;
  currentPage: number;
  disabled: boolean;
  onSelect: (page: number) => void;
}) {
  const isActive = page === currentPage;
  return (
    <Button
      variant={isActive ? "default" : "ghost"}
      size="icon"
      className={`h-8 w-8 font-semibold ${
        isActive
          ? "bg-emerald-800 text-white hover:bg-emerald-900"
          : "text-slate-700 hover:bg-muted"
      }`}
      disabled={disabled}
      onClick={() => onSelect(page)}
      aria-label={`Page ${page}`}
      aria-current={isActive ? "page" : undefined}
    >
      {page}
    </Button>
  );
}