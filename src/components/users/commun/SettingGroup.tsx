"use client";

import Link from "next/link";
import { ChevronRight, LucideIcon } from "lucide-react";

// ---------- SettingRow ----------
interface SettingRowProps {
  icon: LucideIcon;
  iconBg?: string;
  title: string;
  description?: string;
  href?: string;
  onClick?: () => void;
  variant?: "default" | "danger";
}

export function SettingRow({
  icon: Icon,
  iconBg = "bg-emerald-50 text-emerald-700",
  title,
  description,
  href,
  onClick,
  variant = "default",
}: SettingRowProps) {
  const isDanger = variant === "danger";

  const content = (
    <div
      className={`flex items-center gap-3 border-b border-slate-100 px-4 py-3.5 transition last:border-0 ${
        isDanger ? "hover:bg-rose-50" : "hover:bg-slate-50"
      }`}
    >
      <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${isDanger ? "bg-rose-50 text-rose-600" : iconBg}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-semibold ${isDanger ? "text-rose-700" : "text-slate-800"}`}>
          {title}
        </p>
        {description && (
          <p className="truncate text-xs text-slate-500">{description}</p>
        )}
      </div>
      <ChevronRight className={`h-4 w-4 shrink-0 ${isDanger ? "text-rose-400" : "text-slate-400"}`} />
    </div>
  );

  if (href) return <Link href={href}>{content}</Link>;
  return <button onClick={onClick} className="w-full text-left">{content}</button>;
}

// ---------- SettingGroup ----------
interface SettingGroupProps {
  title?: string;
  children: React.ReactNode;
}

export function SettingGroup({ title, children }: SettingGroupProps) {
  return (
    <div>
      {title && (
        <h3 className="mb-2 px-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
          {title}
        </h3>
      )}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {children}
      </div>
    </div>
  );
}