"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Building2,
  CheckCircle2,
  Clock3,
  Eye,
  MapPin,
  Star,
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
import { useAdminEstablishmentsStore } from "@/store/useAdminEstablishmentsStore";
import {
  CATEGORY_STYLES_EST,
  STATUS_STYLES_EST,
  type AdminEstablishment,
  type EstablishmentStatus,
} from "@/types/establishment";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ClientOnlyDate } from "@/components/ui/clientonlydate";

const STATUSES: EstablishmentStatus[] = ["EN_ATTENTE", "PUBLIE", "REJETE", "SUSPENDU"];

function formatPrice(value: number | null, currency: string) {
  return value === null ? "Non renseigné" : `${value.toLocaleString("fr-FR")} ${currency}`;
}

function DetailItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold text-slate-800">{value || "—"}</p>
    </div>
  );
}

export default function AdminEstablishmentsPage() {
  const searchParams = useSearchParams();
  const establishments = useAdminEstablishmentsStore((state) => state.establishments);
  const total = useAdminEstablishmentsStore((state) => state.total);
  const stats = useAdminEstablishmentsStore((state) => state.stats);
  const categories = useAdminEstablishmentsStore((state) => state.categories);
  const page = useAdminEstablishmentsStore((state) => state.page);
  const perPage = useAdminEstablishmentsStore((state) => state.perPage);
  const search = useAdminEstablishmentsStore((state) => state.search);
  const statusFilter = useAdminEstablishmentsStore((state) => state.statusFilter);
  const categoryFilter = useAdminEstablishmentsStore((state) => state.categoryFilter);
  const isLoading = useAdminEstablishmentsStore((state) => state.isLoading);
  const error = useAdminEstablishmentsStore((state) => state.error);
  const loadEstablishments = useAdminEstablishmentsStore((state) => state.loadEstablishments);
  const loadStats = useAdminEstablishmentsStore((state) => state.loadStats);
  const [selected, setSelected] = useState<AdminEstablishment | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const load = useCallback(() => loadEstablishments().catch(() => undefined), [loadEstablishments]);

  useEffect(() => {
    const requestedStatus = searchParams.get("status");
    useAdminEstablishmentsStore.getState().setStatusFilter(
      requestedStatus && STATUSES.includes(requestedStatus as EstablishmentStatus)
        ? requestedStatus as EstablishmentStatus
        : "ALL",
    );
    void useAdminEstablishmentsStore.getState().loadReferences().catch(() => undefined);
    void loadStats().catch(() => undefined);
  }, [loadStats, searchParams]);

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 250);
    return () => window.clearTimeout(timer);
  }, [load, page, perPage, search, statusFilter, categoryFilter]);

  const openDetails = async (establishment: AdminEstablishment) => {
    setSelected(establishment);
    setDetailLoading(true);
    setDetailError(null);
    try {
      setSelected(await useAdminEstablishmentsStore.getState().loadDetails(establishment.id));
    } catch (loadError) {
      setDetailError(loadError instanceof Error ? loadError.message : "Le détail ne peut pas être chargé.");
    } finally {
      setDetailLoading(false);
    }
  };

  const statCards: StatCard[] = [
    { icon: Building2, label: "Total établissements", value: stats.total, color: "bg-emerald-50 text-emerald-700" },
    { icon: Clock3, label: "En attente", value: stats.enAttente, color: "bg-amber-50 text-amber-700" },
    { icon: CheckCircle2, label: "Publiés", value: stats.publies, color: "bg-blue-50 text-blue-700" },
    { icon: XCircle, label: "Rejetés", value: stats.rejetes, color: "bg-rose-50 text-rose-700" },
  ];

  const tabs: Tab[] = [
    { value: "ALL", label: "Tous", count: stats.total },
    { value: "PUBLIE", label: "Publiés", count: stats.publies },
    { value: "EN_ATTENTE", label: "En attente", count: stats.enAttente },
    { value: "REJETE", label: "Rejetés", count: stats.rejetes },
    { value: "SUSPENDU", label: "Suspendus", count: stats.suspendus },
  ];

  const columns: Column<AdminEstablishment>[] = [
    {
      key: "image",
      label: "Image",
      render: (establishment) => establishment.images[0]
        ? <img src={establishment.images[0]} alt="" className="h-11 w-14 rounded-lg object-cover" />
        : <div className="grid h-11 w-14 place-items-center rounded-lg bg-slate-100 text-xs text-slate-400">—</div>,
    },
    {
      key: "name",
      label: "Nom",
      render: (establishment) => <span className="font-semibold text-slate-800">{establishment.name}</span>,
    },
    {
      key: "category",
      label: "Catégorie",
      render: (establishment) => {
        const style = CATEGORY_STYLES_EST[establishment.category.toUpperCase()];
        return (
          <Badge variant="outline" className={`text-[10px] font-semibold ${style?.className ?? "border-slate-200 bg-slate-50 text-slate-700"}`}>
            {style?.label ?? establishment.category}
          </Badge>
        );
      },
    },
    {
      key: "location",
      label: "Localisation",
      render: (establishment) => (
        <div className="flex items-center gap-1 text-xs text-slate-600">
          <MapPin className="h-3 w-3 text-emerald-600" />
          {establishment.location.city || establishment.location.country || establishment.address || "—"}
          {establishment.location.city && establishment.location.country ? `, ${establishment.location.country}` : ""}
        </div>
      ),
    },
    {
      key: "price",
      label: "Prix",
      render: (establishment) => (
        <span className="text-xs font-semibold text-slate-700">
          {establishment.price.toLocaleString("fr-FR")} {establishment.currency}
          {establishment.priceUnit ? ` / ${establishment.priceUnit.toLowerCase()}` : ""}
        </span>
      ),
    },
    {
      key: "status",
      label: "Statut",
      render: (establishment) => (
        <Badge variant="outline" className={`text-[10px] font-semibold ${STATUS_STYLES_EST[establishment.status].className}`}>
          {STATUS_STYLES_EST[establishment.status].label}
        </Badge>
      ),
    },
    {
      key: "date",
      label: "Date d’ajout",
      render: (establishment) => (
        <span className="text-xs text-slate-500">
          {establishment.createdAt ? <ClientOnlyDate date={establishment.createdAt} /> : "—"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "",
      className: "text-right",
      render: (establishment) => {
        const actions: ActionItem[] = [
          { label: "Voir les détails", icon: Eye, onClick: () => void openDetails(establishment) },
        ];
        return <ActionsDropdown actions={actions} />;
      },
    },
  ];

  const selectStatus = (value: string) => {
    useAdminEstablishmentsStore.getState().setStatusFilter(
      value === "PUBLIE" || value === "EN_ATTENTE" || value === "REJETE" || value === "SUSPENDU"
        ? value
        : "ALL",
    );
  };
  const selectCategory = (value: string) => useAdminEstablishmentsStore.getState().setCategoryFilter(value);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Établissements" }]}
        title="Établissements"
        description="Consultez les établissements de la plateforme et leurs informations détaillées."
      />

      <StatsGrid cards={statCards} columns={4} loading={isLoading && stats.total === 0} />
      <TabsBar tabs={tabs} active={statusFilter} onChange={selectStatus} />

      <FilterBar
        search={search}
        onSearchChange={(value) => useAdminEstablishmentsStore.getState().setSearch(value)}
        searchPlaceholder="Rechercher un établissement..."
        onReset={() => {
          useAdminEstablishmentsStore.getState().setSearch("");
          selectStatus("ALL");
          selectCategory("ALL");
        }}
        activeFiltersCount={(statusFilter === "ALL" ? 0 : 1) + (categoryFilter === "ALL" ? 0 : 1)}
        desktopFilters={
          <>
            <FilterSelect
              value={categoryFilter}
              onValueChange={selectCategory}
              placeholder="Toutes catégories"
              options={[{ value: "ALL", label: "Toutes catégories" }, ...categories.map((category) => ({ value: category.id, label: category.name }))]}
            />
            <FilterSelect
              value={statusFilter}
              onValueChange={selectStatus}
              placeholder="Tous statuts"
              options={[{ value: "ALL", label: "Tous statuts" }, ...STATUSES.map((status) => ({ value: status, label: STATUS_STYLES_EST[status].label }))]}
            />
          </>
        }
        mobileFilters={
          <>
            <FilterChips
              label="Catégorie"
              value={categoryFilter}
              onChange={selectCategory}
              options={[{ value: "ALL", label: "Toutes" }, ...categories.map((category) => ({ value: category.id, label: category.name }))]}
            />
            <FilterChips
              label="Statut"
              value={statusFilter}
              onChange={selectStatus}
              options={[{ value: "ALL", label: "Tous" }, ...STATUSES.map((status) => ({ value: status, label: STATUS_STYLES_EST[status].label }))]}
            />
          </>
        }
      />

      {error && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <span role="alert">{error}</span>
          <button type="button" className="font-semibold underline" onClick={() => void load()}>Réessayer</button>
        </div>
      )}

      <DataTable
        data={establishments}
        columns={columns}
        selectable={false}
        emptyMessage={isLoading ? "Chargement des établissements..." : "Aucun établissement trouvé."}
        onRowClick={(establishment) => void openDetails(establishment)}
      />
      <Pagination
        page={page}
        perPage={perPage}
        total={total}
        onPageChange={(value) => useAdminEstablishmentsStore.getState().setPage(value)}
        onPerPageChange={(value) => useAdminEstablishmentsStore.getState().setPerPage(value)}
        itemLabel="établissements"
        perPageOptions={[8, 16, 32, 50, 100]}
      />

      <Dialog open={selected !== null} onOpenChange={(open) => { if (!open) setSelected(null); }}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto rounded-2xl">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selected.name}</DialogTitle>
                <DialogDescription>
                  {selected.slug ? `/${selected.slug} · ` : ""}
                  {selected.category}{selected.subcategory ? ` · ${selected.subcategory}` : ""}
                </DialogDescription>
              </DialogHeader>

              {detailLoading ? (
                <p role="status" className="py-10 text-center text-sm text-slate-500">Chargement du détail...</p>
              ) : detailError ? (
                <div className="space-y-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                  <p role="alert">{detailError}</p>
                  <Button type="button" variant="outline" onClick={() => void openDetails(selected)}>Réessayer</Button>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className={STATUS_STYLES_EST[selected.status].className}>
                      {STATUS_STYLES_EST[selected.status].label}
                    </Badge>
                    <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-600">
                      {selected.availabilityStatus.replaceAll("_", " ")}
                    </Badge>
                  </div>

                  {selected.photos.length > 0 && (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {selected.photos.map((photo) => (
                        <div key={photo.id} className="relative overflow-hidden rounded-xl border border-slate-200">
                          <img src={photo.url} alt={selected.name} className="h-44 w-full object-cover" />
                          {photo.is_cover && <Badge className="absolute left-2 top-2 bg-emerald-700">Couverture</Badge>}
                        </div>
                      ))}
                    </div>
                  )}

                  {selected.description && (
                    <section>
                      <h2 className="mb-2 text-sm font-semibold text-slate-900">Description</h2>
                      <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">{selected.description}</p>
                    </section>
                  )}

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <DetailItem label="Catégorie" value={selected.category} />
                    <DetailItem label="Sous-catégorie" value={selected.subcategory} />
                    <DetailItem label="Propriétaire" value={selected.owner} />
                    <DetailItem label="Adresse" value={selected.address} />
                    <DetailItem label="Ville / pays" value={[selected.location.city, selected.location.country].filter(Boolean).join(", ")} />
                    <DetailItem label="Prix" value={`${selected.price.toLocaleString("fr-FR")} ${selected.currency}${selected.priceUnit ? ` / ${selected.priceUnit.toLowerCase().replaceAll("_", " ")}` : ""}`} />
                    <DetailItem label="Prix par nuit" value={formatPrice(selected.pricePerNight, selected.currency)} />
                    <DetailItem label="Prix par mois" value={formatPrice(selected.pricePerMonth, selected.currency)} />
                    <DetailItem label="Capacité" value={selected.capacity ?? "—"} />
                    <DetailItem label="Chambres" value={selected.roomsCount ?? "—"} />
                    <DetailItem label="Surface" value={selected.area === null ? "—" : `${selected.area} m²`} />
                    <DetailItem label="Type de cuisine" value={selected.cuisineType ?? "—"} />
                    <DetailItem label="Note moyenne" value={`${selected.rating.toFixed(1)} / 5`} />
                    <DetailItem label="Nombre d’avis" value={selected.reviewCount} />
                    <DetailItem label="Créé le" value={selected.createdAt ? new Date(selected.createdAt).toLocaleDateString("fr-FR") : "—"} />
                  </div>

                  {(selected.latitude !== null || selected.longitude !== null) && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin className="h-4 w-4 text-emerald-700" />
                      Coordonnées : {selected.latitude ?? "—"}, {selected.longitude ?? "—"}
                    </div>
                  )}

                  <section>
                    <h2 className="mb-2 text-sm font-semibold text-slate-900">Équipements</h2>
                    {selected.amenities.length ? (
                      <div className="flex flex-wrap gap-2">
                        {selected.amenities.map((amenity) => (
                          <Badge key={amenity.id} variant="outline" className="border-slate-200 bg-white text-slate-700">
                            {amenity.name}
                          </Badge>
                        ))}
                      </div>
                    ) : <p className="text-sm text-slate-500">Aucun équipement renseigné.</p>}
                  </section>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
