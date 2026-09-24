"use client";

import { useEffect, useState } from "react";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useSettingsStore } from "@/store/useSettingsStore";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

export function GeneralSettingsModal({ open, onOpenChange }: Props) {
  const general = useSettingsStore((s) => s.general);
  const updateGeneral = useSettingsStore((s) => s.updateGeneral);

  const [form, setForm] = useState(general);

  useEffect(() => {
    if (open) setForm(general);
  }, [open, general]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateGeneral(form);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle>Informations générales</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-semibold">
            Nom de la plateforme <span className="text-rose-500">*</span>
            <input
              value={form.platformName}
              onChange={(e) => setForm({ ...form, platformName: e.target.value })}
              className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 font-normal outline-none focus:border-emerald-500"
              required
            />
          </label>

          <label className="block text-sm font-semibold">
            Description <span className="text-rose-500">*</span>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2 font-normal outline-none focus:border-emerald-500"
              required
            />
          </label>

          <label className="block text-sm font-semibold">
            URL du site
            <input
              type="url"
              value={form.siteUrl}
              onChange={(e) => setForm({ ...form, siteUrl: e.target.value })}
              className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 font-normal outline-none focus:border-emerald-500"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm font-semibold">
              Email de contact <span className="text-rose-500">*</span>
              <input
                type="email"
                value={form.contactEmail}
                onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 font-normal outline-none focus:border-emerald-500"
                required
              />
            </label>
            <label className="block text-sm font-semibold">
              Téléphone
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 font-normal outline-none focus:border-emerald-500"
              />
            </label>
          </div>

          <label className="block text-sm font-semibold">
            Adresse
            <input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 font-normal outline-none focus:border-emerald-500"
            />
          </label>

          <label className="block text-sm font-semibold">
            Fuseau horaire
            <Select value={form.timezone} onValueChange={(v) => setForm({ ...form, timezone: v })}>
              <SelectTrigger className="mt-1.5 h-11 rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="(UTC+01:00) Afrique/Porto-Novo">
                  (UTC+01:00) Afrique/Porto-Novo
                </SelectItem>
                <SelectItem value="(UTC+00:00) Afrique/Lomé">
                  (UTC+00:00) Afrique/Lomé
                </SelectItem>
                <SelectItem value="(UTC+01:00) Europe/Paris">
                  (UTC+01:00) Europe/Paris
                </SelectItem>
              </SelectContent>
            </Select>
          </label>

          <DialogFooter className="gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">
              Annuler
            </Button>
            <Button type="submit" className="rounded-xl bg-emerald-700 hover:bg-emerald-800">
              Enregistrer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}