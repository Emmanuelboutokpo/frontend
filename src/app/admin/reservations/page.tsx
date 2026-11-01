"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  AlertTriangle,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  Clock,
  Eye,
  Flag,
  Loader2,
  RefreshCw,
  RotateCcw,
  Wallet,
  XCircle,
} from "lucide-react";
import {
  ActionsDropdown,
  AdminPageHeader,
  DataTable,
  FilterBar,
  FilterChips,
  FilterSelect,
  Pagination,
  StatsGrid,
  TabsBar,
  type ActionItem,
  type Column,
  type StatCard,
  type Tab,
} from "@/components/admin/commun";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAdminReservationsStore } from "@/store/useAdminReservationsStore";
import type {
  AdminReservation,
  ReservationStatus,
} from "@/types/reservation";
import {
  PAYMENT_METHOD_STYLES,
  PAYMENT_STATUS_STYLES,
  STATUS_STYLES_RES,
  formatAmount,
  formatStayDates,
} from "@/utils/reservation.helpers";
import type { DateRange } from "react-day-picker";

const STATUSES: ReservationStatus[] = [
  "EN_ATTENTE",
  "CONFIRMEE",
  "EN_COURS",
  "TERMINEE",
  "REFUSEE",
  "ANNULEE",
  "EXPIREE",
];

const STATUS_TABS: Tab[] = [
  { value: "ALL", label: "Toutes" },
  { value: "EN_ATTENTE", label: "En attente" },
  { value: "CONFIRMEE", label: "Confirmées" },
  { value: "EN_COURS", label: "En cours" },
  { value: "TERMINEE", label: "Terminées" },
  { value: "REFUSEE", label: "Refusées" },
  { value: "ANNULEE", label: "Annulées" },
  { value: "EXPIREE", label: "Expirées" },
];

function displayName(reservation: AdminReservation): string {
  return [reservation.clientFirstName, reservation.clientLastName]
    .filter(Boolean)
    .join(" ") || reservation.clientEmail;
}

function initials(reservation: AdminReservation): string {
  const name = displayName(reservation);
  return name.split(/\s+/).slice(0, 2).map((part) => part[0] ?? "").join("").toUpperCase();
}

function readableCategory(category: string | null): string {
  if (!category) return "Non précisée";
  const labels: Record<string, string> = {
    HEBERGEMENT: "Hébergement",
    RESTAURANT: "Restaurant",
    LOISIR: "Loisir",
  };
  return labels[category.toUpperCase()] ?? category.replaceAll("_", " ");
}

