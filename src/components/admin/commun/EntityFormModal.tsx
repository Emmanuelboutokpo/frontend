"use client";

import { useEffect, useState, ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// =====================================================================
// TYPES
// =====================================================================
export type FormFieldType =
  | "text"
  | "email"
  | "tel"
  | "number"
  | "textarea"
  | "select"
  | "date"
  | "password";

export interface FormField {
  name: string;
  label: string;
  type: FormFieldType;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  rows?: number;
  min?: number;
  max?: number;
  fullWidth?: boolean;
  validate?: (value: any) => string | null;
  description?: string; // texte d'aide sous le label
}

interface Props<T> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  title?: string;
  description?: string;
  fields: FormField[];
  initialValues: T;
  onSubmit: (values: T) => void;
  submitLabel?: string;
  children?: ReactNode;
  customFooter?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

const SIZE_CLASSES: Record<string, string> = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

// =====================================================================
// COMPOSANT
// =====================================================================
export function EntityFormModal<T extends Record<string, any>>({
  open,
  onOpenChange,
  mode,
  title,
  description,
  fields,
  initialValues,
  onSubmit,
  submitLabel,
  children,
  customFooter,
  size = "md",
}: Props<T>) {
  const [form, setForm] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setForm(initialValues);
      setErrors({});
    }
  }, [open, initialValues]);

  const updateField = (name: string, value: any) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    for (const field of fields) {
      if (field.required && !form[field.name]) {
        newErrors[field.name] = "Ce champ est requis";
        continue;
      }
      if (field.validate) {
        const err = field.validate(form[field.name]);
        if (err) newErrors[field.name] = err;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(form);
    onOpenChange(false);
  };

  const finalTitle = title ?? (mode === "create" ? "Ajouter" : "Modifier");
  const finalSubmitLabel =
    submitLabel ?? (mode === "create" ? "Créer" : "Enregistrer");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`${SIZE_CLASSES[size]} max-h-[90vh] overflow-y-auto rounded-2xl lr-scrollbar`}
      >
        <DialogHeader>
          <DialogTitle>{finalTitle}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {children}

          {/* Grille de champs */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {fields.map((field) => {
              const value = form[field.name] ?? "";
              const error = errors[field.name];
              const isFullWidth =
                field.fullWidth || field.type === "textarea";
              const fieldId = `field-${field.name}`;

              return (
                <div
                  key={field.name}
                  className={isFullWidth ? "sm:col-span-2" : ""}
                >
                  <Label
                    htmlFor={fieldId}
                    className="mb-1.5 flex items-center gap-1 text-sm font-semibold"
                  >
                    {field.label}
                    {field.required && (
                      <span className="text-rose-500">*</span>
                    )}
                  </Label>

                  {field.description && (
                    <p className="mb-1.5 text-xs text-slate-500">
                      {field.description}
                    </p>
                  )}

                  {/* ---------- TEXTAREA ---------- */}
                  {field.type === "textarea" ? (
                    <Textarea
                      id={fieldId}
                      value={value}
                      onChange={(e) => updateField(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      rows={field.rows ?? 3}
                      className={`rounded-xl border-slate-200 focus-visible:border-emerald-500 focus-visible:ring-0 ${
                        error ? "border-rose-500 focus-visible:border-rose-500" : ""
                      }`}
                    />
                  ) : field.type === "select" ? (
                    /* ---------- SELECT ---------- */
                    <Select
                      value={value}
                      onValueChange={(v) => updateField(field.name, v)}
                    >
                      <SelectTrigger
                        id={fieldId}
                        className={`h-11 rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-0 ${
                          error ? "border-rose-500" : ""
                        }`}
                      >
                        <SelectValue
                          placeholder={field.placeholder ?? "Sélectionner..."}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    /* ---------- INPUT ---------- */
                    <Input
                      id={fieldId}
                      type={field.type}
                      value={value}
                      onChange={(e) =>
                        updateField(
                          field.name,
                          field.type === "number"
                            ? e.target.value === ""
                              ? ""
                              : Number(e.target.value)
                            : e.target.value
                        )
                      }
                      placeholder={field.placeholder}
                      min={field.min}
                      max={field.max}
                      className={`h-11 rounded-xl border-slate-200 focus-visible:border-emerald-500 focus-visible:ring-0 ${
                        error ? "border-rose-500 focus-visible:border-rose-500" : ""
                      }`}
                    />
                  )}

                  {error && (
                    <p className="mt-1 text-xs font-medium text-rose-600">
                      {error}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {customFooter ?? (
            <DialogFooter className="gap-2 pt-2 sm:gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="rounded-xl"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="rounded-xl bg-emerald-700 hover:bg-emerald-800"
              >
                {finalSubmitLabel}
              </Button>
            </DialogFooter>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}