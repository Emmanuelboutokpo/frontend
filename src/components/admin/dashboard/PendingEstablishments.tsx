"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Check, Loader2 } from "lucide-react";
import { DashboardSection } from "./DashboardSection";
import { Button } from "@/components/ui/button";
import { useAdminEstablishmentsStore } from "@/store/useAdminEstablishmentsStore";

export function PendingEstablishments() {
  const establishments = useAdminEstablishmentsStore((state) => state.establishments);
  const loading = useAdminEstablishmentsStore((state) => state.isLoading);
  const error = useAdminEstablishmentsStore((state) => state.error);
  const pending = establishments.slice(0, 4);

  useEffect(() => {
    const api = useAdminEstablishmentsStore.getState();
    api.setStatusFilter("EN_ATTENTE");
    api.setCategoryFilter("ALL");
    api.setSearch("");
    api.setPage(1);
    api.loadEstablishments().catch(() => undefined);
  }, []);

  const approve = async (id: string) => {
    await useAdminEstablishmentsStore.getState().changeStatus(id, "PUBLIE");
  };

  return (
    <DashboardSection
      title="Établissements à valider"
      action={{ label: "Voir tout", href: "/admin/validations" }}
    >
      {error && <p role="alert" className="mb-3 text-xs text-rose-700">{error}</p>}
      {loading ? <div className="flex items-center justify-center py-8 text-slate-500"><Loader2 className="h-4 w-4 animate-spin" /></div> : (
        <div className="space-y-3">
          {pending.map((item) => (
            <div key={item.id} className="flex items-center gap-3 rounded-xl border border-slate-100 p-2 transition hover:bg-slate-50">
              {item.images[0]
                ? <img src={item.images[0]} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" />
                : <div className="h-12 w-12 shrink-0 rounded-lg bg-slate-100" />}
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-slate-800">{item.name}</div>
                <div className="truncate text-[11px] text-slate-500">{item.location.city || item.address}</div>
                <div className="text-[10px] text-slate-400">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}</div>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button asChild size="sm" variant="outline" className="h-7 rounded-md px-2 text-[10px]">
                  <Link href="/admin/etablissements">Voir</Link>
                </Button>
                <Button size="sm" className="h-7 rounded-md bg-emerald-700 px-2 text-[10px] hover:bg-emerald-800" onClick={() => void approve(item.id)}>
                  <Check className="mr-1 h-3 w-3" />Publier
                </Button>
              </div>
            </div>
          ))}
          {!pending.length && !error && <p className="py-5 text-center text-xs text-slate-500">Aucune validation en attente.</p>}
        </div>
      )}
    </DashboardSection>
  );
}
