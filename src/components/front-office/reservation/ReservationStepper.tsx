"use client";

import { Check } from "lucide-react";

const STEPS = [
  { id: 1, label: "Séjour" },
  { id: 2, label: "Informations" },
  { id: 3, label: "Paiement" },
  { id: 4, label: "Confirmation" },
];

interface Props {
  currentStep: number;
}

export function ReservationStepper({ currentStep }: Props) {
  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-2xl px-6 py-5">
        <ol className="flex items-center gap-2">
          {STEPS.map((step, index) => {
            const isCompleted = currentStep > step.id;
            const isActive = currentStep === step.id;

            return (
              <li key={step.id} className="flex flex-1 items-center gap-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold transition ${
                      isCompleted
                        ? "bg-emerald-700 text-white"
                        : isActive
                        ? "bg-emerald-700 text-white ring-4 ring-emerald-100"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {isCompleted ? <Check className="h-4 w-4" /> : step.id}
                  </div>
                  <span
                    className={`hidden text-xs font-semibold whitespace-nowrap sm:block ${
                      isActive
                        ? "text-emerald-700"
                        : isCompleted
                        ? "text-slate-700"
                        : "text-slate-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>

                {index < STEPS.length - 1 && (
                  <div
                    className={`h-px flex-1 transition ${
                      isCompleted ? "bg-emerald-700" : "bg-slate-200"
                    }`}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}