function dateLabel(date: string | null): string {
  if (!date) return "Non renseignée";
  return new Date(`${date.slice(0, 10)}T00:00:00Z`).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function optionLabels(options: Record<string, unknown> | null): string[] {
  if (!options) return [];
  return Object.entries(options).map(([key, value]) => {
    const label = key.replaceAll("_", " ");
    if (typeof value === "string" || typeof value === "number") return `${label} : ${value}`;
    if (typeof value === "boolean") return value ? label : "";
    return label;
  }).filter(Boolean);
}

function dateToInputValue(date: Date | undefined): string {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function inputValueToDate(value: string): Date | undefined {
  if (!value) return undefined;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return undefined;
  return new Date(year, month - 1, day, 12);
}

function ReservationDateRangeFilter({
  startDate,
  endDate,
  onChange,
  mobile = false,
}: {
  startDate: string;
  endDate: string;
  onChange: (range: DateRange | undefined) => void;
  mobile?: boolean;
}) {
  const range = {
    from: inputValueToDate(startDate),
    to: inputValueToDate(endDate),
  };
  const label = range.from && range.to
    ? `${format(range.from, "d MMM yyyy", { locale: fr })} – ${format(range.to, "d MMM yyyy", { locale: fr })}`
    : range.from
      ? `À partir du ${format(range.from, "d MMM yyyy", { locale: fr })}`
      : "Toutes les dates";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          aria-label="Filtrer par période"
          className={`justify-start rounded-xl font-normal ${mobile ? "h-10 w-full" : "h-10 w-[230px] shrink-0"}`}
        >
          <CalendarDays className="mr-2 h-4 w-4 shrink-0" />
          <span className="truncate">{label}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="range"
          selected={range}
          onSelect={onChange}
          numberOfMonths={1}
          locale={fr}
        />
      </PopoverContent>
    </Popover>
  );
}

export default function AdminReservationsPage() {
  const reservations = useAdminReservationsStore((state) => state.reservations);
  const total = useAdminReservationsStore((state) => state.total);
  const stats = useAdminReservationsStore((state) => state.stats);
  const filters = useAdminReservationsStore((state) => state.filters);
  const isLoading = useAdminReservationsStore((state) => state.isLoading);
  const isLoadingStats = useAdminReservationsStore((state) => state.isLoadingStats);
  const isLoadingDetails = useAdminReservationsStore((state) => state.isLoadingDetails);
  const error = useAdminReservationsStore((state) => state.error);
  const statsError = useAdminReservationsStore((state) => state.statsError);
  const detailsError = useAdminReservationsStore((state) => state.detailsError);
  const loadReservations = useAdminReservationsStore((state) => state.loadReservations);
  const loadStats = useAdminReservationsStore((state) => state.loadStats);
  const loadDetails = useAdminReservationsStore((state) => state.loadDetails);
  const changeStatus = useAdminReservationsStore((state) => state.changeStatus);
  const recordRefund = useAdminReservationsStore((state) => state.recordRefund);
  const setPage = useAdminReservationsStore((state) => state.setPage);
  const setPerPage = useAdminReservationsStore((state) => state.setPerPage);
  const setFilters = useAdminReservationsStore((state) => state.setFilters);
  const page = useAdminReservationsStore((state) => state.page);
  const perPage = useAdminReservationsStore((state) => state.perPage);

  const [detailOpen, setDetailOpen] = useState(false);
  const [refundOpen, setRefundOpen] = useState(false);
  const [selected, setSelected] = useState<AdminReservation | null>(null);
  const [refundReference, setRefundReference] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadReservations(filters, page, perPage).catch(() => undefined);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [filters.status, filters.search, filters.startDate, filters.endDate, page, perPage, loadReservations]);

  useEffect(() => {
    void loadStats(filters.startDate || undefined, filters.endDate || undefined).catch(() => undefined);
  }, [filters.startDate, filters.endDate, loadStats]);

  const tabs = useMemo(() => STATUS_TABS.map((tab) => {
    const countByStatus: Partial<Record<ReservationStatus, number>> = {
      EN_ATTENTE: stats.pending,
      CONFIRMEE: stats.confirmed,
      EN_COURS: stats.ongoing,
      TERMINEE: stats.completed,
      ANNULEE: stats.cancelled,
    };
    const count = tab.value === "ALL"
      ? stats.total
      : countByStatus[tab.value as ReservationStatus];
    return {
      ...tab,
      ...(count !== undefined ? { count } : {}),
    };
  }), [stats]);

  const statCards: StatCard[] = [
    { icon: CalendarCheck, label: "Réservations totales", value: stats.total, color: "bg-emerald-50 text-emerald-700" },
    { icon: CheckCircle2, label: "Confirmées", value: stats.confirmed, color: "bg-emerald-50 text-emerald-700" },
    { icon: Clock, label: "En attente", value: stats.pending, color: "bg-amber-50 text-amber-700" },
    { icon: XCircle, label: "Annulées", value: stats.cancelled, color: "bg-rose-50 text-rose-700" },
    { icon: Flag, label: "Terminées", value: stats.completed, color: "bg-blue-50 text-blue-700" },
    { icon: Wallet, label: "Montant payé", value: stats.grossPaid, color: "bg-violet-50 text-violet-700", isCurrency: true },
  ];

  const openDetails = async (reservation: AdminReservation) => {
    setSelected(reservation);
    setActionError(null);
    setDetailOpen(true);
    try {
      setSelected(await loadDetails(reservation.id));
    } catch {
      // The detail error is displayed in the open dialog.
    }
  };

  const runStatusChange = async (status: ReservationStatus) => {
    if (!selected || status === selected.status) return;
    setActionError(null);
    setIsSaving(true);
    try {
      await changeStatus(selected.id, status);
      setSelected(await loadDetails(selected.id));
    } catch (statusError) {
      setActionError(statusError instanceof Error ? statusError.message : "Le statut n’a pas pu être modifié.");
    } finally {
      setIsSaving(false);
    }
  };

  const submitRefund = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selected) return;
    setActionError(null);
    setIsSaving(true);
    try {
      await recordRefund(selected.id, {
        external_reference: refundReference,
        reason: refundReason,
      });
      setSelected(await loadDetails(selected.id));
      setRefundOpen(false);
      setRefundReference("");
      setRefundReason("");
    } catch (refundError) {
      setActionError(refundError instanceof Error ? refundError.message : "Le remboursement n’a pas pu être enregistré.");
    } finally {
      setIsSaving(false);
    }
  };

  const columns: Column<AdminReservation>[] = [
    {
      key: "reference",
      label: "Réservation",
      render: (reservation) => (
        <div>
          <p className="text-xs font-bold text-slate-800">{reservation.reference}</p>
          <p className="mt-0.5 text-[10px] text-slate-400">{dateLabel(reservation.createdAt)}</p>
        </div>
      ),
    },
    {
      key: "client",
      label: "Client",
      render: (reservation) => (
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700">
            {initials(reservation)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-slate-800">{displayName(reservation)}</p>
            <p className="truncate text-[10px] text-slate-400">{reservation.clientEmail}</p>
          </div>
        </div>
      ),
    },
    {
      key: "establishment",
      label: "Établissement",
      render: (reservation) => (
        <div className="min-w-40">
          <p className="max-w-48 truncate text-xs font-semibold text-slate-800">
            {reservation.establishmentName ?? "Établissement"}
          </p>
          <p className="mt-1 text-[10px] font-medium text-emerald-700">
            {readableCategory(reservation.establishmentCategory ?? reservation.category)}
          </p>
        </div>
      ),
    },
    {
      key: "dates",
      label: "Dates",
      render: (reservation) => (
        <div>
          <p className="text-xs font-medium text-slate-700">
            {reservation.startDate ? formatStayDates(reservation.startDate, reservation.endDate ?? reservation.startDate) : dateLabel(reservation.reservationDate)}
          </p>
          <p className="mt-0.5 text-[10px] text-slate-400">
            {reservation.nights != null ? `${reservation.nights} nuit${reservation.nights === 1 ? "" : "s"} · ` : ""}
            {reservation.adults + reservation.children} voyageur{reservation.adults + reservation.children === 1 ? "" : "s"}
          </p>
        </div>
      ),
    },
    {
      key: "amount",
      label: "Montant",
      render: (reservation) => (
        <div>
          <p className="text-xs font-bold text-slate-800">{formatAmount(reservation.total, reservation.currency)}</p>
          <Badge variant="outline" className={`mt-1 text-[9px] font-semibold ${PAYMENT_STATUS_STYLES[reservation.paymentStatus].className}`}>
            {PAYMENT_STATUS_STYLES[reservation.paymentStatus].label}
          </Badge>
        </div>
      ),
    },
    {
      key: "status",
      label: "Statut",
      render: (reservation) => (
        <Badge variant="outline" className={`text-[10px] font-semibold ${STATUS_STYLES_RES[reservation.status].className}`}>
          {STATUS_STYLES_RES[reservation.status].label}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "",
      className: "text-right",
      render: (reservation) => {
        const actions: ActionItem[] = [
          { label: "Voir les détails", icon: Eye, onClick: () => void openDetails(reservation) },
        ];
        if (reservation.paymentStatus === "PAYE") {
          actions.push({
            label: "Enregistrer un remboursement",
            icon: RotateCcw,
            onClick: () => {
              setSelected(reservation);
              setRefundReference("");
              setRefundReason("");
              setActionError(null);
              setRefundOpen(true);
            },
            separatorBefore: true,
          });
        }
        return <ActionsDropdown actions={actions} />;
      },
    },
  ];

  const activeStatus = filters.status;
  const selectStatus = (value: string) => {
    setFilters({ status: value as ReservationStatus | "ALL" });
  };
  const resetFilters = () => {
    setFilters({ status: "ALL", search: "", startDate: "", endDate: "" });
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Réservations" }]}
        title="Réservations"
        description="Suivez les réservations, leur statut et les paiements associés."
      />

      {statsError && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{statsError}</p>}
      <StatsGrid cards={statCards} columns={6} loading={isLoadingStats} />
      <TabsBar tabs={tabs} active={activeStatus} onChange={selectStatus} />

      <FilterBar
        search={filters.search}
        onSearchChange={(value) => setFilters({ search: value })}
        searchPlaceholder="Référence, client ou identifiant..."
        onReset={resetFilters}
        activeFiltersCount={(activeStatus === "ALL" ? 0 : 1) + (filters.startDate || filters.endDate ? 1 : 0)}
        desktopFilters={
          <>
            <FilterSelect
              value={activeStatus}
              onValueChange={selectStatus}
              placeholder="Tous les statuts"
              width="w-[170px]"
              options={[
                { value: "ALL", label: "Tous les statuts" },
                ...STATUSES.map((status) => ({ value: status, label: STATUS_STYLES_RES[status].label })),
              ]}
            />
            <ReservationDateRangeFilter
              startDate={filters.startDate}
              endDate={filters.endDate}
              onChange={(range) => setFilters({
                startDate: dateToInputValue(range?.from),
                endDate: dateToInputValue(range?.to),
              })}
            />
          </>
        }
        mobileFilters={
          <>
            <FilterChips
              label="Statut"
              value={activeStatus}
              onChange={selectStatus}
              options={[
                { value: "ALL", label: "Tous" },
                ...STATUSES.map((status) => ({ value: status, label: STATUS_STYLES_RES[status].label })),
              ]}
            />
            <ReservationDateRangeFilter
              mobile
              startDate={filters.startDate}
              endDate={filters.endDate}
              onChange={(range) => setFilters({
                startDate: dateToInputValue(range?.from),
                endDate: dateToInputValue(range?.to),
              })}
            />
          </>
        }
      />

      {error && (
        <div role="alert" className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{error}</p>
          <Button variant="outline" size="sm" className="ml-auto shrink-0" onClick={() => void loadReservations(filters, page, perPage).catch(() => undefined)}>
            <RefreshCw className="mr-2 h-3.5 w-3.5" />Réessayer
          </Button>
        </div>
      )}

      <div className="relative">
        {isLoading && <div className="absolute inset-0 z-10 flex items-start justify-center rounded-2xl bg-white/70 pt-12 backdrop-blur-[1px]"><Loader2 className="h-6 w-6 animate-spin text-emerald-700" /></div>}
        <DataTable
          data={reservations}
          columns={columns}
          onRowClick={(reservation) => void openDetails(reservation)}
          selectable={false}
          emptyMessage={error ? "Impossible de charger les réservations." : "Aucune réservation ne correspond à ces filtres."}
        />
      </div>
      <Pagination
        page={page}
        perPage={perPage}
        total={total}
        onPageChange={setPage}
        onPerPageChange={setPerPage}
        itemLabel="réservations"
        perPageOptions={[10, 20, 50, 100]}
      />

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="flex h-[90dvh] max-h-[90dvh] w-[96vw] max-w-[96vw] flex-col gap-0 overflow-hidden rounded-2xl border-0 p-0 shadow-2xl sm:max-w-5xl">
          {selected && (
            <>
              <div className="shrink-0 border-b border-slate-100 bg-gradient-to-r from-emerald-50 via-white to-white px-5 py-5 sm:px-8">
                <DialogHeader className="text-left">
                  <div className="flex items-start gap-3">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-700 text-white shadow-sm">
                      <CalendarCheck className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <DialogTitle className="text-xl font-bold text-slate-900">{selected.reference}</DialogTitle>
                      <DialogDescription className="mt-1">{displayName(selected)} · {selected.clientEmail}</DialogDescription>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Badge variant="outline" className={STATUS_STYLES_RES[selected.status].className}>{STATUS_STYLES_RES[selected.status].label}</Badge>
                        <Badge variant="outline" className={PAYMENT_STATUS_STYLES[selected.paymentStatus].className}>{PAYMENT_STATUS_STYLES[selected.paymentStatus].label}</Badge>
                      </div>
                    </div>
                  </div>
                </DialogHeader>
              </div>

              <div className="min-h-0 flex-1 space-y-5 overflow-y-auto bg-slate-50/60 px-4 py-5 sm:px-8">
                {(actionError || detailsError) && (
                  <div role="alert" className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                    <p>{actionError ?? detailsError}</p>
                  </div>
                )}
                {isLoadingDetails && <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-8 text-slate-500"><Loader2 className="h-5 w-5 animate-spin" /></div>}

                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <SummaryCard label="Montant total" value={formatAmount(selected.total, selected.currency)} icon={Wallet} />
                  <SummaryCard label="Date de réservation" value={dateLabel(selected.reservationDate ?? selected.createdAt)} icon={CalendarCheck} />
                  <SummaryCard label="Voyageurs" value={`${selected.adults + selected.children} personne${selected.adults + selected.children === 1 ? "" : "s"}`} icon={Eye} />
                  <SummaryCard label="Catégorie" value={readableCategory(selected.category)} icon={Flag} />
                </section>

                <section className="grid gap-5 lg:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <SectionHeading title="Séjour et client" description="Informations communiquées lors de la réservation." />
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <DetailField label="Arrivée / date" value={dateLabel(selected.startDate ?? selected.reservationDate)} />
                      <DetailField label="Départ" value={dateLabel(selected.endDate)} />
                      <DetailField label="Heure de début" value={selected.startTime ?? "Non renseignée"} />
                      <DetailField label="Heure de fin" value={selected.endTime ?? "Non renseignée"} />
                      <DetailField label="Durée" value={selected.nights != null ? `${selected.nights} nuit${selected.nights === 1 ? "" : "s"}` : "Non applicable"} />
                      <DetailField label="Quantité" value={String(selected.quantity)} />
                      <DetailField label="Adultes" value={String(selected.adults)} />
                      <DetailField label="Enfants" value={String(selected.children)} />
                      <DetailField label="Chambre / unité" value={selected.roomOrUnit ?? "Non renseignée"} />
                      <DetailField label="Téléphone" value={selected.clientPhone ?? "Non renseigné"} />
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                      <SectionHeading title="Paiement" description="Détail des montants et de la transaction." />
                      <div className="mt-4 space-y-3">
                        <DetailField label="Sous-total" value={formatAmount(selected.subtotal, selected.currency)} />
                        <DetailField label="Frais de service" value={formatAmount(selected.serviceFee, selected.currency)} />
                        <div className="flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50/60 p-3">
                          <span className="text-xs font-semibold text-emerald-800">Total</span>
                          <span className="text-sm font-bold text-emerald-800">{formatAmount(selected.total, selected.currency)}</span>
                        </div>
                        <DetailField label="Mode de paiement" value={selected.paymentMethod ? PAYMENT_METHOD_STYLES[selected.paymentMethod].label : "Non renseigné"} />
                        <DetailField label="Prestataire" value={selected.paymentProvider ?? "Non renseigné"} />
                        <DetailField label="Référence paiement" value={selected.paymentReference ?? "Non renseignée"} />
                        <DetailField label="Paiement effectué le" value={dateLabel(selected.paidAt)} />
                      </div>
                      {selected.paymentStatus === "PAYE" && (
                        <Button
                          className="mt-4 w-full rounded-xl border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100"
                          variant="outline"
                          onClick={() => {
                            setRefundReference("");
                            setRefundReason("");
                            setActionError(null);
                            setRefundOpen(true);
                          }}
                        >
                          <RotateCcw className="mr-2 h-4 w-4" />Enregistrer un remboursement
                        </Button>
                      )}
                    </div>
                  </div>
                </section>

                {(selected.specialRequests || selected.cancellationReason || optionLabels(selected.options).length > 0) && (
                  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <SectionHeading title="Compléments" description="Options et notes liées à la réservation." />
                    <div className="mt-4 space-y-4">
                      {optionLabels(selected.options).length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {optionLabels(selected.options).map((option) => <Badge key={option} variant="outline" className="rounded-full">{option}</Badge>)}
                        </div>
                      )}
                      {selected.specialRequests && <DetailField label="Demandes spéciales" value={selected.specialRequests} />}
                      {selected.cancellationReason && <DetailField label="Motif d’annulation" value={selected.cancellationReason} />}
                    </div>
                  </section>
                )}
              </div>

              <DialogFooter className="shrink-0 flex-row items-center justify-between gap-3 border-t border-slate-100 bg-white px-4 py-3 sm:px-8">
                <label className="flex min-w-0 items-center gap-2 text-xs font-medium text-slate-500 sm:text-sm">
                  <span className="hidden sm:inline">Statut</span>
                  <select
                    value={selected.status}
                    disabled={isSaving}
                    onChange={(event) => void runStatusChange(event.target.value as ReservationStatus)}
                    className="h-10 max-w-48 rounded-xl border border-slate-200 bg-white px-2 text-xs text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:px-3 sm:text-sm"
                  >
                    {STATUSES.map((status) => <option key={status} value={status}>{STATUS_STYLES_RES[status].label}</option>)}
                  </select>
                </label>
                <Button variant="outline" className="shrink-0 rounded-xl" onClick={() => setDetailOpen(false)}>Fermer</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={refundOpen} onOpenChange={(open) => {
        setRefundOpen(open);
        if (!open) setActionError(null);
      }}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle>Enregistrer un remboursement</DialogTitle>
            <DialogDescription>
              Cette action consigne un remboursement déjà effectué auprès du prestataire de paiement. Elle ne déclenche pas le transfert d’argent.
            </DialogDescription>
          </DialogHeader>
          {selected && (
            <form onSubmit={submitRefund} className="space-y-4">
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm">
                <p className="font-semibold text-amber-900">{selected.reference}</p>
                <p className="mt-1 text-amber-800">{formatAmount(selected.total, selected.currency)} · {displayName(selected)}</p>
              </div>
              {actionError && <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{actionError}</p>}
              <label className="block space-y-1.5 text-sm font-medium text-slate-700">
                Référence du remboursement
                <Input required minLength={3} maxLength={255} value={refundReference} onChange={(event) => setRefundReference(event.target.value)} placeholder="Référence fournie par le prestataire" className="h-11 rounded-xl" />
              </label>
              <label className="block space-y-1.5 text-sm font-medium text-slate-700">
                Motif
                <textarea required minLength={3} maxLength={1000} value={refundReason} onChange={(event) => setRefundReason(event.target.value)} placeholder="Expliquez la raison du remboursement..." rows={3} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
              </label>
              <DialogFooter className="gap-2">
                <Button type="button" variant="outline" disabled={isSaving} onClick={() => setRefundOpen(false)}>Retour</Button>
                <Button type="submit" disabled={isSaving} className="rounded-xl bg-emerald-700 hover:bg-emerald-800">
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Confirmer l’enregistrement
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SummaryCard({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Wallet }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><Icon className="h-4 w-4" /></div>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
          <p className="mt-1 truncate text-sm font-bold text-slate-800">{value}</p>
        </div>
      </div>
    </div>
  );
}

function SectionHeading({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h3 className="text-sm font-bold text-slate-900">{title}</h3>
      <p className="mt-0.5 text-xs text-slate-500">{description}</p>
    </div>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 items-start justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3">
      <span className="shrink-0 text-[11px] font-medium text-slate-400">{label}</span>
      <span className="break-all text-right text-xs font-semibold text-slate-700">{value}</span>
    </div>
  );
}
