"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  Eye,
  Pencil,
  Plus,
  Power,
  ShieldCheck,
  TrendingUp,
  Trash2,
  UserCheck,
  Users,
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
  ConfirmModal,
  EntityFormModal,
  EntityDetailsModal,
  type ActionItem,
  type Column,
  type StatCard,
  type Tab,
} from "@/components/admin/commun";
import { Badge } from "@/components/ui/badge";
import { FilterSelect } from "@/components/admin/commun/FilterSelect";
import { useUsersStore } from "@/store/useUsersStore";
import { useAuthStore } from "@/store/authStore";
import {
  getAvatarColor,
  getInitials,
  ROLE_STYLES,
  STATUS_STYLES,
} from "@/utils/user.helpers";
import type {
  AdminUserActivity,
  AdminUserFavorite,
  AdminUserReservation,
  User,
  UserFilters,
  UserRole,
  UserStatus,
} from "@/types/users";
import { useAdminTable } from "../../../../hook/admin/useAdminTable";
import { ClientOnlyDate } from "@/components/ui/clientonlydate";

type UserFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  status: UserStatus;
};

function roleFromForm(value: string): UserRole {
  if (value === "ADMIN" || value === "PROPRIETAIRE") return value;
  return "CLIENT";
}

function statusFromForm(value: string): UserStatus {
  if (value === "INACTIF" || value === "EN_ATTENTE" || value === "SUSPENDU") {
    return value;
  }
  return "ACTIF";
}

function displayDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString("fr-FR");
}

function ReservationDetails({ reservation }: { reservation: AdminUserReservation }) {
  const summary = reservation.reference ?? reservation.id;
  const date = reservation.created_at ?? reservation.start_date;
  return (
    <article key={reservation.id} className="rounded-xl border border-slate-100 p-3">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-slate-800">{summary}</p>
        {reservation.status && (
          <Badge variant="outline" className="text-[10px]">{reservation.status}</Badge>
        )}
      </div>
      {date && <p className="mt-1 text-xs text-slate-500">{displayDate(date)}</p>}
      {reservation.total_amount !== undefined && (
        <p className="mt-1 text-xs font-medium text-slate-700">
          {reservation.total_amount.toLocaleString("fr-FR")} {reservation.currency ?? ""}
        </p>
      )}
    </article>
  );
}

function FavoriteDetails({ favorite }: { favorite: AdminUserFavorite }) {
  return (
    <article key={favorite.id} className="rounded-xl border border-slate-100 p-3">
      <p className="text-sm font-semibold text-slate-800">
        Établissement {favorite.establishment_id}
      </p>
      {favorite.note && <p className="mt-1 text-xs text-slate-600">{favorite.note}</p>}
      <p className="mt-1 text-xs text-slate-400">{displayDate(favorite.created_at)}</p>
    </article>
  );
}

function ActivityDetails({ activity }: { activity: AdminUserActivity }) {
  return (
    <article key={activity.id} className="rounded-xl border border-slate-100 p-3">
      <p className="text-sm font-semibold text-slate-800">{activity.action}</p>
      {activity.description && <p className="mt-1 text-xs text-slate-600">{activity.description}</p>}
      <p className="mt-1 text-xs text-slate-400">{displayDate(activity.created_at)}</p>
    </article>
  );
}

