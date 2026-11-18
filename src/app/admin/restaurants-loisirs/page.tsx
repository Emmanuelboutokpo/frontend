"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Building2, Eye, ImagePlus, Loader2, MapPin, Pencil, Plus, Search, Trash2, Upload, X } from "lucide-react";

import {
  ActionsDropdown,
  AdminPageHeader,
  ConfirmModal,
  DataTable,
  Pagination,
  type ActionItem,
  type Column,
} from "@/components/admin/commun";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminEstablishmentsStore, type EstablishmentPayload } from "@/store/useAdminEstablishmentsStore";
import {
  CATEGORY_STYLES_EST,
  STATUS_STYLES_EST,
  type AdminEstablishment,
  type AdminAmenity,
  type AdminLocation,
  type EstablishmentStatus,
  type PriceUnit,
} from "@/types/establishment";

type ManagedCategoryType = "restaurant" | "loisir";
type ManagedFormValues = {
  name: string;
  slug: string;
  category_id: string;
  subcategory_id: string;
  location_id: string;
  amenity_ids: string[];
  address: string;
  description: string;
  price: string;
  price_per_night: string;
  price_per_month: string;
  price_unit: PriceUnit;
  currency: string;
  capacity: string;
  rooms_count: string;
  cuisine_type: string;
  area: string;
  latitude: string;
  longitude: string;
};

const EMPTY_FORM: ManagedFormValues = {
  name: "",
  slug: "",
  category_id: "",
  subcategory_id: "",
  location_id: "",
  amenity_ids: [],
  address: "",
  description: "",
  price: "",
  price_per_night: "",
  price_per_month: "",
  price_unit: "PERSONNE",
  currency: "XOF",
  capacity: "",
  rooms_count: "",
  cuisine_type: "",
  area: "",
  latitude: "",
  longitude: "",
};
const STATUSES: EstablishmentStatus[] = ["EN_ATTENTE", "PUBLIE", "REJETE", "SUSPENDU"];
const PRICE_UNITS: PriceUnit[] = ["NUIT", "PERSONNE", "MOIS", "PERSONNE_NUIT", "GROUPE", "PRESTATION", "HEURE", "CRENEAU"];
const PAGE_SIZE = 20;

function categoryType(category: { slug?: string; name: string }): ManagedCategoryType | null {
  const slug = category.slug?.toLocaleLowerCase("fr")
    ?? category.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("fr");
  if (slug === "restaurant" || slug === "restaurants") return "restaurant";
  if (slug === "loisir" || slug === "loisirs") return "loisir";
  return null;
}

function toPayload(values: ManagedFormValues): EstablishmentPayload {
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
    price_unit: values.price_unit,
    currency: values.currency.toUpperCase(),
    capacity: numeric(values.capacity),
    rooms_count: numeric(values.rooms_count),
    cuisine_type: values.cuisine_type.trim() || null,
    area: numeric(values.area),
    latitude: numeric(values.latitude),
    longitude: numeric(values.longitude),
  };
}

function fromEstablishment(establishment: AdminEstablishment): ManagedFormValues {
  const value = (input: number | null) => input === null ? "" : String(input);
  return {
    name: establishment.name,
    slug: establishment.slug,
    category_id: establishment.categoryId,
    subcategory_id: establishment.subcategoryId ?? "",
    location_id: establishment.locationId,
    amenity_ids: establishment.amenities.map((amenity) => amenity.id),
    address: establishment.address,
    description: establishment.description,
    price: value(establishment.price),
    price_per_night: value(establishment.pricePerNight),
    price_per_month: value(establishment.pricePerMonth),
    price_unit: establishment.priceUnit ?? "PERSONNE",
    currency: establishment.currency,
    capacity: value(establishment.capacity),
    rooms_count: value(establishment.roomsCount),
    cuisine_type: establishment.cuisineType ?? "",
    area: value(establishment.area),
    latitude: value(establishment.latitude),
    longitude: value(establishment.longitude),
  };
}

function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("fr")
    .trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function ManagedField({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder,
  min,
  max,
  step,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: string;
}) {
  return (
    <label className="block space-y-1.5 text-sm font-medium text-slate-700">
      <span>{label}{required && <span className="ml-1 text-rose-500">*</span>}</span>
      <Input
        type={type}
        required={required}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-10 rounded-xl border-slate-200"
      />
    </label>
  );
}

