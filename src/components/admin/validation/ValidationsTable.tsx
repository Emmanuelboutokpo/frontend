"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { STATUS_STYLES_VAL, CATEGORY_STYLES_VAL } from "@/utils/validation.helpers";
import type { ValidationEstablishment } from "@/types/validation";
import { ClientOnlyDate } from "@/components/ui/clientonlydate";

interface Props {
  items: ValidationEstablishment[];
  onView: (e: ValidationEstablishment) => void;
  onApprove: (e: ValidationEstablishment) => void;
  onReject: (e: ValidationEstablishment) => void;
  onRevision: (e: ValidationEstablishment) => void;
}

export function ValidationsTable({ items, onView, onApprove, onReject, onRevision }: Props) {
  const [selected, setSelected] = useState<number[]>([]);
  const allSelected = items.length > 0 && selected.length === items.length;

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="w-full min-w-[900px] text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/50 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
            <th className="w-10 px-4 py-3">
              <Checkbox
                checked={allSelected}
                onCheckedChange={() => setSelected(allSelected ? [] : items.map((i) => i.id))}
              />
            </th>
            <th className="px-4 py-3">Établissement</th>
            <th className="px-4 py-3">Catégorie</th>
            <th className="px-4 py-3">Propriétaire</th>
            <th className="px-4 py-3">Localisation</th>
            <th className="px-4 py-3">Date de soumission</th>
            <th className="px-4 py-3">Statut</th>
            <th className="w-24 px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={8} className="py-16 text-center text-sm text-slate-400">
                Aucun établissement à valider
              </td>
            </tr>
          ) : (
            items.map((v) => {
              const status = STATUS_STYLES_VAL[v.status];
              const cat = CATEGORY_STYLES_VAL[v.category];
              const isSelected = selected.includes(v.id);

              return (
                <tr
                  key={v.id}
                  className={`border-b border-slate-50 transition last:border-0 hover:bg-slate-50/50 ${
                    isSelected ? "bg-emerald-50/30" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() =>
                        setSelected((s) =>
                          s.includes(v.id) ? s.filter((x) => x !== v.id) : [...s, v.id]
                        )
                      }
                    />
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={v.images[0]}
                        alt={v.name}
                        className="h-11 w-14 shrink-0 rounded-lg object-cover"
                      />
                      <div className="min-w-0">
                        <div className="truncate font-semibold text-slate-800">
                          {v.name}
                        </div>
                        <div className="truncate text-[11px] text-slate-500">
                          {v.description.slice(0, 40)}...
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-semibold ${cat.className}`}
                    >
                      {cat.label}
                    </Badge>
                  </td>

                  <td className="px-4 py-3">
                    <div className="text-xs font-medium text-slate-700">
                      {v.owner.name}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {v.owner.email}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-xs text-slate-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-emerald-600" />
                      {v.city}, {v.country}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-xs text-slate-500">
                    <ClientOnlyDate date={v.submittedAt} />
                  </td>

                  <td className="px-4 py-3">
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-semibold ${status.className}`}
                    >
                      {status.label}
                    </Badge>
                  </td>

                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onView(v)}
                        className="h-8 rounded-lg text-xs"
                      >
                        Voir
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => onApprove(v)} className="text-emerald-700">
                            Approuver
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onRevision(v)} className="text-blue-700">
                            Mettre en révision
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onReject(v)} className="text-rose-600">
                            Rejeter
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}