"use client";

import { DesktopLayout } from "@/components/front-office/exporer/DesktopLayout";
 import { MobileLayout } from "@/components/front-office/exporer/MobileLayout";
import { useMediaQuery } from "../../../../hook/useMediaQuery";


export default function ExplorerPage() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  // Rendu conditionnel : on monte UNIQUEMENT le bon layout
  return isDesktop ? <DesktopLayout /> : <MobileLayout />;
}