"use client";

import { Pencil, ExternalLink, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettingsStore } from "@/store/useSettingsStore";
import { SERVICE_STATUS_STYLES } from "@/utils/settings.helpers";
import { ClientOnlyDate } from "@/components/ui/clientonlydate";

export function PlatformInfoCard({ onEdit }: { onEdit: () => void }) {
  const general = useSettingsStore((s) => s.general);
  const services = useSettingsStore((s) => s.services);
  const lastMaintenance = useSettingsStore((s) => s.lastMaintenance);

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {/* ---------- INFOS ---------- */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Informations de la plateforme
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="rounded-lg"
          >
            <Pencil className="mr-1.5 h-3.5 w-3.5" /> Modifier
          </Button>
        </div>

        <dl className="space-y-3 text-sm">
          <Row label="Nom de la plateforme" value={general.platformName} />
          <Row label="Description" value={general.description} />
          <Row
            label="URL du site"
            value={general.siteUrl}
            valueClass="text-emerald-700 underline"
            href={general.siteUrl}
          />
          <Row
            label="Email de contact"
            value={general.contactEmail}
            valueClass="text-emerald-700 underline"
            href={`mailto:${general.contactEmail}`}
          />
          <Row label="Téléphone" value={general.phone} />
          <Row label="Adresse" value={general.address} />
        </dl>
      </div>

      {/* ---------- APERÇU ---------- */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Aperçu de la plateforme</h3>
          <Button asChild variant="outline" size="sm" className="rounded-lg">
            <a href={general.siteUrl} target="_blank" rel="noreferrer">
              Voir le site <ExternalLink className="ml-1.5 h-3 w-3" />
            </a>
          </Button>
        </div>

        {/* Mockup navigateur */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          {/* Barre navigateur */}
          <div className="flex items-center gap-2 border-b bg-slate-50 px-3 py-2">
            <div className="flex gap-1">
              <div className="h-2 w-2 rounded-full bg-rose-400" />
              <div className="h-2 w-2 rounded-full bg-amber-400" />
              <div className="h-2 w-2 rounded-full bg-emerald-400" />
            </div>
            <div className="flex-1 truncate text-[10px] text-slate-500">{general.siteUrl}</div>
          </div>
          {/* Header mockup */}
          <div className="flex items-center justify-between border-b px-3 py-2">
            <div className="flex items-center gap-2">
              <div className="grid h-6 w-6 place-items-center rounded-md bg-emerald-700 text-[10px] font-bold text-white">B</div>
              <span className="text-xs font-bold">{general.platformName}</span>
            </div>
            <div className="flex gap-2 text-[10px] text-slate-500">
              <span>Hébergements</span>
              <span>Restaurants</span>
              <span>Loisirs</span>
            </div>
          </div>
          {/* Hero */}
          <div
            className="relative h-32 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600')",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/20" />
            <div className="relative flex h-full flex-col justify-center px-4 text-white">
              <p className="text-[10px] uppercase tracking-widest text-white/80">
                {general.platformName}
              </p>
              <p className="mt-1 text-sm font-bold leading-tight">
                Découvrez les meilleurs lieux où que vous alliez
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- STATUT DES SERVICES ---------- */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="mb-4 text-sm font-bold text-slate-900">Statut des services</h3>

        <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Tous les services sont opérationnels
          </p>
        </div>

        <ul className="space-y-2.5">
          {services.map((s) => {
            const style = SERVICE_STATUS_STYLES[s.status];
            return (
              <li key={s.id} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-600">
                  <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                  {s.label}
                </span>
                <span className={`font-semibold ${style.className}`}>
                  {style.label}
                </span>
              </li>
            );
          })}
        </ul>

        {/* Dernière maintenance */}
        <div className="mt-5 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-500" />
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-500">
                Dernière maintenance
              </p>
              <p className="text-[11px] text-slate-600">
                <ClientOnlyDate date={lastMaintenance} /> à 02:00
              </p>
              <p className="text-[10px] text-slate-400">Mise à jour du système</p>
            </div>
          </div>
          <button className="text-[11px] font-semibold text-emerald-700 hover:underline">
            Voir les logs
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  href,
  valueClass = "",
}: {
  label: string;
  value: string;
  href?: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3 last:border-0">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className={`text-xs font-semibold text-slate-800 ${valueClass}`}>
        {href ? (
          <a href={href} target="_blank" rel="noreferrer">
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}