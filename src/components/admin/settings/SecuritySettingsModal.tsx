"use client";

import { useState } from "react";
import { Eye, EyeOff, Check } from "lucide-react";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSettingsStore } from "@/store/useSettingsStore";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

export function SecuritySettingsModal({ open, onOpenChange }: Props) {
  const updatePassword = useSettingsStore((s) => s.updatePassword);
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const [form, setForm] = useState({ current: "", new: "", confirm: "" });

  const rules = [
    { label: "Au moins 8 caractères", valid: form.new.length >= 8 },
    { label: "Une lettre majuscule", valid: /[A-Z]/.test(form.new) },
    { label: "Une lettre minuscule", valid: /[a-z]/.test(form.new) },
    { label: "Un chiffre", valid: /\d/.test(form.new) },
    { label: "Un caractère spécial (@#$%)", valid: /[^A-Za-z0-9]/.test(form.new) },
  ];

  const allValid = rules.every((r) => r.valid) && form.new === form.confirm && form.current;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allValid) return;
    updatePassword(form.new);
    setForm({ current: "", new: "", confirm: "" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle>Changer le mot de passe</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <PasswordField
            label="Mot de passe actuel"
            value={form.current}
            onChange={(v) => setForm({ ...form, current: v })}
            visible={show.current}
            onToggle={() => setShow({ ...show, current: !show.current })}
            required
          />

          <PasswordField
            label="Nouveau mot de passe"
            value={form.new}
            onChange={(v) => setForm({ ...form, new: v })}
            visible={show.new}
            onToggle={() => setShow({ ...show, new: !show.new })}
            required
          />

          <PasswordField
            label="Confirmer le mot de passe"
            value={form.confirm}
            onChange={(v) => setForm({ ...form, confirm: v })}
            visible={show.confirm}
            onToggle={() => setShow({ ...show, confirm: !show.confirm })}
            required
          />

          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Le mot de passe doit contenir :
            </p>
            <ul className="space-y-1">
              {rules.map((r) => (
                <li key={r.label} className="flex items-center gap-2 text-xs">
                  <span
                    className={`grid h-4 w-4 shrink-0 place-items-center rounded-full ${
                      r.valid ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-400"
                    }`}
                  >
                    <Check className="h-2.5 w-2.5" />
                  </span>
                  <span className={r.valid ? "text-slate-700" : "text-slate-500"}>
                    {r.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={!allValid}
              className="rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50"
            >
              Mettre à jour
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function PasswordField({
  label, value, onChange, visible, onToggle, required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  visible: boolean;
  onToggle: () => void;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-semibold">
      {label} {required && <span className="text-rose-500">*</span>}
      <div className="relative mt-1.5">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 w-full rounded-xl border border-slate-200 px-3 pr-10 font-normal outline-none focus:border-emerald-500"
          required={required}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 hover:bg-slate-100"
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </label>
  );
}