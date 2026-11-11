"use client";

import { useEffect, useRef, useState } from "react";
import {
  Check,
  Clock3,
  Eye,
  ExternalLink,
  FileText,
  Loader2,
  X,
} from "lucide-react";
import {
  AdminPageHeader,
  DataTable,
  FilterBar,
  FilterChips,
  Pagination,
  StatsGrid,
  type Column,
  type StatCard,
} from "@/components/admin/commun";
import { FilterSelect } from "@/components/admin/commun/FilterSelect";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useAdminOwnerApplicationsStore,
  type AdminOwnerApplication,
  type AdminOwnerApplicationStatus,
  type OwnerApplicationDecision,
} from "@/store/useAdminOwnerApplicationsStore";

const PAGE_SIZE = 10;

const STATUS_LABELS: Record<AdminOwnerApplicationStatus, string> = {
  EN_ATTENTE: "En attente",
  APPROUVE: "Approuvé",
  REJETE: "Rejeté",
};

const STATUS_CLASSES: Record<AdminOwnerApplicationStatus, string> = {
  EN_ATTENTE: "border-amber-200 bg-amber-50 text-amber-700",
  APPROUVE: "border-emerald-200 bg-emerald-50 text-emerald-700",
  REJETE: "border-rose-200 bg-rose-50 text-rose-700",
};

function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString("fr-FR");
}

function ownerName(application: AdminOwnerApplication) {
  return [application.owner.firstName, application.owner.lastName].filter(Boolean).join(" ")
    || application.owner.email;
}

function DocumentLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3 text-sm font-medium text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50/50"
    >
      <span className="flex min-w-0 items-center gap-2">
        <FileText className="h-4 w-4 shrink-0 text-emerald-700" />
        <span className="truncate">{label}</span>
      </span>
      <ExternalLink className="h-4 w-4 shrink-0 text-slate-400" />
    </a>
  );
}

