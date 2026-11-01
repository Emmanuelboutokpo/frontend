"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DashboardSection } from "./DashboardSection";
import { analyticsNumber, analyticsString, type AnalyticsRecord } from "@/store/useAdminAnalyticsStore";

export function RevenueChart({ rows, error }: { rows: AnalyticsRecord[]; error?: string }) {
  const data = rows.flatMap((row) => {
    const period = analyticsString(row, ["label", "month", "period", "date", "name"]);
    const amount = analyticsNumber(row, ["value", "revenue", "amount", "total", "gross_revenue"]);
    return period && amount !== null ? [{ period, amount }] : [];
  });

  return (
    <DashboardSection title="Évolution des revenus" action={{ label: "XOF" }}>
      {error ? (
        <p role="alert" className="rounded-lg bg-rose-50 p-3 text-xs text-rose-700">{error}</p>
      ) : data.length === 0 ? (
        <p className="flex h-64 items-center justify-center text-sm text-slate-400">Aucune donnée de revenu pour cette période.</p>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} formatter={(value) => [`${Number(value).toLocaleString("fr-FR")} XOF`, "Revenus"]} />
              <Line type="monotone" dataKey="amount" stroke="#7c3aed" strokeWidth={2.5} dot={{ r: 3, fill: "#7c3aed", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6, fill: "#7c3aed", strokeWidth: 3, stroke: "#fff" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </DashboardSection>
  );
}
