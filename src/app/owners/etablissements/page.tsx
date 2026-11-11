"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  Building2,
  Check,
  CheckCircle2,
  Clock,
  Eye,
  MapPin,
  Pencil,
  Plus,
  Power,
  Star,
  Trash2,
  Upload,
  X,
  XCircle,
  Loader2,
  ImagePlus,
  MapPinned,
  Coins,
  Hash,
  type LucideIcon,
} from "lucide-react";
import {
  ActionsDropdown,
  AdminPageHeader,
  ConfirmModal,
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
import { useAdminEstablishmentsStore, type EstablishmentPayload } from "@/store/useAdminEstablishmentsStore";
import {
  CATEGORY_STYLES_EST,
  STATUS_STYLES_EST,
  type AdminEstablishment,
  type EstablishmentStatus,
  type PriceUnit,
} from "@/types/establishment";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ClientOnlyDate } from "@/components/ui/clientonlydate";

type FormValues = {
  name: string;
  slug: string;
  category_id: string;
  subcategory_id: string;
  location_id: string;
  address: string;
  description: string;
  price: string;
  price_per_night: string;
  price_per_month: string;
  price_unit: string;
  currency: string;
  capacity: string;
  rooms_count: string;
  cuisine_type: string;
  area: string;
  latitude: string;
  longitude: string;
};

type EstablishmentFormStep = 0 | 1 | 2;

const EMPTY_FORM: FormValues = {
  name: "", slug: "", category_id: "", subcategory_id: "", location_id: "", address: "",
  description: "", price: "", price_per_night: "", price_per_month: "",
  price_unit: "NUIT", currency: "XOF", capacity: "", rooms_count: "",
  cuisine_type: "", area: "", latitude: "", longitude: "",
};
const STATUSES: EstablishmentStatus[] = ["EN_ATTENTE", "PUBLIE", "REJETE", "SUSPENDU"];

