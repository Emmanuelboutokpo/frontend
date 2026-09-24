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

const data = [
  { month: "Jan", value: 120 },
  { month: "Fév", value: 180 },
  { month: "Mar", value: 150 },
  { month: "Avr", value: 220 },
  { month: "Mai", value: 280 },
  { month: "Juin", value: 240 },
  { month: "Juil", value: 320 },
  { month: "Août", value: 380 },
  { month: "Sep", value: 356 },
  { month: "Oct", value: 400 },
  { month: "Nov", value: 420 },
  { month: "Déc", value: 480 },
];

export function ReservationsChart() {
  return (
    <DashboardSection
      title="Évolution des réservations"
      action={{ label: "12 derniers mois" }}
    >
      <div className="h-64">
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
      </div>
    </DashboardSection>
  );
}