export default function AdminManagedEstablishmentsPage() {
  const categories = useAdminEstablishmentsStore((state) => state.categories);
  const locations = useAdminEstablishmentsStore((state) => state.locations);
  const amenities = useAdminEstablishmentsStore((state) => state.amenities);
  const [rows, setRows] = useState<AdminEstablishment[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [categoryTypeFilter, setCategoryTypeFilter] = useState<ManagedCategoryType | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<EstablishmentStatus | "ALL">("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected] = useState<AdminEstablishment | null>(null);
  const [values, setValues] = useState<ManagedFormValues>(EMPTY_FORM);
  const [photos, setPhotos] = useState<File[]>([]);
  const [amenityToAdd, setAmenityToAdd] = useState("");
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<AdminEstablishment | null>(null);
  const [details, setDetails] = useState<AdminEstablishment | null>(null);

  const formCategories = useMemo(
    () => categories.filter((category) => categoryType(category) !== null),
    [categories],
  );
  const formSubcategories = useMemo(
    () => formCategories.find((category) => category.id === values.category_id)?.subcategories ?? [],
    [formCategories, values.category_id],
  );
  const selectedCategory = formCategories.find((category) => category.id === values.category_id);
  const selectedCategorySlug = selectedCategory?.slug?.toLocaleLowerCase("fr")
    ?? selectedCategory?.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("fr");
  const isAccommodation = selectedCategorySlug === "hebergement" || selectedCategorySlug === "hébergement";

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await useAdminEstablishmentsStore.getState().loadManagedEstablishments({
        category_type: categoryTypeFilter === "ALL" ? undefined : categoryTypeFilter,
        status: statusFilter === "ALL" ? undefined : statusFilter,
        q: search.trim(),
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE,
      });
      setRows(result.items);
      setTotal(result.total);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Le chargement des restaurants et loisirs a échoué.");
    } finally {
      setLoading(false);
    }
  }, [categoryTypeFilter, page, search, statusFilter]);

  useEffect(() => {
    void useAdminEstablishmentsStore.getState().loadReferences().catch((loadError: unknown) => {
      setError(loadError instanceof Error ? loadError.message : "Le chargement des référentiels a échoué.");
    });
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), search.trim().length === 1 ? 300 : 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  const openCreate = () => {
    const firstCategory = formCategories[0];
    setSelected(null);
    setValues({
      ...EMPTY_FORM,
      category_id: firstCategory?.id ?? "",
      location_id: locations[0]?.id ?? "",
    });
    setPhotos([]);
    setAmenityToAdd("");
    setActionError(null);
    setDialogOpen(true);
  };

  const openEdit = async (establishment: AdminEstablishment) => {
    setSaving(true);
    setActionError(null);
    try {
      const detail = await useAdminEstablishmentsStore.getState().loadManagedEstablishmentDetails(establishment.id);
      setSelected(detail);
      setValues(fromEstablishment(detail));
      setPhotos([]);
      setAmenityToAdd("");
      setDialogOpen(true);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Le détail ne peut pas être chargé.");
    } finally {
      setSaving(false);
    }
  };

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!values.category_id || !values.location_id || values.name.trim().length < 2 || values.address.trim().length < 3) {
      setActionError("Vérifiez le nom, la catégorie, le lieu et l’adresse.");
      return;
    }
    if (values.currency.trim().length !== 3) {
      setActionError("La devise doit contenir exactement 3 lettres.");
      return;
    }
    setSaving(true);
    setActionError(null);
    let establishmentSaved = false;
    try {
      const api = useAdminEstablishmentsStore.getState();
      const payload = toPayload(values);
      const establishment = selected
        ? await api.updateManagedEstablishment(selected.id, payload)
        : await api.createManagedEstablishment(payload);
      establishmentSaved = true;
      if (photos.length) await api.addManagedEstablishmentPhotos(establishment.id, photos);
      setDialogOpen(false);
      setSelected(null);
      setPhotos([]);
      await load();
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : "L’enregistrement a échoué.";
      setActionError(establishmentSaved
        ? `Les informations ont été enregistrées, mais l’ajout des photos a échoué : ${message}`
        : message);
      if (establishmentSaved) {
        await load();
      }
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!pendingDelete) return;
    setSaving(true);
    setError(null);
    try {
      await useAdminEstablishmentsStore.getState().removeManagedEstablishment(pendingDelete.id);
      setPendingDelete(null);
      await load();
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : "La suppression a échoué.");
      setPendingDelete(null);
    } finally {
      setSaving(false);
    }
  };

  const openDetails = async (establishment: AdminEstablishment) => {
    setSaving(true);
    setError(null);
    try {
      setDetails(await useAdminEstablishmentsStore.getState().loadManagedEstablishmentDetails(establishment.id));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Le détail ne peut pas être chargé.");
    } finally {
      setSaving(false);
    }
  };

  const columns: Column<AdminEstablishment>[] = [
    {
      key: "image",
      label: "Image",
      render: (item) => item.images[0]
        ? <img src={item.images[0]} alt="" className="h-11 w-14 rounded-lg object-cover" />
        : <div className="grid h-11 w-14 place-items-center rounded-lg bg-slate-100 text-xs text-slate-400">—</div>,
    },
    { key: "name", label: "Nom", render: (item) => <span className="font-semibold text-slate-800">{item.name}</span> },
    {
      key: "category",
      label: "Catégorie",
      render: (item) => {
        const style = CATEGORY_STYLES_EST[item.category.toUpperCase()];
        return <Badge variant="outline" className={`text-[10px] font-semibold ${style?.className ?? "border-slate-200 bg-slate-50 text-slate-700"}`}>{style?.label ?? item.category}</Badge>;
      },
    },
    { key: "location", label: "Localisation", render: (item) => <span className="text-xs text-slate-600">{item.location.city || item.address || "—"}</span> },
    { key: "price", label: "Prix", render: (item) => <span className="text-xs font-semibold">{item.price.toLocaleString("fr-FR")} {item.currency}{item.priceUnit ? ` / ${item.priceUnit.toLowerCase().replaceAll("_", " ")}` : ""}</span> },
    {
      key: "status",
      label: "Statut",
      render: (item) => <Badge variant="outline" className={`text-[10px] ${STATUS_STYLES_EST[item.status].className}`}>{STATUS_STYLES_EST[item.status].label}</Badge>,
    },
    {
      key: "actions",
      label: "",
      className: "text-right",
      render: (item) => {
        const actions: ActionItem[] = [
          { label: "Consulter", icon: Eye, onClick: () => void openDetails(item) },
          { label: "Modifier", icon: Pencil, onClick: () => void openEdit(item) },
          { label: "Supprimer", icon: Trash2, variant: "danger", onClick: () => setPendingDelete(item) },
        ];
        return <ActionsDropdown actions={actions} />;
      },
    },
  ];

  const updateValue = <K extends keyof ManagedFormValues>(key: K, value: ManagedFormValues[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Restaurants et loisirs" }]}
        title="Restaurants et loisirs"
        description="L’administration crée et gère les restaurants et lieux de loisirs. Les hébergements restent gérés dans l’espace propriétaire."
        actions={[{ label: "Ajouter un établissement", icon: Plus, onClick: openCreate }]}
      />

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row">
        <label className="relative min-w-0 flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input value={search} onChange={(event) => { setPage(1); setSearch(event.target.value); }} placeholder="Rechercher un établissement..." className="h-10 rounded-xl pl-9" />
        </label>
        <Select value={categoryTypeFilter} onValueChange={(value) => { setPage(1); setCategoryTypeFilter(value as ManagedCategoryType | "ALL"); }}>
          <SelectTrigger className="h-10 w-full rounded-xl border-slate-200 bg-white sm:w-52">
            <SelectValue placeholder="Restaurants et loisirs" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Restaurants et loisirs</SelectItem>
            <SelectItem value="restaurant">Restaurants</SelectItem>
            <SelectItem value="loisir">Loisirs</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(value) => { setPage(1); setStatusFilter(value as EstablishmentStatus | "ALL"); }}>
          <SelectTrigger className="h-10 w-full rounded-xl border-slate-200 bg-white sm:w-48">
            <SelectValue placeholder="Tous les statuts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous les statuts</SelectItem>
            {STATUSES.map((status) => <SelectItem key={status} value={status}>{STATUS_STYLES_EST[status].label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {error && <div role="alert" className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"><span>{error}</span><Button variant="outline" size="sm" onClick={() => void load()}>Réessayer</Button></div>}

      <DataTable
        data={rows}
        columns={columns}
        selectable={false}
        emptyMessage={loading ? "Chargement des établissements..." : "Aucun restaurant ou lieu de loisirs trouvé."}
        onRowClick={(item) => void openDetails(item)}
      />
      {loading && <p role="status" className="text-center text-xs text-slate-500"><Loader2 className="mr-1 inline h-3.5 w-3.5 animate-spin" />Chargement…</p>}
      <Pagination page={page} perPage={PAGE_SIZE} total={total} onPageChange={setPage} onPerPageChange={() => setPage(1)} itemLabel="établissements" perPageOptions={[PAGE_SIZE]} />

      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!saving) setDialogOpen(open); }}>
        <DialogContent className="flex max-h-[92vh] w-[calc(100vw-1.5rem)] max-w-[calc(100vw-1.5rem)] flex-col gap-0 overflow-hidden rounded-3xl border-slate-200 bg-slate-50 p-0 shadow-2xl sm:w-[75vw] sm:max-w-[75vw]">
          <DialogHeader className="shrink-0 border-b border-slate-100 bg-white px-5 py-5 pr-14 sm:px-8 sm:py-6">
            <div className="flex items-start gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
                <Building2 className="h-6 w-6" />
              </span>
              <div className="min-w-0">
                <DialogTitle className="text-xl font-bold tracking-tight text-slate-900">
                  {selected ? "Modifier l’établissement" : "Créer un établissement"}
                </DialogTitle>
                <DialogDescription className="mt-1 max-w-2xl leading-relaxed">
                  Renseignez les informations, la localisation, les équipements et les photos du restaurant ou du lieu de loisirs.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {actionError && (
            <p role="alert" className="mx-5 mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 sm:mx-8">
              {actionError}
            </p>
          )}

          <form
            id="managed-establishment-form"
            onSubmit={(event) => void save(event)}
            className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-8 sm:py-6"
          >
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-4 flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-700"><Building2 className="h-4 w-4" /></span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Informations générales</h3>
                  <p className="text-xs text-slate-500">Identité et classification de l’établissement.</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <ManagedField label="Nom" value={values.name} required onChange={(value) => setValues((current) => ({ ...current, name: value, slug: current.slug === slugify(current.name) ? slugify(value) : current.slug }))} />
                <ManagedField label="Slug" value={values.slug} required onChange={(value) => updateValue("slug", slugify(value))} />
                <div className="space-y-1.5 text-sm font-medium text-slate-700">
                  <span>Catégorie <span className="text-rose-500">*</span></span>
                  <Select value={values.category_id} onValueChange={(categoryId) => setValues((current) => ({ ...current, category_id: categoryId, subcategory_id: "" }))}>
                    <SelectTrigger className="h-10 w-full rounded-xl border-slate-200 bg-white">
                      <SelectValue placeholder="Choisir une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {formCategories.map((category) => <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5 text-sm font-medium text-slate-700">
                  <span>Sous-catégorie <span className="text-xs font-normal text-slate-400">Optionnelle</span></span>
                  <Select
                    value={values.subcategory_id || "__none"}
                    onValueChange={(subcategoryId) => updateValue("subcategory_id", subcategoryId === "__none" ? "" : subcategoryId)}
                    disabled={!formSubcategories.length}
                  >
                    <SelectTrigger className="h-10 w-full rounded-xl border-slate-200 bg-white disabled:bg-slate-50">
                      <SelectValue placeholder={formSubcategories.length ? "Choisir une sous-catégorie" : "Aucune sous-catégorie disponible"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none">Aucune sous-catégorie</SelectItem>
                      {formSubcategories.map((subcategory) => <SelectItem key={subcategory.id} value={subcategory.id}>{subcategory.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <ManagedField label="Type de cuisine" value={values.cuisine_type} onChange={(value) => updateValue("cuisine_type", value)} />
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-4 flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-violet-50 text-violet-700"><MapPin className="h-4 w-4" /></span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Localisation</h3>
                  <p className="text-xs text-slate-500">Choisissez un lieu du référentiel et précisez l’adresse.</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <div className="space-y-1.5 text-sm font-medium text-slate-700">
                  <span>Lieu <span className="text-rose-500">*</span></span>
                  <Select value={values.location_id} onValueChange={(locationId) => updateValue("location_id", locationId)}>
                    <SelectTrigger className="h-10 w-full rounded-xl border-slate-200 bg-white">
                      <SelectValue placeholder="Choisir un lieu" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location: AdminLocation) => <SelectItem key={location.id} value={location.id}>{location.name} · {location.type}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <ManagedField label="Latitude" type="number" min={-90} max={90} step="any" value={values.latitude} onChange={(value) => updateValue("latitude", value)} />
                <ManagedField label="Longitude" type="number" min={-180} max={180} step="any" value={values.longitude} onChange={(value) => updateValue("longitude", value)} />
                <label className="block space-y-1.5 text-sm font-medium text-slate-700 sm:col-span-2 xl:col-span-3">
                  <span>Adresse <span className="text-rose-500">*</span></span>
                  <Input required minLength={3} maxLength={500} value={values.address} onChange={(event) => updateValue("address", event.target.value)} className="h-10 rounded-xl border-slate-200" />
                </label>
                <label className="block space-y-1.5 text-sm font-medium text-slate-700 sm:col-span-2 xl:col-span-3">
                  <span>Description</span>
                  <Textarea rows={3} maxLength={5000} value={values.description} onChange={(event) => updateValue("description", event.target.value)} className="resize-y rounded-xl border-slate-200" />
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-4">
                <h3 className="text-sm font-bold text-slate-900">Tarification</h3>
                <p className="text-xs text-slate-500">Définissez le tarif principal et son unité.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <ManagedField label="Prix de base" type="number" min={0} step="any" value={values.price} onChange={(value) => updateValue("price", value)} />
                <div className="space-y-1.5 text-sm font-medium text-slate-700">
                  <span>Unité de prix</span>
                  <Select value={values.price_unit} onValueChange={(priceUnit) => updateValue("price_unit", priceUnit as PriceUnit)}>
                    <SelectTrigger className="h-10 w-full rounded-xl border-slate-200 bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRICE_UNITS.map((unit) => <SelectItem key={unit} value={unit}>{unit.toLowerCase().replaceAll("_", " ")}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <ManagedField label="Devise" required min={3} max={3} value={values.currency} onChange={(value) => updateValue("currency", value.toUpperCase())} />
                {isAccommodation && (
                  <>
                    <ManagedField label="Prix par nuit" type="number" min={0} step="any" value={values.price_per_night} onChange={(value) => updateValue("price_per_night", value)} />
                    <ManagedField label="Prix par mois" type="number" min={0} step="any" value={values.price_per_month} onChange={(value) => updateValue("price_per_month", value)} />
                    <ManagedField label="Capacité" type="number" min={1} value={values.capacity} onChange={(value) => updateValue("capacity", value)} />
                    <ManagedField label="Nombre de chambres" type="number" min={0} value={values.rooms_count} onChange={(value) => updateValue("rooms_count", value)} />
                    <ManagedField label="Superficie (m²)" type="number" min={0} step="any" value={values.area} onChange={(value) => updateValue("area", value)} />
                  </>
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Équipements</h3>
                  <p className="text-xs text-slate-500">Ajoutez des équipements depuis le référentiel.</p>
                </div>
                <Badge variant="outline" className="shrink-0 border-slate-200 bg-slate-50 text-slate-600">{values.amenity_ids.length}/100</Badge>
              </div>
              <fieldset className="space-y-3">
                <legend className="sr-only">Équipements du référentiel</legend>
                {amenities.length ? (
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Select value={amenityToAdd} onValueChange={setAmenityToAdd}>
                      <SelectTrigger className="h-11 w-full rounded-xl border-slate-200 bg-white sm:flex-1">
                        <SelectValue placeholder="Choisir un équipement" />
                      </SelectTrigger>
                      <SelectContent>
                        {amenities
                          .filter((amenity: AdminAmenity) => !values.amenity_ids.includes(amenity.id))
                          .map((amenity) => <SelectItem key={amenity.id} value={amenity.id}>{amenity.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      disabled={!amenityToAdd || values.amenity_ids.length >= 100}
                      className="h-11 rounded-xl bg-emerald-700 hover:bg-emerald-800"
                      onClick={() => {
                        if (!amenityToAdd || values.amenity_ids.includes(amenityToAdd)) return;
                        updateValue("amenity_ids", [...values.amenity_ids, amenityToAdd]);
                        setAmenityToAdd("");
                      }}
                    >
                      <Plus className="h-4 w-4" /> Ajouter
                    </Button>
                  </div>
                ) : (
                  <p className="rounded-xl border border-dashed border-slate-200 p-3 text-sm text-slate-500">Aucun équipement dans le référentiel. Ajoutez-en depuis l’espace Référentiels.</p>
                )}
                {values.amenity_ids.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {values.amenity_ids.map((id) => {
                      const amenity = amenities.find((item) => item.id === id);
                      return amenity ? (
                        <Badge key={id} variant="secondary" className="gap-1.5 rounded-full bg-emerald-50 py-1 pl-3 pr-1.5 text-emerald-800">
                          {amenity.name}
                          <button
                            type="button"
                            aria-label={`Retirer ${amenity.name}`}
                            className="rounded-full p-0.5 text-emerald-700 hover:bg-emerald-100"
                            onClick={() => updateValue("amenity_ids", values.amenity_ids.filter((amenityId) => amenityId !== id))}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ) : null;
                    })}
                  </div>
                )}
              </fieldset>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-4">
                <h3 className="text-sm font-bold text-slate-900">Photos</h3>
                <p className="text-xs text-slate-500">{selected ? "Ajoutez des photos à la galerie existante." : "Sélectionnez une ou plusieurs images pour la galerie."}</p>
              </div>
              <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/40 px-4 py-6 text-center transition hover:border-emerald-400 hover:bg-emerald-50">
                <span className="mb-3 grid h-11 w-11 place-items-center rounded-2xl bg-white text-emerald-700 shadow-sm"><Upload className="h-5 w-5" /></span>
                <span className="text-sm font-semibold text-slate-800">Parcourir les photos</span>
                <span className="mt-1 text-xs text-slate-500">Images · Sélection multiple possible</span>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) => setPhotos((current) => [...current, ...Array.from(event.target.files ?? [])])}
                  className="sr-only"
                />
              </label>
              {photos.length > 0 && (
                <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                  {photos.map((photo, index) => (
                    <div key={`${photo.name}-${index}`} className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-emerald-700 shadow-sm"><ImagePlus className="h-4 w-4" /></span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-xs font-semibold text-slate-800">{photo.name}</span>
                        <span className="text-[11px] text-slate-500">{(photo.size / 1024 / 1024).toFixed(2)} Mo</span>
                      </span>
                      <button type="button" aria-label={`Retirer ${photo.name}`} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600" onClick={() => setPhotos((current) => current.filter((_, photoIndex) => photoIndex !== index))}>
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </form>
          <DialogFooter className="shrink-0 border-t border-slate-200 bg-white px-5 py-4 sm:px-8">
            <Button type="button" variant="outline" disabled={saving} onClick={() => setDialogOpen(false)} className="rounded-xl">Annuler</Button>
            <Button type="submit" form="managed-establishment-form" disabled={saving || formCategories.length === 0 || locations.length === 0} className="rounded-xl bg-emerald-700 px-5 hover:bg-emerald-800">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {selected ? "Enregistrer les modifications" : "Créer l’établissement"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={details !== null} onOpenChange={(open) => { if (!open) setDetails(null); }}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto rounded-2xl">
          {details && (
            <>
              <DialogHeader>
                <DialogTitle>{details.name}</DialogTitle>
                <DialogDescription>{details.category}{details.slug ? ` · /${details.slug}` : ""}</DialogDescription>
              </DialogHeader>
              {details.photos.length > 0 && <div className="grid gap-3 sm:grid-cols-3">{details.photos.map((photo) => <img key={photo.id} src={photo.url} alt={details.name} className="h-40 w-full rounded-xl object-cover" />)}</div>}
              <div className="grid gap-3 sm:grid-cols-2">
                <Detail label="Adresse" value={details.address} />
                <Detail label="Lieu" value={[details.location.city, details.location.country].filter(Boolean).join(", ")} />
                <Detail label="Statut" value={STATUS_STYLES_EST[details.status].label} />
                <Detail label="Prix" value={`${details.price.toLocaleString("fr-FR")} ${details.currency}`} />
                <Detail label="Capacité" value={details.capacity ?? "—"} />
                <Detail label="Type de cuisine" value={details.cuisineType ?? "—"} />
                {details.description && <Detail label="Description" value={details.description} />}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDetails(null)}>Fermer</Button>
                <Button className="bg-emerald-700 hover:bg-emerald-800" onClick={() => { setDetails(null); void openEdit(details); }}><Pencil className="h-4 w-4" />Modifier</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmModal
        open={pendingDelete !== null}
        onOpenChange={(open) => { if (!open && !saving) setPendingDelete(null); }}
        title="Supprimer cet établissement ?"
        description="Cette suppression est définitive."
        confirmLabel={saving ? "Suppression..." : "Supprimer"}
        onConfirm={() => void remove()}
      />
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-xl border border-slate-100 bg-slate-50 p-3"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-1 whitespace-pre-wrap break-words text-sm font-semibold text-slate-800">{value || "—"}</p></div>;
}
