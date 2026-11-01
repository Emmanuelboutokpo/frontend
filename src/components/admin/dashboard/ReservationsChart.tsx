"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

import { DashboardSection } from "./DashboardSection";
import { analyticsNumber, analyticsString, type AnalyticsRecord } from "@/store/useAdminAnalyticsStore";

export function ReservationsChart({ rows, error }: { rows: AnalyticsRecord[]; error?: string }) {
  const data = rows.flatMap((row) => {
    const month = analyticsString(row, ["label", "month", "period", "date", "name"]);
    const value = analyticsNumber(row, ["value", "count", "reservations", "total", "booking_count"]);
    return month && value !== null ? [{ month, value }] : [];
  });

  return (
    <DashboardSection
      title="Évolution des réservations"
      action={{ label: "Données réelles" }}
    >
      {error ? (
        <p role="alert" className="rounded-lg bg-rose-50 p-3 text-xs text-rose-700">{error}</p>
      ) : data.length === 0 ? (
        <p className="flex h-64 items-center justify-center text-sm text-slate-400">Aucune donnée de réservation pour cette période.</p>
      ) : <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #e2e8f0",
                fontSize: 12,
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
              formatter={(value) => [`${value} réservations`, "Réservations"]}
            />
            <ReferenceLine x="Sep" stroke="#10b981" strokeDasharray="3 3" />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#047857"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "#047857", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6, fill: "#047857", strokeWidth: 3, stroke: "#fff" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>}
    </DashboardSection>
  );
}