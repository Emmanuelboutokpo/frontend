"use client";

import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { StatsSkeleton } from "./StatsSkeleton";
import { useMounted } from "../../../../hook/admin/useMounted";

export interface StatCard {
  icon: LucideIcon;
  label: string;
  value: number | string;
  trend?: number;
  trendLabel?: string;
  color?: string;
  isCurrency?: boolean;
  suffix?: string;
}

interface Props {
  cards: StatCard[];
  columns?: 2 | 3 | 4 | 5 | 6;
  loading?: boolean;
}

const COL_CLASSES: Record<number, string> = {
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
  6: "lg:grid-cols-6",
};

export function StatsGrid({ cards, columns = 5, loading }: Props) {
  const mounted = useMounted();

  // ⚠️ Anti-hydration mismatch avec les stores Zustand persistés
  if (!mounted || loading) {
    return <StatsSkeleton count={cards.length} columns={columns} />;
  }

  return (
    <div className={`grid grid-cols-2 gap-4 ${COL_CLASSES[columns]}`}>
      {cards.map((c) => {
        const Icon = c.icon;
        const positive = (c.trend ?? 0) >= 0;
        const displayValue = c.isCurrency
          ? (c.value as number).toLocaleString("fr-FR")
          : c.value;

        return (
          <Card
            key={c.label}
            className="rounded-2xl p-4 transition hover:shadow-md"
          >
            <div className="flex gap-4">
            <div
              className={`grid h-10 w-10 place-items-center rounded-xl ${
                c.color ?? "bg-emerald-50 text-emerald-700"
              }`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div className="">
              <div className="text-lg font-bold text-slate-900">
                {displayValue}
              </div>
              <div className="mt-0.5 text-[11px] text-slate-500">
                {c.label}
              </div>
            {c.trend !== undefined && c.trend !== 0 && (
              <div className="flex flex-col">
                <span
                  className={
                    positive
                      ? "text-[13px] font-semibold text-emerald-600"
                      : " text-[13px] font-semibold text-rose-600"
                  }
                >
                  {positive ? (
                    <TrendingUp className="inline h-3 w-3" />
                  ) : (
                    <TrendingDown className="inline h-3 w-3" />
                  )}{" "}
                  {positive ? "+" : ""}
                  {c.trend}%
                </span>
                <span className="text-[10px] text-slate-400">
                  {c.trendLabel ?? "ce mois"}
                </span>
              </div>
            )}
            </div>

            </div>
          </Card>
        );
      })}
    </div>
  );
}