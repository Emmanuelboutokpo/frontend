"use client";

import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Props {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: Props) {
  return (
    <Card className="rounded-2xl border-dashed p-12 text-center">
      <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-slate-100">
        <Icon className="h-7 w-7 text-slate-400" />
      </div>
      <h3 className="text-sm font-semibold">{title}</h3>
      {description && (
        <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500">
          {description}
        </p>
      )}
      {action && (
        <Button
          asChild={Boolean(action.href)}
          onClick={action.onClick}
          className="mt-4 rounded-full bg-emerald-700 hover:bg-emerald-800"
        >
          {action.href ? (
            <Link href={action.href}>{action.label}</Link>
          ) : (
            action.label
          )}
        </Button>
      )}
    </Card>
  );
}