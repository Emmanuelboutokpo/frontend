"use client";
import { useState } from "react";
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  XCircle,
  Flag,
  Wallet,
  Plus,
  Eye,
  Pencil,
  X,
} from "lucide-react";

import {
  AdminPageHeader,
  StatsGrid,
  TabsBar,
  FilterBar,
  FilterChips,
  DataTable,
  Pagination,
  ActionsDropdown,
  ExportButton,
  ConfirmModal,
  EntityFormModal,
  EntityDetailsModal,
  type Column,
  type StatCard,
  type Tab,
  type ActionItem,
  FilterSelect,
} from "@/components/admin/commun";

import { Badge } from "@/components/ui/badge";
import { CreditCard, Smartphone, Landmark, Star } from "lucide-react";
import { useReservationsStore } from "@/store/useReservationsStore";

import {
  STATUS_STYLES_RES,
  PAYMENT_METHOD_STYLES,
  CATEGORY_STYLES_RES,
  formatAmount,
  formatStayDates,
} from "@/utils/reservation.helpers";
import type {
  Reservation,
  ReservationStatus,
  ReservationCategory,
} from "@/types/reservation";
import { useMounted } from "../../../../hook/admin/useMounted";
import { useAdminTable } from "../../../../hook/admin/useAdminTable";

const PAYMENT_ICONS: Record<string, any> = {
  "credit-card": CreditCard,
  smartphone: Smartphone,
  landmark: Landmark,
};

