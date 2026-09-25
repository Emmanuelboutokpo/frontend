"use client";

import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useMounted } from "../../../../hook/use-mounted";

export interface UserStatCard {
  icon: LucideIcon;
  label: string;
  value: number | string;
  href?: string;
  color?: string;
}

interface Props {
  cards: UserStatCard[];
}

export function UserStatsGrid({ cards }: Props) {
  const mounted = useMounted();

  if (!mounted) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl bg-slate-100" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((c) => {
        const Icon = c.icon;
        const CardComp: any = c.href ? "a" : "div";
        const props = c.href ? { href: c.href } : {};

        return (
          <CardComp
            key={c.label}
            {...props}
            className="flex items-center gap-4 rounded-2xl p-5 transition hover:shadow-md"
          >
            <div
              className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${c.color ?? "bg-emerald-50 text-emerald-700"}`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xl font-bold text-slate-900">{c.value}</div>
              <div className="truncate text-xs text-slate-500">{c.label}</div>
            </div>
          </CardComp>
        );
      })}
    </div>
  );
}