"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useValidationsStore } from "@/store/useValidationsStore";
import type {
  ValidationEstablishment,
  ValidationStatus,
} from "@/types/validation";

import { ValidationStats } from "@/components/admin/validation/ValidationStats";
import { ValidationTabs } from "@/components/admin/validation/ValidationTabs";
import { ValidationFilters } from "@/components/admin/validation/ValidationFilters";
import { ValidationsTable } from "@/components/admin/validation/ValidationsTable";
import { ValidationDetailsModal } from "@/components/admin/validation/ValidationDetailsModal";
import { DecisionModal } from "@/components/admin/validation/DecisionModal";

export default function AdminValidationsPage() {
  const validations = useValidationsStore((s) => s.validations);
  const page = useValidationsStore((s) => s.page);
  const perPage = useValidationsStore((s) => s.perPage);
  const setPage = useValidationsStore((s) => s.setPage);
  const setPerPage = useValidationsStore((s) => s.setPerPage);
  const getFiltered = useValidationsStore((s) => s.getFiltered);
  const updateStatus = useValidationsStore((s) => s.updateStatus);

  const [tab, setTab] = useState<ValidationStatus | "ALL">("EN_ATTENTE");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [decisionOpen, setDecisionOpen] = useState(false);
  const [selected, setSelected] = useState<ValidationEstablishment | null>(null);

  const filtered = useMemo(
    () => getFiltered(tab),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [validations, tab]
  );

  const paginated = useMemo(() => {
    const start = (page - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, page, perPage]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));

  const handleView = (e: ValidationEstablishment) => {
    setSelected(e);
    setDetailsOpen(true);
  };

  const handleDecide = (e: ValidationEstablishment) => {
    setSelected(e);
    setDetailsOpen(false);
    setDecisionOpen(true);
  };

  const handleConfirm = (status: ValidationStatus, comment: string) => {
    if (selected) updateStatus(selected.id, status, comment);
    setSelected(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <nav className="flex items-center gap-1 text-xs text-slate-500">
            <Link href="/admin" className="hover:text-emerald-700">Dashboard</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="font-semibold text-slate-700">Validations</span>
          </nav>
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Validation des établissements
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Examinez et validez les établissements soumis par les propriétaires.
          </p>
        </div>

        <Button variant="outline" className="rounded-xl">
          <Download className="mr-2 h-4 w-4" /> Exporter
        </Button>
      </div>

      <ValidationStats />

      <ValidationTabs active={tab} onChange={setTab} />

      <ValidationFilters />

      <ValidationsTable
        items={paginated}
        onView={handleView}
        onApprove={(e) => updateStatus(e.id, "VALIDE")}
        onReject={(e) => updateStatus(e.id, "REJETE")}
        onRevision={(e) => updateStatus(e.id, "EN_REVISION")}
      />

      {/* Pagination */}
      <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 sm:flex-row">
        <p className="text-xs text-slate-500">
          Affichage de{" "}
          <strong>{filtered.length === 0 ? 0 : (page - 1) * perPage + 1}</strong> à{" "}
          <strong>{Math.min(page * perPage, filtered.length)}</strong> sur{" "}
          <strong>{filtered.length}</strong> résultats
        </p>

        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Button
              key={p}
              variant={page === p ? "default" : "ghost"}
              size="icon"
              className={`h-8 w-8 rounded-lg text-xs ${
                page === p ? "bg-emerald-700 text-white" : ""
              }`}
              onClick={() => setPage(p)}
            >
              {p}
            </Button>
          ))}
        </div>

        <select
          value={perPage}
          onChange={(e) => setPerPage(Number(e.target.value))}
          className="h-8 rounded-lg border border-slate-200 px-2 text-xs"
        >
          <option value={5}>5 par page</option>
          <option value={10}>10 par page</option>
          <option value={20}>20 par page</option>
        </select>
      </div>

      {/* Modals */}
      <ValidationDetailsModal
        establishment={selected}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onDecide={handleDecide}
      />

      <DecisionModal
        establishment={selected}
        open={decisionOpen}
        onOpenChange={setDecisionOpen}
        onConfirm={handleConfirm}
      />
    </div>
  );
}