"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  page: number;
  perPage: number;
  total: number;
  onPageChange: (p: number) => void;
  onPerPageChange?: (n: number) => void;
  itemLabel?: string;
  perPageOptions?: number[];
}

export function Pagination({
  page,
  perPage,
  total,
  onPageChange,
  onPerPageChange,
  itemLabel = "résultats",
  perPageOptions = [8, 16, 32],
}: Props) {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const start = total === 0 ? 0 : (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, total);

  return (
    <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 sm:flex-row">
      <p className="text-xs text-slate-500">
        Affichage de{" "}
        <strong className="text-slate-700">{start}</strong> à{" "}
        <strong className="text-slate-700">{end}</strong> sur{" "}
        <strong className="text-slate-700">
          {total.toLocaleString("fr-FR")}
        </strong>{" "}
        {itemLabel}
      </p>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-lg"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </Button>

        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(
          (p) => (
            <Button
              key={p}
              variant={page === p ? "default" : "ghost"}
              size="icon"
              className={`h-8 w-8 rounded-lg text-xs ${
                page === p ? "bg-emerald-700 text-white hover:bg-emerald-800" : ""
              }`}
              onClick={() => onPageChange(p)}
            >
              {p}
            </Button>
          )
        )}

        {totalPages > 5 && (
          <span className="px-1 text-xs text-slate-400">...</span>
        )}
        {totalPages > 5 && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg text-xs"
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </Button>
        )}

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-lg"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>

      {onPerPageChange && (
        <Select
          value={String(perPage)}
          onValueChange={(v) => onPerPageChange(Number(v))}
        >
          <SelectTrigger className="h-8 w-[120px] rounded-lg text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {perPageOptions.map((n) => (
              <SelectItem key={n} value={String(n)}>
                {n} par page
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}