"use client";

import { useMemo, useState } from "react";

interface Options<T, F> {
  data: T[];
  defaultPerPage?: number;
  initialFilters: F;
  filterFn?: (item: T, filters: F) => boolean;
}

export function useAdminTable<T, F extends Record<string, any>>({
  data,
  defaultPerPage = 8,
  initialFilters,
  filterFn,
}: Options<T, F>) {
  const [filters, setFiltersState] = useState<F>(initialFilters);
  const [page, setPage] = useState(1);
  const [perPage, setPerPageState] = useState(defaultPerPage);

  const setFilters = (patch: Partial<F>) => {
    setFiltersState((prev) => ({ ...prev, ...patch }));
    setPage(1);
  };

  const resetFilters = () => {
    setFiltersState(initialFilters);
    setPage(1);
  };

  const setPerPage = (n: number) => {
    setPerPageState(n);
    setPage(1);
  };

  const filtered = useMemo(
    () => (filterFn ? data.filter((item) => filterFn(item, filters)) : data),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, filters]
  );

  const paginated = useMemo(() => {
    const start = (page - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, page, perPage]);

  const activeFiltersCount = useMemo(() => {
    return Object.values(filters).filter(
      (v) => v !== "ALL" && v !== "" && v !== undefined && v !== null
    ).length;
  }, [filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));

  return {
    filters,
    page,
    perPage,
    filtered,
    paginated,
    activeFiltersCount,
    totalPages,
    setFilters,
    resetFilters,
    setPage,
    setPerPage,
  };
}