export default function AdminReservationsPage() {
  const mounted = useMounted();
  const reservations = useReservationsStore((s) => s.reservations);
  const updateReservation = useReservationsStore((s) => s.updateReservation);
  const cancelReservation = useReservationsStore((s) => s.cancelReservation);
  const getStats = useReservationsStore((s) => s.getStats);

  // État UI
  const [tab, setTab] = useState<ReservationStatus | "ALL">("ALL");
  const [selected, setSelected] = useState<Reservation | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("edit");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  // Table générique
  const table = useAdminTable<Reservation, any>({
    data: reservations,
    defaultPerPage: 6,
    initialFilters: { search: "", category: "ALL", status: "ALL", period: "all" },
    filterFn: (r, f) => {
      if (f.search) {
        const q = f.search.toLowerCase();
        if (
          !r.reference.toLowerCase().includes(q) &&
          !r.client.name.toLowerCase().includes(q) &&
          !r.client.email.toLowerCase().includes(q) &&
          !r.establishment.name.toLowerCase().includes(q)
        )
          return false;
      }
      if (f.category !== "ALL" && r.category !== f.category) return false;
      if (f.status !== "ALL" && r.status !== f.status) return false;
      return true;
    },
  });

  // Applique le tab en filtre supplémentaire
  const finalFiltered =
    tab === "ALL"
      ? table.filtered
      : table.filtered.filter((r) => r.status === tab);

  const paginated =
    tab === "ALL"
      ? table.paginated
      : finalFiltered.slice(
          (table.page - 1) * table.perPage,
          table.page * table.perPage
        );

  const stats = mounted
    ? getStats()
    : { total: 0, confirmees: 0, enAttente: 0, annulees: 0, terminees: 0, revenue: 0 };

  // Stats cards
  const statCards: StatCard[] = [
    { icon: CalendarCheck, label: "Réservations totales", value: stats.total, trend: 18, color: "bg-emerald-50 text-emerald-700" },
    { icon: CheckCircle2, label: "Confirmées", value: stats.confirmees, trend: 12, color: "bg-emerald-50 text-emerald-700" },
    { icon: Clock, label: "En attente", value: stats.enAttente, trend: -8, color: "bg-amber-50 text-amber-700" },
    { icon: XCircle, label: "Annulées", value: stats.annulees, trend: 2, color: "bg-rose-50 text-rose-700" },
    { icon: Flag, label: "Terminées", value: stats.terminees, trend: 25, color: "bg-blue-50 text-blue-700" },
    { icon: Wallet, label: "Revenus (FCFA)", value: stats.revenue, trend: 22, color: "bg-rose-50 text-rose-700", isCurrency: true },
  ];

  // Tabs
  const tabs: Tab[] = [
    { value: "ALL", label: "Toutes", count: reservations.length },
    { value: "EN_ATTENTE", label: "En attente", count: reservations.filter((r) => r.status === "EN_ATTENTE").length },
    { value: "CONFIRMEE", label: "Confirmées", count: reservations.filter((r) => r.status === "CONFIRMEE").length },
    { value: "EN_COURS", label: "En cours", count: reservations.filter((r) => r.status === "EN_COURS").length },
    { value: "TERMINEE", label: "Terminées", count: reservations.filter((r) => r.status === "TERMINEE").length },
    { value: "ANNULEE", label: "Annulées", count: reservations.filter((r) => r.status === "ANNULEE").length },
  ];

  // Colonnes
  const columns: Column<Reservation>[] = [
    {
      key: "reference",
      label: "N° réservation",
      render: (r) => (
        <span className="text-xs font-bold text-slate-700">{r.reference}</span>
      ),
    },
    {
      key: "client",
      label: "Client",
      render: (r) => (
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700">
            {r.client.initials}
          </div>
          <div className="min-w-0">
            <div className="truncate text-xs font-semibold text-slate-800">{r.client.name}</div>
            <div className="truncate text-[10px] text-slate-400">{r.client.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "establishment",
      label: "Établissement",
      render: (r) => (
        <div className="flex items-center gap-2">
          <img
            src={r.establishment.image}
            alt=""
            className="h-9 w-11 shrink-0 rounded-md object-cover"
          />
          <div className="min-w-0">
            <div className="truncate text-xs font-semibold text-slate-800">
              {r.establishment.name}
            </div>
            <div className="truncate text-[10px] text-slate-400">
              {r.establishment.city}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      label: "Catégorie",
      render: (r) => (
        <Badge variant="outline" className={`text-[10px] font-semibold ${CATEGORY_STYLES_RES[r.category].className}`}>
          {CATEGORY_STYLES_RES[r.category].label}
        </Badge>
      ),
    },
    {
      key: "dates",
      label: "Dates de séjour",
      render: (r) => (
        <div>
          <div className="text-xs font-medium text-slate-700">
            {formatStayDates(r.startDate, r.endDate)}
          </div>
          <div className="text-[10px] text-slate-400">
            {r.nights} nuit{r.nights > 1 ? "s" : ""} · {r.guests.adults + r.guests.children} pers.
          </div>
        </div>
      ),
    },
    {
      key: "amount",
      label: "Montant",
      render: (r) => (
        <span className="text-xs font-bold text-slate-800">
          {formatAmount(r.totalAmount, r.currency)}
        </span>
      ),
    },
    {
      key: "status",
      label: "Statut",
      render: (r) => (
        <Badge variant="outline" className={`text-[10px] font-semibold ${STATUS_STYLES_RES[r.status].className}`}>
          {STATUS_STYLES_RES[r.status].label}
        </Badge>
      ),
    },
    {
      key: "payment",
      label: "Mode de paiement",
      render: (r) => {
        const payMethod = PAYMENT_METHOD_STYLES[r.paymentMethod];
        const PayIcon = PAYMENT_ICONS[payMethod.icon];
        return (
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            {PayIcon && <PayIcon className="h-3.5 w-3.5 text-slate-400" />}
            <span>{payMethod.label}</span>
          </div>
        );
      },
    },
    {
      key: "actions",
      label: "",
      className: "text-right",
      render: (r) => {
        const actions: ActionItem[] = [
          { label: "Voir les détails", icon: Eye, onClick: () => { setSelected(r); setDetailsOpen(true); } },
          { label: "Modifier", icon: Pencil, onClick: () => { setSelected(r); setFormMode("edit"); setFormOpen(true); } },
        ];

        if (r.status !== "ANNULEE" && r.status !== "TERMINEE") {
          actions.push({
            label: "Annuler la réservation",
            icon: X,
            onClick: () => { setSelected(r); setCancelOpen(true); },
            variant: "danger",
            separatorBefore: true,
          });
        }

        return <ActionsDropdown actions={actions} />;
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header générique */}
      <AdminPageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Réservations" },
        ]}
        title="Réservations"
        description="Gérez toutes les réservations effectuées sur la plateforme."
        actions={[
          { label: "Nouvelle réservation", icon: Plus, onClick: () => { setFormMode("create"); setFormOpen(true); } },
        ]}
      />

      {/* Stats génériques */}
      <StatsGrid cards={statCards} columns={6} />

      {/* Tabs génériques */}
      <TabsBar tabs={tabs} active={tab} onChange={(v) => setTab(v as any)} />

      {/* Filtres génériques */}
     <FilterBar
  search={table.filters.search}
  onSearchChange={(v) => table.setFilters({ search: v })}
  searchPlaceholder="Rechercher une réservation..."
  onReset={table.resetFilters}
  activeFiltersCount={table.activeFiltersCount}
  desktopFilters={
    <>
      <FilterSelect
        value={table.filters.category}
        onValueChange={(v) => table.setFilters({ category: v })}
        placeholder="Toutes catégories"
        width="w-[180px]"
        options={[
          { value: "ALL", label: "Toutes catégories" },
          { value: "HEBERGEMENT", label: "Hébergement" },
          { value: "RESTAURANT", label: "Restaurant" },
          { value: "LOISIR", label: "Loisir" },
        ]}
      />
      <FilterSelect
        value={table.filters.status}
        onValueChange={(v) => table.setFilters({ status: v })}
        placeholder="Tous statuts"
        width="w-[160px]"
        options={[
          { value: "ALL", label: "Tous statuts" },
          { value: "EN_ATTENTE", label: "En attente" },
          { value: "CONFIRMEE", label: "Confirmée" },
          { value: "EN_COURS", label: "En cours" },
          { value: "TERMINEE", label: "Terminée" },
          { value: "ANNULEE", label: "Annulée" },
        ]}
      />
      <FilterSelect
        value={table.filters.period}
        onValueChange={(v) => table.setFilters({ period: v })}
        placeholder="Toutes les dates"
        width="w-[180px]"
        options={[
          { value: "all", label: "Toutes les dates" },
          { value: "today", label: "Aujourd'hui" },
          { value: "week", label: "7 derniers jours" },
          { value: "month", label: "30 derniers jours" },
          { value: "year", label: "Cette année" },
        ]}
      />
    </>
  }
  mobileFilters={
    <>
      <FilterChips
        label="Catégorie"
        value={table.filters.category}
        onChange={(v) => table.setFilters({ category: v })}
        options={[
          { value: "ALL", label: "Toutes" },
          { value: "HEBERGEMENT", label: "Hébergement" },
          { value: "RESTAURANT", label: "Restaurant" },
          { value: "LOISIR", label: "Loisir" },
        ]}
      />
      <FilterChips
        label="Statut"
        value={table.filters.status}
        onChange={(v) => table.setFilters({ status: v })}
        options={[
          { value: "ALL", label: "Tous" },
          { value: "EN_ATTENTE", label: "En attente" },
          { value: "CONFIRMEE", label: "Confirmée" },
          { value: "EN_COURS", label: "En cours" },
          { value: "TERMINEE", label: "Terminée" },
          { value: "ANNULEE", label: "Annulée" },
        ]}
      />
      <FilterChips
        label="Période"
        value={table.filters.period}
        onChange={(v) => table.setFilters({ period: v })}
        options={[
          { value: "all", label: "Toutes" },
          { value: "today", label: "Aujourd'hui" },
          { value: "week", label: "7 jours" },
          { value: "month", label: "30 jours" },
          { value: "year", label: "Cette année" },
        ]}
      />
    </>
  }
  trailing={<ExportButton />}
/>
      {/* Table générique */}
      <DataTable
        data={paginated}
        columns={columns}
        onRowClick={(r) => { setSelected(r); setDetailsOpen(true); }}

      />

      {/* Pagination générique */}
      <Pagination
        page={table.page}
        perPage={table.perPage}
        total={finalFiltered.length}
        onPageChange={table.setPage}
        onPerPageChange={table.setPerPage}
        itemLabel="réservations"
        perPageOptions={[6, 12, 24]}
      />

      {/* Formulaire générique (édition) */}
      <EntityFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        title={formMode === "create" ? "Nouvelle réservation" : "Modifier la réservation"}
        size="md"
        initialValues={
          formMode === "edit" && selected
            ? {
                status: selected.status,
                startDate: selected.startDate,
                endDate: selected.endDate,
                adults: selected.guests.adults,
                children: selected.guests.children,
                room: selected.room,
              }
            : {
                status: "EN_ATTENTE",
                startDate: "",
                endDate: "",
                adults: 1,
                children: 0,
                room: "",
              }
        }
        fields={[
          {
            name: "status",
            label: "Statut",
            type: "select",
            required: true,
            options: [
              { value: "EN_ATTENTE", label: "En attente" },
              { value: "CONFIRMEE", label: "Confirmée" },
              { value: "EN_COURS", label: "En cours" },
              { value: "TERMINEE", label: "Terminée" },
              { value: "ANNULEE", label: "Annulée" },
            ],
          },
          { name: "startDate", label: "Date d'arrivée", type: "date", required: true },
          { name: "endDate", label: "Date de départ", type: "date", required: true },
          { name: "adults", label: "Adultes", type: "number", min: 1, required: true },
          { name: "children", label: "Enfants", type: "number", min: 0 },
          { name: "room", label: "Chambre", type: "text", fullWidth: true },
        ]}
        onSubmit={(values) => {
          if (selected) {
            updateReservation(selected.id, {
              startDate: values.startDate,
              endDate: values.endDate,
              guests: {
                adults: Number(values.adults),
                children: Number(values.children),
              },
              room: values.room,
            });
          }
          setSelected(null);
        }}
      />

      {/* Détails générique */}
      <EntityDetailsModal
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        size="xl"
        header={
          selected && (
            <div className="flex items-start gap-4">
              <img
                src={selected.establishment.image}
                alt=""
                className="h-16 w-20 rounded-xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold">{selected.reference}</h2>
                  <Badge variant="outline" className={`text-[10px] font-semibold ${STATUS_STYLES_RES[selected.status].className}`}>
                    {STATUS_STYLES_RES[selected.status].label}
                  </Badge>
                </div>
                <p className="mt-1 text-sm font-semibold text-slate-700">
                  {selected.establishment.name}
                </p>
                <p className="text-xs text-slate-500">
                  {selected.establishment.city}, {selected.establishment.country}
                </p>
              </div>
            </div>
          )
        }
        onEdit={() => {
          setDetailsOpen(false);
          setFormMode("edit");
          setFormOpen(true);
        }}
        tabs={[
          {
            value: "info",
            label: "Informations",
            content: selected && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <InfoRow label="N° réservation" value={selected.reference} />
                  <InfoRow label="Catégorie" value={CATEGORY_STYLES_RES[selected.category].label} />
                  <InfoRow label="Arrivée" value={formatStayDates(selected.startDate, selected.startDate)} />
                  <InfoRow label="Départ" value={formatStayDates(selected.endDate, selected.endDate)} />
                  <InfoRow label="Durée" value={`${selected.nights} nuit${selected.nights > 1 ? "s" : ""}`} />
                  <InfoRow
                    label="Voyageurs"
                    value={`${selected.guests.adults} adulte${selected.guests.adults > 1 ? "s" : ""}, ${selected.guests.children} enfant${selected.guests.children > 1 ? "s" : ""}`}
                  />
                  <InfoRow label="Chambre" value={selected.room} />
                  <InfoRow label="Montant total" value={formatAmount(selected.totalAmount, selected.currency)} />
                </div>
                {selected.options.length > 0 && (
                  <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                    <p className="mb-2 text-[10px] font-bold uppercase text-slate-500">Options</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selected.options.map((o) => (
                        <span key={o} className="rounded-full border bg-white px-2.5 py-1 text-xs font-medium text-slate-700">
                          {o}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ),
          },
          {
            value: "client",
            label: "Client",
            content: selected && (
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                    {selected.client.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{selected.client.name}</p>
                    <p className="text-xs text-slate-500">{selected.client.email}</p>
                    <p className="text-xs text-slate-500">{selected.client.phone}</p>
                  </div>
                </div>
              </div>
            ),
          },
          {
            value: "establishment",
            label: "Établissement",
            content: selected && (
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <img
                    src={selected.establishment.image}
                    alt=""
                    className="h-14 w-16 rounded-lg object-cover"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{selected.establishment.name}</p>
                    <p className="text-xs text-slate-500">
                      {selected.establishment.city}, {selected.establishment.country}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-amber-600">
                      <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                      <span className="font-semibold">{selected.establishment.rating.toFixed(1)}</span>
                      <span className="text-slate-400">({selected.establishment.reviewCount} avis)</span>
                    </div>
                  </div>
                </div>
              </div>
            ),
          },
          {
            value: "payment",
            label: "Paiement",
            content: selected && (
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
                  <div>
                    <p className="text-sm font-bold text-emerald-800">Payé</p>
                    <p className="text-[10px] text-slate-500">Montant total</p>
                  </div>
                  <p className="text-base font-bold text-emerald-800">
                    {formatAmount(selected.totalAmount, selected.currency)}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 p-4 text-xs">
                  <p className="text-[10px] font-bold uppercase text-slate-500">Mode de paiement</p>
                  <p className="mt-1 text-sm font-medium">
                    {PAYMENT_METHOD_STYLES[selected.paymentMethod].label}
                    <span className="ml-2 text-slate-400">{selected.paymentRef}</span>
                  </p>
                </div>
              </div>
            ),
          },
          {
            value: "history",
            label: "Historique",
            content: (
              <p className="rounded-xl border border-dashed border-slate-200 py-10 text-center text-xs text-slate-400">
                Aucun historique
              </p>
            ),
          },
        ]}
      />

      {/* Confirmation d'annulation générique */}
      <ConfirmModal
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        title="Êtes-vous sûr ?"
        description="Cette action annulera la réservation. Le client sera notifié et le paiement sera remboursé selon la politique d'annulation."
        confirmLabel="Annuler la réservation"
        confirmVariant="danger"
        onConfirm={() => {
          if (selected) cancelReservation(selected.id, "client", "");
          setSelected(null);
        }}
      >
        {selected && (
          <div className="space-y-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs">
              <p className="text-[10px] font-bold uppercase text-slate-500">Réservation</p>
              <p className="mt-1 font-semibold">{selected.reference}</p>
              <p className="text-slate-500">{selected.establishment.name}</p>
            </div>

            <div>
              <label className="block text-xs font-semibold">
                Motif d'annulation <span className="text-rose-500">*</span>
              </label>
              <select
                className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm"
                defaultValue="client"
              >
                <option value="client">Demande du client</option>
                <option value="no-show">Client ne s'est pas présenté</option>
                <option value="force-majeure">Cas de force majeure</option>
                <option value="etablissement">Problème établissement</option>
                <option value="autre">Autre</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold">Commentaire (optionnel)</label>
              <textarea
                rows={2}
                placeholder="Ajoutez un commentaire..."
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
          </div>
        )}
      </ConfirmModal>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-3">
      <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </dt>
      <dd className="mt-1 text-xs font-semibold text-slate-800">{value}</dd>
    </div>
  );
}