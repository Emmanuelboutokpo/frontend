"use client";

import { DashboardSection } from "./DashboardSection";
import { Progress } from "@/components/ui/progress";
import { analyticsNumber, analyticsString, type AnalyticsRecord } from "@/store/useAdminAnalyticsStore";

export function TopEstablishments({
  rows,
  error,
  href = "/admin/etablissements",
}: {
  rows: AnalyticsRecord[];
  error?: string;
  href?: string;
}) {
  const establishments = rows.flatMap((row) => {
    const name = analyticsString(row, ["name", "establishment_name", "title"]);
    const value = analyticsNumber(row, ["reservations", "reservation_count", "bookings", "count", "value", "total"]);
    return name && value !== null ? [{ name, value }] : [];
  }).slice(0, 4);
  const max = Math.max(...establishments.map((entry) => entry.value), 0);

  return (
    <DashboardSection title="Établissements les plus réservés" action={{ label: "Voir tout", href }}>
      {error ? (
        <p role="alert" className="rounded-lg bg-rose-50 p-3 text-xs text-rose-700">{error}</p>
      ) : establishments.length === 0 ? (
        <p className="py-5 text-center text-xs text-slate-400">Aucune donnée disponible.</p>
      ) : (
        <div className="space-y-3">
          {establishments.map((establishment, index) => (
            <div key={`${establishment.name}-${index}`} className="flex items-center gap-3">
              <span className="w-4 text-xs font-bold text-slate-400">{index + 1}</span>
              <span className="w-28 truncate text-xs font-medium text-slate-700" title={establishment.name}>{establishment.name}</span>
              <Progress value={max > 0 ? establishment.value / max * 100 : 0} className="h-2 flex-1 [&>[data-slot=progress-indicator]]:bg-emerald-700" />
              <span className="w-10 text-right text-xs font-bold text-slate-700">{establishment.value}</span>
            </div>
          ))}
        </div>
      )}
    </DashboardSection>
  );
}
