"use client";

import { UserPlus, CalendarCheck, AlertCircle, Star } from "lucide-react";
import { DashboardSection } from "./DashboardSection";
import { analyticsString, type AnalyticsRecord } from "@/store/useAdminAnalyticsStore";

export function RecentActivities({ rows, error }: { rows: AnalyticsRecord[]; error?: string }) {
  const activities = rows.flatMap((row, index) => {
    const text = analyticsString(row, ["description", "action", "title", "activity"]);
    const date = analyticsString(row, ["created_at", "createdAt", "date", "timestamp"]);
    if (!text) return [];
    const entity = analyticsString(row, ["entity_type", "entityType", "entity_name", "name"]);
    const action = `${analyticsString(row, ["action"]) ?? ""} ${text}`.toLowerCase();
    const Icon = action.includes("reservation") ? CalendarCheck : action.includes("establishment") ? AlertCircle : action.includes("user") ? UserPlus : Star;
    const time = date && !Number.isNaN(new Date(date).getTime())
      ? new Date(date).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })
      : "";
    return [{ id: analyticsString(row, ["id"]) ?? `${date ?? "activity"}-${index}`, Icon, text, entity, time }];
  }).slice(0, 4);

  return (
    <DashboardSection title="Activités récentes">
      {error ? <p role="alert" className="rounded-lg bg-rose-50 p-3 text-xs text-rose-700">{error}</p> : activities.length === 0 ? <p className="py-5 text-center text-xs text-slate-400">Aucune activité récente.</p> : <div className="space-y-3">
        {activities.map((a) => {
          const Icon = a.Icon;
          return (
            <div key={a.id} className="flex items-start gap-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-700">
                <Icon className="h-3.5 w-3.5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-slate-700">
                  {a.text}
                </p>
                {a.entity && <p className="truncate text-[11px] text-slate-500">{a.entity}</p>}
              </div>
              <span className="shrink-0 text-[10px] text-slate-400">{a.time}</span>
            </div>
          );
        })}
      </div>}
    </DashboardSection>
  );
}