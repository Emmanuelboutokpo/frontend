"use client";

import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Column, DataTable } from "../commun";
import { useAdminReservationsStore } from "@/store/useAdminReservationsStore";
import type { AdminReservation } from "@/types/reservation";
import { STATUS_STYLES_RES, formatAmount } from "@/utils/reservation.helpers";

function clientName(reservation: AdminReservation) {
  return [reservation.clientFirstName, reservation.clientLastName].filter(Boolean).join(" ") || reservation.clientEmail;
}

export function LatestBookingsTable() {
  const reservations = useAdminReservationsStore((state) => state.recentReservations);
  const isLoading = useAdminReservationsStore((state) => state.isLoadingRecentReservations);
  const error = useAdminReservationsStore((state) => state.recentReservationsError);
  const loadRecentReservations = useAdminReservationsStore((state) => state.loadRecentReservations);

  useEffect(() => {
    void loadRecentReservations().catch(() => undefined);
  }, [loadRecentReservations]);

  const columns: Column<AdminReservation>[] = [
    {
      key: "client",
      label: "Client",
      render: (reservation) => (
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700">
            {clientName(reservation).split(/\s+/).slice(0, 2).map((part) => part[0] ?? "").join("").toUpperCase()}
          </span>
          <span className="truncate text-xs font-medium text-slate-700">{clientName(reservation)}</span>
        </div>
      ),
    },
    {
      key: "reference",
      label: "Réservation",
      render: (reservation) => <span className="font-mono text-xs text-slate-600">{reservation.reference}</span>,
    },
    {
      key: "date",
      label: "Date",
      render: (reservation) => <span className="text-xs text-slate-500">{new Date(reservation.createdAt).toLocaleDateString("fr-FR")}</span>,
    },
    {
      key: "amount",
      label: "Montant",
      render: (reservation) => <span className="text-xs font-semibold text-slate-800">{formatAmount(reservation.total, reservation.currency)}</span>,
    },
    {
      key: "status",
      label: "Statut",
      render: (reservation) => <Badge variant="outline" className={`text-[10px] font-semibold ${STATUS_STYLES_RES[reservation.status].className}`}>{STATUS_STYLES_RES[reservation.status].label}</Badge>,
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900">Dernières réservations</h3>
        <Link href="/admin/reservations" className="text-xs font-semibold text-emerald-700 hover:underline">Voir tout →</Link>
      </div>
      {isLoading ? (
        <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-emerald-700" /></div>
      ) : error ? (
        <p role="alert" className="rounded-lg bg-rose-50 p-3 text-xs text-rose-700">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <DataTable data={reservations} columns={columns} selectable={false} emptyMessage="Aucune réservation récente." />
        </div>
      )}
    </div>
  );
}
