"use client";

import { DashboardSection } from "./DashboardSection";
import { Progress } from "@/components/ui/progress";
import { analyticsNumber, analyticsString, type AnalyticsRecord } from "@/store/useAdminAnalyticsStore";

export function TopDestinations({ rows, error }: { rows: AnalyticsRecord[]; error?: string }) {
  const destinations = rows.flatMap((row) => {
    const name = analyticsString(row, ["name", "destination", "location", "location_name"]);
    const value = analyticsNumber(row, ["count", "reservations", "reservation_count", "value", "total"]);
    return name && value !== null ? [{ name, value }] : [];
  }).slice(0, 4);
  const max = Math.max(...destinations.map((destination) => destination.value), 0);

  return (
    <DashboardSection title="Destinations les plus réservées">
      {error ? <p role="alert" className="rounded-lg bg-rose-50 p-3 text-xs text-rose-700">{error}</p> : destinations.length === 0 ? <p className="py-5 text-center text-xs text-slate-400">Aucune destination disponible.</p> : <div className="space-y-3">
        {destinations.map((d, i) => (
          <div key={d.name} className="flex items-center gap-3">
            <span className="w-4 text-xs font-bold text-slate-400">
              {i + 1}
            </span>
            <span className="w-24 truncate text-xs font-medium text-slate-700">
              {d.name}
            </span>
            <Progress
              value={max > 0 ? (d.value / max) * 100 : 0}
              className="h-2 flex-1 [&>[data-slot=progress-indicator]]:bg-emerald-700"
            />
            <span className="w-10 text-right text-xs font-bold text-slate-700">
              {d.value}
            </span>
          </div>
        ))}
      </div>}
    </DashboardSection>
  );
}