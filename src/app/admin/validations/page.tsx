"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAdminEstablishmentsStore } from "@/store/useAdminEstablishmentsStore";

export default function AdminValidationsPage() {
  const establishments = useAdminEstablishmentsStore((state) => state.establishments);
  const total = useAdminEstablishmentsStore((state) => state.total);
  const isLoading = useAdminEstablishmentsStore((state) => state.isLoading);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const api = useAdminEstablishmentsStore.getState();
    api.setStatusFilter("EN_ATTENTE");
    api.setCategoryFilter("ALL");
    api.setSearch("");
    api.setPage(1);
    api.loadEstablishments().catch((loadError: unknown) => setError(loadError instanceof Error ? loadError.message : "Le chargement a échoué."));
  }, []);

  const decide = async (id: string, status: "PUBLIE" | "REJETE") => {
    setError(null);
    try {
      await useAdminEstablishmentsStore.getState().changeStatus(id, status);
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "La décision n’a pas pu être enregistrée.");
    }
  };

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Validations des établissements</h1>
        <p className="mt-1 text-sm text-slate-500">Les décisions sont synchronisées avec le statut de l’établissement dans la base.</p>
      </header>
      {error && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
      {isLoading ? <div className="flex items-center justify-center gap-2 rounded-2xl border bg-white p-12 text-slate-500"><Loader2 className="h-5 w-5 animate-spin" />Chargement…</div> : (
        <div className="overflow-x-auto rounded-2xl border bg-white">
          <div className="border-b p-4 text-sm text-slate-500">{total} établissement(s) en attente</div>
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="p-4">Établissement</th><th className="p-4">Catégorie</th><th className="p-4">Adresse</th><th className="p-4">Date de création</th><th className="p-4">Décision</th></tr></thead>
            <tbody className="divide-y">
              {establishments.map((establishment) => <tr key={establishment.id}>
                <td className="p-4"><span className="block font-semibold">{establishment.name}</span><span className="text-xs text-slate-500">{establishment.slug}</span></td>
                <td className="p-4">{establishment.category}</td>
                <td className="p-4">{establishment.address}</td>
                <td className="p-4">{establishment.createdAt ? new Date(establishment.createdAt).toLocaleDateString() : "—"}</td>
                <td className="p-4"><Badge variant="outline">En attente</Badge><div className="mt-2 flex gap-1">
                  <Button size="sm" className="bg-emerald-700" onClick={() => void decide(establishment.id, "PUBLIE")}><Check className="mr-1 h-4 w-4" />Publier</Button>
                  <Button size="sm" variant="outline" className="text-rose-700" onClick={() => void decide(establishment.id, "REJETE")}><X className="mr-1 h-4 w-4" />Rejeter</Button>
                </div></td>
              </tr>)}
              {!establishments.length && <tr><td colSpan={5} className="p-12 text-center text-slate-500">Aucune validation en attente.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
