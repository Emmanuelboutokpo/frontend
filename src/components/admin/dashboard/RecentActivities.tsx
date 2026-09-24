"use client";

import { UserPlus, CalendarCheck, AlertCircle, Star } from "lucide-react";
import { DashboardSection } from "./DashboardSection";

const activities = [
  { id: 1, icon: UserPlus, color: "text-emerald-700 bg-emerald-50", text: "Nouvel utilisateur inscrit", sub: "marie@gmail.com", time: "Il y a 12 min" },
  { id: 2, icon: CalendarCheck, color: "text-blue-700 bg-blue-50", text: "Nouvelle réservation", sub: "Villa Paradis", time: "Il y a 28 min" },
  { id: 3, icon: AlertCircle, color: "text-amber-700 bg-amber-50", text: "Établissement en attente de validation", sub: "Aqua Park", time: "Il y a 1 h" },
  { id: 4, icon: Star, color: "text-orange-700 bg-orange-50", text: "Avis publié", sub: "Le Goût Local (4.5 ★)", time: "Il y a 2 h" },
];

export function RecentActivities() {
  return (
    <DashboardSection
      title="Activités récentes"
      action={{ label: "Voir tout" }}
    >
      <div className="space-y-3">
        {activities.map((a) => {
          const Icon = a.icon;
          return (
            <div key={a.id} className="flex items-start gap-3">
              <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${a.color}`}>
                <Icon className="h-3.5 w-3.5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-slate-700">
                  {a.text}
                </p>
                <p className="truncate text-[11px] text-slate-500">{a.sub}</p>
              </div>
              <span className="shrink-0 text-[10px] text-slate-400">
                {a.time}
              </span>
            </div>
          );
        })}
      </div>
    </DashboardSection>
  );
}