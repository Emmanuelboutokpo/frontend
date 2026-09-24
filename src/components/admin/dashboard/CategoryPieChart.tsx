"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Hébergements", value: 62, color: "#047857" },
  { name: "Restaurants", value: 47, color: "#f59e0b" },
  { name: "Loisirs", value: 31, color: "#3b82f6" },
  { name: "Autres", value: 16, color: "#94a3b8" },
];

const total = data.reduce((sum, d) => sum + d.value, 0);

export function CategoryPieChart() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="mb-5 text-sm font-bold text-slate-900">
        Répartition par catégorie
      </h3>

      <div className="grid grid-cols-2 items-center gap-4">
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
      </div>
    </div>
  );
}