"use client";

import { ArrowUpRight, LucideIcon } from "lucide-react";
import Link from "next/link";
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
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="h-28 animate-pulse rounded-2xl border border-slate-100 bg-white" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((c) => {
        const Icon = c.icon;
        const content = (
          <Card className="flex h-full flex-row items-center gap-4 rounded-2xl border-slate-200 p-4 shadow-sm transition group-hover:border-emerald-200 group-hover:shadow-md sm:p-5">
            <div
              className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${c.color ?? "bg-emerald-50 text-emerald-700"}`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-2xl font-semibold tracking-tight text-slate-900">{c.value}</div>
              <div className="mt-1 truncate text-sm font-medium text-slate-500">{c.label}</div>
            </div>
            {c.href && (
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-slate-300 transition group-hover:bg-emerald-50 group-hover:text-emerald-700">
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </span>
            )}
          </Card>
        );

        return c.href ? (
          <Link key={c.label} href={c.href} className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2">
            {content}
          </Link>
        ) : (
          <div key={c.label}>{content}</div>
        );
      })}
    </div>
  );
}