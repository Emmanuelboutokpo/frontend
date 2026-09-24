"use client";

import { ReactNode, useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// =====================================================================
// TYPES
// =====================================================================
export interface DetailTab {
  value: string;
  label: string;
  content: ReactNode;
  badge?: number;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  header: ReactNode;
  tabs: DetailTab[];
  defaultTab?: string;
  onEdit?: () => void;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
}

const SIZE_CLASSES: Record<string, string> = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-3xl",
  "2xl": "max-w-4xl",
};

// =====================================================================
// COMPOSANT
// =====================================================================
export function EntityDetailsModal({
  open,
  onOpenChange,
  header,
  tabs,
  defaultTab,
  onEdit,
  footer,
  size = "lg",
}: Props) {
  const [activeTab, setActiveTab] = useState(defaultTab ?? tabs[0]?.value);

  // Reset à l'ouverture
  useEffect(() => {
    if (open) {
      setActiveTab(defaultTab ?? tabs[0]?.value);
    }
  }, [open, defaultTab, tabs]);

  const currentTab = tabs.find((t) => t.value === activeTab);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`${SIZE_CLASSES[size]} max-h-[90vh] overflow-hidden rounded-2xl p-0`}
      >
        {/* ============ HEADER ============ */}
        <DialogHeader className="px-6 pb-4 pt-6">
          <DialogTitle className="sr-only">Détails</DialogTitle>
          <div className="flex items-start gap-4">
            <div className="min-w-0 flex-1">{header}</div>
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
                className="rounded-xl mt-3"
              >
                <Pencil className="mr-1.5 h-3.5 w-3.5" /> Modifier
              </Button>
            )}
          </div>
        </DialogHeader>

        {/* ============ TABS (BOUTONS) ============ */}
        <div className="border-b border-slate-200 px-6">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setActiveTab(tab.value)}
                  className={`shrink-0 border-b-2 px-3 py-2.5 text-xs font-semibold transition ${
                    isActive
                      ? "border-emerald-600 text-emerald-700"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {tab.label}
                  {tab.badge !== undefined && (
                    <span
                      className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] ${
                        isActive
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ============ CONTENU ============ */}
        <div className="max-h-[60vh] overflow-y-auto px-6 py-4 lr-scrollbar">
          {currentTab?.content}
        </div>

        {/* ============ FOOTER ============ */}
        {footer && (
          <div className="border-t bg-slate-50 px-6 py-4">{footer}</div>
        )}
      </DialogContent>
    </Dialog>
  );
}