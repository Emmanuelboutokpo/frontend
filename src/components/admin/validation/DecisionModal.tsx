"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, FileEdit, Info } from "lucide-react";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { ValidationEstablishment, ValidationStatus } from "@/types/validation";

interface Props {
  establishment: ValidationEstablishment | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onConfirm: (status: ValidationStatus, comment: string) => void;
}

const OPTIONS: {
  value: ValidationStatus;
  label: string;
  description: string;
  icon: any;
  color: string;
  bg: string;
}[] = [
  {
    value: "VALIDE",
    label: "Valider l'établissement",
    description: "L'établissement sera publié sur la plateforme.",
    icon: CheckCircle2,
    color: "text-emerald-700 border-emerald-500",
    bg: "bg-emerald-50",
  },
  {
    value: "EN_REVISION",
    label: "Mettre en révision",
    description: "Demander des informations complémentaires.",
    icon: FileEdit,
    color: "text-blue-700 border-blue-500",
    bg: "bg-blue-50",
  },
  {
    value: "REJETE",
    label: "Rejeter l'établissement",
    description: "L'établissement sera refusé.",
    icon: XCircle,
    color: "text-rose-700 border-rose-500",
    bg: "bg-rose-50",
  },
];

export function DecisionModal({
  establishment, open, onOpenChange, onConfirm,
}: Props) {
  const [decision, setDecision] = useState<ValidationStatus>("VALIDE");
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (open) {
      setDecision("VALIDE");
      setComment("");
    }
  }, [open]);

  if (!establishment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>Décision de validation</DialogTitle>
        </DialogHeader>

        {/* Info */}
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3 text-xs text-emerald-800">
          <div className="flex items-start gap-2">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              Après vérification des informations, vous pouvez valider ou
              rejeter cet établissement.
            </p>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-2">
          {OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const isActive = decision === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setDecision(opt.value)}
                className={`flex w-full items-start gap-3 rounded-xl border-2 p-3 text-left transition ${
                  isActive
                    ? `${opt.bg} ${opt.color}`
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${isActive ? opt.color.split(" ")[0] : "text-slate-400"}`} />
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${isActive ? opt.color.split(" ")[0] : "text-slate-700"}`}>
                    {opt.label}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {opt.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Commentaire */}
        <div>
          <label className="block text-xs font-semibold text-slate-700">
            Commentaire (optionnel)
          </label>
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Ajoutez un commentaire..."
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500"
          />
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 rounded-xl"
          >
            Annuler
          </Button>
          <Button
            onClick={() => {
              onConfirm(decision, comment);
              onOpenChange(false);
            }}
            className="flex-1 rounded-xl bg-emerald-700 hover:bg-emerald-800"
          >
            {decision === "VALIDE" && "Valider l'établissement"}
            {decision === "EN_REVISION" && "Mettre en révision"}
            {decision === "REJETE" && "Rejeter l'établissement"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}