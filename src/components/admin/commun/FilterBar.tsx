"use client";

import { ReactNode } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "./SearchInput";
import { FiltersBottomSheet } from "./FiltersBottomSheet";

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  searchPlaceholder?: string;
  onReset?: () => void;
  activeFiltersCount?: number;
  desktopFilters?: ReactNode;
  mobileFilters?: ReactNode;
  trailing?: ReactNode;
}

export function FilterBar({
  search,
  onSearchChange,
  searchPlaceholder,
  onReset,
  activeFiltersCount = 0,
  desktopFilters,
  mobileFilters,
  trailing,
}: Props) {
  return (
    <>
      {/* DESKTOP */}
      <div className="hidden flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 lg:flex lg:flex-row lg:items-center">
        <SearchInput
          value={search}
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
          className="flex-1"
        />

        {desktopFilters}

        {onReset && (
          <Button
            variant="outline"
            onClick={onReset}
            className="h-10 rounded-xl"
          >
            <RotateCcw className="mr-2 h-3.5 w-3.5" /> Réinitialiser
          </Button>
        )}

        {trailing}
      </div>

      {/* MOBILE */}
      <div className="flex gap-2 lg:hidden">
        <SearchInput
          value={search}
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
          className="flex-1"
        />

        {mobileFilters ? (
          <FiltersBottomSheet
            activeCount={activeFiltersCount}
            onReset={onReset}
          >
            {mobileFilters}
          </FiltersBottomSheet>
        ) : (
          onReset &&
          activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              onClick={onReset}
              className="h-11 w-11 shrink-0 rounded-xl"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          )
        )}
      </div>
    </>
  );
}