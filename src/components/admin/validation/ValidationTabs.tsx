"use client";

import { useValidationsStore } from "@/store/useValidationsStore";
import type { ValidationStatus } from "@/types/validation";

interface Props {
  active: ValidationStatus | "ALL";
  onChange: (v: ValidationStatus | "ALL") => void;
}

export function ValidationTabs({ active, onChange }: Props) {
  const validations = useValidationsStore((s) => s.validations);

  const counts = {
    EN_ATTENTE: validations.filter((v) => v.status === "EN_ATTENTE").length,
    EN_REVISION: validations.filter((v) => v.status === "EN_REVISION").length,
    VALIDE: validations.filter((v) => v.status === "VALIDE").length,
    REJETE: validations.filter((v) => v.status === "REJETE").length,
    ALL: validations.length,
  };

  const tabs: { value: ValidationStatus | "ALL"; label: string; count: number }[] = [
    { value: "EN_ATTENTE", label: "En attente", count: counts.EN_ATTENTE },
    { value: "EN_REVISION", label: "En révision", count: counts.EN_REVISION },
    { value: "VALIDE", label: "Validés", count: counts.VALIDE },
    { value: "REJETE", label: "Rejetés", count: counts.REJETE },
    { value: "ALL", label: "Tous", count: counts.ALL },
  ];

  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-200">
      <div className="flex flex-1 gap-1 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => {
          const isActive = active === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => onChange(tab.value)}
              className={`shrink-0 border-b-2 px-4 py-3 text-sm font-semibold transition ${
                isActive
                  ? "border-emerald-600 text-emerald-700"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
              <span
                className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] ${
                  isActive
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}