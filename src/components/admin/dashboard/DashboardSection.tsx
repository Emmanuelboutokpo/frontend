"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Props {
  title: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  children: ReactNode;
  className?: string;
}

export function DashboardSection({
  title,
  action,
  children,
  className,
}: Props) {
  return (
    <Card className={`rounded-2xl p-5 ${className ?? ""}`}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
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