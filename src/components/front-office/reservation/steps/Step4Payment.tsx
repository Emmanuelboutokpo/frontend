"use client";

import { CreditCard, Smartphone, Building2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export type PaymentMethod = "card" | "mobile" | "transfer";

const METHODS = [
  {
    id: "card" as const,
    icon: CreditCard,
    label: "Carte bancaire",
    description: "Visa, Mastercard, American Express",
    badges: ["VISA", "MC"],
  },
  {
    id: "mobile" as const,
    icon: Smartphone,
    label: "Mobile Money",
    description: "Moov Money, MTN, Wave",
    badges: ["MTN", "Moov"],
  },
  {
    id: "transfer" as const,
    icon: Building2,
    label: "Virement bancaire",
    description: "Paiement par virement (1-3 jours)",
    badges: [],
  },
];

interface Props {
  paymentMethod: PaymentMethod;
  onPaymentMethodChange: (m: PaymentMethod) => void;
  subtotal: number;
  serviceFee: number;
  totalAmount: number;
  currency: string;
  onNext: () => void;
  onPrev: () => void;
}

export function Step3Payment({
  paymentMethod,
  onPaymentMethodChange,
  subtotal,
  serviceFee,
  totalAmount,
  currency,
  onNext,
  onPrev,
}: Props) {
  return (
    <div className="space-y-8">
      {/* Titre */}
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Mode de paiement
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Choisissez comment vous souhaitez régler votre réservation.
        </p>
      </header>

      {/* Options */}
      <RadioGroup
        value={paymentMethod}
        onValueChange={(v) => onPaymentMethodChange(v as PaymentMethod)}
        className="space-y-3"
      >
        {METHODS.map((m) => {
          const Icon = m.icon;
          const isActive = paymentMethod === m.id;

          return (
            <label
              key={m.id}
              className={`flex cursor-pointer items-center gap-4 rounded-xl border bg-white p-4 transition ${
                isActive
                  ? "border-emerald-600 ring-2 ring-emerald-500/20"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <RadioGroupItem value={m.id} />
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-700">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-900">{m.label}</p>
                <p className="text-xs text-slate-500">{m.description}</p>
              </div>
              <div className="flex gap-1">
                {m.badges.map((b) => (
                  <span
                    key={b}
                    className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </label>
          );
        })}
      </RadioGroup>

      {/* Détail du prix */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-sm font-bold text-slate-900">
          Détail du paiement
        </h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-slate-600">
            <span>Sous-total</span>
            <span className="font-semibold text-slate-900">
              {subtotal.toLocaleString("fr-FR")} {currency}
            </span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Frais de service</span>
            <span className="font-semibold text-slate-900">
              {serviceFee.toLocaleString("fr-FR")} {currency}
            </span>
          </div>
          <div className="flex justify-between border-t border-slate-100 pt-3 text-base font-bold text-slate-900">
            <span>Total</span>
            <span className="text-emerald-800">
              {totalAmount.toLocaleString("fr-FR")} {currency}
            </span>
          </div>
        </div>
      </section>

      {/* Info sécurité */}
      <div className="flex items-start gap-2 rounded-xl bg-emerald-50 p-4 text-xs text-emerald-800">
        <Lock className="mt-0.5 h-4 w-4 shrink-0" />
        <span>
          Paiement 100% sécurisé. Vos informations bancaires sont cryptées.
        </span>
      </div>

      {/* Actions */}
      <div className="flex justify-between gap-3 pt-2">
        <Button
          variant="outline"
          onClick={onPrev}
          className="h-12 rounded-xl px-6"
        >
          Retour
        </Button>
        <Button
          onClick={onNext}
          className="h-12 rounded-xl bg-emerald-700 px-8 font-semibold hover:bg-emerald-800"
        >
          Continuer
        </Button>
      </div>
    </div>
  );
}