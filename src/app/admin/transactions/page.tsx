"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Clock,
  Eye,
  Loader2,
  ReceiptText,
  RefreshCw,
  RotateCcw,
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
  type ActionItem,
  type Column,
  type StatCard,
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useAdminPaymentsStore,
  readPaymentCurrencyStats,
  readPaymentStat,
} from "@/store/useAdminPaymentsStore";
import { useAdminReservationsStore } from "@/store/useAdminReservationsStore";
import type { AdminPayment, AdminPaymentStatus } from "@/types/adminPayments";
import type { AdminReservation } from "@/types/reservation";
import { PAYMENT_STATUS_STYLES, formatAmount } from "@/utils/reservation.helpers";
import type { DateRange } from "react-day-picker";

const STATUSES: AdminPaymentStatus[] = ["EN_ATTENTE", "PAYE", "REMBOURSE", "ECHOUE"];
const STATUS_OPTIONS = [
  { value: "ALL", label: "Tous les statuts" },
  { value: "EN_ATTENTE", label: "En attente" },
  { value: "PAYE", label: "Payé" },
  { value: "REMBOURSE", label: "Remboursé" },
  { value: "ECHOUE", label: "Échoué" },
];

function dateLabel(date: string): string {
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? date : parsed.toLocaleString("fr-FR");
}

