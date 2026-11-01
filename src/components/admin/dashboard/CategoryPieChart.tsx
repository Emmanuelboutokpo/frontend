"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { analyticsNumber, analyticsString, type AnalyticsRecord } from "@/store/useAdminAnalyticsStore";

const COLORS = ["#047857", "#f59e0b", "#3b82f6", "#8b5cf6", "#94a3b8"];

export function CategoryPieChart({ rows, error }: { rows: AnalyticsRecord[]; error?: string }) {
  const data = rows.flatMap((row, index) => {
    const name = analyticsString(row, ["name", "category", "label", "category_name"]);
    const value = analyticsNumber(row, ["value", "count", "total", "reservations", "establishments"]);
    return name && value !== null ? [{ name, value, color: COLORS[index % COLORS.length] }] : [];
  });
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="mb-5 text-sm font-bold text-slate-900">
        Répartition par catégorie
      </h3>

      {error ? (
        <p role="alert" className="rounded-lg bg-rose-50 p-3 text-xs text-rose-700">{error}</p>
      ) : data.length === 0 ? (
        <p className="flex h-40 items-center justify-center text-sm text-slate-400">Aucune répartition disponible.</p>
      ) : <div className="grid grid-cols-2 items-center gap-4">
        {/* Donut */}
        <div className="relative h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #e2e8f0",
                  fontSize: 12,
                }}
                formatter={(value, name) => [`${value} établissements`, name]}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Centre */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-slate-900">{total}</span>
            <span className="text-[10px] text-slate-500">établissements</span>
          </div>
        </div>

        {/* Légende */}
        <div className="space-y-2">
          {data.map((item) => {
            const percent = Math.round((item.value / total) * 100);
            return (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: item.color }}
                />
                <span className="flex-1 truncate text-slate-600">
                  {item.name}
                </span>
                <span className="font-semibold text-slate-900">{percent}%</span>
              </div>
            );
          })}
        </div>
      </div>}
    </div>
  );
}