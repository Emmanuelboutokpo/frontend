"use client";

import { useCallback, useEffect, useState } from "react";
import { ImagePlus, Layers3, Loader2, Pencil, Plus, Trash2 } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/commun/AdminPageHeader";
import { ConfirmModal } from "@/components/admin/commun/ConfirmModal";
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
import { useAdminEstablishmentsStore } from "@/store/useAdminEstablishmentsStore";
import type { AdminCategory } from "@/types/establishment";

type CategoryForm = {
  id?: string;
  name: string;
  icon: string;
  image: File | null;
};

type PendingAction =
  | { type: "category"; category: AdminCategory }
  | { type: "image"; category: AdminCategory }
  | null;

const EMPTY_FORM: CategoryForm = { name: "", icon: "", image: null };

export default function AdminCategoriesPage() {
  const categories = useAdminEstablishmentsStore((state) => state.categories);
  const loadReferences = useAdminEstablishmentsStore((state) => state.loadReferences);
  const [form, setForm] = useState<CategoryForm>(EMPTY_FORM);
  const [formOpen, setFormOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await loadReferences();
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Le chargement des catégories a échoué.");
    } finally {
      setLoading(false);
    }
  }, [loadReferences]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (!form.image) {
      setSelectedFileUrl(null);
      return;
    }

    const url = URL.createObjectURL(form.image);
    setSelectedFileUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [form.image]);

  const beginCreate = () => {
    setForm(EMPTY_FORM);
    setCurrentImageUrl(null);
    setError(null);
    setFormOpen(true);
  };

  const beginEdit = (category: AdminCategory) => {
    setForm({ id: category.id, name: category.name, icon: category.icon ?? "", image: null });
    setCurrentImageUrl(category.img);
    setError(null);
    setFormOpen(true);
  };

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const api = useAdminEstablishmentsStore.getState();
    try {
      if (form.id) {
        await api.updateCategory(
          form.id,
          { name: form.name.trim(), icon: form.icon.trim() || null },
          form.image ?? undefined
        );
      } else {
        await api.createCategory(form.name.trim(), form.icon.trim() || undefined, form.image ?? undefined);
      }
      setFormOpen(false);
      setForm(EMPTY_FORM);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "L’enregistrement de la catégorie a échoué.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!pendingAction) return;
    setBusy(true);
    setError(null);
    try {
      const api = useAdminEstablishmentsStore.getState();
      if (pendingAction.type === "category") {
        await api.deleteCategory(pendingAction.category.id);
      } else {
        await api.deleteCategoryImage(pendingAction.category.id);
      }
      setPendingAction(null);
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : "La suppression a échoué.");
      setPendingAction(null);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="space-y-6">
      <AdminPageHeader
        breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Catégories" }]}
        title="Gestion des catégories"
        description="Créez les catégories de la plateforme et définissez leur image. Les propriétaires pourront ensuite y rattacher leurs sous-catégories."
        actions={[{ label: "Nouvelle catégorie", icon: Plus, onClick: beginCreate }]}
      />

      {error && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <span role="alert">{error}</span>
          <Button variant="outline" size="sm" onClick={() => void refresh()}>Réessayer</Button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-20 text-sm text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin text-emerald-700" />
          Chargement des catégories...
        </div>
      ) : categories.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <article key={category.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="relative aspect-[16/9] bg-slate-100">
                {category.img ? (
                  <img src={category.img} alt={`Image de ${category.name}`} className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full place-items-center text-slate-400">
                    <ImagePlus className="h-8 w-8" />
                  </div>
                )}
                <Badge className="absolute left-3 top-3 border-white/70 bg-white/95 text-slate-700 hover:bg-white">
                  {category.subcategories?.length ?? 0} sous-catégorie{category.subcategories?.length === 1 ? "" : "s"}
                </Badge>
              </div>
              <div className="flex items-center gap-3 p-4">
              {category.img ? (
                <img
                  src={category.img}
                  alt=""
                  className="h-10 w-10 shrink-0 rounded-xl object-cover"
                />
              ) : (
                <div aria-hidden="true" className="h-10 w-10 shrink-0 rounded-xl bg-slate-100" />
              )}
                <div className="min-w-0 flex-1">
                  <h2 className="truncate font-semibold text-slate-900">{category.name}</h2>
                  <p className="truncate text-xs text-slate-500">{category.icon || "Aucune icône associée"}</p>
                </div>
                {category.img && (
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Supprimer l’image de ${category.name}`}
                    title="Supprimer l’image"
                    onClick={() => setPendingAction({ type: "image", category })}
                    className="h-9 w-9 rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Modifier ${category.name}`}
                  onClick={() => beginEdit(category)}
                  className="h-9 w-9 rounded-lg text-slate-500"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Supprimer ${category.name}`}
                  onClick={() => setPendingAction({ type: "category", category })}
                  className="h-9 w-9 rounded-lg text-rose-600 hover:bg-rose-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-16 text-center">
          <Layers3 className="mx-auto h-8 w-8 text-slate-300" />
          <p className="mt-3 text-sm font-medium text-slate-700">Aucune catégorie n’a encore été créée.</p>
          <Button onClick={beginCreate} className="mt-4 rounded-xl bg-emerald-700 hover:bg-emerald-800">
            <Plus className="h-4 w-4" /> Créer une catégorie
          </Button>
        </div>
      )}

      <Dialog
        open={formOpen}
        onOpenChange={(open) => {
          if (!busy) setFormOpen(open);
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle>{form.id ? "Modifier la catégorie" : "Créer une catégorie"}</DialogTitle>
            <DialogDescription>
              {form.id
                ? "Modifiez le nom, l’icône ou remplacez l’image de la catégorie."
                : "Définissez son nom, son icône et son image."}
            </DialogDescription>
          </DialogHeader>
          <form id="category-form" onSubmit={(event) => void save(event)} className="space-y-4">
            <label className="block space-y-1.5 text-sm font-medium text-slate-700">
              <span>Nom <span className="text-rose-500">*</span></span>
              <Input autoFocus required minLength={2} maxLength={100} value={form.name} onChange={(event) => setForm((value) => ({ ...value, name: event.target.value }))} placeholder="Ex. Restaurant" />
            </label>
            <label className="block space-y-1.5 text-sm font-medium text-slate-700">
              <span>Icône <span className="text-xs font-normal text-slate-400">Optionnel</span></span>
              <Input maxLength={100} value={form.icon} onChange={(event) => setForm((value) => ({ ...value, icon: event.target.value }))} placeholder="Ex. utensils" />
            </label>
            <label className="block space-y-1.5 text-sm font-medium text-slate-700">
              <span>Image <span className="text-xs font-normal text-slate-400">{form.id ? "Remplacement optionnel" : "Optionnelle"}</span></span>
              {(selectedFileUrl || currentImageUrl) && (
                <img
                  src={selectedFileUrl ?? currentImageUrl ?? ""}
                  alt={selectedFileUrl ? "Aperçu de la nouvelle image" : `Image actuelle de ${form.name}`}
                  className="h-36 w-full rounded-xl object-cover"
                />
              )}
              {form.id && currentImageUrl && !selectedFileUrl && (
                <p className="text-xs font-normal text-slate-500">Sélectionnez un fichier pour remplacer l’image actuelle.</p>
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={(event) => setForm((value) => ({ ...value, image: event.target.files?.[0] ?? null }))}
                className="h-auto cursor-pointer rounded-xl py-2 file:mr-3 file:rounded-lg file:bg-emerald-50 file:px-3 file:py-1 file:text-emerald-800"
              />
            </label>
          </form>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" className="rounded-xl" disabled={busy} onClick={() => setFormOpen(false)}>Annuler</Button>
            <Button type="submit" form="category-form" disabled={busy} className="rounded-xl bg-emerald-700 hover:bg-emerald-800">
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmModal
        open={pendingAction !== null}
        onOpenChange={(open) => {
          if (!open && !busy) setPendingAction(null);
        }}
        title={pendingAction?.type === "image" ? "Supprimer l’image ?" : "Supprimer la catégorie ?"}
        description={
          pendingAction?.type === "image"
            ? "L’image sera supprimée de cette catégorie."
            : "Cette suppression peut être refusée si la catégorie est encore utilisée par des établissements ou des sous-catégories."
        }
        confirmLabel={busy ? "Suppression..." : "Supprimer"}
        onConfirm={() => void remove()}
      />
    </div>
  );
}
