"use client";

import { Hourglass, CheckCircle2, XCircle, FileEdit, FileCheck } from "lucide-react";
import { useValidationsStore } from "@/store/useValidationsStore";
import { useMounted } from "../../../../hook/use-mounted";
 
export function ValidationStats() {
  const mounted = useMounted();
  const getStats = useValidationsStore((s) => s.getStats);

  // ⚠️ SSR : skeleton stable (évite le mismatch)
  if (!mounted) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-100" />
            <div className="mt-3 space-y-2">
              <div className="h-6 w-12 animate-pulse rounded bg-slate-100" />
              <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const stats = getStats();

  const cards = [
    { icon: Hourglass, label: "En attente", value: stats.enAttente, sub: "— 3 cette semaine", color: "bg-amber-50 text-amber-700" },
    { icon: CheckCircle2, label: "Validés", value: stats.valides, sub: "+12% ce mois", positive: true, color: "bg-emerald-50 text-emerald-700" },
    { icon: XCircle, label: "Rejetés", value: stats.rejetes, sub: "+2% ce mois", positive: false, color: "bg-rose-50 text-rose-700" },
    { icon: FileEdit, label: "En révision", value: stats.enRevision, sub: "0% ce mois", color: "bg-blue-50 text-blue-700" },
    { icon: FileCheck, label: "Total soumis", value: stats.total, sub: "+15% ce mois", positive: true, color: "bg-violet-50 text-violet-700" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div key={c.label} className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:shadow-md">
            <div className={`grid h-10 w-10 place-items-center rounded-xl ${c.color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="mt-3">
              <div className="text-xl font-bold text-slate-900">{c.value}</div>
              <div className="mt-0.5 text-xs text-slate-500">{c.label}</div>
            </div>
            {c.sub && (
              <div className="mt-2 flex items-center gap-1 text-[11px]">
                <span className={c.positive === true ? "text-emerald-600 font-semibold" : c.positive === false ? "text-rose-600 font-semibold" : "text-slate-400"}>
                  {c.sub}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}