function toPayload(values: FormValues): EstablishmentPayload {
  const numeric = (value: string) => value.trim() ? Number(value) : null;
  return {
    name: values.name.trim(),
    slug: values.slug.trim() || null,
    category_id: values.category_id,
    subcategory_id: values.subcategory_id || null,
    location_id: values.location_id,
    address: values.address.trim(),
    description: values.description.trim() || null,
    price: numeric(values.price),
    price_per_night: numeric(values.price_per_night),
    price_per_month: numeric(values.price_per_month),
    price_unit: (values.price_unit || null) as PriceUnit | null,
    currency: values.currency.toUpperCase(),
    capacity: numeric(values.capacity),
    rooms_count: numeric(values.rooms_count),
    cuisine_type: values.cuisine_type.trim() || null,
    area: numeric(values.area),
    latitude: numeric(values.latitude),
    longitude: numeric(values.longitude),
  };
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function fromEstablishment(establishment: AdminEstablishment): FormValues {
  return {
    name: establishment.name,
    slug: establishment.slug,
    category_id: establishment.categoryId,
    subcategory_id: establishment.subcategoryId ?? "",
    location_id: establishment.locationId,
    address: establishment.address,
    description: establishment.description,
    price: establishment.price ? String(establishment.price) : "",
    price_per_night: establishment.pricePerNight === null ? "" : String(establishment.pricePerNight),
    price_per_month: establishment.pricePerMonth === null ? "" : String(establishment.pricePerMonth),
    price_unit: establishment.priceUnit ?? "NUIT",
    currency: establishment.currency,
    capacity: establishment.capacity === null ? "" : String(establishment.capacity),
    rooms_count: establishment.roomsCount === null ? "" : String(establishment.roomsCount),
    cuisine_type: establishment.cuisineType ?? "",
    area: establishment.area === null ? "" : String(establishment.area),
    latitude: establishment.latitude === null ? "" : String(establishment.latitude),
    longitude: establishment.longitude === null ? "" : String(establishment.longitude),
  };
}

export default function AdminEstablishmentsPage() {
  const searchParams = useSearchParams();
  const establishments = useAdminEstablishmentsStore((state) => state.establishments);
  const total = useAdminEstablishmentsStore((state) => state.total);
  const stats = useAdminEstablishmentsStore((state) => state.stats);
  const categories = useAdminEstablishmentsStore((state) => state.categories);
  const locations = useAdminEstablishmentsStore((state) => state.locations);
  const amenities = useAdminEstablishmentsStore((state) => state.amenities);
  const page = useAdminEstablishmentsStore((state) => state.page);
  const perPage = useAdminEstablishmentsStore((state) => state.perPage);
  const search = useAdminEstablishmentsStore((state) => state.search);
  const statusFilter = useAdminEstablishmentsStore((state) => state.statusFilter);
  const categoryFilter = useAdminEstablishmentsStore((state) => state.categoryFilter);
  const isLoading = useAdminEstablishmentsStore((state) => state.isLoading);
  const error = useAdminEstablishmentsStore((state) => state.error);
  const loadEstablishments = useAdminEstablishmentsStore((state) => state.loadEstablishments);
  const loadStats = useAdminEstablishmentsStore((state) => state.loadStats);
  const [dialog, setDialog] = useState<"create" | "edit" | "detail" | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<AdminEstablishment | null>(null);
  const [values, setValues] = useState<FormValues>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [amenityId, setAmenityId] = useState("");
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [coverPhotoId, setCoverPhotoId] = useState<string | null>(null);
  const [selectedCoverIndex, setSelectedCoverIndex] = useState<number | null>(null);
  const [formStep, setFormStep] = useState<EstablishmentFormStep>(0);
  const [slugEdited, setSlugEdited] = useState(false);
  const [photoPreviews, setPhotoPreviews] = useState<{ file: File; url: string }[]>([]);

  useEffect(() => {
    const previews = selectedPhotos.map((file) => ({ file, url: URL.createObjectURL(file) }));
    setPhotoPreviews(previews);
    return () => previews.forEach(({ url }) => URL.revokeObjectURL(url));
  }, [selectedPhotos]);

  const load = useCallback(() => loadEstablishments().catch(() => undefined), [loadEstablishments]);

  useEffect(() => {
    const requestedStatus = searchParams.get("status");
    if (requestedStatus && STATUSES.includes(requestedStatus as EstablishmentStatus)) {
      useAdminEstablishmentsStore.getState().setStatusFilter(requestedStatus as EstablishmentStatus);
    } else useAdminEstablishmentsStore.getState().setStatusFilter("ALL");
    useAdminEstablishmentsStore.getState().loadReferences().catch((loadError: unknown) => {
      setActionError(loadError instanceof Error ? loadError.message : "Le chargement des référentiels a échoué.");
    });
    void loadStats().catch(() => undefined);
  }, [loadStats, searchParams]);

  useEffect(() => {
    const timer = window.setTimeout(() => { void load(); }, 250);
    return () => window.clearTimeout(timer);
  }, [load, page, perPage, search, statusFilter, categoryFilter]);

  const maxPage = Math.max(1, Math.ceil(total / perPage));
  const formCategories = useMemo(() => categories, [categories]);

  const openCreate = () => {
    setSelected(null);
    setValues({ ...EMPTY_FORM, category_id: categories[0]?.id ?? "", location_id: locations[0]?.id ?? "" });
    setSelectedPhotos([]);
    setCoverPhotoId(null);
    setSelectedCoverIndex(null);
    setFormStep(0);
    setSlugEdited(false);
    setActionError(null);
    setDialog("create");
  };

  const openEdit = (establishment: AdminEstablishment) => {
    setSelected(establishment);
    setValues(fromEstablishment(establishment));
    setSelectedPhotos([]);
    setCoverPhotoId(establishment.photos.find((photo) => photo.is_cover)?.id ?? null);
    setSelectedCoverIndex(null);
    setFormStep(0);
    setSlugEdited(false);
    setActionError(null);
    setDialog("edit");
  };

  const validateStep = (step: EstablishmentFormStep) => {
    if (step === 0) {
      if (values.name.trim().length < 2) return "Le nom doit contenir au moins 2 caractères.";
      if (values.slug.trim().length < 2) return "Le slug doit contenir au moins 2 caractères.";
      if (!values.category_id) return "Veuillez sélectionner une catégorie.";
      if (values.currency.trim().length !== 3) return "La devise doit contenir exactement 3 lettres.";
    }
    if (step === 1) {
      if (!values.address.trim() || values.address.trim().length < 3) return "L’adresse doit contenir au moins 3 caractères.";
      if (!values.location_id) return "Veuillez sélectionner un lieu.";
    }
    if (step === 2 && selectedPhotos.length > 0 && selectedCoverIndex === null && !coverPhotoId) {
      return "Choisissez une photo de couverture avant de continuer.";
    }
    return null;
  };

  const continueForm = () => {
    const validationError = validateStep(formStep);
    if (validationError) {
      setActionError(validationError);
      return;
    }
    setActionError(null);
    if (formStep < 2) setFormStep((step) => (step + 1) as EstablishmentFormStep);
    else void submitForm();
  };

  const submitForm = async () => {
    if (!values.name.trim() || values.name.trim().length < 2) {
      setActionError("Le nom de l’établissement doit contenir au moins 2 caractères.");
      return;
    }
    const validationError = validateStep(0) ?? validateStep(1) ?? validateStep(2);
    if (validationError) {
      setActionError(validationError);
      return;
    }
    setSaving(true);
    setActionError(null);
    let establishmentSaved = dialog === "edit";
    try {
      const payload = toPayload(values);
      const api = useAdminEstablishmentsStore.getState();
      let establishment = selected;
      if (dialog === "create") {
        establishment = await api.createEstablishment(payload);
        establishmentSaved = true;
        setSelected(establishment);
        setValues(fromEstablishment(establishment));
        setSlugEdited(false);
        setDialog("edit");
      } else if (dialog === "edit" && establishment) {
        establishment = await api.updateEstablishment(establishment.id, payload);
        establishmentSaved = true;
        setSelected(establishment);
      }
      if (establishment && selectedPhotos.length) {
        await api.addPhotos(
          establishment.id,
          selectedPhotos,
          selectedCoverIndex ?? undefined,
        );
        if (coverPhotoId && selectedCoverIndex === null) {
          await api.setCoverPhoto(coverPhotoId);
        }
        setSelectedPhotos([]);
        setSelectedCoverIndex(null);
      } else if (establishment && coverPhotoId) {
        await api.setCoverPhoto(coverPhotoId);
      }
      setDialog(null);
      setFormStep(0);
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : "L’enregistrement a échoué.";
      setActionError(
        establishmentSaved
          ? `Les informations ont été enregistrées, mais les photos n’ont pas pu être ajoutées : ${message}`
          : message,
      );
    } finally {
      setSaving(false);
    }
  };

  const addSelectedPhotos = (files: FileList | null) => {
    if (!files) return;
    const newPhotos = Array.from(files).filter((file) => file.type.startsWith("image/"));
    if (newPhotos.length !== files.length) {
      setActionError("Seuls les fichiers image peuvent être ajoutés.");
    }
    if (newPhotos.length) {
      setSelectedPhotos((current) => {
        if (current.length === 0 && !coverPhotoId) setSelectedCoverIndex(0);
        return [...current, ...newPhotos];
      });
    }
  };

  const perform = async (operation: () => Promise<unknown>) => {
    setActionError(null);
    try {
      await operation();
      await loadStats();
      if (selected && dialog === "detail") {
        const latest = await useAdminEstablishmentsStore.getState().loadDetails(selected.id);
        setSelected(latest);
      }
    } catch (operationError) {
      setActionError(operationError instanceof Error ? operationError.message : "L’opération a échoué.");
    }
  };

  const openDetails = async (establishment: AdminEstablishment) => {
    setSelected(establishment);
    setDialog("detail");
    setActionError(null);
    try {
      setSelected(await useAdminEstablishmentsStore.getState().loadDetails(establishment.id));
    } catch (detailError) {
      setActionError(detailError instanceof Error ? detailError.message : "Le détail ne peut pas être chargé.");
    }
  };

  const statCards: StatCard[] = [
    { icon: Building2, label: "Total établissements", value: stats.total, color: "bg-emerald-50 text-emerald-700" },
    { icon: Clock, label: "En attente", value: stats.enAttente, color: "bg-amber-50 text-amber-700" },
    { icon: CheckCircle2, label: "Publiés", value: stats.publies, color: "bg-emerald-50 text-emerald-700" },
    { icon: XCircle, label: "Rejetés", value: stats.rejetes, color: "bg-rose-50 text-rose-700" },
    { icon: AlertTriangle, label: "Suspendus", value: stats.suspendus, color: "bg-orange-50 text-orange-700" },
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
        ? <img src={establishment.images[0]} alt={establishment.name} className="h-11 w-14 rounded-lg object-cover" />
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
        return <Badge variant="outline" className={`text-[10px] font-semibold ${style?.className ?? "border-slate-200 bg-slate-50 text-slate-700"}`}>
          {style?.label ?? establishment.category}
        </Badge>;
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
      key: "rating",
      label: "Avis",
      render: (establishment) => (
        <div className="flex items-center gap-1 text-xs">
          <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
          <span className="font-semibold">{establishment.rating.toFixed(1)}</span>
          <span className="text-slate-400">({establishment.reviewCount})</span>
        </div>
      ),
    },
    {
      key: "date",
      label: "Date d’ajout",
      render: (establishment) => <span className="text-xs text-slate-500">{establishment.createdAt ? <ClientOnlyDate date={establishment.createdAt} /> : "—"}</span>,
    },
    {
      key: "actions",
      label: "",
      className: "text-right",
      render: (establishment) => {
        const actions: ActionItem[] = [
          { label: "Voir les détails", icon: Eye, onClick: () => void openDetails(establishment) },
          { label: "Modifier", icon: Pencil, onClick: () => openEdit(establishment) },
          {
            label: establishment.status === "PUBLIE" ? "Suspendre" : "Publier",
            icon: Power,
            onClick: () => void perform(() => useAdminEstablishmentsStore.getState().changeStatus(
              establishment.id,
              establishment.status === "PUBLIE" ? "SUSPENDU" : "PUBLIE",
            )),
            separatorBefore: true,
          },
          {
            label: "Supprimer",
            icon: Trash2,
            onClick: () => { setSelected(establishment); setDeleteOpen(true); setActionError(null); },
            variant: "danger",
            separatorBefore: true,
          },
        ];
        return <ActionsDropdown actions={actions} />;
      },
    },
  ];

  const selectStatus = (value: string) => {
    useAdminEstablishmentsStore.getState().setStatusFilter(value as EstablishmentStatus | "ALL");
  };
  const selectCategory = (value: string) => useAdminEstablishmentsStore.getState().setCategoryFilter(value);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        breadcrumbs={[{ label: "Dashboard", href: "/owners" }, { label: "Établissements" }]}
        title="Établissements"
        description="Gérez tous les établissements de la plateforme."
        actions={[{ label: "Ajouter un établissement", icon: Plus, onClick: openCreate }]}
      />

      <StatsGrid cards={statCards} columns={5} loading={isLoading && stats.total === 0} />
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
              options={[
                { value: "ALL", label: "Tous statuts" },
                ...STATUSES.map((status) => ({ value: status, label: STATUS_STYLES_EST[status].label })),
              ]}
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

      {(actionError || error) && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <span role="alert">{actionError || error}</span>
          <button type="button" className="font-semibold underline" onClick={() => void loadEstablishments().catch(() => undefined)}>Réessayer</button>
        </div>
      )}
      <DataTable
        data={establishments}
        columns={columns}
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

      <ConfirmModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Supprimer cet établissement ?"
        description="Cette suppression physique est définitive."
        confirmLabel="Supprimer définitivement"
        confirmVariant="danger"
        onConfirm={() => {
          if (!selected) return;
          void perform(() => useAdminEstablishmentsStore.getState().removeEstablishment(selected.id))
            .then(() => setSelected(null));
        }}
      >
        {selected && (
          <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-3">
            <p className="text-sm font-semibold">{selected.name}</p>
            <p className="text-xs text-slate-500">{selected.address}</p>
          </div>
        )}
      </ConfirmModal>

      <Dialog
        open={dialog === "create" || dialog === "edit"}
        onOpenChange={(open) => {
          if (!open && !saving) {
            setDialog(null);
            setSelectedPhotos([]);
            setSelectedCoverIndex(null);
            setFormStep(0);
          }
        }}
      >
        <DialogContent className="flex h-[94dvh] max-h-[94dvh] max-w-5xl flex-col gap-0 overflow-hidden rounded-2xl border-0 p-0 shadow-2xl">
          <div className="shrink-0 border-b border-slate-100 bg-gradient-to-r from-emerald-50 via-white to-white px-4 py-5 sm:px-8">
            <DialogHeader className="space-y-2 pr-8 text-left">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-700 text-white shadow-sm">
                  {dialog === "create" ? <Plus className="h-5 w-5" /> : <Pencil className="h-5 w-5" />}
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold text-slate-900">
                    {dialog === "create" ? "Créer un établissement" : "Modifier l’établissement"}
                  </DialogTitle>
                  <DialogDescription className="mt-1 text-sm text-slate-500">
                    {formStep === 0 && "Renseignez les informations principales de l’établissement."}
                    {formStep === 1 && "Associez un lieu et précisez l’adresse ou les coordonnées GPS."}
                    {formStep === 2 && "Ajoutez plusieurs photos et choisissez celle qui servira de couverture."}
                  </DialogDescription>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-medium text-slate-500">
                {(["Informations", "Localisation", "Photos"] as const).map((label, index) => (
                  <button
                    key={label}
                    type="button"
                    disabled={index > formStep}
                    onClick={() => {
                      if (index < formStep) {
                        setActionError(null);
                        setFormStep(index as EstablishmentFormStep);
                      }
                    }}
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 transition ${
                      formStep === index
                        ? "bg-emerald-700 text-white shadow-sm"
                        : formStep > index
                          ? "bg-emerald-50 text-emerald-800"
                          : "bg-white text-slate-400 ring-1 ring-slate-200"
                    }`}
                  >
                    <span className="grid h-4 w-4 place-items-center rounded-full bg-white/20 text-[10px]">
                      {formStep > index ? <Check className="h-3 w-3" /> : index + 1}
                    </span>
                    {label}
                  </button>
                ))}
              </div>
            </DialogHeader>
          </div>

          <form
            id="establishment-form"
            className="flex min-h-0 flex-1 flex-col overflow-hidden"
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              continueForm();
            }}
          >
          <div className="min-h-0 flex-1 overflow-y-auto bg-slate-50/60 px-4 py-6 sm:px-8">
            {actionError && (
              <div role="alert" className="mb-5 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>{actionError}</p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-5">
              <div className="space-y-5">
                <section className={`${formStep === 0 ? "" : "hidden"} rounded-2xl border border-slate-200 bg-white p-5 shadow-sm`}>
                  <SectionTitle icon={Building2} title="Informations générales" description="Les champs marqués d’un astérisque sont obligatoires." />
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <FormInput
                      label="Nom de l’établissement"
                      required
                      className="sm:col-span-2"
                      value={values.name}
                      placeholder="Ex. Manoir rose"
                      onChange={(value) => setValues((prev) => ({
                        ...prev,
                        name: value,
                        slug: slugEdited ? prev.slug : slugify(value),
                      }))}
                    />
                    <div className="space-y-1.5 sm:col-span-2">
                      <div className="flex items-center justify-between gap-2">
                        <label htmlFor="establishment-slug" className="text-sm font-medium text-slate-700">
                          Slug <span className="text-rose-500">*</span>
                        </label>
                        <span className="text-[11px] text-slate-400">Identifiant d’URL unique</span>
                      </div>
                      <div className="relative">
                        <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                          id="establishment-slug"
                          required
                          minLength={2}
                          maxLength={220}
                          value={values.slug}
                          onChange={(event) => {
                            setSlugEdited(true);
                            setValues((prev) => ({ ...prev, slug: slugify(event.target.value) }));
                          }}
                          placeholder="manoir-rose"
                          className="h-11 rounded-xl border-slate-200 pl-9 font-mono text-sm focus-visible:ring-emerald-600"
                        />
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {slugEdited ? "Modifiable manuellement." : "Généré automatiquement à partir du nom."}
                      </p>
                    </div>

                    <FormSelect
                      label="Catégorie"
                      required
                      value={values.category_id}
                      placeholder="Choisir une catégorie"
                      onChange={(value) => setValues((prev) => ({ ...prev, category_id: value, subcategory_id: "" }))}
                      options={formCategories.map((category) => ({ value: category.id, label: category.name }))}
                    />
                    <FormSelect
                      label="Sous-catégorie"
                      value={values.subcategory_id}
                      placeholder="Aucune sous-catégorie"
                      onChange={(value) => setValues((prev) => ({ ...prev, subcategory_id: value }))}
                      options={(formCategories.find((category) => category.id === values.category_id)?.subcategories ?? []).map((subcategory) => ({ value: subcategory.id, label: subcategory.name }))}
                    />
                    <FormInput
                      label="Adresse"
                      required
                      className="sm:col-span-2"
                      value={values.address}
                      placeholder="Adresse complète de l’établissement"
                      onChange={(value) => setValues((prev) => ({ ...prev, address: value }))}
                    />
                    <label className="space-y-1.5 text-sm font-medium text-slate-700 sm:col-span-2">
                      Description
                      <Textarea
                        rows={4}
                        value={values.description}
                        onChange={(event) => setValues((prev) => ({ ...prev, description: event.target.value }))}
                        placeholder="Présentez l’établissement, ses services et ses points forts..."
                        className="resize-y rounded-xl border-slate-200 focus-visible:ring-emerald-600"
                      />
                    </label>
                  </div>
                </section>

                <section className={`${formStep === 1 ? "" : "hidden"} rounded-2xl border border-slate-200 bg-white p-5 shadow-sm`}>
                  <SectionTitle icon={MapPinned} title="Localisation" description="Associez l’établissement à son lieu et renseignez ses coordonnées si disponibles." />
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <FormSelect
                      label="Lieu"
                      required
                      className="sm:col-span-2"
                      value={values.location_id}
                      placeholder="Choisir un lieu"
                      onChange={(value) => setValues((prev) => ({ ...prev, location_id: value }))}
                      options={locations.map((location) => ({ value: location.id, label: `${location.name} · ${location.type}` }))}
                    />
                    <FormInput label="Latitude" type="number" step="any" min={-90} max={90} value={values.latitude} placeholder="6.3703" onChange={(value) => setValues((prev) => ({ ...prev, latitude: value }))} />
                    <FormInput label="Longitude" type="number" step="any" min={-180} max={180} value={values.longitude} placeholder="2.3912" onChange={(value) => setValues((prev) => ({ ...prev, longitude: value }))} />
                  </div>
                </section>

                <section className={`${formStep === 0 ? "" : "hidden"} rounded-2xl border border-slate-200 bg-white p-5 shadow-sm`}>
                  <SectionTitle icon={Coins} title="Tarification et capacité" description="Indiquez les tarifs applicables et la capacité d’accueil." />
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <FormInput label="Prix de base" type="number" min={0} step="any" value={values.price} placeholder="0" onChange={(value) => setValues((prev) => ({ ...prev, price: value }))} />
                    <FormSelect
                      label="Unité de prix"
                      value={values.price_unit}
                      onChange={(value) => setValues((prev) => ({ ...prev, price_unit: value }))}
                      options={["NUIT", "PERSONNE", "MOIS", "PERSONNE_NUIT", "GROUPE", "PRESTATION", "HEURE", "CRENEAU"].map((unit) => ({ value: unit, label: unit.replaceAll("_", " ").toLowerCase() }))}
                    />
                    <FormInput label="Prix par nuit" type="number" min={0} step="any" value={values.price_per_night} placeholder="0" onChange={(value) => setValues((prev) => ({ ...prev, price_per_night: value }))} />
                    <FormInput label="Prix par mois" type="number" min={0} step="any" value={values.price_per_month} placeholder="0" onChange={(value) => setValues((prev) => ({ ...prev, price_per_month: value }))} />
                    <FormInput label="Devise" required minLength={3} maxLength={3} value={values.currency} placeholder="XOF" onChange={(value) => setValues((prev) => ({ ...prev, currency: value.toUpperCase() }))} />
                    <FormInput label="Capacité" type="number" min={1} value={values.capacity} placeholder="Ex. 20 personnes" onChange={(value) => setValues((prev) => ({ ...prev, capacity: value }))} />
                    <FormInput label="Nombre de chambres" type="number" min={0} value={values.rooms_count} placeholder="0" onChange={(value) => setValues((prev) => ({ ...prev, rooms_count: value }))} />
                    <FormInput label="Superficie (m²)" type="number" min={0} step="any" value={values.area} placeholder="0" onChange={(value) => setValues((prev) => ({ ...prev, area: value }))} />
                    <FormInput label="Type de cuisine" value={values.cuisine_type} placeholder="Ex. Cuisine béninoise" onChange={(value) => setValues((prev) => ({ ...prev, cuisine_type: value }))} />
                  </div>
                </section>
              </div>

              <aside className={`${formStep === 2 ? "" : "hidden"} space-y-5`}>
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <SectionTitle icon={ImagePlus} title="Photos de l’établissement" description="Ajoutez des images pour présenter l’établissement." />
                  <div className="mt-5">
                    <label
                      htmlFor="establishment-photos"
                      className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/70 px-4 py-6 text-center transition hover:border-emerald-400 hover:bg-emerald-50/50"
                    >
                      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-emerald-700 shadow-sm">
                        <Upload className="h-5 w-5" />
                      </div>
                      <p className="mt-3 text-sm font-semibold text-slate-800">Cliquez pour sélectionner des photos</p>
                      <p className="mt-1 text-xs text-slate-500">Formats image · Sélection multiple possible</p>
                      <input
                        id="establishment-photos"
                        type="file"
                        accept="image/*"
                        multiple
                        className="sr-only"
                        onChange={(event) => {
                          addSelectedPhotos(event.target.files);
                          event.target.value = "";
                        }}
                      />
                    </label>
                    {dialog === "edit" && selected?.photos.length ? (
                      <div className="mt-5">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Photos déjà enregistrées</p>
                        <div className="grid grid-cols-3 gap-2">
                          {selected.photos.map((photo) => (
                                  <button
                                    key={photo.id}
                                    type="button"
                                    onClick={() => {
                                      setCoverPhotoId(photo.id);
                                      setSelectedCoverIndex(null);
                                    }}
                                    className={`relative overflow-hidden rounded-lg border-2 text-left transition ${
                                      coverPhotoId === photo.id
                                        ? "border-emerald-600 ring-2 ring-emerald-100"
                                        : "border-transparent hover:border-slate-300"
                                    }`}
                                  >
                                    <img src={photo.url} alt="" className="aspect-square w-full object-cover" />
                                    {(coverPhotoId === photo.id || (coverPhotoId === null && selectedCoverIndex === null && photo.is_cover)) && (
                                      <span className="absolute bottom-1 left-1 rounded bg-emerald-700 px-1.5 py-0.5 text-[9px] font-semibold text-white">Couverture</span>
                                    )}
                                    {coverPhotoId === photo.id && <span className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-emerald-700 text-white"><Check className="h-3 w-3" /></span>}
                                  </button>
                                ))}
                              </div>
                            </div>
                    ) : null}
                    {photoPreviews.length > 0 && (
                      <div className="mt-5">
                        <div className="mb-2 flex items-center justify-between">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">À téléverser</p>
                          <Badge variant="outline" className="text-[10px]">{photoPreviews.length} photo{photoPreviews.length > 1 ? "s" : ""}</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {photoPreviews.map(({ file, url }, index) => (
                            <div
                              key={`${file.name}-${file.lastModified}-${index}`}
                              className={`group relative overflow-hidden rounded-lg border-2 transition ${
                                selectedCoverIndex === index
                                  ? "border-emerald-600 ring-2 ring-emerald-100"
                                  : "border-slate-200"
                              }`}
                            >
                              <img src={url} alt={file.name} className="aspect-square w-full object-cover" />
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedCoverIndex(index);
                                  setCoverPhotoId(null);
                                }}
                                aria-label={`Définir ${file.name} comme photo de couverture`}
                                className={`absolute bottom-7 left-1 rounded-md px-2 py-1 text-[9px] font-semibold shadow ${
                                  selectedCoverIndex === index
                                    ? "bg-emerald-700 text-white"
                                    : "bg-white/95 text-slate-700 hover:bg-emerald-50"
                                }`}
                              >
                                {selectedCoverIndex === index ? "Photo de couverture" : "Choisir comme couverture"}
                              </button>
                              <button
                                type="button"
                                aria-label={`Retirer ${file.name}`}
                                onClick={() => {
                                  setSelectedPhotos((current) => current.filter((_, photoIndex) => photoIndex !== index));
                                  setSelectedCoverIndex((current) => {
                                    if (current === null) return null;
                                    if (current === index) return selectedPhotos.length > 1 ? 0 : null;
                                    return current > index ? current - 1 : current;
                                  });
                                }}
                                className="absolute right-1 top-1 grid h-7 w-7 place-items-center rounded-full bg-white/95 text-slate-600 shadow transition hover:bg-rose-600 hover:text-white"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                              <span className="absolute inset-x-0 bottom-0 truncate bg-slate-950/60 px-1.5 py-1 text-[9px] text-white">{file.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </section>
                <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-4 text-xs leading-relaxed text-blue-800">
                  <p className="font-semibold">À savoir</p>
                  <p className="mt-1">Les photos sélectionnées sont envoyées après l’enregistrement de la fiche. Pour une nouvelle fiche, l’établissement est d’abord créé puis les images lui sont associées.</p>
                </div>
              </aside>
            </div>
          </div>
          </form>

          <DialogFooter className="shrink-0 flex-row items-center justify-between gap-2 border-t border-slate-100 bg-white px-4 py-3 sm:px-8 sm:py-4">
            <Button
              type="button"
              variant="outline"
              disabled={saving}
              onClick={() => {
                if (formStep > 0) {
                  setFormStep((step) => (step - 1) as EstablishmentFormStep);
                  setActionError(null);
                } else {
                  setDialog(null);
                  setSelectedPhotos([]);
                }
              }}
              className="shrink-0 rounded-xl px-3 sm:mr-auto sm:px-4"
            >
              {formStep > 0 ? "Précédent" : "Annuler"}
            </Button>
            <span className="hidden self-center text-xs text-slate-400 sm:inline">Étape {formStep + 1} sur 3</span>
            {formStep < 2 ? (
              <Button type="submit" form="establishment-form" disabled={saving} className="min-w-0 shrink rounded-xl bg-emerald-700 px-3 hover:bg-emerald-800 sm:min-w-32 sm:px-4">
                Continuer
                <MapPin className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                form="establishment-form"
                disabled={saving}
                className="min-w-0 shrink rounded-xl bg-emerald-700 px-3 hover:bg-emerald-800 sm:min-w-40 sm:px-4"
              >
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                {saving ? "Enregistrement..." : dialog === "create" ? "Créer l’établissement" : "Enregistrer"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={dialog === "detail"} onOpenChange={(open) => !open && setDialog(null)}>
        <DialogContent className="flex h-[90dvh] max-h-[90dvh] w-[96vw] max-w-[96vw] flex-col gap-0 overflow-hidden rounded-2xl border-0 p-0 shadow-2xl sm:max-w-5xl">
          {selected && (
            <>
              <div className="shrink-0 border-b border-slate-100 bg-gradient-to-r from-emerald-50 via-white to-white px-5 py-5 sm:px-8">
                <DialogHeader className="pr-8 text-left">
                  <div className="flex items-start gap-3">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-700 text-white shadow-sm">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <DialogTitle className="truncate text-xl font-bold text-slate-900">{selected.name}</DialogTitle>
                      <DialogDescription className="mt-1 truncate text-sm text-slate-500">
                        {selected.slug ? `/${selected.slug}` : "Détails de l’établissement"}
                      </DialogDescription>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Badge variant="outline" className={STATUS_STYLES_EST[selected.status].className}>
                          {STATUS_STYLES_EST[selected.status].label}
                        </Badge>
                        <Badge variant="outline" className="border-slate-200 bg-white text-slate-600">
                          {selected.category}{selected.subcategory ? ` · ${selected.subcategory}` : ""}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </DialogHeader>
              </div>

              <div className="min-h-0 flex-1 space-y-5 overflow-y-auto bg-slate-50/60 px-4 py-5 sm:px-8 sm:py-6">
                {actionError && (
                  <div role="alert" className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                    <p>{actionError}</p>
                  </div>
                )}

                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  {selected.photos[0] ? (
                    <div className="relative h-48 bg-slate-100 sm:h-64">
                      <img src={(selected.photos.find((photo) => photo.is_cover) ?? selected.photos[0]).url} alt={selected.name} className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 text-white sm:p-5">
                        <div className="min-w-0">
                          <p className="truncate text-lg font-bold">{selected.name}</p>
                          <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-white/85">
                            <MapPin className="h-3.5 w-3.5 shrink-0" />{selected.address || selected.location.city || selected.location.country}
                          </p>
                        </div>
                        <div className="shrink-0 rounded-xl bg-white/15 px-3 py-2 text-right backdrop-blur-sm">
                          <p className="text-sm font-bold">{selected.price.toLocaleString()} {selected.currency}</p>
                          <p className="text-[10px] text-white/80">{selected.priceUnit?.toLowerCase().replaceAll("_", " ") ?? "Tarif"}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-36 items-center justify-center bg-gradient-to-br from-emerald-50 to-slate-100 text-emerald-700">
                      <Building2 className="h-10 w-10 opacity-40" />
                    </div>
                  )}
                  <div className="grid grid-cols-2 divide-x divide-slate-100 sm:grid-cols-4">
                    <div className="p-4">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Note moyenne</p>
                      <p className="mt-1 flex items-center gap-1.5 text-sm font-bold text-slate-800">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-500" />{selected.rating.toFixed(1)}
                        <span className="font-normal text-slate-400">({selected.reviewCount})</span>
                      </p>
                    </div>
                    <div className="p-4">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Capacité</p>
                      <p className="mt-1 text-sm font-bold text-slate-800">{selected.capacity ?? "—"} <span className="font-normal text-slate-500">personnes</span></p>
                    </div>
                    <div className="p-4">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Chambres</p>
                      <p className="mt-1 text-sm font-bold text-slate-800">{selected.roomsCount ?? "—"}</p>
                    </div>
                    <div className="p-4">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Disponibilité</p>
                      <p className="mt-1 text-sm font-bold text-slate-800">{selected.availabilityStatus.replaceAll("_", " ").toLowerCase()}</p>
                    </div>
                  </div>
                </section>

                <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <SectionTitle icon={Building2} title="À propos" description="Description et informations principales." />
                    <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-600">{selected.description || "Aucune description n’a été renseignée."}</p>
                    <div className="mt-5 grid gap-3 border-t border-slate-100 pt-4 text-sm sm:grid-cols-2">
                      <div>
                        <p className="text-xs font-medium text-slate-400">Adresse</p>
                        <p className="mt-1 font-medium text-slate-700">{selected.address || "Non renseignée"}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-400">Localisation</p>
                        <p className="mt-1 font-medium text-slate-700">{[selected.location.city, selected.location.country].filter(Boolean).join(", ") || "Non renseignée"}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-400">Prix par nuit</p>
                        <p className="mt-1 font-medium text-slate-700">{selected.pricePerNight != null ? `${selected.pricePerNight.toLocaleString()} ${selected.currency}` : "Non renseigné"}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-400">Prix par mois</p>
                        <p className="mt-1 font-medium text-slate-700">{selected.pricePerMonth != null ? `${selected.pricePerMonth.toLocaleString()} ${selected.currency}` : "Non renseigné"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <SectionTitle icon={ImagePlus} title="Photos" description={`${selected.photos.length} photo${selected.photos.length === 1 ? "" : "s"} enregistrée${selected.photos.length === 1 ? "" : "s"}.`} />
                      <label className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50">
                        {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                        Ajouter
                        <input className="hidden" type="file" accept="image/*" multiple disabled={uploading} onChange={async (event) => {
                          if (!event.target.files?.length) return;
                          setUploading(true);
                          try {
                            await perform(() => useAdminEstablishmentsStore.getState().addPhotos(selected.id, Array.from(event.target.files ?? [])));
                          } finally {
                            setUploading(false);
                            event.target.value = "";
                          }
                        }} />
                      </label>
                    </div>
                    {selected.photos.length ? (
                      <div className="grid grid-cols-3 gap-2">
                        {selected.photos.map((photo) => (
                          <div key={photo.id} className="group relative overflow-hidden rounded-xl border border-slate-100">
                            <img src={photo.url} alt="" className="aspect-square w-full object-cover transition duration-200 group-hover:scale-105" />
                            {photo.is_cover && <span className="absolute bottom-1 left-1 rounded-md bg-emerald-700 px-1.5 py-1 text-[9px] font-semibold text-white">Couverture</span>}
                            <div className="absolute right-1 top-1 flex gap-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
                              {!photo.is_cover && <button type="button" title="Définir en couverture" aria-label="Définir en couverture" className="rounded-lg bg-white/95 p-1.5 text-slate-700 shadow hover:text-emerald-700" onClick={() => void perform(() => useAdminEstablishmentsStore.getState().setCoverPhoto(photo.id))}><Check className="h-3.5 w-3.5" /></button>}
                              <button type="button" title="Supprimer la photo" aria-label="Supprimer la photo" className="rounded-lg bg-white/95 p-1.5 text-rose-600 shadow hover:bg-rose-600 hover:text-white" onClick={() => void perform(() => useAdminEstablishmentsStore.getState().deletePhoto(photo.id))}><X className="h-3.5 w-3.5" /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 py-8 text-center text-xs text-slate-500">Aucune photo pour cet établissement.</div>
                    )}
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <SectionTitle icon={CheckCircle2} title="Équipements" description="Gérez les équipements associés à l’établissement." />
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selected.amenities.map((amenity) => (
                      <Badge key={amenity.id} variant="outline" className="gap-1.5 rounded-full border-slate-200 bg-slate-50 px-3 py-1.5 text-slate-700">
                        {amenity.name}
                        <button type="button" aria-label={`Retirer ${amenity.name}`} className="text-slate-400 transition hover:text-rose-600" onClick={() => void perform(() => useAdminEstablishmentsStore.getState().removeAmenity(selected.id, amenity.id))}><X className="h-3 w-3" /></button>
                      </Badge>
                    ))}
                    {!selected.amenities.length && <p className="text-sm text-slate-500">Aucun équipement associé.</p>}
                  </div>
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <select className="h-10 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" value={amenityId} onChange={(event) => setAmenityId(event.target.value)}>
                      <option value="">Ajouter un équipement…</option>
                      {amenities.filter((amenity) => !selected.amenities.some((current) => current.id === amenity.id)).map((amenity) => <option key={amenity.id} value={amenity.id}>{amenity.name}</option>)}
                    </select>
                    <Button disabled={!amenityId} className="rounded-xl bg-emerald-700 hover:bg-emerald-800" onClick={() => void perform(async () => { await useAdminEstablishmentsStore.getState().addAmenities(selected.id, [amenityId]); setAmenityId(""); })}>Ajouter un équipement</Button>
                  </div>
                </section>
              </div>

              <DialogFooter className="shrink-0 flex-row items-center justify-between gap-3 border-t border-slate-100 bg-white px-4 py-3 sm:px-8 sm:py-4">
                <label className="flex min-w-0 items-center gap-2 text-xs font-medium text-slate-500 sm:text-sm">
                  <span className="hidden sm:inline">Disponibilité</span>
                  <select className="h-10 min-w-0 rounded-xl border border-slate-200 bg-white px-2 text-xs text-slate-700 outline-none focus:border-emerald-500 sm:px-3 sm:text-sm" value={selected.availabilityStatus} onChange={(event) => void perform(() => useAdminEstablishmentsStore.getState().changeAvailability(selected.id, event.target.value as AdminEstablishment["availabilityStatus"]))}>
                    {["AVAILABLE", "RENTED", "UNAVAILABLE"].map((status) => <option key={status} value={status}>{status.replaceAll("_", " ").toLowerCase()}</option>)}
                  </select>
                </label>
                <Button variant="outline" className="shrink-0 rounded-xl border-emerald-200 text-emerald-800 hover:bg-emerald-50" onClick={() => openEdit(selected)}>
                  <Pencil className="mr-2 h-4 w-4" />Modifier
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
        <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{description}</p>
      </div>
    </div>
  );
}

function FormInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  min,
  max,
  minLength,
  maxLength,
  step,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  step?: string;
  className?: string;
}) {
  return (
    <label className={`block space-y-1.5 text-sm font-medium text-slate-700 ${className}`}>
      <span>{label}{required && <span className="ml-1 text-rose-500">*</span>}</span>
      <Input
        type={type}
        required={required}
        min={min}
        max={max}
        minLength={minLength}
        maxLength={maxLength}
        step={step}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-xl border-slate-200 focus-visible:ring-emerald-600"
      />
    </label>
  );
}

function FormSelect({
  label,
  value,
  onChange,
  options,
  placeholder,
  required = false,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={`block space-y-1.5 text-sm font-medium text-slate-700 ${className}`}>
      <span>{label}{required && <span className="ml-1 text-rose-500">*</span>}</span>
      <select
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  );
}
