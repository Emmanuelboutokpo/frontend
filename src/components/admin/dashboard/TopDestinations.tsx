"use client";

import { DashboardSection } from "./DashboardSection";
import { Progress } from "@/components/ui/progress";

const destinations = [
  { name: "Cotonou", value: 320 },
  { name: "Ouidah", value: 145 },
  { name: "Porto-Novo", value: 98 },
  { name: "Abomey-Calavi", value: 76 },
  { name: "Bohicon", value: 54 },
];

const max = Math.max(...destinations.map((d) => d.value));

export function TopDestinations() {
  return (
    <DashboardSection
      title="Top destinations"
      action={{ label: "Ce mois" }}
    >
      <div className="space-y-3">
        {destinations.map((d, i) => (
          <div key={d.name} className="flex items-center gap-3">
            <span className="w-4 text-xs font-bold text-slate-400">
              {i + 1}
            </span>
            <span className="w-24 truncate text-xs font-medium text-slate-700">
              {d.name}
            </span>
            <Progress
              value={(d.value / max) * 100}
              className="h-2 flex-1 [&>[data-slot=progress-indicator]]:bg-emerald-700"
            />
            <span className="w-10 text-right text-xs font-bold text-slate-700">
              {d.value}
            </span>
          </div>
        ))}
      </div>
    </DashboardSection>
  );
}