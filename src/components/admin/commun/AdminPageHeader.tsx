"use client";

import Link from "next/link";
import { ChevronRight, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Action {
  label: string;
  icon?: LucideIcon;
  onClick?: () => void;
  href?: string;
  variant?: "default" | "outline";
}

interface Props {
  breadcrumbs: { label: string; href?: string }[];
  title: string;
  description?: string;
  actions?: Action[];
}

export function AdminPageHeader({
  breadcrumbs,
  title,
  description,
  actions = [],
}: Props) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <nav className="flex items-center gap-1 text-xs text-slate-500">
          {breadcrumbs.map((b, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="h-3 w-3" />}
              {b.href ? (
                <Link href={b.href} className="hover:text-emerald-700">
                  {b.label}
                </Link>
              ) : (
                <span className="font-semibold text-slate-700">{b.label}</span>
              )}
            </span>
          ))}
        </nav>
        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        )}
      </div>

      {actions.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {actions.map((a, i) => {
            const Icon = a.icon;
            const isOutline = a.variant === "outline";
            const className = isOutline
              ? "rounded-xl"
              : "rounded-xl bg-emerald-700 hover:bg-emerald-800";

            if (a.href) {
              return (
                <Button key={i} asChild variant={isOutline ? "outline" : "default"} className={className}>
                  <Link href={a.href}>
                    {Icon && <Icon className="mr-2 h-4 w-4" />}
                    {a.label}
                  </Link>
                </Button>
              );
            }

            return (
              <Button
                key={i}
                variant={isOutline ? "outline" : "default"}
                onClick={a.onClick}
                className={className}
              >
                {Icon && <Icon className="mr-2 h-4 w-4" />}
                {a.label}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}