function valueLabel(value: string | number | null | undefined): string {
  return value === null || value === undefined || value === "" ? "Non renseigné" : String(value);
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

function PaymentDateRangeFilter({
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

export default function AdminTransactionsPage() {
  const payments = useAdminPaymentsStore((state) => state.payments);
  const total = useAdminPaymentsStore((state) => state.total);
  const stats = useAdminPaymentsStore((state) => state.stats);
  const filters = useAdminPaymentsStore((state) => state.filters);
  const page = useAdminPaymentsStore((state) => state.page);
  const perPage = useAdminPaymentsStore((state) => state.perPage);
  const isLoading = useAdminPaymentsStore((state) => state.isLoading);
  const isLoadingStats = useAdminPaymentsStore((state) => state.isLoadingStats);
  const isLoadingDetails = useAdminPaymentsStore((state) => state.isLoadingDetails);
  const error = useAdminPaymentsStore((state) => state.error);
  const statsError = useAdminPaymentsStore((state) => state.statsError);
  const detailsError = useAdminPaymentsStore((state) => state.detailsError);
  const selectedPayment = useAdminPaymentsStore((state) => state.selectedPayment);
  const loadPayments = useAdminPaymentsStore((state) => state.loadPayments);
  const loadStats = useAdminPaymentsStore((state) => state.loadStats);
  const loadDetails = useAdminPaymentsStore((state) => state.loadDetails);
  const loadReservationDetails = useAdminReservationsStore((state) => state.loadDetails);
  const isLoadingReservation = useAdminReservationsStore((state) => state.isLoadingDetails);
  const setFilters = useAdminPaymentsStore((state) => state.setFilters);
  const setPage = useAdminPaymentsStore((state) => state.setPage);
  const setPerPage = useAdminPaymentsStore((state) => state.setPerPage);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<AdminReservation | null>(null);
  const [reservationError, setReservationError] = useState<string | null>(null);
  const detailRequestId = useRef(0);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadPayments(filters, page, perPage).catch(() => undefined);
    }, 250);
    return () => window.clearTimeout(timer);
  }, [filters.search, filters.status, filters.provider, filters.type, filters.startDate, filters.endDate, page, perPage, loadPayments]);

  useEffect(() => {
    void loadStats(filters).catch(() => undefined);
  }, [filters.startDate, filters.endDate, filters.provider, filters.status, filters.type, loadStats]);

  const providers = useMemo(() => [...new Set(payments.map((payment) => payment.provider).filter((provider): provider is string => Boolean(provider)))], [payments]);
  const paymentTypes = useMemo(() => [...new Set(payments.map((payment) => payment.paymentType).filter((type): type is string => Boolean(type)))], [payments]);
  const paymentCurrencyStats = readPaymentCurrencyStats(stats, "payments_by_currency");
  const refundCurrencyStats = readPaymentCurrencyStats(stats, "refunds_by_currency");
  const paymentCount = (status: AdminPaymentStatus) => paymentCurrencyStats.reduce(
    (total, currency) => total + (currency.byStatus[status]?.count ?? 0),
    0,
  );
  const paymentStatusAvailable = (status: AdminPaymentStatus) => paymentCurrencyStats.some(
    (currency) => currency.byStatus[status]?.count !== null && currency.byStatus[status]?.count !== undefined,
  );
  const totalPaymentCount = paymentCurrencyStats.length > 0
    ? paymentCurrencyStats.reduce((total, currency) => total + (currency.totalCount ?? 0), 0)
    : readPaymentStat(stats, ["total", "total_transactions", "transactions_count", "total_payments", "payment_count", "count"]);
  const refundedCount = refundCurrencyStats.reduce((total, currency) => total + (currency.totalCount ?? 0), 0);

  const statCards: StatCard[] = [
    { icon: ReceiptText, label: "Transactions", value: totalPaymentCount ?? "—", color: "bg-emerald-50 text-emerald-700" },
    { icon: CheckCircle2, label: "Paiements réussis", value: paymentStatusAvailable("PAYE") ? paymentCount("PAYE") : readPaymentStat(stats, ["paid", "successful", "successful_count", "paid_count", "paid_payments", "successful_payments"]) ?? "—", color: "bg-blue-50 text-blue-700" },
    { icon: Clock, label: "En attente", value: paymentStatusAvailable("EN_ATTENTE") ? paymentCount("EN_ATTENTE") : readPaymentStat(stats, ["pending", "pending_count", "pending_payments"]) ?? "—", color: "bg-amber-50 text-amber-700" },
    { icon: RotateCcw, label: "Remboursés", value: refundCurrencyStats.length > 0 ? refundedCount : readPaymentStat(stats, ["refunded", "refunded_count", "refunded_payments"]) ?? "—", color: "bg-violet-50 text-violet-700" },
    { icon: XCircle, label: "Échoués", value: paymentStatusAvailable("ECHOUE") ? paymentCount("ECHOUE") : readPaymentStat(stats, ["failed", "failed_count", "error_count", "failed_payments"]) ?? "—", color: "bg-rose-50 text-rose-700" },
  ];

  const openDetails = async (payment: AdminPayment) => {
    if (!payment.transactionId) return;
    const requestId = ++detailRequestId.current;
    setSelectedReservation(null);
    setReservationError(null);
    setDetailOpen(true);
    try {
      const details = await loadDetails(payment.transactionId);
      const reservationId = details.reservationId ?? details.reservation?.id;
      if (!reservationId) return;
      try {
        const reservation = await loadReservationDetails(reservationId);
        if (requestId !== detailRequestId.current) return;
        setSelectedReservation(reservation);
      } catch (loadError) {
        if (requestId === detailRequestId.current) {
          setReservationError(loadError instanceof Error
            ? loadError.message
            : "Les informations détaillées de la réservation n’ont pas pu être chargées.");
        }
      }
    } catch {
      // The detail error is displayed in the dialog.
    }
  };

  const columns: Column<AdminPayment>[] = [
    {
      key: "transaction",
      label: "Transaction",
      render: (payment) => (
        <div>
          <p className="font-mono text-xs font-bold text-slate-800">{payment.transactionRef}</p>
          <p className="mt-0.5 text-[10px] text-slate-400">{dateLabel(payment.createdAt)}</p>
        </div>
      ),
    },
    {
      key: "reservation",
      label: "Réservation",
      render: (payment) => (
        <div>
          <p className="text-xs font-semibold text-slate-700">{payment.reservationReference || payment.reservation?.reference || "Non renseignée"}</p>
          {payment.reservation?.establishmentName && <p className="mt-0.5 text-[10px] text-slate-400">{payment.reservation.establishmentName}</p>}
        </div>
      ),
    },
    {
      key: "client",
      label: "Client",
      render: (payment) => {
        const name = [payment.client?.firstName, payment.client?.lastName].filter(Boolean).join(" ");
        return (
          <div className="max-w-48">
            <p className="truncate text-xs font-semibold text-slate-700">{name || payment.client?.email || "Non renseigné"}</p>
            {name && payment.client?.email && <p className="truncate text-[10px] text-slate-400">{payment.client.email}</p>}
          </div>
        );
      },
    },
    {
      key: "provider",
      label: "Prestataire",
      render: (payment) => <span className="text-xs text-slate-600">{payment.provider ?? "Non renseigné"}</span>,
    },
    {
      key: "amount",
      label: "Montant",
      render: (payment) => <span className="text-xs font-bold text-slate-800">{formatAmount(payment.amount, payment.currency)}</span>,
    },
    {
      key: "status",
      label: "Statut",
      render: (payment) => <Badge variant="outline" className={`text-[10px] font-semibold ${PAYMENT_STATUS_STYLES[payment.status].className}`}>{PAYMENT_STATUS_STYLES[payment.status].label}</Badge>,
    },
    {
      key: "actions",
      label: "",
      className: "text-right",
      render: (payment) => {
        const actions: ActionItem[] = payment.transactionId ? [
          {
            label: "Voir le détail",
            icon: Eye,
            onClick: () => void openDetails(payment),
          },
        ] : [];
        return <ActionsDropdown actions={actions} />;
      },
    },
  ];

  const resetFilters = () => setFilters({ search: "", status: "ALL", provider: "ALL", type: "ALL", startDate: "", endDate: "" });
  const paymentReservation = selectedPayment?.reservation;
  const establishmentName = selectedReservation?.establishmentName
    ?? paymentReservation?.establishmentName;
  const establishmentCity = selectedReservation?.establishmentCity
    ?? paymentReservation?.establishmentCity;
  const establishmentAddress = selectedReservation?.establishmentAddress
    ?? paymentReservation?.establishmentAddress;
  const establishmentCategory = selectedReservation?.establishmentCategory
    ?? selectedReservation?.category
    ?? paymentReservation?.category;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Transactions" }]}
        title="Transactions"
        description="Consultez les paiements, leur statut et les références associées."
      />

      {statsError && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{statsError}</p>}
      <StatsGrid cards={statCards} columns={5} loading={isLoadingStats} />

      <FilterBar
        search={filters.search}
        onSearchChange={(search) => setFilters({ search })}
        searchPlaceholder="Référence de transaction ou réservation..."
        onReset={resetFilters}
        activeFiltersCount={(filters.status === "ALL" ? 0 : 1) + (filters.provider === "ALL" ? 0 : 1) + (filters.type === "ALL" ? 0 : 1) + (filters.startDate || filters.endDate ? 1 : 0)}
        desktopFilters={
          <>
            <FilterSelect value={filters.status} onValueChange={(status) => setFilters({ status: status as AdminPaymentStatus | "ALL" })} placeholder="Tous les statuts" options={STATUS_OPTIONS} />
            <FilterSelect value={filters.provider} onValueChange={(provider) => setFilters({ provider })} placeholder="Tous les prestataires" options={[{ value: "ALL", label: "Tous les prestataires" }, ...providers.map((provider) => ({ value: provider, label: provider }))]} />
            <FilterSelect value={filters.type} onValueChange={(type) => setFilters({ type })} placeholder="Tous les types" options={[{ value: "ALL", label: "Tous les types" }, ...paymentTypes.map((type) => ({ value: type, label: type.replaceAll("_", " ") }))]} />
            <PaymentDateRangeFilter
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
            <FilterChips label="Statut" value={filters.status} onChange={(status) => setFilters({ status: status as AdminPaymentStatus | "ALL" })} options={[{ value: "ALL", label: "Tous" }, ...STATUSES.map((status) => ({ value: status, label: PAYMENT_STATUS_STYLES[status].label }))]} />
            <FilterChips label="Prestataire" value={filters.provider} onChange={(provider) => setFilters({ provider })} options={[{ value: "ALL", label: "Tous" }, ...providers.map((provider) => ({ value: provider, label: provider }))]} />
            <FilterChips label="Type" value={filters.type} onChange={(type) => setFilters({ type })} options={[{ value: "ALL", label: "Tous" }, ...paymentTypes.map((type) => ({ value: type, label: type.replaceAll("_", " ") }))]} />
            <PaymentDateRangeFilter
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
          <Button variant="outline" size="sm" className="ml-auto shrink-0" onClick={() => void loadPayments(filters, page, perPage).catch(() => undefined)}>
            <RefreshCw className="mr-2 h-3.5 w-3.5" />Réessayer
          </Button>
        </div>
      )}

      <div className="relative">
        {isLoading && <div className="absolute inset-0 z-10 flex justify-center rounded-2xl bg-white/70 pt-12 backdrop-blur-[1px]"><Loader2 className="h-6 w-6 animate-spin text-emerald-700" /></div>}
        <DataTable data={payments} columns={columns} onRowClick={(payment) => void openDetails(payment)} selectable={false} emptyMessage={error ? "Impossible de charger les transactions." : "Aucune transaction ne correspond à ces filtres."} />
      </div>
      <Pagination page={page} perPage={perPage} total={total} onPageChange={setPage} onPerPageChange={setPerPage} itemLabel="transactions" perPageOptions={[10, 20, 50, 100]} />

      <Dialog open={detailOpen} onOpenChange={(open) => {
        setDetailOpen(open);
        if (!open) detailRequestId.current += 1;
      }}>
        <DialogContent className="flex h-[90dvh] max-h-[90dvh] w-[96vw] max-w-[96vw] flex-col gap-0 overflow-hidden rounded-2xl border-0 p-0 shadow-2xl sm:max-w-5xl">
          <DialogHeader className="shrink-0 border-b border-slate-100 bg-gradient-to-r from-emerald-50 via-white to-white px-5 py-5 text-left sm:px-8">
            <DialogTitle>Détail de la transaction</DialogTitle>
            <DialogDescription>Informations de la transaction, de la réservation et du client.</DialogDescription>
          </DialogHeader>
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto bg-slate-50/60 px-4 py-5 sm:px-8">
            {isLoadingDetails && <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-emerald-700" /></div>}
            {detailsError && <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{detailsError}</p>}
            {reservationError && <p role="alert" className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">{reservationError}</p>}
            {selectedPayment && (
              <>
              <section className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900">Transaction</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <PaymentDetail label="Référence" value={selectedPayment.transactionRef} />
                  <PaymentDetail label="Montant" value={formatAmount(selectedPayment.amount, selectedPayment.currency)} />
                  <PaymentDetail label="Statut" value={PAYMENT_STATUS_STYLES[selectedPayment.status].label} />
                  <PaymentDetail label="Prestataire" value={valueLabel(selectedPayment.provider)} />
                  <PaymentDetail label="Type" value={valueLabel(selectedPayment.paymentType)} />
                  <PaymentDetail label="Créée le" value={dateLabel(selectedPayment.createdAt)} />
                  <PaymentDetail label="Mise à jour le" value={dateLabel(selectedPayment.updatedAt)} />
                </div>
              </section>

              <section className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900">Réservation</h3>
                {isLoadingReservation && <div className="flex items-center gap-2 text-sm text-slate-500"><Loader2 className="h-4 w-4 animate-spin" />Chargement des informations de la réservation…</div>}
                <div className="grid gap-3 sm:grid-cols-2">
                  <PaymentDetail label="Nom" value={valueLabel(establishmentName)} />
                  <PaymentDetail label="Lieu" value={[establishmentCity, establishmentAddress].filter(Boolean).join(" · ") || "Non renseigné"} />
                  <PaymentDetail label="Catégorie" value={valueLabel(establishmentCategory)} />
                  <PaymentDetail label="Date de réservation" value={(selectedReservation?.reservationDate ?? selectedPayment.reservation?.reservationDate) ? dateLabel((selectedReservation?.reservationDate ?? selectedPayment.reservation?.reservationDate)!) : "Non renseignée"} />
                  <PaymentDetail label="Total réservation" value={selectedReservation ? formatAmount(selectedReservation.total, selectedReservation.currency) : selectedPayment.reservation?.total === null || selectedPayment.reservation?.total === undefined ? formatAmount(selectedPayment.amount, selectedPayment.currency) : formatAmount(selectedPayment.reservation.total, selectedPayment.reservation.currency ?? selectedPayment.currency)} />
                </div>
              </section>

              <section className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900">Client</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <PaymentDetail label="Nom" value={[selectedPayment.client?.firstName, selectedPayment.client?.lastName].filter(Boolean).join(" ") || "Non renseigné"} />
                  <PaymentDetail label="Email" value={valueLabel(selectedPayment.client?.email)} />
                  <PaymentDetail label="Téléphone" value={valueLabel(selectedReservation?.clientPhone ?? selectedPayment.client?.phone)} />
                </div>
              </section>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PaymentDetail({ label, value }: { label: string; value: string }) {
  return <div className="min-w-0 rounded-xl border border-slate-100 bg-slate-50/60 p-3"><p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 break-all text-sm font-semibold text-slate-700">{value}</p></div>;
}
