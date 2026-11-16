"use client";

import { useEffect } from "react";
import { DesktopLayout } from "@/components/front-office/exporer/DesktopLayout";
import { MobileLayout } from "@/components/front-office/exporer/MobileLayout";
import { useMediaQuery } from "../../../../hook/useMediaQuery";
import { usePropertyStore } from "@/store";


export default function ExplorerPage() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const searchQuery = usePropertyStore((state) => state.searchQuery);
  const searchFilters = usePropertyStore((state) => state.searchFilters);
  const page = usePropertyStore((state) => state.page);
  const pageSize = usePropertyStore((state) => state.pageSize);
  const fetchEstablishmentPage = usePropertyStore((state) => state.fetchEstablishmentPage);

  useEffect(() => {
    void fetchEstablishmentPage(searchQuery, searchFilters, pageSize, (page - 1) * pageSize)
      .catch(() => undefined);
  }, [
    searchQuery,
    searchFilters,
    page,
    pageSize,
    fetchEstablishmentPage,
  ]);

  // Rendu conditionnel : on monte UNIQUEMENT le bon layout
  return isDesktop ? <DesktopLayout /> : <MobileLayout />;
}