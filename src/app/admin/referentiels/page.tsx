"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Building2,
  Check,
  ChevronDown,
  CircleHelp,
  Globe2,
  Layers3,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  Search,
  Trash2,
  Wifi,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/commun/AdminPageHeader";
import { ConfirmModal } from "@/components/admin/commun/ConfirmModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAdminEstablishmentsStore } from "@/store/useAdminEstablishmentsStore";
import type { AdminCategory, AdminLocation } from "@/types/establishment";

type CatalogType = "category" | "subcategory" | "location" | "amenity";
type CatalogTab = "all" | "categories" | "locations" | "amenities";
type CatalogForm = {
  id?: string;
  name: string;
  icon: string;
  category_id: string;
  type: string;
  country_code: string;
  parent_id: string;
  latitude: string;
  longitude: string;
  timezone: string;
  population: string;
  is_active: boolean;
};
type PendingDelete = { type: CatalogType; id: string; name: string } | null;

const EMPTY: CatalogForm = {
  name: "",
  icon: "",
  category_id: "",
  type: "CITY",
  country_code: "BJ",
  parent_id: "",
  latitude: "",
  longitude: "",
  timezone: "",
  population: "",
  is_active: true,
};

const TYPE_LABELS: Record<CatalogType, string> = {
  category: "catégorie",
  subcategory: "sous-catégorie",
  location: "lieu",
  amenity: "équipement",
};

const TABS: { id: CatalogTab; label: string }[] = [
  { id: "all", label: "Tout gérer" },
  { id: "categories", label: "Catégories" },
  { id: "locations", label: "Lieux" },
  { id: "amenities", label: "Équipements" },
];

