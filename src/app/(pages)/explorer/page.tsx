"use client";

import { useEffect, useRef } from "react";
import { DesktopLayout } from "@/components/front-office/exporer/DesktopLayout";
import { MobileLayout } from "@/components/front-office/exporer/MobileLayout";
import { useMediaQuery } from "../../../../hook/useMediaQuery";
import { usePropertyStore } from "@/store";


export default function ExplorerPage() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const establishmentsLoaded = usePropertyStore((state) => state.establishmentsLoaded);
  const establishmentsLoading = usePropertyStore((state) => state.establishmentsLoading);
  const fetchEstablishments = usePropertyStore((state) => state.fetchEstablishments);
  const requestStarted = useRef(false);

  useEffect(() => {
    if (!establishmentsLoaded && !establishmentsLoading && !requestStarted.current) {
      requestStarted.current = true;
      void fetchEstablishments().catch(() => undefined);
    }
  }, [establishmentsLoaded, establishmentsLoading, fetchEstablishments]);

  // Rendu conditionnel : on monte UNIQUEMENT le bon layout
  return isDesktop ? <DesktopLayout /> : <MobileLayout />;
}