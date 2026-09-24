"use client";

import { DashboardSection } from "./DashboardSection";
import { Button } from "@/components/ui/button";

const pending = [
  { id: 1, name: "Aqua Park", city: "Abomey-Calavi", date: "Ajouté le 20 Sept. 2026", image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=200" },
  { id: 2, name: "Le Coton Bleu", city: "Cotonou", date: "Ajouté le 19 Sept. 2026", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200" },
  { id: 3, name: "Saveurs d'Afrique", city: "Ouidah", date: "Ajouté le 18 Sept. 2026", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200" },
  { id: 4, name: "Résidence du Lac", city: "Porto-Novo", date: "Ajouté le 17 Sept. 2026", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200" },
];

export function PendingEstablishments() {
  return (
    <DashboardSection
      title="Établissements à valider"
      action={{ label: "Voir tout", href: "/admin/validations" }}
    >
      <div className="space-y-3">
        {pending.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 rounded-xl border border-slate-100 p-2 transition hover:bg-slate-50"
          >
            <img
              src={item.image}
              alt={item.name}
              className="h-12 w-12 shrink-0 rounded-lg object-cover"
            />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-slate-800">
                {item.name}
              </div>
              <div className="truncate text-[11px] text-slate-500">
                {item.city}
              </div>
              <div className="text-[10px] text-slate-400">{item.date}</div>
            </div>
            <div className="flex shrink-0 gap-1">
              <Button size="sm" variant="outline" className="h-7 rounded-md px-2 text-[10px]">
                Voir
              </Button>
              <Button size="sm" className="h-7 rounded-md bg-emerald-700 px-2 text-[10px] hover:bg-emerald-800">
                Approuver
              </Button>
            </div>
          </div>
        ))}
      </div>
    </DashboardSection>
  );
}