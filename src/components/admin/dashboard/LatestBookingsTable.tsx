"use client";

import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Column, DataTable } from "../commun";

type BookingStatus = "Confirmée" | "En attente" | "Annulée";
interface LatestBooking {
  id: number;
  client: string;
  initials: string;
  establishment: string;
  date: string;
  amount: number;
  status: BookingStatus;
}

const bookings: LatestBooking[] = [
  { id: 1, client: "Jean Dupont", initials: "JD", establishment: "Hôtel Azalaï", date: "21 Sept. 2026", amount: 75000, status: "Confirmée" },
  { id: 2, client: "Marie K.", initials: "MK", establishment: "Villa Paradis", date: "21 Sept. 2026", amount: 120000, status: "En attente" },
  { id: 3, client: "Paul H.", initials: "PH", establishment: "Le Goût Local", date: "20 Sept. 2026", amount: 45000, status: "Confirmée" },
  { id: 4, client: "Sophie L.", initials: "SL", establishment: "Résidence du Lac", date: "20 Sept. 2026", amount: 90000, status: "Annulée" },
  { id: 5, client: "Luc A.", initials: "LA", establishment: "La Paillote", date: "19 Sept. 2026", amount: 35000, status: "Confirmée" },
];

const STATUS_STYLES: Record<BookingStatus, string> = {
  "Confirmée": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "En attente": "bg-amber-50 text-amber-700 border-amber-200",
  "Annulée": "bg-rose-50 text-rose-700 border-rose-200",
};

const AVATAR_COLORS = [
  "bg-emerald-100 text-emerald-700",
  "bg-slate-200 text-slate-700",
  "bg-blue-100 text-blue-700",
  "bg-rose-100 text-rose-700",
  "bg-amber-100 text-amber-700",
];

export function LatestBookingsTable() {
  const columns: Column<LatestBooking>[] = [
    {
      key: "client",
      label: "Client",
      render: (b) => {
        const index = bookings.findIndex((x) => x.id === b.id);
        return (
          <div className="flex items-center gap-2">
            <span
              className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[10px] font-bold ${AVATAR_COLORS[index % AVATAR_COLORS.length]}`}
            >
              {b.initials}
            </span>
            <div className="min-w-0">
              <div className="truncate font-medium text-slate-700">{b.client}</div>
              <div className="truncate text-[10px] text-slate-400 md:hidden">
                {b.establishment}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      key: "establishment",
      label: "Établissement",
      render: (b) => <span className="text-slate-600">{b.establishment}</span>,
    },
    {
      key: "date",
      label: "Date",
      render: (b) => <span className="text-xs text-slate-500">{b.date}</span>,
    },
    {
      key: "amount",
      label: "Montant",
      render: (b) => (
        <span className="font-semibold text-slate-800">
          {b.amount.toLocaleString("fr-FR")} FCFA
        </span>
      ),
    },
    {
      key: "status",
      label: "Statut",
      className: "text-right",
      render: (b) => (
        <Badge
          variant="outline"
          className={`text-[10px] font-semibold ${STATUS_STYLES[b.status]}`}
        >
          {b.status}
        </Badge>
      ),
    },
  ];

 
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900">
          Dernières réservations
        </h3>
        <Link
          href="/admin/reservations"
          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:underline"
        >
          Voir tout <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="overflow-x-auto">
         <DataTable
        data={bookings}
        columns={columns}
        selectable={false}
      />
      </div>
    </div>
  );
}