export default function OwnerApplicationsPanel() {
  const applications = useAdminOwnerApplicationsStore((state) => state.applications);
  const isLoading = useAdminOwnerApplicationsStore((state) => state.isLoading);
  const error = useAdminOwnerApplicationsStore((state) => state.error);
  const getApplication = useAdminOwnerApplicationsStore((state) => state.getApplication);
  const loadApplications = useAdminOwnerApplicationsStore((state) => state.loadApplications);
  const updateApplication = useAdminOwnerApplicationsStore((state) => state.updateApplication);
  const [status, setStatus] = useState<AdminOwnerApplicationStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<AdminOwnerApplication | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const detailRequestId = useRef(0);
  const [decision, setDecision] = useState<{
    application: AdminOwnerApplication;
    value: OwnerApplicationDecision;
  } | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isReviewing, setIsReviewing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const offset = (page - 1) * PAGE_SIZE;

  useEffect(() => {
    void loadApplications(status, PAGE_SIZE, offset).catch(() => undefined);
  }, [loadApplications, status, offset]);

  const visibleApplications = applications.filter((application) => {
    const query = search.trim().toLocaleLowerCase("fr");
    return !query || [
      application.owner.email,
      application.owner.firstName,
      application.owner.lastName,
      application.owner.phone,
      application.owner.city,
    ].some((value) => value?.toLocaleLowerCase("fr").includes(query));
  });

  const beginReview = (application: AdminOwnerApplication, value: OwnerApplicationDecision) => {
    setDecision({ application, value });
    setRejectionReason("");
    setActionError(null);
  };

  const openDetails = async (application: AdminOwnerApplication) => {
    const requestId = ++detailRequestId.current;
    setSelected(application);
    setDetailLoading(true);
    setDetailError(null);
    try {
      const details = await getApplication(application.id);
      if (requestId === detailRequestId.current) setSelected(details);
    } catch (loadError) {
      if (requestId === detailRequestId.current) {
        setDetailError(loadError instanceof Error ? loadError.message : "Le détail du dossier ne peut pas être chargé.");
      }
    } finally {
      if (requestId === detailRequestId.current) setDetailLoading(false);
    }
  };

  const submitStatusUpdate = async () => {
    if (!decision) return;
    setIsReviewing(true);
    setActionError(null);
    try {
      await updateApplication(
        decision.application.id,
        decision.value,
        decision.value === "REJETE" ? rejectionReason : undefined,
      );
    } catch (reviewError) {
      setActionError(reviewError instanceof Error ? reviewError.message : "La décision n’a pas pu être enregistrée.");
      setIsReviewing(false);
      return;
    }
    setDecision(null);
    setSelected(null);
    setPage(1);
    setIsReviewing(false);
    await loadApplications(status, PAGE_SIZE, 0).catch(() => undefined);
  };

  const cards: StatCard[] = [
    { icon: FileText, label: "Dossiers affichés", value: applications.length, color: "bg-emerald-50 text-emerald-700" },
    { icon: Clock3, label: "En attente", value: applications.filter((application) => application.status === "EN_ATTENTE").length, color: "bg-amber-50 text-amber-700" },
    { icon: Check, label: "Approuvés", value: applications.filter((application) => application.status === "APPROUVE").length, color: "bg-blue-50 text-blue-700" },
    { icon: X, label: "Rejetés", value: applications.filter((application) => application.status === "REJETE").length, color: "bg-rose-50 text-rose-700" },
  ];

  const columns: Column<AdminOwnerApplication>[] = [
    {
      key: "actions",
      label: "Traiter le dossier",
      className: "w-[300px] min-w-[300px]",
      render: (application) => (
        <div className="flex flex-wrap items-center gap-2">
          {application.status === "EN_ATTENTE" ? (
            <>
              <Button
                type="button"
                size="sm"
                className="h-9 rounded-lg bg-emerald-700 px-3 font-semibold text-white hover:bg-emerald-800"
                onClick={() => beginReview(application, "APPROUVE")}
              >
                <Check className="mr-1.5 h-4 w-4" />
                Approuver
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-9 rounded-lg border-rose-200 px-3 font-semibold text-rose-700 hover:bg-rose-50 hover:text-rose-800"
                onClick={() => beginReview(application, "REJETE")}
              >
                <X className="mr-1.5 h-4 w-4" />
                Rejeter
              </Button>
            </>
          ) : (
            <span className="text-xs text-slate-400">Dossier déjà traité</span>
          )}
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-9 rounded-lg px-2 text-slate-600"
            onClick={() => void openDetails(application)}
          >
            <Eye className="mr-1.5 h-4 w-4" />
            Voir
          </Button>
        </div>
      ),
    },
    {
      key: "partner",
      label: "Partenaire",
      render: (application) => (
        <div>
          <p className="font-semibold text-slate-800">{ownerName(application)}</p>
          <p className="mt-1 text-xs text-slate-500">{application.owner.city || "Ville non renseignée"}</p>
        </div>
      ),
    },
    {
      key: "contact",
      label: "Contact",
      render: (application) => (
        <div>
          <p className="text-slate-700">{application.owner.email}</p>
          <p className="mt-1 text-xs text-slate-500">{application.owner.phone || "Téléphone non renseigné"}</p>
        </div>
      ),
    },
    {
      key: "submitted",
      label: "Soumis le",
      render: (application) => <span className="text-xs text-slate-500">{formatDate(application.submitted_at)}</span>,
    },
    {
      key: "status",
      label: "Statut du dossier",
      render: (application) => (
        <Badge variant="outline" className={`text-[10px] font-semibold ${STATUS_CLASSES[application.status]}`}>
          {STATUS_LABELS[application.status]}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Validations" }]}
        title="Validations"
        description="Consultez les dossiers de partenariat et validez ou rejetez les demandes."
      />

      <StatsGrid cards={cards} columns={4} loading={isLoading} />

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Rechercher par nom, email ou ville..."
        onReset={() => {
          setSearch("");
          setStatus("ALL");
          setPage(1);
        }}
        activeFiltersCount={(status === "ALL" ? 0 : 1) + (search ? 1 : 0)}
        desktopFilters={
          <FilterSelect
            value={status}
            onValueChange={(value) => {
              setStatus(value === "EN_ATTENTE" || value === "APPROUVE" || value === "REJETE" ? value : "ALL");
              setPage(1);
            }}
            placeholder="Tous les statuts"
            options={[
              { value: "ALL", label: "Tous les dossiers" },
              { value: "EN_ATTENTE", label: "En attente" },
              { value: "APPROUVE", label: "Approuvés" },
              { value: "REJETE", label: "Rejetés" },
            ]}
          />
        }
        mobileFilters={
          <FilterChips
            label="Statut du dossier"
            value={status}
            onChange={(value) => {
              setStatus(value === "EN_ATTENTE" || value === "APPROUVE" || value === "REJETE" ? value : "ALL");
              setPage(1);
            }}
            options={[
              { value: "ALL", label: "Tous" },
              { value: "EN_ATTENTE", label: "En attente" },
              { value: "APPROUVE", label: "Approuvés" },
              { value: "REJETE", label: "Rejetés" },
            ]}
          />
        }
      />

      {error && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <span role="alert">{error}</span>
          <button type="button" className="font-semibold underline" onClick={() => void loadApplications(status, PAGE_SIZE, offset).catch(() => undefined)}>Réessayer</button>
        </div>
      )}
      {actionError && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{actionError}</p>}

      <DataTable
        data={visibleApplications}
        columns={columns}
        selectable={false}
        emptyMessage={isLoading ? "Chargement des dossiers partenaires..." : search ? "Aucun dossier ne correspond à la recherche." : "Aucun dossier partenaire pour ce statut."}
      />
      <Pagination
        page={page}
        perPage={PAGE_SIZE}
        total={null}
        onPageChange={setPage}
        itemLabel="dossiers partenaires"
        perPageOptions={[PAGE_SIZE]}
        hasNextPage={applications.length === PAGE_SIZE}
      />

      <Dialog open={selected !== null} onOpenChange={(open) => {
        if (!open) {
          detailRequestId.current += 1;
          setSelected(null);
          setDetailLoading(false);
          setDetailError(null);
        }
      }}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-2xl">
          {detailLoading ? (
            <div role="status" className="flex items-center justify-center gap-2 py-12 text-sm text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin text-emerald-700" />
              Chargement du dossier partenaire...
            </div>
          ) : detailError ? (
            <div className="space-y-4">
              <DialogHeader>
                <DialogTitle>Dossier partenaire indisponible</DialogTitle>
                <DialogDescription role="alert">{detailError}</DialogDescription>
              </DialogHeader>
              {selected && (
                <Button type="button" variant="outline" onClick={() => void openDetails(selected)}>
                  Réessayer
                </Button>
              )}
            </div>
          ) : selected && (
            <>
              <DialogHeader>
                <DialogTitle>Dossier partenaire</DialogTitle>
                <DialogDescription>Informations du partenaire et pièces soumises pour validation.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-2">
                <Info label="Partenaire" value={ownerName(selected)} />
                <Info label="Email" value={selected.owner.email} />
                <Info label="Téléphone" value={selected.owner.phone || "Non renseigné"} />
                <Info label="Ville" value={selected.owner.city || "Non renseignée"} />
                <Info label="Date de soumission" value={formatDate(selected.submitted_at)} />
                <Info label="Statut" value={STATUS_LABELS[selected.status]} />
                {selected.reviewed_at && <Info label="Date de décision" value={formatDate(selected.reviewed_at)} />}
              </div>
              {selected.rejection_reason && (
                <p className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
                  <span className="font-semibold">Motif du rejet : </span>{selected.rejection_reason}
                </p>
              )}
              <div className="grid gap-2 sm:grid-cols-2">
                <DocumentLink href={selected.registry_document_url} label="Document d’immatriculation" />
                <DocumentLink href={selected.partnership_document_url} label="Document de partenariat" />
              </div>
              {selected.status === "EN_ATTENTE" && (
                <DialogFooter className="gap-2">
                  <Button type="button" variant="outline" className="rounded-xl border-rose-200 text-rose-700" onClick={() => { beginReview(selected, "REJETE"); setSelected(null); }}>
                    <X className="mr-2 h-4 w-4" />Rejeter
                  </Button>
                  <Button type="button" className="rounded-xl bg-emerald-700 hover:bg-emerald-800" onClick={() => { beginReview(selected, "APPROUVE"); setSelected(null); }}>
                    <Check className="mr-2 h-4 w-4" />Approuver le partenaire
                  </Button>
                </DialogFooter>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={decision !== null} onOpenChange={(open) => { if (!open && !isReviewing) setDecision(null); }}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle>{decision?.value === "APPROUVE" ? "Approuver le partenaire ?" : "Rejeter le dossier partenaire ?"}</DialogTitle>
            <DialogDescription>
              {decision && ownerName(decision.application)}
              {decision?.value === "APPROUVE"
                ? " pourra accéder à son espace propriétaire après approbation."
                : " sera informé de la décision et pourra soumettre de nouveaux documents."}
            </DialogDescription>
          </DialogHeader>
          {decision?.value === "REJETE" && (
            <div className="space-y-2">
              <label htmlFor="rejection-reason" className="text-sm font-medium text-slate-700">
                Motif du rejet <span className="text-xs font-normal text-slate-400">Optionnel</span>
              </label>
              <Textarea id="rejection-reason" value={rejectionReason} onChange={(event) => setRejectionReason(event.target.value)} maxLength={1000} placeholder="Précisez les éléments à corriger..." className="min-h-24 rounded-xl" />
            </div>
          )}
          {actionError && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{actionError}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" disabled={isReviewing} className="rounded-xl" onClick={() => setDecision(null)}>Annuler</Button>
            <Button type="button" disabled={isReviewing} onClick={() => void submitStatusUpdate()} className={`rounded-xl ${decision?.value === "REJETE" ? "bg-rose-700 hover:bg-rose-800" : "bg-emerald-700 hover:bg-emerald-800"}`}>
              {isReviewing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Modification...</> : "Modifier le statut"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-1 break-words text-sm font-medium text-slate-800">{value}</p>
    </div>
  );
}
