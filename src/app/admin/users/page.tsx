"use client";

import { useState } from "react";
import {
  Users,
  UserCheck,
  ShieldCheck,
  Building2,
  TrendingUp,
  Plus,
  Eye,
  Pencil,
  Power,
  Trash2,
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
} from "@/components/admin/commun";

import { Badge } from "@/components/ui/badge";
 
import { useUsersStore } from "@/store/useUsersStore";
 
import {
  ROLE_STYLES,
  STATUS_STYLES,
  getAvatarColor,
  getInitials,
} from "@/utils/user.helpers";
import type { User, UserRole } from "@/types/users";
import { useAdminTable } from "../../../../hook/admin/useAdminTable";
import { useMounted } from "../../../../hook/admin/useMounted";
import { ClientOnlyDate } from "@/components/ui/clientonlydate";
import { FilterSelect } from "@/components/admin/commun/FilterSelect";

export default function AdminUsersPage() {
  const mounted = useMounted();
  const users = useUsersStore((s) => s.users);
  const addUser = useUsersStore((s) => s.addUser);
  const updateUser = useUsersStore((s) => s.updateUser);
  const deleteUser = useUsersStore((s) => s.deleteUser);
  const toggleStatus = useUsersStore((s) => s.toggleStatus);
  const getStats = useUsersStore((s) => s.getStats);

  // État UI
  const [tab, setTab] = useState<UserRole | "ALL">("ALL");
  const [selected, setSelected] = useState<User | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Table générique
  const table = useAdminTable<User, any>({
    data: users,
    defaultPerPage: 8,
    initialFilters: { search: "", role: "ALL", status: "ALL" },
    filterFn: (u, f) => {
      if (f.search) {
        const q = f.search.toLowerCase();
        if (
          !u.firstName.toLowerCase().includes(q) &&
          !u.lastName.toLowerCase().includes(q) &&
          !u.email.toLowerCase().includes(q) &&
          !u.phone.includes(q)
        )
          return false;
      }
      if (f.role !== "ALL" && u.role !== f.role) return false;
      if (f.status !== "ALL" && u.status !== f.status) return false;
      return true;
    },
  });

  // Applique le tab en filtre supplémentaire
  const finalFiltered =
    tab === "ALL"
      ? table.filtered
      : table.filtered.filter((u) => u.role === tab);

  const paginated =
    tab === "ALL"
      ? table.paginated
      : finalFiltered.slice(
          (table.page - 1) * table.perPage,
          table.page * table.perPage
        );

  const stats = mounted
    ? getStats()
    : { total: 0, clients: 0, admins: 0, owners: 0, newThisMonth: 0 };

  // Stats cards
  const statCards: StatCard[] = [
    { icon: Users, label: "Utilisateurs total", value: stats.total, trend: 12, color: "bg-emerald-50 text-emerald-700" },
    { icon: UserCheck, label: "Clients", value: stats.clients, trend: 15, color: "bg-blue-50 text-blue-700" },
    { icon: ShieldCheck, label: "Administrateurs", value: stats.admins, color: "bg-violet-50 text-violet-700" },
    { icon: Building2, label: "Propriétaires", value: stats.owners, trend: 8, color: "bg-amber-50 text-amber-700" },
    { icon: TrendingUp, label: "Nouveaux ce mois", value: stats.newThisMonth, trend: 22, color: "bg-rose-50 text-rose-700" },
  ];

  // Tabs
  const tabs: Tab[] = [
    { value: "ALL", label: "Tous", count: users.length },
    { value: "CLIENT", label: "Clients", count: users.filter((u) => u.role === "CLIENT").length },
    { value: "ADMIN", label: "Admins", count: users.filter((u) => u.role === "ADMIN").length },
    { value: "PROPRIETAIRE", label: "Propriétaires", count: users.filter((u) => u.role === "PROPRIETAIRE").length },
  ];

  // Colonnes
  const columns: Column<User>[] = [
    {
      key: "user",
      label: "Utilisateur",
      render: (u) => (
        <div className="flex items-center gap-3">
          {u.avatar ? (
            <img src={u.avatar} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover" />
          ) : (
            <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-[11px] font-bold ${getAvatarColor(u.id)}`}>
              {getInitials(u.firstName, u.lastName)}
            </div>
          )}
          <span className="font-semibold text-slate-800">
            {u.firstName} {u.lastName}
          </span>
        </div>
      ),
    },
    { key: "email", label: "Email", render: (u) => <span className="text-slate-600">{u.email}</span> },
    { key: "phone", label: "Téléphone", render: (u) => <span className="text-slate-600">{u.phone}</span> },
    {
      key: "role",
      label: "Rôle",
      render: (u) => (
        <Badge variant="outline" className={`text-[10px] font-semibold ${ROLE_STYLES[u.role].className}`}>
          {ROLE_STYLES[u.role].label.toUpperCase()}
        </Badge>
      ),
    },
    {
      key: "status",
      label: "Statut",
      render: (u) => (
        <Badge variant="outline" className={`text-[10px] font-semibold ${STATUS_STYLES[u.status].className}`}>
          {STATUS_STYLES[u.status].label}
        </Badge>
      ),
    },
    {
      key: "date",
      label: "Inscription",
      render: (u) => (
        <span className="text-xs text-slate-500">
          <ClientOnlyDate date={u.registrationDate || u.createdAt} />
        </span>
      ),
    },
    {
      key: "actions",
      label: "",
      className: "text-right",
      render: (u) => {
        const actions: ActionItem[] = [
          { label: "Voir le profil", icon: Eye, onClick: () => { setSelected(u); setDetailsOpen(true); } },
          { label: "Modifier", icon: Pencil, onClick: () => { setSelected(u); setFormMode("edit"); setFormOpen(true); } },
          {
            label: u.status === "ACTIF" ? "Désactiver" : "Activer",
            icon: Power,
            onClick: () => toggleStatus(u.id),
            separatorBefore: true,
          },
          {
            label: "Supprimer",
            icon: Trash2,
            onClick: () => { setSelected(u); setDeleteOpen(true); },
            variant: "danger",
            separatorBefore: true,
          },
        ];
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
          { label: "Utilisateurs" },
        ]}
        title="Utilisateurs"
        description="Gérez tous les utilisateurs de la plateforme."
        actions={[
          {
            label: "Ajouter un utilisateur",
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
  searchPlaceholder="Rechercher un utilisateur..."
  onReset={table.resetFilters}
  activeFiltersCount={table.activeFiltersCount}
  desktopFilters={
    <>
      <FilterSelect
        value={table.filters.role}
        onValueChange={(v) => table.setFilters({ role: v })}
        placeholder="Tous les rôles"
        options={[
          { value: "ALL", label: "Tous les rôles" },
          { value: "CLIENT", label: "Client" },
          { value: "ADMIN", label: "Admin" },
          { value: "PROPRIETAIRE", label: "Propriétaire" },
        ]}
      />
      <FilterSelect
        value={table.filters.status}
        onValueChange={(v) => table.setFilters({ status: v })}
        placeholder="Tous les statuts"
        options={[
          { value: "ALL", label: "Tous les statuts" },
          { value: "ACTIF", label: "Actif" },
          { value: "INACTIF", label: "Inactif" },
          { value: "EN_ATTENTE", label: "En attente" },
          { value: "SUSPENDU", label: "Suspendu" },
        ]}
      />
    </>
  }
  mobileFilters={
    <>
      <FilterChips
        label="Rôle"
        value={table.filters.role}
        onChange={(v) => table.setFilters({ role: v })}
        options={[
          { value: "ALL", label: "Tous" },
          { value: "CLIENT", label: "Client" },
          { value: "ADMIN", label: "Admin" },
          { value: "PROPRIETAIRE", label: "Propriétaire" },
        ]}
      />
      <FilterChips
        label="Statut"
        value={table.filters.status}
        onChange={(v) => table.setFilters({ status: v })}
        options={[
          { value: "ALL", label: "Tous" },
          { value: "ACTIF", label: "Actif" },
          { value: "INACTIF", label: "Inactif" },
          { value: "EN_ATTENTE", label: "En attente" },
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
        onRowClick={(u) => { setSelected(u); setDetailsOpen(true); }}
      />

      {/* Pagination générique */}
      <Pagination
        page={table.page}
        perPage={table.perPage}
        total={finalFiltered.length}
        onPageChange={table.setPage}
        onPerPageChange={table.setPerPage}
        itemLabel="utilisateurs"
      />

      {/* Formulaire générique (create + edit) */}
      <EntityFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        title={formMode === "create" ? "Ajouter un utilisateur" : "Modifier l'utilisateur"}
        description={
          formMode === "create"
            ? "Créez un nouveau compte utilisateur sur la plateforme."
            : "Mettez à jour les informations de cet utilisateur."
        }
        initialValues={
          formMode === "edit" && selected
            ? {
                firstName: selected.firstName,
                lastName: selected.lastName,
                email: selected.email,
                phone: selected.phone,
                role: selected.role,
                status: selected.status,
              }
            : {
                firstName: "",
                lastName: "",
                email: "",
                phone: "+229 ",
                role: "CLIENT",
                status: "ACTIF",
              }
        }
        fields={[
          { name: "firstName", label: "Prénom", type: "text", required: true, placeholder: "Ex : Aïcha" },
          { name: "lastName", label: "Nom", type: "text", required: true, placeholder: "Ex : Bello" },
          { name: "email", label: "Email", type: "email", required: true, placeholder: "vous@exemple.com" },
          { name: "phone", label: "Téléphone", type: "tel", placeholder: "+229 ..." },
          {
            name: "role",
            label: "Rôle",
            type: "select",
            required: true,
            options: [
              { value: "CLIENT", label: "Client" },
              { value: "ADMIN", label: "Admin" },
              { value: "PROPRIETAIRE", label: "Propriétaire" },
            ],
          },
          ...(formMode === "edit"
            ? [
                {
                  name: "status",
                  label: "Statut",
                  type: "select" as const,
                  required: true,
                  options: [
                    { value: "ACTIF", label: "Actif" },
                    { value: "INACTIF", label: "Inactif" },
                    { value: "EN_ATTENTE", label: "En attente" },
                    { value: "SUSPENDU", label: "Suspendu" },
                  ],
                },
              ]
            : []),
        ]}
        onSubmit={(values) => {
          if (formMode === "create") {
            addUser({
              firstName: values.firstName,
              lastName: values.lastName,
              email: values.email,
              phone: values.phone,
              role: values.role,
              status: "ACTIF",
            } as any);
          } else if (selected) {
            updateUser(selected.id, {
              firstName: values.firstName,
              lastName: values.lastName,
              email: values.email,
              phone: values.phone,
            
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
              {selected.avatar ? (
                <img
                  src={selected.avatar}
                  alt=""
                  className="h-16 w-16 rounded-full object-cover ring-2 ring-emerald-100"
                />
              ) : (
                <div className="grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-700">
                  {getInitials(selected.firstName, selected.lastName)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold">
                  {selected.firstName} {selected.lastName}
                </h2>
                <div className="mt-1 flex flex-wrap gap-2">
                  <Badge variant="outline" className={`text-[10px] ${ROLE_STYLES[selected.role].className}`}>
                    {ROLE_STYLES[selected.role].label.toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className={`text-[10px] ${STATUS_STYLES[selected.status].className}`}>
                    {STATUS_STYLES[selected.status].label}
                  </Badge>
                </div>
                <p className="mt-2 truncate text-xs text-slate-500">
                  {selected.email}
                </p>
                <p className="truncate text-xs text-slate-500">
                  {selected.phone}
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
                  <InfoRow label="Nom complet" value={`${selected.firstName} ${selected.lastName}`} />
                  <InfoRow label="Email" value={selected.email} />
                  <InfoRow label="Téléphone" value={selected.phone} />
                  <InfoRow label="Rôle" value={ROLE_STYLES[selected.role].label} />
                  <InfoRow label="Statut" value={STATUS_STYLES[selected.status].label} />
                  <InfoRow label="Inscrit le" value={<ClientOnlyDate date={selected.registrationDate || selected.createdAt} /> as any} />
                </div>
              </div>
            ),
          },
          {
            value: "activity",
            label: "Activités",
            content: (
              <p className="rounded-xl border border-dashed border-slate-200 py-10 text-center text-xs text-slate-400">
                Aucune activité enregistrée
              </p>
            ),
          },
          {
            value: "bookings",
            label: "Réservations",
            badge: 0,
            content: (
              <p className="rounded-xl border border-dashed border-slate-200 py-10 text-center text-xs text-slate-400">
                Aucune réservation
              </p>
            ),
          },
        ]}
      />

      {/* Confirmation suppression générique */}
      <ConfirmModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Êtes-vous sûr ?"
        description="Cette action est irréversible. L'utilisateur sera définitivement supprimé de la plateforme."
        confirmLabel="Supprimer définitivement"
        confirmVariant="danger"
        onConfirm={() => {
          if (selected) deleteUser(selected.id);
          setSelected(null);
        }}
      >
        {selected && (
          <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50/50 p-3">
            {selected.avatar ? (
              <img src={selected.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
            ) : (
              <div className="grid h-10 w-10 place-items-center rounded-full bg-rose-100 text-xs font-bold text-rose-700">
                {getInitials(selected.firstName, selected.lastName)}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                {selected.firstName} {selected.lastName}
              </p>
              <p className="truncate text-xs text-slate-500">{selected.email}</p>
            </div>
          </div>
        )}
      </ConfirmModal>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-3">
      <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </dt>
      <dd className="mt-1 text-xs font-semibold text-slate-800">{value}</dd>
    </div>
  );
}