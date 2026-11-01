"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuthStore } from "@/store/authStore";
import { useUserAccountStore } from "@/store/userAccountStore";

export function UserPasswordModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const changePassword = useUserAccountStore((state) => state.changePassword);
  const [values, setValues] = useState({ current: "", next: "", confirm: "" });
  const [visible, setVisible] = useState({ current: false, next: false, confirm: false });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const rules = [
    { label: "Au moins 8 caractères", valid: values.next.length >= 8 },
    { label: "Une lettre majuscule", valid: /[A-Z]/.test(values.next) },
    { label: "Une lettre minuscule", valid: /[a-z]/.test(values.next) },
    { label: "Un chiffre", valid: /\d/.test(values.next) },
    { label: "Un caractère spécial", valid: /[^A-Za-z0-9]/.test(values.next) },
  ];
  const isValid = Boolean(values.current) && rules.every((rule) => rule.valid)
    && values.next === values.confirm && values.next !== values.current;

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await changePassword(values.current, values.next, values.confirm);
      setValues({ current: "", next: "", confirm: "" });
      onOpenChange(false);
      useAuthStore.getState().clearSession();
      router.replace("/");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Impossible de modifier le mot de passe.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-2xl">
        <DialogHeader><DialogTitle>Changer le mot de passe</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          {([
            ["current", "Mot de passe actuel"],
            ["next", "Nouveau mot de passe"],
            ["confirm", "Confirmer le nouveau mot de passe"],
          ] as const).map(([key, label]) => (
            <label key={key} className="block text-sm font-semibold">
              {label} <span className="text-rose-500">*</span>
              <span className="relative mt-1.5 block">
                <input
                  type={visible[key] ? "text" : "password"}
                  required
                  minLength={8}
                  maxLength={128}
                  autoComplete={key === "current" ? "current-password" : "new-password"}
                  value={values[key]}
                  onChange={(event) => setValues({ ...values, [key]: event.target.value })}
                  className="h-11 w-full rounded-xl border border-slate-200 px-3 pr-10 font-normal outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  aria-label={visible[key] ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  onClick={() => setVisible({ ...visible, [key]: !visible[key] })}
                  className="absolute inset-y-0 right-0 grid w-10 place-items-center text-slate-400"
                >
                  {visible[key] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </span>
            </label>
          ))}

          <ul className="space-y-1 rounded-xl border border-slate-200 bg-slate-50 p-3">
            {rules.map((rule) => (
              <li key={rule.label} className={`text-xs ${rule.valid ? "text-emerald-700" : "text-slate-500"}`}>
                {rule.valid ? "✓" : "•"} {rule.label}
              </li>
            ))}
            <li className={`text-xs ${values.next === values.confirm && values.confirm ? "text-emerald-700" : "text-slate-500"}`}>
              {values.next === values.confirm && values.confirm ? "✓" : "•"} Les mots de passe correspondent
            </li>
          </ul>

          {error && <p role="alert" className="text-sm text-rose-600">{error}</p>}
          <p className="text-xs text-slate-500">Après modification, vous devrez vous reconnecter.</p>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">Annuler</Button>
            <Button type="submit" disabled={!isValid || isSubmitting} className="rounded-xl bg-emerald-700 hover:bg-emerald-800">
              {isSubmitting ? "Modification…" : "Modifier le mot de passe"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
