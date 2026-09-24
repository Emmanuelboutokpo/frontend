"use client";

import { useState } from "react";
import { Plus, Pencil, Building2, Clock,AlertTriangle, Eye, CheckCircle2, XCircle, Power, Trash2 } from "lucide-react";

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
import { Star, MapPin } from "lucide-react";

import { useAdminEstablishmentsStore } from "@/store/useAdminEstablishmentsStore";

import {
  STATUS_STYLES_EST,
  CATEGORY_STYLES_EST,
  type AdminEstablishment,
  type EstablishmentStatus,
  EstablishmentCategory,
} from "@/types/establishment";

import { useMounted } from "../../../../hook/use-mounted";
import { useAdminTable } from "../../../../hook/admin/useAdminTable";
import { formatEstPrice } from "@/utils/establishment.helpers";
import { ClientOnlyDate } from "@/components/ui/clientonlydate";

export default function AdminEstablishmentsPage() {
  const mounted = useMounted();
  const establishments = useAdminEstablishmentsStore((s) => s.establishments);
  const add = useAdminEstablishmentsStore((s) => s.add);
  const update = useAdminEstablishmentsStore((s) => s.update);
  const remove = useAdminEstablishmentsStore((s) => s.remove);
  const changeStatus = useAdminEstablishmentsStore((s) => s.changeStatus);
  const getStats = useAdminEstablishmentsStore((s) => s.getStats);

  // État UI
  const [tab, setTab] = useState<EstablishmentStatus | "ALL">("ALL");
  const [selected, setSelected] = useState<AdminEstablishment | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Table générique
  const table = useAdminTable<AdminEstablishment, any>({
    data: establishments,
    defaultPerPage: 8,
    initialFilters: {
      search: "",
      category: "ALL",
      status: "ALL",
      country: "ALL",
      city: "ALL",
    },
    filterFn: (e, f) => {
      if (f.search) {
        const q = f.search.toLowerCase();
        if (
          !e.name.toLowerCase().includes(q) &&
          !e.location.city.toLowerCase().includes(q)
        )
          return false;
      }
      if (f.category !== "ALL" && e.category !== f.category) return false;
      if (f.status !== "ALL" && e.status !== f.status) return false;
      if (f.country !== "ALL" && e.location.country !== f.country) return false;
      if (f.city !== "ALL" && e.location.city !== f.city) return false;
      return true;
    },
  });

  // Applique le tab en filtre supplémentaire
  const finalFiltered =
    tab === "ALL"
      ? table.filtered
      : table.filtered.filter((e) => e.status === tab);

  const paginated =
    tab === "ALL"
      ? table.paginated
      : finalFiltered.slice(
          (table.page - 1) * table.perPage,
          table.page * table.perPage
        );

  const stats = mounted
    ? getStats()
    : { total: 0, enAttente: 0, publies: 0, rejetes: 0, suspendus: 0 };

  // Stats cards
  const statCards: StatCard[] = [
    { icon: Building2, label: "Total établissements", value: stats.total, trend: 12, color: "bg-emerald-50 text-emerald-700" },
    { icon: Clock, label: "En attente", value: stats.enAttente, trend: -8, color: "bg-amber-50 text-amber-700" },
    { icon: CheckCircle2, label: "Publiés", value: stats.publies, trend: 15, color: "bg-emerald-50 text-emerald-700" },
    { icon: XCircle, label: "Rejetés", value: stats.rejetes, trend: -20, color: "bg-rose-50 text-rose-700" },
    { icon: AlertTriangle, label: "Suspendus", value: stats.suspendus, trend: -30, color: "bg-orange-50 text-orange-700" },
  ];

  // Tabs
  const tabs: Tab[] = [
    { value: "ALL", label: "Tous", count: establishments.length },
    { value: "PUBLIE", label: "Publiés", count: stats.publies },
    { value: "EN_ATTENTE", label: "En attente", count: stats.enAttente },
    { value: "REJETE", label: "Rejetés", count: stats.rejetes },
    { value: "SUSPENDU", label: "Suspendus", count: stats.suspendus },
  ];

  // Colonnes
  const columns: Column<AdminEstablishment>[] = [
    {
      key: "image",
      label: "Image",
      render: (e) => (
        <img src={e.images[0]} alt={e.name} className="h-11 w-14 rounded-lg object-cover" />
      ),
    },
    {
      key: "name",
      label: "Nom",
      render: (e) => <span className="font-semibold text-slate-800">{e.name}</span>,
    },
    {
      key: "category",
      label: "Catégorie",
      render: (e) => (
        <Badge variant="outline" className={`text-[10px] font-semibold ${CATEGORY_STYLES_EST[e.category].className}`}>
          {CATEGORY_STYLES_EST[e.category].label}
        </Badge>
      ),
    },
    {
      key: "location",
      label: "Localisation",
      render: (e) => (
        <div className="flex items-center gap-1 text-xs text-slate-600">
          <MapPin className="h-3 w-3 text-emerald-600" />
          {e.location.city}, {e.location.country}
        </div>
      ),
    },
    {
      key: "price",
      label: "Prix",
      render: (e) => (
        <span className="text-xs font-semibold text-slate-700">
          {formatEstPrice(e)}
        </span>
      ),
    },
    {
      key: "status",
      label: "Statut",
      render: (e) => (
        <Badge variant="outline" className={`text-[10px] font-semibold ${STATUS_STYLES_EST[e.status].className}`}>
          {STATUS_STYLES_EST[e.status].label}
        </Badge>
      ),
    },
    {
      key: "rating",
      label: "Avis",
      render: (e) => (
        <div className="flex items-center gap-1 text-xs">
          <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
          <span className="font-semibold">{e.rating.toFixed(1)}</span>
          <span className="text-slate-400">({e.reviewCount})</span>
        </div>
      ),
    },
    {
      key: "date",
      label: "Date d'ajout",
      render: (e) => (
        <span className="text-xs text-slate-500">
          <ClientOnlyDate date={e.createdAt} />
        </span>
      ),
    },
    {
      key: "actions",
      label: "",
      className: "text-right",
      render: (e) => {
        const actions: ActionItem[] = [
          { label: "Voir les détails", icon: Eye, onClick: () => { setSelected(e); setDetailsOpen(true); } },
          { label: "Modifier", icon: Pencil, onClick: () => { setSelected(e); setFormMode("edit"); setFormOpen(true); } },
        ];

        if (e.status === "EN_ATTENTE") {
          actions.push(
            { label: "Approuver", icon: CheckCircle2, onClick: () => changeStatus(e.id, "PUBLIE"), variant: "success", separatorBefore: true },
            { label: "Rejeter", icon: XCircle, onClick: () => changeStatus(e.id, "REJETE"), variant: "danger" }
          );
        } else if (e.status === "PUBLIE") {
          actions.push({ label: "Suspendre", icon: Power, onClick: () => changeStatus(e.id, "SUSPENDU"), separatorBefore: true });
        } else if (e.status === "SUSPENDU") {
          actions.push({ label: "Réactiver", icon: CheckCircle2, onClick: () => changeStatus(e.id, "PUBLIE"), variant: "success", separatorBefore: true });
        }

        actions.push({
          label: "Supprimer",
          icon: Trash2,
          onClick: () => { setSelected(e); setDeleteOpen(true); },
          variant: "danger",
          separatorBefore: true,
        });

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
          { label: "Établissements" },
        ]}
        title="Établissements"
        description="Gérez tous les établissements de la plateforme."
        actions={[
          {
            label: "Ajouter un établissement",
            icon: Plus,
            onClick: () => { setFormMode("create"); setFormOpen(true); },
          },
        ]}
      />

      {/* Stats génériques */}
      <StatsGrid cards={statCards} columns={5} />

      {/* Tabs génériques */}
      <TabsBar tabs={tabs} active={tab} onChange={(v) => setTab(v as any)} />

      {/* Filtres génériques */}
      <FilterBar
  search={table.filters.search}
  onSearchChange={(v) => table.setFilters({ search: v })}
  searchPlaceholder="Rechercher un établissement..."
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
          { value: "PUBLIE", label: "Publié" },
          { value: "EN_ATTENTE", label: "En attente" },
          { value: "REJETE", label: "Rejeté" },
          { value: "SUSPENDU", label: "Suspendu" },
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
          { value: "PUBLIE", label: "Publié" },
          { value: "EN_ATTENTE", label: "En attente" },
          { value: "REJETE", label: "Rejeté" },
          { value: "SUSPENDU", label: "Suspendu" },
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
        onRowClick={(e) => { setSelected(e); setDetailsOpen(true); }}
      />

      {/* Pagination générique */}
      <Pagination
        page={table.page}
        perPage={table.perPage}
        total={finalFiltered.length}
        onPageChange={table.setPage}
        onPerPageChange={table.setPerPage}
        itemLabel="établissements"
      />

      {/* Formulaire générique (création / édition) */}
      <EntityFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        title={formMode === "create" ? "Ajouter un établissement" : "Modifier l'établissement"}
        size="lg"
        initialValues={
          formMode === "edit" && selected
            ? {
                name: selected.name,
                category: selected.category,
                subcategory: selected.subcategory,
                description: selected.description,
                price: selected.price,
                currency: selected.currency,
                status: selected.status,
              }
            : {
                name: "",
                category: "HEBERGEMENT",
                subcategory: "",
                description: "",
                price: 0,
                currency: "FCFA",
                status: "EN_ATTENTE",
              }
        }
        fields={[
          { name: "name", label: "Nom de l'établissement", type: "text", required: true, placeholder: "Ex : Hôtel Azalaï" },
          {
            name: "category",
            label: "Catégorie",
            type: "select",
            required: true,
            options: [
              { value: "HEBERGEMENT", label: "Hébergement" },
              { value: "RESTAURANT", label: "Restaurant" },
              { value: "LOISIR", label: "Loisir" },
            ],
          },
          { name: "subcategory", label: "Sous-catégorie", type: "text", placeholder: "Ex : Hôtel" },
          { name: "description", label: "Description", type: "textarea", required: true, rows: 3 },
          { name: "price", label: "Prix (FCFA)", type: "number", required: true },
          {
            name: "status",
            label: "Statut",
            type: "select",
            required: true,
            options: [
              { value: "PUBLIE", label: "Publié" },
              { value: "EN_ATTENTE", label: "En attente" },
              { value: "REJETE", label: "Rejeté" },
              { value: "SUSPENDU", label: "Suspendu" },
            ],
          },
        ]}
        onSubmit={(values) => {
          if (formMode === "create") {
            add({
              name: values.name,
              slug: values.name.toLowerCase().replace(/\s+/g, "-"),
              category: values.category as EstablishmentCategory,
              subcategory: values.subcategory,
              description: values.description,
              location: { country: "Bénin", city: "Cotonou", address: "" },
              owner: "BestRev",
              price: Number(values.price),
              currency: "FCFA",
              priceUnit: "nuit",
              status: values.status as EstablishmentStatus,
              
              images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200"],
            });
          } else if (selected) {
            update(selected.id, {
              name: values.name,
              category: values.category as EstablishmentCategory,
              subcategory: values.subcategory,
              description: values.description,
              price: Number(values.price),
              status: values.status as EstablishmentStatus,
            });
          }
          setSelected(null);
        }}
      />

      {/* Détails générique */}
      <EntityDetailsModal
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        header={
          selected && (
            <div className="flex items-start gap-4">
              <img
                src={selected.images[0]}
                alt={selected.name}
                className="h-20 w-24 rounded-xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold">{selected.name}</h2>
                  <Badge variant="outline" className={`text-[10px] ${STATUS_STYLES_EST[selected.status].className}`}>
                    {STATUS_STYLES_EST[selected.status].label}
                  </Badge>
                </div>
                <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                  <MapPin className="h-3 w-3 text-emerald-600" />
                  {selected.location.city}, {selected.location.country}
                </p>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className={`text-[10px] ${CATEGORY_STYLES_EST[selected.category].className}`}>
                    {CATEGORY_STYLES_EST[selected.category].label}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs">
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                    <span className="font-semibold">{selected.rating.toFixed(1)}</span>
                    <span className="text-slate-400">({selected.reviewCount} avis)</span>
                  </div>
                </div>
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
                  <InfoRow label="Nom" value={selected.name} />
                  <InfoRow label="Catégorie" value={CATEGORY_STYLES_EST[selected.category].label} />
                  <InfoRow label="Adresse" value={selected.location.address || "—"} />
                  <InfoRow label="Sous-catégorie" value={selected.subcategory} />
                  <InfoRow label="Prix" value={formatEstPrice(selected)} />
                  <InfoRow label="Statut" value={STATUS_STYLES_EST[selected.status].label} />
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="mb-1 text-[10px] font-bold uppercase text-slate-500">Description</p>
                  <p className="text-sm text-slate-700">{selected.description}</p>
                </div>
              </div>
            ),
          },
          {
            value: "media",
            label: "Médias",
            badge: selected?.images.length,
            content: selected && (
              <div className="grid grid-cols-3 gap-2">
                {selected.images.map((img, i) => (
                  <img key={i} src={img} alt="" className="aspect-square rounded-lg object-cover" />
                ))}
              </div>
            ),
          },
          { value: "reviews", label: "Avis", content: <p className="text-center text-xs text-slate-400">Aucun avis</p> },
          { value: "history", label: "Historique", content: <p className="text-center text-xs text-slate-400">Aucun historique</p> },
        ]}
      />

      {/* Confirmation suppression générique */}
      <ConfirmModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Êtes-vous sûr ?"
        description="Cette action est irréversible. L'établissement sera définitivement supprimé."
        confirmLabel="Supprimer définitivement"
        confirmVariant="danger"
        onConfirm={() => {
          if (selected) remove(selected.id);
          setSelected(null);
        }}
      >
        {selected && (
          <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50/50 p-3">
            <img src={selected.images[0]} alt="" className="h-12 w-14 rounded-lg object-cover" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{selected.name}</p>
              <p className="truncate text-xs text-slate-500">
                {selected.location.city}, {selected.location.country}
              </p>
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
      <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</dt>
      <dd className="mt-1 text-xs font-semibold text-slate-800">{value}</dd>
    </div>
  );
}