export default function AdminReferencesPage() {
  const categories = useAdminEstablishmentsStore((state) => state.categories);
  const locations = useAdminEstablishmentsStore((state) => state.locations);
  const amenities = useAdminEstablishmentsStore((state) => state.amenities);
  const loadReferences = useAdminEstablishmentsStore((state) => state.loadReferences);
  const [type, setType] = useState<CatalogType>("category");
  const [tab, setTab] = useState<CatalogTab>("all");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<CatalogForm>(EMPTY);
  const [formOpen, setFormOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<PendingDelete>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await loadReferences();
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Le chargement des référentiels a échoué.");
    } finally {
      setLoading(false);
    }
  }, [loadReferences]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const query = search.trim().toLocaleLowerCase("fr");
  const visibleCategories = useMemo(
    () => categories
      .map((category) => ({
        ...category,
        subcategories: (category.subcategories ?? []).filter((item) => !query || item.name.toLocaleLowerCase("fr").includes(query)),
      }))
      .filter((category) => !query
        || category.name.toLocaleLowerCase("fr").includes(query)
        || category.subcategories?.length),
    [categories, query],
  );
  const visibleLocations = useMemo(
    () => locations.filter((location) => !query
      || location.name.toLocaleLowerCase("fr").includes(query)
      || location.type.toLocaleLowerCase("fr").includes(query)
      || location.country_code.toLocaleLowerCase("fr").includes(query)),
    [locations, query],
  );
  const visibleAmenities = useMemo(
    () => amenities.filter((amenity) => !query || amenity.name.toLocaleLowerCase("fr").includes(query)),
    [amenities, query],
  );

  const beginCreate = (catalogType: CatalogType, categoryId = "") => {
    setType(catalogType);
    setForm({ ...EMPTY, category_id: categoryId || categories[0]?.id || "" });
    setError(null);
    setFormOpen(true);
  };

  const beginEdit = (
    catalogType: CatalogType,
    value: AdminCategory | AdminLocation | { id: string; name: string; icon: string | null },
  ) => {
    setType(catalogType);
    setForm({
      ...EMPTY,
      id: value.id,
      name: value.name,
      icon: "icon" in value && value.icon ? value.icon : "",
      category_id: "category_id" in value && typeof value.category_id === "string" ? value.category_id : "",
      type: "type" in value ? value.type : "CITY",
      country_code: "country_code" in value ? value.country_code : "BJ",
      parent_id: "parent_id" in value && value.parent_id ? value.parent_id : "",
      latitude: "latitude" in value && value.latitude !== null ? String(value.latitude) : "",
      longitude: "longitude" in value && value.longitude !== null ? String(value.longitude) : "",
      timezone: "timezone" in value && value.timezone ? value.timezone : "",
      population: "population" in value && value.population !== null ? String(value.population) : "",
      is_active: "is_active" in value ? value.is_active : true,
    });
    setError(null);
    setFormOpen(true);
  };

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const api = useAdminEstablishmentsStore.getState();
    try {
      if (type === "category") {
        if (form.id) await api.updateCategory(form.id, { name: form.name, icon: form.icon });
        else await api.createCategory(form.name, form.icon);
      } else if (type === "subcategory") {
        if (form.id) await api.updateSubcategory(form.id, { name: form.name, icon: form.icon, category_id: form.category_id });
        else await api.createSubcategory(form.category_id, form.name, form.icon);
      } else if (type === "amenity") {
        if (form.id) await api.updateAmenity(form.id, { name: form.name, icon: form.icon });
        else await api.createAmenity(form.name, form.icon);
      } else {
        const payload = {
          name: form.name,
          type: form.type,
          country_code: form.country_code.toUpperCase(),
          parent_id: form.parent_id || null,
          latitude: form.latitude === "" ? null : Number(form.latitude),
          longitude: form.longitude === "" ? null : Number(form.longitude),
          timezone: form.timezone || null,
          population: form.population === "" ? null : Number(form.population),
          is_active: form.is_active,
        };
        if (form.id) await api.updateLocation(form.id, payload);
        else await api.createLocation(payload);
      }
      setFormOpen(false);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "L’enregistrement a échoué.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    setError(null);
    try {
      const api = useAdminEstablishmentsStore.getState();
      if (pendingDelete.type === "category") await api.deleteCategory(pendingDelete.id);
      if (pendingDelete.type === "subcategory") await api.deleteSubcategory(pendingDelete.id);
      if (pendingDelete.type === "location") await api.deleteLocation(pendingDelete.id);
      if (pendingDelete.type === "amenity") await api.deleteAmenity(pendingDelete.id);
      setPendingDelete(null);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "La suppression a échoué.");
      setPendingDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const counts: Record<CatalogTab, number> = {
    all: categories.length + locations.length + amenities.length,
    categories: categories.length,
    locations: locations.length,
    amenities: amenities.length,
  };
  const showCategories = tab === "all" || tab === "categories";
  const showLocations = tab === "all" || tab === "locations";
  const showAmenities = tab === "all" || tab === "amenities";

  return (
    <div className="space-y-6">
      <AdminPageHeader
        breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Référentiels" }]}
        title="Référentiels"
        description="Centralisez les catégories, les zones géographiques et les équipements utilisés par les établissements."
        actions={[{ label: "Ajouter une donnée", icon: Plus, onClick: () => beginCreate(tab === "locations" ? "location" : tab === "amenities" ? "amenity" : "category") }]}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard icon={Layers3} label="Catégories" count={categories.length} tint="bg-emerald-50 text-emerald-700" />
        <SummaryCard icon={Globe2} label="Lieux" count={locations.length} tint="bg-blue-50 text-blue-700" />
        <SummaryCard icon={Wifi} label="Équipements" count={amenities.length} tint="bg-violet-50 text-violet-700" />
      </div>

      <Card className="overflow-hidden rounded-2xl border-slate-200 shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-1 overflow-x-auto">
            {TABS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`shrink-0 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                  tab === item.id ? "bg-emerald-50 text-emerald-800" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                {item.label}
                <span className={`ml-2 rounded-full px-1.5 py-0.5 text-[10px] ${tab === item.id ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"}`}>
                  {counts[item.id]}
                </span>
              </button>
            ))}
          </div>
          <div className="relative w-full lg:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher dans les référentiels..."
              className="h-10 rounded-xl border-slate-200 pl-9"
            />
          </div>
        </div>

        {error && (
          <div className="m-4 flex items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <span role="alert">{error}</span>
            <Button variant="outline" size="sm" onClick={() => void refresh()}>Réessayer</Button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-20 text-sm text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin text-emerald-700" />
            Chargement des référentiels...
          </div>
        ) : (
          <div className="space-y-8 p-4 sm:p-6">
            {showCategories && (
              <section className="space-y-4">
                <SectionHeading
                  icon={Layers3}
                  title="Catégories et sous-catégories"
                  description="Organisez le classement des établissements."
                  count={categories.length}
                  onCreate={() => beginCreate("category")}
                  createLabel="Nouvelle catégorie"
                />
                {visibleCategories.length ? (
                  <div className="grid gap-3 xl:grid-cols-2">
                    {visibleCategories.map((category) => (
                      <CategoryCard
                        key={category.id}
                        category={category}
                        onEdit={() => beginEdit("category", category)}
                        onDelete={() => setPendingDelete({ type: "category", id: category.id, name: category.name })}
                        onAddSubcategory={() => beginCreate("subcategory", category.id)}
                        onEditSubcategory={(subcategory) => beginEdit("subcategory", subcategory)}
                        onDeleteSubcategory={(subcategory) => setPendingDelete({ type: "subcategory", id: subcategory.id, name: subcategory.name })}
                      />
                    ))}
                  </div>
                ) : <EmptyState label="Aucune catégorie ne correspond à la recherche." />}
              </section>
            )}

            {showLocations && (
              <section className="space-y-4">
                <SectionHeading
                  icon={MapPin}
                  title="Lieux géographiques"
                  description="Gérez les pays, régions, villes et quartiers."
                  count={locations.length}
                  onCreate={() => beginCreate("location")}
                  createLabel="Ajouter un lieu"
                />
                {visibleLocations.length ? (
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full min-w-[620px] text-left text-sm">
                      <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        <tr><th className="px-4 py-3">Lieu</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Pays</th><th className="px-4 py-3">Statut</th><th className="px-4 py-3 text-right">Actions</th></tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {visibleLocations.map((location) => (
                          <tr key={location.id} className="transition hover:bg-slate-50/70">
                            <td className="px-4 py-3 font-semibold text-slate-800">{location.name}</td>
                            <td className="px-4 py-3"><Badge variant="outline" className="border-blue-100 bg-blue-50 text-[10px] text-blue-700">{location.type}</Badge></td>
                            <td className="px-4 py-3 text-slate-600">{location.country_code}</td>
                            <td className="px-4 py-3"><Badge variant="outline" className={location.is_active ? "border-emerald-200 bg-emerald-50 text-[10px] text-emerald-700" : "border-slate-200 bg-slate-50 text-[10px] text-slate-500"}>{location.is_active ? "Actif" : "Inactif"}</Badge></td>
                            <td className="px-4 py-3">
                              <RowActions
                                label={location.name}
                                onEdit={() => beginEdit("location", location)}
                                onDelete={() => setPendingDelete({ type: "location", id: location.id, name: location.name })}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : <EmptyState label="Aucun lieu ne correspond à la recherche." />}
              </section>
            )}

            {showAmenities && (
              <section className="space-y-4">
                <SectionHeading
                  icon={Wifi}
                  title="Équipements"
                  description="Maintenez la liste des équipements disponibles."
                  count={amenities.length}
                  onCreate={() => beginCreate("amenity")}
                  createLabel="Ajouter un équipement"
                />
                {visibleAmenities.length ? (
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {visibleAmenities.map((amenity) => (
                      <div key={amenity.id} className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 transition hover:border-emerald-200 hover:shadow-sm">
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-violet-50 text-violet-700">
                          <Wifi className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-slate-800">{amenity.name}</p>
                          <p className="truncate text-xs text-slate-400">{amenity.icon || "Aucune icône associée"}</p>
                        </div>
                        <RowActions
                          label={amenity.name}
                          onEdit={() => beginEdit("amenity", amenity)}
                          onDelete={() => setPendingDelete({ type: "amenity", id: amenity.id, name: amenity.name })}
                        />
                      </div>
                    ))}
                  </div>
                ) : <EmptyState label="Aucun équipement ne correspond à la recherche." />}
              </section>
            )}
          </div>
        )}
      </Card>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle>{form.id ? "Modifier" : "Ajouter"} {TYPE_LABELS[type]}</DialogTitle>
            <DialogDescription>Renseignez les informations de ce référentiel.</DialogDescription>
          </DialogHeader>
          <form id="catalog-form" onSubmit={(event) => void save(event)} className="space-y-4">
            <FormField label="Nom" required>
              <Input autoFocus required minLength={2} maxLength={150} value={form.name} onChange={(event) => setForm((value) => ({ ...value, name: event.target.value }))} placeholder={`Nom ${TYPE_LABELS[type]}`} />
            </FormField>
            {(type === "category" || type === "subcategory" || type === "amenity") && (
              <FormField label="Icône" hint="Optionnel">
                <Input maxLength={100} value={form.icon} onChange={(event) => setForm((value) => ({ ...value, icon: event.target.value }))} placeholder="Ex. wifi, restaurant..." />
              </FormField>
            )}
            {type === "subcategory" && (
              <FormField label="Catégorie" required>
                <select required className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-500" value={form.category_id} onChange={(event) => setForm((value) => ({ ...value, category_id: event.target.value }))}>
                  <option value="">Choisir une catégorie</option>
                  {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                </select>
              </FormField>
            )}
            {type === "location" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Type" required>
                  <select className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm" value={form.type} onChange={(event) => setForm((value) => ({ ...value, type: event.target.value }))}>
                    {["COUNTRY", "REGION", "CITY", "DISTRICT", "NEIGHBORHOOD"].map((item) => <option key={item}>{item}</option>)}
                  </select>
                </FormField>
                <FormField label="Code pays" hint="2 lettres" required>
                  <Input required minLength={2} maxLength={2} value={form.country_code} onChange={(event) => setForm((value) => ({ ...value, country_code: event.target.value.toUpperCase() }))} />
                </FormField>
                <FormField label="Lieu parent" hint="Optionnel">
                  <select className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm" value={form.parent_id} onChange={(event) => setForm((value) => ({ ...value, parent_id: event.target.value }))}>
                    <option value="">Aucun</option>
                    {locations.filter((location) => location.id !== form.id).map((location) => <option key={location.id} value={location.id}>{location.name} ({location.type})</option>)}
                  </select>
                </FormField>
                <FormField label="Fuseau horaire" hint="Optionnel">
                  <Input maxLength={50} value={form.timezone} onChange={(event) => setForm((value) => ({ ...value, timezone: event.target.value }))} placeholder="Africa/Porto-Novo" />
                </FormField>
                <FormField label="Latitude" hint="Optionnel">
                  <Input type="number" step="any" min={-90} max={90} value={form.latitude} onChange={(event) => setForm((value) => ({ ...value, latitude: event.target.value }))} />
                </FormField>
                <FormField label="Longitude" hint="Optionnel">
                  <Input type="number" step="any" min={-180} max={180} value={form.longitude} onChange={(event) => setForm((value) => ({ ...value, longitude: event.target.value }))} />
                </FormField>
                <FormField label="Population" hint="Optionnel">
                  <Input type="number" min={0} value={form.population} onChange={(event) => setForm((value) => ({ ...value, population: event.target.value }))} />
                </FormField>
                <label className="flex items-center gap-2 self-end pb-2 text-sm font-medium text-slate-700">
                  <input type="checkbox" checked={form.is_active} onChange={(event) => setForm((value) => ({ ...value, is_active: event.target.checked }))} className="h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600" />
                  Lieu actif
                </label>
              </div>
            )}
          </form>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" className="rounded-xl" onClick={() => setFormOpen(false)}>Annuler</Button>
            <Button type="submit" form="catalog-form" disabled={busy || (type === "subcategory" && !form.category_id)} className="rounded-xl bg-emerald-700 hover:bg-emerald-800">
              {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmModal
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open && !deleting) setPendingDelete(null);
        }}
        title={`Supprimer ${TYPE_LABELS[pendingDelete?.type ?? "category"]} ?`}
        description="Cette suppression peut empêcher son utilisation dans les établissements. Cette action est définitive."
        confirmLabel={deleting ? "Suppression..." : "Supprimer définitivement"}
        confirmVariant="danger"
        onConfirm={() => void remove()}
      >
        {pendingDelete && (
          <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50/70 p-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-rose-100 text-rose-700">
              <Trash2 className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">{pendingDelete.name}</p>
              <p className="text-xs text-slate-500">{TYPE_LABELS[pendingDelete.type]}</p>
            </div>
          </div>
        )}
      </ConfirmModal>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, count, tint }: { icon: typeof Building2; label: string; count: number; tint: string }) {
  return (
    <Card className="rounded-2xl border-slate-200 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center gap-3">
        <div className={`grid h-11 w-11 place-items-center rounded-xl ${tint}`}><Icon className="h-5 w-5" /></div>
        <div>
          <p className="text-xl font-bold text-slate-900">{count.toLocaleString("fr-FR")}</p>
          <p className="text-xs text-slate-500">{label}</p>
        </div>
      </div>
    </Card>
  );
}

function SectionHeading({
  icon: Icon,
  title,
  description,
  count,
  onCreate,
  createLabel,
}: {
  icon: typeof Layers3;
  title: string;
  description: string;
  count: number;
  onCreate: () => void;
  createLabel: string;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><Icon className="h-5 w-5" /></div>
        <div>
          <h2 className="font-semibold text-slate-900">{title}<span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">{count}</span></h2>
          <p className="mt-0.5 text-xs text-slate-500">{description}</p>
        </div>
      </div>
      <Button variant="outline" size="sm" onClick={onCreate} className="rounded-xl self-start sm:self-auto">
        <Plus className="mr-1.5 h-4 w-4" />{createLabel}
      </Button>
    </div>
  );
}

function CategoryCard({
  category,
  onEdit,
  onDelete,
  onAddSubcategory,
  onEditSubcategory,
  onDeleteSubcategory,
}: {
  category: AdminCategory;
  onEdit: () => void;
  onDelete: () => void;
  onAddSubcategory: () => void;
  onEditSubcategory: (subcategory: NonNullable<AdminCategory["subcategories"]>[number]) => void;
  onDeleteSubcategory: (subcategory: NonNullable<AdminCategory["subcategories"]>[number]) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const subcategories = category.subcategories ?? [];
  return (
    <Card className="overflow-hidden rounded-xl border-slate-200 shadow-none">
      <div className="flex items-center gap-3 bg-slate-50/80 p-4">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-emerald-700 shadow-sm">
          <Building2 className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-900">{category.name}</p>
          <p className="text-xs text-slate-500">{category.icon || "Catégorie"} · {subcategories.length} sous-catégorie{subcategories.length === 1 ? "" : "s"}</p>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" aria-label={`Modifier ${category.name}`} onClick={onEdit} className="h-8 w-8 rounded-lg"><Pencil className="h-4 w-4 text-slate-500" /></Button>
          <Button variant="ghost" size="icon" aria-label={`Supprimer ${category.name}`} onClick={onDelete} className="h-8 w-8 rounded-lg hover:bg-rose-50"><Trash2 className="h-4 w-4 text-rose-600" /></Button>
          <Button variant="ghost" size="icon" aria-label={expanded ? "Réduire" : "Développer"} onClick={() => setExpanded((value) => !value)} className="h-8 w-8 rounded-lg">
            <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform ${expanded ? "" : "-rotate-90"}`} />
          </Button>
        </div>
      </div>
      {expanded && (
        <div className="px-4 pb-4 pt-2">
          {subcategories.length ? (
            <div className="divide-y divide-slate-100">
              {subcategories.map((subcategory) => (
                <div key={subcategory.id} className="flex items-center gap-3 py-2.5 pl-3">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                  <span className="min-w-0 flex-1 truncate text-sm text-slate-700">{subcategory.name}</span>
                  {subcategory.icon && <span className="hidden text-xs text-slate-400 sm:inline">{subcategory.icon}</span>}
                  <Button variant="ghost" size="icon" aria-label={`Modifier ${subcategory.name}`} onClick={() => onEditSubcategory(subcategory)} className="h-7 w-7 rounded-lg"><Pencil className="h-3.5 w-3.5 text-slate-500" /></Button>
                  <Button variant="ghost" size="icon" aria-label={`Supprimer ${subcategory.name}`} onClick={() => onDeleteSubcategory(subcategory)} className="h-7 w-7 rounded-lg hover:bg-rose-50"><Trash2 className="h-3.5 w-3.5 text-rose-600" /></Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-3 pl-3 text-xs text-slate-400">Aucune sous-catégorie pour le moment.</p>
          )}
          <button type="button" onClick={onAddSubcategory} className="mt-2 flex w-full items-center gap-2 rounded-lg border border-dashed border-slate-200 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-50/50">
            <Plus className="h-3.5 w-3.5" /> Ajouter une sous-catégorie
          </button>
        </div>
      )}
    </Card>
  );
}

function RowActions({ label, onEdit, onDelete }: { label: string; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex justify-end gap-1">
      <Button variant="ghost" size="icon" aria-label={`Modifier ${label}`} onClick={onEdit} className="h-8 w-8 rounded-lg"><Pencil className="h-4 w-4 text-slate-500" /></Button>
      <Button variant="ghost" size="icon" aria-label={`Supprimer ${label}`} onClick={onDelete} className="h-8 w-8 rounded-lg hover:bg-rose-50"><Trash2 className="h-4 w-4 text-rose-600" /></Button>
    </div>
  );
}

function FormField({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5 text-sm font-medium text-slate-700">
      <span className="flex items-center gap-1.5">{label}{required && <span className="text-rose-500">*</span>}{hint && <span className="text-xs font-normal text-slate-400">{hint}</span>}</span>
      {children}
    </label>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-4 py-10 text-center">
      <CircleHelp className="mx-auto h-7 w-7 text-slate-300" />
      <p className="mt-2 text-sm text-slate-500">{label}</p>
    </div>
  );
}
