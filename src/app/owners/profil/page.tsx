"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { Camera, ChevronRight, Mail, Phone, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminAccountStore } from "@/store/useAdminAccountStore";
import { useAuthStore } from "@/store/authStore";

export default function AdminProfilePage() {
  const profile = useAdminAccountStore((state) => state.profile);
  const isLoading = useAdminAccountStore((state) => state.isLoading);
  const error = useAdminAccountStore((state) => state.error);
  const loadProfile = useAdminAccountStore((state) => state.loadProfile);
  const updateProfile = useAdminAccountStore((state) => state.updateProfile);
  const uploadAvatar = useAdminAccountStore((state) => state.uploadAvatar);
  const deleteAvatar = useAdminAccountStore((state) => state.deleteAvatar);
  const changePassword = useAdminAccountStore((state) => state.changePassword);
  const deleteAccount = useAdminAccountStore((state) => state.deleteAccount);
  const clearSession = useAuthStore((state) => state.clearSession);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [password, setPassword] = useState({ next: "", confirm: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (profile) {
      setForm({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phone: profile.phone,
      });
    }
  }, [profile]);

  const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSuccess("");
    setIsUploading(true);
    try {
      await uploadAvatar(file);
      setSuccess("La photo de profil a été mise à jour.");
    } catch {
      // The store exposes the API error on this page.
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccess("");
    setIsSaving(true);
    try {
      await updateProfile(form);
      setSuccess("Vos informations ont été enregistrées.");
    } catch {
      // The store exposes the API error on this page.
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccess("");
    setIsChangingPassword(true);
    try {
      await changePassword(password.next, password.confirm);
      setPassword({ next: "", confirm: "" });
      setSuccess("Votre mot de passe a été modifié. Veuillez vous reconnecter.");
      clearSession();
      window.location.assign("/");
    } catch {
      // The store exposes the API error on this page.
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Supprimer définitivement votre compte administrateur ? Cette action est irréversible.")) return;
    setSuccess("");
    setIsDeleting(true);
    try {
      await deleteAccount();
      window.location.assign("/");
    } catch {
      // The store exposes the API error on this page.
    } finally {
      setIsDeleting(false);
    }
  };

  const passwordRules = [
    { label: "Au moins 8 caractères", valid: password.next.length >= 8 },
    { label: "Une lettre majuscule", valid: /[A-Z]/.test(password.next) },
    { label: "Une lettre minuscule", valid: /[a-z]/.test(password.next) },
    { label: "Un chiffre", valid: /\d/.test(password.next) },
    { label: "Un caractère spécial", valid: /[^A-Za-z0-9]/.test(password.next) },
  ];
  const initials = `${form.firstName[0] ?? ""}${form.lastName[0] ?? ""}`.toUpperCase();

  return (
    <div className="space-y-6">
      <div>
        <nav className="flex items-center gap-1 text-xs text-slate-500">
          <Link href="/owners" className="hover:text-emerald-700">Dashboard</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="font-semibold text-slate-700">Mon profil</span>
        </nav>
        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Mon profil</h1>
        <p className="mt-1 text-sm text-slate-500">Gérez vos informations personnelles et la sécurité de votre compte administrateur.</p>
      </div>

      {error && (
        <div role="alert" className="flex flex-wrap items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          <span>{error}</span>
          {!profile && (
            <button type="button" onClick={() => void loadProfile().catch(() => undefined)} disabled={isLoading} className="font-semibold underline disabled:opacity-50">
              Réessayer
            </button>
          )}
        </div>
      )}
      {success && <p role="status" className="text-sm text-emerald-700">{success}</p>}
      {isLoading && !profile && <p className="text-sm text-slate-500">Chargement du profil…</p>}

      <Card className="rounded-2xl p-6">
        <div className="mb-6 flex items-center gap-4 border-b border-slate-100 pb-6">
          {profile?.avatar ? (
            <img src={profile.avatar} alt="Photo de profil" className="h-20 w-20 rounded-full object-cover" />
          ) : (
            <div className="grid h-20 w-20 place-items-center rounded-full bg-emerald-700 text-2xl font-bold text-white">{initials || "AD"}</div>
          )}
          <div>
            <p className="text-sm font-semibold">Photo de profil</p>
            <input id="admin-profile-avatar" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => void handleAvatarChange(event)} className="sr-only" />
            <div className="mt-2 flex flex-wrap gap-2">
              <Button type="button" variant="outline" size="sm" disabled={!profile || isUploading} onClick={() => document.getElementById("admin-profile-avatar")?.click()} className="rounded-lg">
                <Camera className="mr-1.5 h-3.5 w-3.5" />{isUploading ? "Envoi…" : "Changer la photo"}
              </Button>
              {profile?.avatar && (
                <Button type="button" variant="outline" size="sm" disabled={isUploading} onClick={() => {
                  setSuccess("");
                  setIsUploading(true);
                  void deleteAvatar().then(() => setSuccess("Votre photo de profil a été supprimée.")).catch(() => {}).finally(() => setIsUploading(false));
                }} className="rounded-lg">
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" />Supprimer
                </Button>
              )}
            </div>
            <p className="mt-1 text-[10px] text-slate-400">JPEG, PNG ou WebP (max. 5 Mo)</p>
          </div>
        </div>

        <form onSubmit={(event) => void handleSave(event)} className="space-y-4">
          <h2 className="text-sm font-bold">Informations personnelles</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="admin-first-name">Prénom <span className="text-rose-500">*</span></Label>
              <Input id="admin-first-name" required maxLength={100} value={form.firstName} onChange={(event) => setForm({ ...form, firstName: event.target.value })} className="mt-1.5 h-11 rounded-xl" />
            </div>
            <div>
              <Label htmlFor="admin-last-name">Nom <span className="text-rose-500">*</span></Label>
              <Input id="admin-last-name" required maxLength={100} value={form.lastName} onChange={(event) => setForm({ ...form, lastName: event.target.value })} className="mt-1.5 h-11 rounded-xl" />
            </div>
          </div>
          <div>
            <Label htmlFor="admin-email">Email</Label>
            <div className="relative mt-1.5">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input id="admin-email" type="email" required maxLength={254} value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="h-11 rounded-xl pl-10" />
            </div>
          </div>
          <div>
            <Label htmlFor="admin-phone">Téléphone</Label>
            <div className="relative mt-1.5">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input id="admin-phone" maxLength={30} value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} className="h-11 rounded-xl pl-10" />
            </div>
          </div>
          <Button type="submit" disabled={isSaving || isLoading || !profile} className="rounded-xl bg-emerald-700 hover:bg-emerald-800">
            {isSaving ? "Enregistrement…" : "Enregistrer les modifications"}
          </Button>
        </form>
      </Card>

      <Card className="rounded-2xl p-6">
        <form onSubmit={(event) => void handlePasswordChange(event)} className="space-y-4">
          <div>
            <h2 className="text-sm font-bold">Sécurité</h2>
            <p className="mt-1 text-sm text-slate-500">Choisissez un nouveau mot de passe pour votre compte.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="admin-new-password">Nouveau mot de passe <span className="text-rose-500">*</span></Label>
              <Input id="admin-new-password" type="password" autoComplete="new-password" minLength={8} maxLength={128} required value={password.next} onChange={(event) => setPassword({ ...password, next: event.target.value })} className="mt-1.5 h-11 rounded-xl" />
            </div>
            <div>
              <Label htmlFor="admin-confirm-password">Confirmer le mot de passe <span className="text-rose-500">*</span></Label>
              <Input id="admin-confirm-password" type="password" autoComplete="new-password" minLength={8} maxLength={128} required value={password.confirm} onChange={(event) => setPassword({ ...password, confirm: event.target.value })} className="mt-1.5 h-11 rounded-xl" />
            </div>
          </div>
          <ul className="space-y-1 rounded-xl border border-slate-200 bg-slate-50 p-3">
            {passwordRules.map((rule) => <li key={rule.label} className={`text-xs ${rule.valid ? "text-emerald-700" : "text-slate-500"}`}>{rule.valid ? "✓" : "•"} {rule.label}</li>)}
            <li className={`text-xs ${password.next && password.next === password.confirm ? "text-emerald-700" : "text-slate-500"}`}>
              {password.next && password.next === password.confirm ? "✓" : "•"} Les mots de passe correspondent
            </li>
          </ul>
          <Button type="submit" disabled={!profile || isChangingPassword || !passwordRules.every((rule) => rule.valid) || password.next !== password.confirm} className="rounded-xl bg-emerald-700 hover:bg-emerald-800">
            {isChangingPassword ? "Modification…" : "Modifier le mot de passe"}
          </Button>
        </form>
      </Card>

      <Card className="rounded-2xl border-rose-200 p-6">
        <h2 className="text-sm font-bold text-rose-700">Zone de danger</h2>
        <p className="mt-1 text-sm text-slate-500">La suppression de votre compte administrateur est définitive.</p>
        <Button type="button" variant="destructive" disabled={!profile || isDeleting} onClick={() => void handleDeleteAccount()} className="mt-4 rounded-xl">
          <Trash2 className="mr-2 h-4 w-4" />{isDeleting ? "Suppression…" : "Supprimer mon compte"}
        </Button>
      </Card>
    </div>
  );
}
