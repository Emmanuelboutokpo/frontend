"use client";

import { Check } from "lucide-react";
import { Label } from "@/components/ui/label";

export interface ChipOption {
  value: string;
  label: string;
}

interface Props {
  label: string;
  value: string;
  options: ChipOption[];
  onChange: (value: string) => void;
  columns?: 2 | 3;
}

export function FilterChips({
  label,
  value,
  options,
  onChange,
  columns = 2,
}: Props) {
  const gridClass = columns === 3 ? "grid-cols-3" : "grid-cols-2";

  return (
    <div>
      <Label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
        {label}
      </Label>
      <div className={`grid ${gridClass} gap-2`}>
        {options.map((o) => {
          const active = value === o.value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => onChange(o.value)}
              className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                  : "border-slate-200 hover:bg-slate-50"
              }`}
            >
              {active && <Check className="h-3.5 w-3.5" />}
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}