export default function AdminUsersPage() {
  const isOwner = useAuthStore((state) => state.role) === "PROPRIETAIRE";
  const users = useUsersStore((state) => state.users);
  const total = useUsersStore((state) => state.total);
  const stats = useUsersStore((state) => state.stats);
  const isLoading = useUsersStore((state) => state.isLoading);
  const isLoadingStats = useUsersStore((state) => state.isLoadingStats);
  const isLoadingDetails = useUsersStore((state) => state.isLoadingDetails);
  const error = useUsersStore((state) => state.error);
  const detailsError = useUsersStore((state) => state.detailsError);
  const userDetails = useUsersStore((state) => state.userDetails);
  const loadUsers = useUsersStore((state) => state.loadUsers);
  const loadStats = useUsersStore((state) => state.loadStats);
  const loadUserDetails = useUsersStore((state) => state.loadUserDetails);
  const addUser = useUsersStore((state) => state.addUser);
  const updateUser = useUsersStore((state) => state.updateUser);
  const changeRole = useUsersStore((state) => state.changeRole);
  const changeStatus = useUsersStore((state) => state.changeStatus);
  const disableUser = useUsersStore((state) => state.disableUser);

  const [selected, setSelected] = useState<User | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [disableOpen, setDisableOpen] = useState(false);
  const [actionError, setActionError] = useState("");

  const table = useAdminTable<User, UserFilters>({
    data: users,
    defaultPerPage: 8,
    initialFilters: { search: "", role: isOwner ? "CLIENT" : "ALL", status: "ALL", registrationDate: "all" },
  });

  useEffect(() => {
    void loadStats().catch(() => undefined);
  }, [loadStats]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadUsers(table.filters, table.page, table.perPage).catch(() => undefined);
    }, table.filters.search ? 300 : 0);
    return () => window.clearTimeout(timer);
  }, [
    loadUsers,
    table.filters.search,
    table.filters.role,
    table.filters.status,
    table.page,
    table.perPage,
  ]);

  const tabs: Tab[] = isOwner
    ? [{ value: "CLIENT", label: "Clients", count: stats.clients || stats.total }]
    : [
        { value: "ALL", label: "Tous", count: stats.total },
        { value: "CLIENT", label: "Clients", count: stats.clients },
        { value: "ADMIN", label: "Admins", count: stats.admins },
        { value: "PROPRIETAIRE", label: "Propriétaires", count: stats.owners },
      ];

  const statCards: StatCard[] = isOwner
    ? [
        { icon: Users, label: "Mes clients", value: stats.total, color: "bg-emerald-50 text-emerald-700" },
        { icon: UserCheck, label: "Clients actifs", value: stats.active, color: "bg-blue-50 text-blue-700" },
        { icon: TrendingUp, label: "Nouveaux (30 jours)", value: stats.newThisMonth, color: "bg-violet-50 text-violet-700" },
      ]
    : [
        { icon: Users, label: "Utilisateurs total", value: stats.total, color: "bg-emerald-50 text-emerald-700" },
        { icon: UserCheck, label: "Clients", value: stats.clients, color: "bg-blue-50 text-blue-700" },
        { icon: ShieldCheck, label: "Administrateurs", value: stats.admins, color: "bg-violet-50 text-violet-700" },
        { icon: Building2, label: "Propriétaires", value: stats.owners, color: "bg-amber-50 text-amber-700" },
        { icon: TrendingUp, label: "Nouveaux (30 jours)", value: stats.newThisMonth, color: "bg-rose-50 text-rose-700" },
      ];

  const openDetails = (user: User) => {
    setSelected(user);
    setDetailsOpen(true);
    setActionError("");
    void loadUserDetails(user.id)
      .then(setSelected)
      .catch(() => undefined);
  };

  const refreshCurrentPage = () =>
    loadUsers(table.filters, table.page, table.perPage);
  const initialValues = useMemo<UserFormValues>(() => ({
    firstName: formMode === "edit" ? selected?.firstName ?? "" : "",
    lastName: formMode === "edit" ? selected?.lastName ?? "" : "",
    email: formMode === "edit" ? selected?.email ?? "" : "",
    phone: formMode === "edit" ? selected?.phone ?? "" : "",
    password: "",
    role: formMode === "edit" ? selected?.role ?? "CLIENT" : "CLIENT",
    status: formMode === "edit" ? selected?.status ?? "ACTIF" : "ACTIF",
  }), [formMode, selected]);

  const columns: Column<User>[] = [
    {
      key: "user",
      label: "Utilisateur",
      render: (user) => (
        <div className="flex items-center gap-3">
          {user.avatar ? (
            <img src={user.avatar} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover" />
          ) : (
            <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-[11px] font-bold ${getAvatarColor(user.id)}`}>
              {getInitials(user.firstName, user.lastName)}
            </div>
          )}
          <span className="font-semibold text-slate-800">
            {[user.firstName, user.lastName].filter(Boolean).join(" ") || "Utilisateur"}
          </span>
        </div>
      ),
    },
    { key: "email", label: "Email", render: (user) => <span className="text-slate-600">{user.email}</span> },
    { key: "phone", label: "Téléphone", render: (user) => <span className="text-slate-600">{user.phone || "—"}</span> },
    {
      key: "role",
      label: "Rôle",
      render: (user) => (
        <Badge variant="outline" className={`text-[10px] font-semibold ${ROLE_STYLES[user.role].className}`}>
          {ROLE_STYLES[user.role].label.toUpperCase()}
        </Badge>
      ),
    },
    {
      key: "status",
      label: "Statut",
      render: (user) => (
        <Badge variant="outline" className={`text-[10px] font-semibold ${STATUS_STYLES[user.status].className}`}>
          {STATUS_STYLES[user.status].label}
        </Badge>
      ),
    },
    {
      key: "date",
      label: "Inscription",
      render: (user) => (
        <span className="text-xs text-slate-500">
          {user.registrationDate ? <ClientOnlyDate date={user.registrationDate} /> : "—"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "",
      className: "text-right",
      render: (user) => {
        const actions: ActionItem[] = [
          { label: "Voir le profil", icon: Eye, onClick: () => openDetails(user) },
          {
            label: "Modifier",
            icon: Pencil,
            onClick: () => {
              setSelected(user);
              setFormMode("edit");
              setFormOpen(true);
              setActionError("");
            },
          },
          {
            label: user.status === "ACTIF" ? "Désactiver" : "Activer",
            icon: Power,
            onClick: () => {
              setActionError("");
              void changeStatus(user.id, user.status === "ACTIF" ? "SUSPENDU" : "ACTIF")
                .then(refreshCurrentPage)
                .catch((cause: unknown) => setActionError(cause instanceof Error ? cause.message : "Impossible de modifier le statut."));
            },
            separatorBefore: true,
          },
          {
            label: "Désactiver le compte",
            icon: Trash2,
            onClick: () => {
              setSelected(user);
              setDisableOpen(true);
              setActionError("");
            },
            variant: "danger",
            separatorBefore: true,
          },
        ];
        return <ActionsDropdown actions={actions} />;
      },
    },
  ];
  const visibleColumns = isOwner ? columns.filter((column) => column.key !== "role") : columns;

  const roleFilter = (value: string) => {
    table.setFilters({ role: value as UserRole | "ALL" });
  };
  const statusFilter = (value: string) => {
    table.setFilters({ status: value as UserStatus | "ALL" });
  };

  const detailsTabs = useMemo(() => [
    {
      value: "info",
      label: "Informations",
      content: selected ? (
        <dl className="grid grid-cols-2 gap-3">
          <InfoRow label="Nom complet" value={[selected.firstName, selected.lastName].filter(Boolean).join(" ") || "—"} />
          <InfoRow label="Email" value={selected.email} />
          <InfoRow label="Téléphone" value={selected.phone || "—"} />
          <InfoRow label="Rôle" value={ROLE_STYLES[selected.role].label} />
          <InfoRow label="Statut" value={STATUS_STYLES[selected.status].label} />
          <InfoRow label="Provider" value={selected.provider || "—"} />
          <InfoRow label="Inscrit le" value={displayDate(selected.createdAt)} />
          <InfoRow label="Dernière connexion" value={displayDate(selected.lastLogin)} />
        </dl>
      ) : null,
    },
    {
      value: "activity",
      label: "Activités",
      badge: userDetails?.activity.length,
      content: detailsError
        ? <p role="alert" className="py-8 text-center text-sm text-rose-700">{detailsError}</p>
        : isLoadingDetails
        ? <p role="status" className="py-8 text-center text-sm text-slate-500">Chargement des activités...</p>
        : userDetails?.activity.length
          ? <div className="space-y-2">{userDetails.activity.map((activity) => <ActivityDetails key={activity.id} activity={activity} />)}</div>
          : <p className="py-8 text-center text-sm text-slate-400">Aucune activité enregistrée.</p>,
    },
    {
      value: "bookings",
      label: "Réservations",
      badge: userDetails?.reservations.length,
      content: detailsError
        ? <p role="alert" className="py-8 text-center text-sm text-rose-700">{detailsError}</p>
        : isLoadingDetails
        ? <p role="status" className="py-8 text-center text-sm text-slate-500">Chargement des réservations...</p>
        : userDetails?.reservations.length
          ? <div className="space-y-2">{userDetails.reservations.map((reservation) => <ReservationDetails key={reservation.id} reservation={reservation} />)}</div>
          : <p className="py-8 text-center text-sm text-slate-400">Aucune réservation.</p>,
    },
    {
      value: "favorites",
      label: "Favoris",
      badge: userDetails?.favorites.length,
      content: detailsError
        ? <p role="alert" className="py-8 text-center text-sm text-rose-700">{detailsError}</p>
        : isLoadingDetails
        ? <p role="status" className="py-8 text-center text-sm text-slate-500">Chargement des favoris...</p>
        : userDetails?.favorites.length
          ? <div className="space-y-2">{userDetails.favorites.map((favorite) => <FavoriteDetails key={favorite.id} favorite={favorite} />)}</div>
          : <p className="py-8 text-center text-sm text-slate-400">Aucun favori.</p>,
    },
  ], [detailsError, isLoadingDetails, selected, userDetails]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/owners" },
          { label: isOwner ? "Mes clients" : "Utilisateurs" },
        ]}
        title={isOwner ? "Mes clients" : "Utilisateurs"}
        description={isOwner ? "Consultez et gérez les clients de vos établissements." : "Gérez les comptes utilisateurs de la plateforme."}
        actions={[
          {
            label: isOwner ? "Ajouter un client" : "Ajouter un utilisateur",
            icon: Plus,
            onClick: () => {
              setSelected(null);
              setFormMode("create");
              setFormOpen(true);
              setActionError("");
            },
          },
        ]}
      />

      <StatsGrid cards={statCards} columns={isOwner ? 3 : 5} loading={isLoadingStats} />
      <TabsBar tabs={tabs} active={table.filters.role} onChange={roleFilter} />

      <FilterBar
        search={table.filters.search}
        onSearchChange={(value) => table.setFilters({ search: value })}
        searchPlaceholder="Rechercher un utilisateur..."
        onReset={() => {
          table.resetFilters();
        }}
        activeFiltersCount={table.activeFiltersCount}
        desktopFilters={
          <>
            {!isOwner && (
              <FilterSelect
                value={table.filters.role}
                onValueChange={roleFilter}
                placeholder="Tous les rôles"
                options={[
                  { value: "ALL", label: "Tous les rôles" },
                  { value: "CLIENT", label: "Client" },
                  { value: "ADMIN", label: "Admin" },
                  { value: "PROPRIETAIRE", label: "Propriétaire" },
                ]}
              />
            )}
            <FilterSelect
              value={table.filters.status}
              onValueChange={statusFilter}
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
            {!isOwner && (
              <FilterChips
                label="Rôle"
                value={table.filters.role}
                onChange={roleFilter}
                options={[
                  { value: "ALL", label: "Tous" },
                  { value: "CLIENT", label: "Client" },
                  { value: "ADMIN", label: "Admin" },
                  { value: "PROPRIETAIRE", label: "Propriétaire" },
                ]}
              />
            )}
            <FilterChips
              label="Statut"
              value={table.filters.status}
              onChange={statusFilter}
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
      />

      {actionError && (
        <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {actionError}
        </p>
      )}
      {error && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <span role="alert">{error}</span>
          <button type="button" className="font-semibold underline" onClick={() => void refreshCurrentPage().catch(() => undefined)}>
            Réessayer
          </button>
        </div>
      )}

      <DataTable
        data={users}
        columns={visibleColumns}
        emptyMessage={isLoading ? "Chargement des utilisateurs..." : "Aucun utilisateur trouvé."}
        onRowClick={openDetails}
      />
      <Pagination
        page={table.page}
        perPage={table.perPage}
        total={total}
        onPageChange={table.setPage}
        onPerPageChange={table.setPerPage}
        itemLabel="utilisateurs"
      />

      <EntityFormModal<UserFormValues>
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        title={formMode === "create" ? (isOwner ? "Ajouter un client" : "Ajouter un utilisateur") : isOwner ? "Modifier le client" : "Modifier l'utilisateur"}
        description={
          formMode === "create"
            ? isOwner ? "Créez un compte client. Un mot de passe provisoire est requis." : "Créez un compte utilisateur. Un mot de passe provisoire est requis."
            : isOwner ? "Mettez à jour le profil et le statut du client." : "Mettez à jour le profil, le rôle et le statut du compte."
        }
        initialValues={initialValues}
        fields={[
          { name: "firstName", label: "Prénom", type: "text", required: true, placeholder: "Ex : Aïcha" },
          { name: "lastName", label: "Nom", type: "text", required: true, placeholder: "Ex : Bello" },
          { name: "email", label: "Email", type: "email", required: true, placeholder: "vous@exemple.com" },
          ...(formMode === "create"
            ? [{ name: "password", label: "Mot de passe provisoire", type: "password" as const, required: true }]
            : [
                { name: "phone", label: "Téléphone", type: "tel" as const, placeholder: "+229 ..." },
                ...(!isOwner ? [{
                  name: "role",
                  label: "Rôle",
                  type: "select" as const,
                  required: true,
                  options: [
                    { value: "CLIENT", label: "Client" },
                    { value: "ADMIN", label: "Admin" },
                    { value: "PROPRIETAIRE", label: "Propriétaire" },
                  ],
                }] : []),
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
              ]),
        ]}
        onSubmit={async (values) => {
          if (formMode === "create") {
            await addUser({
              email: values.email,
              password: values.password,
              firstName: values.firstName,
              lastName: values.lastName,
            });
          } else if (selected) {
            let updated = await updateUser(selected.id, {
              firstName: values.firstName,
              lastName: values.lastName,
              email: values.email,
              phone: values.phone,
            });
            if (!isOwner && updated.role !== roleFromForm(values.role)) {
              updated = await changeRole(updated.id, roleFromForm(values.role));
            }
            if (updated.status !== statusFromForm(values.status)) {
              updated = await changeStatus(updated.id, statusFromForm(values.status));
            }
          }
          await refreshCurrentPage();
        }}
      />

      <EntityDetailsModal
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        header={
          selected ? (
            <div className="flex items-start gap-4">
              {selected.avatar ? (
                <img src={selected.avatar} alt="" className="h-16 w-16 rounded-full object-cover ring-2 ring-emerald-100" />
              ) : (
                <div className={`grid h-16 w-16 place-items-center rounded-full text-lg font-bold ${getAvatarColor(selected.id)}`}>
                  {getInitials(selected.firstName, selected.lastName)}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-bold">
                  {[selected.firstName, selected.lastName].filter(Boolean).join(" ") || "Utilisateur"}
                </h2>
                <div className="mt-1 flex flex-wrap gap-2">
                  <Badge variant="outline" className={`text-[10px] ${ROLE_STYLES[selected.role].className}`}>
                    {ROLE_STYLES[selected.role].label.toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className={`text-[10px] ${STATUS_STYLES[selected.status].className}`}>
                    {STATUS_STYLES[selected.status].label}
                  </Badge>
                </div>
                <p className="mt-2 truncate text-xs text-slate-500">{selected.email}</p>
                <p className="truncate text-xs text-slate-500">{selected.phone || "Téléphone non renseigné"}</p>
              </div>
            </div>
          ) : null
        }
        onEdit={() => {
          setDetailsOpen(false);
          setFormMode("edit");
          setFormOpen(true);
        }}
        tabs={detailsTabs}
        size="xl"
      />

      <ConfirmModal
        open={disableOpen}
        onOpenChange={setDisableOpen}
        title="Désactiver cet utilisateur ?"
        description="Le compte sera désactivé sur la plateforme. Cette opération peut être suivie d’une réactivation depuis sa fiche."
        confirmLabel="Désactiver le compte"
        confirmVariant="danger"
        onConfirm={() => {
          if (!selected) return;
          void disableUser(selected.id)
            .then(async () => {
              setSelected(null);
              if (users.length === 1 && table.page > 1) {
                table.setPage(table.page - 1);
                await loadUsers(table.filters, table.page - 1, table.perPage);
                return;
              }
              await refreshCurrentPage();
            })
            .catch((cause: unknown) => setActionError(cause instanceof Error ? cause.message : "Impossible de désactiver l'utilisateur."));
        }}
      >
        {selected && (
          <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-3">
            <p className="text-sm font-semibold">{[selected.firstName, selected.lastName].filter(Boolean).join(" ")}</p>
            <p className="text-xs text-slate-500">{selected.email}</p>
          </div>
        )}
      </ConfirmModal>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-3">
      <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</dt>
      <dd className="mt-1 text-xs font-semibold text-slate-800">{value}</dd>
    </div>
  );
}
