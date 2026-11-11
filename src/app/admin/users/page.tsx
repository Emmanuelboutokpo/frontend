"use client";

import { useEffect, useMemo, useState } from "react";
import { Building2, Pencil, Plus, Power, ShieldCheck, Trash2, UserCheck, Users } from "lucide-react";
import {
  ActionsDropdown,
  AdminPageHeader,
  ConfirmModal,
  DataTable,
  EntityFormModal,
  Pagination,
  StatsGrid,
  type ActionItem,
  type Column,
  type StatCard,
} from "@/components/admin/commun";
import { Badge } from "@/components/ui/badge";
import { FilterSelect } from "@/components/admin/commun/FilterSelect";
import { FilterBar } from "@/components/admin/commun/FilterBar";
import { useUsersStore } from "@/store/useUsersStore";
import { getAvatarColor, getInitials, ROLE_STYLES, STATUS_STYLES } from "@/utils/user.helpers";
import type { User, UserFilters, UserRole, UserStatus } from "@/types/users";
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

function displayName(user: User) {
  return [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email;
}

export default function AdminUsersPage() {
  const users = useUsersStore((state) => state.users);
  const total = useUsersStore((state) => state.total);
  const stats = useUsersStore((state) => state.stats);
  const isLoading = useUsersStore((state) => state.isLoading);
  const isLoadingStats = useUsersStore((state) => state.isLoadingStats);
  const error = useUsersStore((state) => state.error);
  const loadUsers = useUsersStore((state) => state.loadUsers);
  const loadStats = useUsersStore((state) => state.loadStats);
  const addUser = useUsersStore((state) => state.addUser);
  const updateUser = useUsersStore((state) => state.updateUser);
  const changeRole = useUsersStore((state) => state.changeRole);
  const changeStatus = useUsersStore((state) => state.changeStatus);
  const disableUser = useUsersStore((state) => state.disableUser);
  const [selected, setSelected] = useState<User | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [disableOpen, setDisableOpen] = useState(false);
  const [actionError, setActionError] = useState("");

  const table = useAdminTable<User, UserFilters>({
    data: users,
    defaultPerPage: 8,
    initialFilters: { search: "", role: "ALL", status: "ALL", registrationDate: "all" },
  });

  useEffect(() => {
    void loadStats().catch(() => undefined);
  }, [loadStats]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadUsers(table.filters, table.page, table.perPage).catch(() => undefined);
    }, table.filters.search ? 300 : 0);
    return () => window.clearTimeout(timer);
  }, [loadUsers, table.filters.search, table.filters.role, table.filters.status, table.page, table.perPage]);

  const refreshCurrentPage = () => loadUsers(table.filters, table.page, table.perPage);
  const initialValues = useMemo<UserFormValues>(() => ({
    firstName: formMode === "edit" ? selected?.firstName ?? "" : "",
    lastName: formMode === "edit" ? selected?.lastName ?? "" : "",
    email: formMode === "edit" ? selected?.email ?? "" : "",
    phone: formMode === "edit" ? selected?.phone ?? "" : "",
    password: "",
    role: selected?.role ?? "CLIENT",
    status: selected?.status ?? "ACTIF",
  }), [formMode, selected]);

  const cards: StatCard[] = [
    { icon: Users, label: "Utilisateurs sur la plateforme", value: stats.total, color: "bg-emerald-50 text-emerald-700" },
    { icon: UserCheck, label: "Clients", value: stats.clients, color: "bg-blue-50 text-blue-700" },
    { icon: Building2, label: "Partenaires", value: stats.owners, color: "bg-amber-50 text-amber-700" },
    { icon: ShieldCheck, label: "Administrateurs", value: stats.admins, color: "bg-violet-50 text-violet-700" },
  ];

  const columns: Column<User>[] = [
    {
      key: "user",
      label: "Compte",
      render: (user) => (
        <div className="flex items-center gap-3">
          {user.avatar
            ? <img src={user.avatar} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover" />
            : <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-[11px] font-bold ${getAvatarColor(user.id)}`}>{getInitials(user.firstName, user.lastName)}</div>}
          <span className="font-semibold text-slate-800">{displayName(user)}</span>
        </div>
      ),
    },
    { key: "email", label: "Email", render: (user) => <span className="text-slate-600">{user.email}</span> },
    { key: "phone", label: "Téléphone", render: (user) => <span className="text-slate-600">{user.phone || "—"}</span> },
    {
      key: "role",
      label: "Rôle",
      render: (user) => <Badge variant="outline" className={`text-[10px] font-semibold ${ROLE_STYLES[user.role].className}`}>{ROLE_STYLES[user.role].label}</Badge>,
    },
    {
      key: "status",
      label: "Statut",
      render: (user) => <Badge variant="outline" className={`text-[10px] font-semibold ${STATUS_STYLES[user.status].className}`}>{STATUS_STYLES[user.status].label}</Badge>,
    },
    {
      key: "created",
      label: "Inscription",
      render: (user) => <span className="text-xs text-slate-500">{user.registrationDate ? <ClientOnlyDate date={user.registrationDate} /> : "—"}</span>,
    },
    {
      key: "actions",
      label: "",
      className: "text-right",
      render: (user) => {
        const actions: ActionItem[] = [
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
            label: user.status === "ACTIF" ? "Suspendre" : "Réactiver",
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

  return (
    <div className="space-y-6">
      <AdminPageHeader
        breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Utilisateurs" }]}
        title="Utilisateurs"
        description="Suivez le nombre de comptes sur la plateforme et gérez les utilisateurs et partenaires."
        actions={[
          {
            label: "Dossiers partenaires",
            icon: Building2,
            href: "/admin/validations?tab=partenaires",
            variant: "outline",
          },
          {
            label: "Ajouter un utilisateur",
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

      <StatsGrid cards={cards} columns={4} loading={isLoadingStats} />

      <FilterBar
        search={table.filters.search}
        onSearchChange={(search) => table.setFilters({ search })}
        searchPlaceholder="Rechercher par nom ou email..."
        onReset={() => table.resetFilters()}
        activeFiltersCount={table.activeFiltersCount}
        desktopFilters={
          <>
            <FilterSelect
              value={table.filters.role}
              onValueChange={(value) => table.setFilters({ role: value as UserRole | "ALL" })}
              placeholder="Tous les rôles"
              options={[
                { value: "ALL", label: "Tous les rôles" },
                { value: "CLIENT", label: "Client" },
                { value: "PROPRIETAIRE", label: "Partenaire" },
                { value: "ADMIN", label: "Administrateur" },
              ]}
            />
            <FilterSelect
              value={table.filters.status}
              onValueChange={(value) => table.setFilters({ status: value as UserStatus | "ALL" })}
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
      />

      {actionError && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{actionError}</p>}
      {error && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <span role="alert">{error}</span>
          <button type="button" className="font-semibold underline" onClick={() => void refreshCurrentPage().catch(() => undefined)}>Réessayer</button>
        </div>
      )}

      <DataTable data={users} columns={columns} emptyMessage={isLoading ? "Chargement des utilisateurs..." : "Aucun utilisateur trouvé."} />
      <Pagination page={table.page} perPage={table.perPage} total={total} onPageChange={table.setPage} onPerPageChange={table.setPerPage} itemLabel="comptes" />

      <EntityFormModal<UserFormValues>
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        title={formMode === "create" ? "Ajouter un utilisateur" : "Modifier le compte"}
        description={formMode === "create"
          ? "Créez un compte utilisateur. Les partenaires suivent ensuite le processus de validation dédié."
          : "Modifiez les informations et le rôle de ce compte."}
        initialValues={initialValues}
        fields={[
          { name: "firstName", label: "Prénom", type: "text", placeholder: "Ex. Aïcha" },
          { name: "lastName", label: "Nom", type: "text", placeholder: "Ex. Bello" },
          { name: "email", label: "Email", type: "email", required: true, placeholder: "vous@exemple.com" },
          ...(formMode === "create"
            ? [{ name: "password", label: "Mot de passe provisoire", type: "password" as const, required: true }]
            : [
                { name: "phone", label: "Téléphone", type: "tel" as const, placeholder: "+229 ..." },
                {
                  name: "role",
                  label: "Rôle",
                  type: "select" as const,
                  required: true,
                  options: [
                    { value: "CLIENT", label: "Client" },
                    { value: "PROPRIETAIRE", label: "Partenaire" },
                    { value: "ADMIN", label: "Administrateur" },
                  ],
                },
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
            if (updated.role !== values.role) updated = await changeRole(updated.id, values.role);
            if (updated.status !== values.status) await changeStatus(updated.id, values.status);
          }
          await refreshCurrentPage();
        }}
      />

      <ConfirmModal
        open={disableOpen}
        onOpenChange={setDisableOpen}
        title="Désactiver ce compte ?"
        description="Le compte sera désactivé sur la plateforme."
        confirmLabel="Désactiver le compte"
        confirmVariant="danger"
        onConfirm={() => {
          if (!selected) return;
          void disableUser(selected.id)
            .then(async () => {
              setDisableOpen(false);
              setSelected(null);
              await refreshCurrentPage();
            })
            .catch((cause: unknown) => setActionError(cause instanceof Error ? cause.message : "Impossible de désactiver le compte."));
        }}
      >
        {selected && <p className="rounded-xl border border-rose-200 bg-rose-50/50 p-3 text-sm font-semibold">{displayName(selected)} · {selected.email}</p>}
      </ConfirmModal>
    </div>
  );
}
