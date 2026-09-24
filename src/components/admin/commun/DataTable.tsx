"use client";

import { useState, ReactNode } from "react";
import { Checkbox } from "@/components/ui/checkbox";

export interface Column<T> {
  key: string;
  label: string;
  width?: string;
  render: (item: T) => ReactNode;
  className?: string;
}

interface Props<T extends { id: number }> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  selectable?: boolean;
  onSelectionChange?: (ids: number[]) => void;
  emptyMessage?: string;
}

export function DataTable<T extends { id: number }>({
  data,
  columns,
  onRowClick,
  selectable = true,
  onSelectionChange,
  emptyMessage = "Aucun résultat",
}: Props<T>) {
  const [selected, setSelected] = useState<number[]>([]);

  const allSelected = data.length > 0 && selected.length === data.length;

  const toggleAll = () => {
    const next = allSelected ? [] : data.map((d) => d.id);
    setSelected(next);
    onSelectionChange?.(next);
  };

  const toggleOne = (id: number) => {
    const next = selected.includes(id)
      ? selected.filter((x) => x !== id)
      : [...selected, id];
    setSelected(next);
    onSelectionChange?.(next);
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="w-full min-w-[900px] text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/50 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
            {selectable && (
              <th className="w-10 px-4 py-3">
                <Checkbox checked={allSelected} onCheckedChange={toggleAll} />
              </th>
            )}
            {columns.map((c) => (
              <th key={c.key} className={`px-4 py-3 ${c.className ?? ""}`} style={{ width: c.width }}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0)} className="py-16 text-center text-sm text-slate-400">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item) => {
              const isSelected = selected.includes(item.id);
              return (
                <tr
                  key={item.id}
                  onClick={() => onRowClick?.(item)}
                  className={`border-b border-slate-50 transition last:border-0 hover:bg-slate-50/50 ${
                    onRowClick ? "cursor-pointer" : ""
                  } ${isSelected ? "bg-emerald-50/30" : ""}`}
                >
                  {selectable && (
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleOne(item.id)}
                      />
                    </td>
                  )}
                  {columns.map((c) => (
                    <td key={c.key} className={`px-4 py-3 ${c.className ?? ""}`}>
                      {c.render(item)}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}