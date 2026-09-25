"use client";

import Link from "next/link";
import { ArrowRight, LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ReactNode } from "react";

interface Props {
  title: string;
  action?: { label: string; href?: string; onClick?: () => void };
  children: ReactNode;
  className?: string;
  icon?: LucideIcon;
}

export function UserSection({ title, action, children, className, icon: Icon }: Props) {
  return (
    <Card className={`rounded-2xl p-5 ${className ?? ""}`}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {Icon && (
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 text-emerald-700">
              <Icon className="h-4 w-4" />
            </div>
          )}
          <h3 className="text-base font-bold text-slate-900">{title}</h3>
        </div>
        {action &&
          (action.href ? (
            <Link
              href={action.href}
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:underline"
            >
              {action.label} <ArrowRight className="h-3 w-3" />
            </Link>
          ) : (
            <button
              onClick={action.onClick}
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:underline"
            >
              {action.label} <ArrowRight className="h-3 w-3" />
            </button>
          ))}
      </div>
      {children}
    </Card>
  );
}