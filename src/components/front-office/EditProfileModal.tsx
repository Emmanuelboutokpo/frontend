"use client";

import { useEffect, useState } from "react";
import { Mail, Save, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: {
    email: string;
    firstName: string;
    lastName: string;
  };
  onSubmit: (values: {
    email: string;
    firstName: string;
    lastName: string;
  }) => void;
}

export function EditProfileModal({
  open,
  onOpenChange,
  initialValues,
  onSubmit,
}: EditProfileModalProps) {
  const [form, setForm] = useState(initialValues);
  const [saved, setSaved] = useState(false);

  // Reset form à chaque ouverture
  useEffect(() => {
    if (open) {
      setForm(initialValues);
      setSaved(false);
    }
  }, [open, initialValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
    setSaved(true);
    setTimeout(() => {
      onOpenChange(false);
    }, 600);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <UserRound className="h-5 w-5 text-emerald-700" />
            Modifier mes informations
          </DialogTitle>
          <DialogDescription>
            Mettez à jour vos informations personnelles.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold">
              Prénom
              <input
                value={form.firstName}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 font-normal outline-none focus:border-emerald-500"
                required
              />
            </label>
            <label className="text-sm font-semibold">
              Nom
              <input
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 font-normal outline-none focus:border-emerald-500"
                required
              />
            </label>
          </div>

          <label className="block text-sm font-semibold">
            Adresse email
            <span className="mt-2 flex h-11 items-center gap-2 rounded-xl border border-slate-200 px-3 focus-within:border-emerald-500">
              <Mail className="h-4 w-4 text-slate-400" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="min-w-0 flex-1 outline-none"
                required
              />
            </span>
          </label>

          <div className="flex items-center justify-between border-t pt-4">
            <p className="text-sm text-emerald-700">
              {saved ? "✓ Enregistré" : ""}
            </p>
            <Button
              type="submit"
              className="rounded-xl bg-emerald-700 hover:bg-emerald-800"
            >
              <Save className="mr-2 h-4 w-4" />
              Enregistrer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}