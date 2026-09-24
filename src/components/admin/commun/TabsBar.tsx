"use client";

export interface Tab {
  value: string;
  label: string;
  count?: number;
}

interface Props {
  tabs: Tab[];
  active: string;
  onChange: (value: string) => void;
  /** Masquer le compteur (utile pour des tabs simples) */
  hideCounts?: boolean;
  /** Alignement des tabs */
  align?: "start" | "center";
}

export function TabsBar({
  tabs,
  active,
  onChange,
  hideCounts = false,
  align = "start",
}: Props) {
  return (
    <div
      className={`flex items-center gap-1 overflow-x-auto border-b border-slate-200 scrollbar-hide ${
        align === "center" ? "justify-center" : ""
      }`}
    >
      {tabs.map((tab) => {
        const isActive = active === tab.value;
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={`shrink-0 border-b-2 px-4 py-3 text-sm font-semibold transition ${
              isActive
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
            {!hideCounts && tab.count !== undefined && (
              <span
                className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] ${
                  isActive
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}