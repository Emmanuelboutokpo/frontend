"use client";

import {
  Settings, ShieldCheck, CreditCard, Bell, Palette, Server, ChevronRight,
} from "lucide-react";

export type SettingsSection =
  | "general"
  | "security"
  | "payments"
  | "notifications"
  | "customization"
  | "system";

const CARDS: {
  id: SettingsSection;
  icon: any;
  title: string;
  subtitle: string;
  color: string;
}[] = [
  { id: "general",       icon: Settings,    title: "Informations générales", subtitle: "Configuration principale", color: "bg-blue-50 text-blue-700" },
  { id: "security",      icon: ShieldCheck, title: "Sécurité",                subtitle: "Sécurisez votre compte",   color: "bg-emerald-50 text-emerald-700" },
  { id: "payments",      icon: CreditCard,  title: "Paiements",               subtitle: "Méthodes et commissions",  color: "bg-indigo-50 text-indigo-700" },
  { id: "notifications", icon: Bell,        title: "Notifications",           subtitle: "Emails et alertes",        color: "bg-rose-50 text-rose-700" },
  { id: "customization", icon: Palette,     title: "Personnalisation",        subtitle: "Logo, couleurs, apparence", color: "bg-violet-50 text-violet-700" },
  { id: "system",        icon: Server,      title: "Système",                 subtitle: "Maintenance et logs",      color: "bg-cyan-50 text-cyan-700" },
];

interface Props {
  onSelect: (section: SettingsSection) => void;
}

export function SettingsMenuCards({ onSelect }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
      {CARDS.map((c) => {
        const Icon = c.icon;
        return (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className="group flex flex-col items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
          >
            <div className={`grid h-10 w-10 place-items-center rounded-xl ${c.color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex w-full items-start justify-between gap-1">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-800">{c.title}</p>
                <p className="mt-0.5 line-clamp-1 text-[11px] text-slate-500">{c.subtitle}</p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-emerald-600" />
            </div>
          </button>
        );
      })}
    </div>
  );
}