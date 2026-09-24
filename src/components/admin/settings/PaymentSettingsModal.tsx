"use client";

import { useEffect, useState } from "react";
import { Plus, CreditCard, Smartphone, Landmark } from "lucide-react";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useSettingsStore } from "@/store/useSettingsStore";

const ICONS: Record<string, any> = {
  "mobile-money": Smartphone,
  card: CreditCard,
  transfer: Landmark,
};

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

export function PaymentSettingsModal({ open, onOpenChange }: Props) {
  const payment = useSettingsStore((s) => s.payment);
  const updatePayment = useSettingsStore((s) => s.updatePayment);
  const togglePaymentMethod = useSettingsStore((s) => s.togglePaymentMethod);

  const [form, setForm] = useState({
    commissionRate: payment.commissionRate,
    minWithdrawal: payment.minWithdrawal,
    withdrawalDelay: payment.withdrawalDelay,
  });

  useEffect(() => {
    if (open) {
      setForm({
        commissionRate: payment.commissionRate,
        minWithdrawal: payment.minWithdrawal,
        withdrawalDelay: payment.withdrawalDelay,
      });
    }
  }, [open, payment]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle>Paiements</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Méthodes de paiement */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Méthodes de paiement
              </p>
              <Button size="sm" className="rounded-lg bg-emerald-700 hover:bg-emerald-800">
                <Plus className="mr-1.5 h-3 w-3" /> Ajouter
              </Button>
            </div>

            <div className="space-y-2">
              {payment.methods.map((m) => {
                const Icon = ICONS[m.id] ?? CreditCard;
                return (
                  <div
                    key={m.id}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3"
                  >
                    <div className={`grid h-9 w-9 place-items-center rounded-lg ${m.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-xs font-semibold text-slate-800">
                        {m.name}
                      </p>
                      <p className="truncate text-[10px] text-slate-500">
                        {m.description}
                      </p>
                    </div>
                    <Switch
                      checked={m.enabled}
                      onCheckedChange={() => togglePaymentMethod(m.id)}
                      className="data-[state=checked]:bg-emerald-600"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Règles et commissions */}
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
              Règles et commissions
            </p>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-xs font-semibold">
                Commission plateforme (%)
                <input
                  type="number"
                  value={form.commissionRate}
                  onChange={(e) => setForm({ ...form, commissionRate: Number(e.target.value) })}
                  className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 font-normal outline-none focus:border-emerald-500"
                />
              </label>
              <label className="block text-xs font-semibold">
                Montant minimum de retrait
                <div className="relative mt-1.5">
                  <input
                    type="number"
                    value={form.minWithdrawal}
                    onChange={(e) => setForm({ ...form, minWithdrawal: Number(e.target.value) })}
                    className="h-11 w-full rounded-xl border border-slate-200 px-3 pr-14 font-normal outline-none focus:border-emerald-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                    FCFA
                  </span>
                </div>
              </label>
            </div>

            <label className="mt-3 block text-xs font-semibold">
              Délai de virement (jours)
              <div className="relative mt-1.5">
                <input
                  type="number"
                  value={form.withdrawalDelay}
                  onChange={(e) => setForm({ ...form, withdrawalDelay: Number(e.target.value) })}
                  className="h-11 w-full rounded-xl border border-slate-200 px-3 pr-14 font-normal outline-none focus:border-emerald-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                  jours
                </span>
              </div>
            </label>
          </div>
        </div>

        <DialogFooter className="gap-2 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">
            Annuler
          </Button>
          <Button
            onClick={() => {
              updatePayment(form);
              onOpenChange(false);
            }}
            className="rounded-xl bg-emerald-700 hover:bg-emerald-800"
          >
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}