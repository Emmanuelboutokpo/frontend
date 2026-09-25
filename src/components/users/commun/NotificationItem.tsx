"use client";

import { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  iconColor: string;   // "bg-emerald-50 text-emerald-700"
  title: string;
  description: string;
  time: string;
  unread?: boolean;
}

export function NotificationItem({
  icon: Icon, iconColor, title, description, time, unread,
}: Props) {
  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border p-4 transition ${
        unread ? "border-emerald-200 bg-emerald-50/30" : "border-slate-200 bg-white"
      }`}
    >
      <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${iconColor}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold text-slate-800">{title}</p>
          {unread && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />}
        </div>
        <p className="mt-1 text-xs text-slate-500">{description}</p>
        <p className="mt-1.5 text-[10px] text-slate-400">{time}</p>
      </div>
    </div>
  );
}