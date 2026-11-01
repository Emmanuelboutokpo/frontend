"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SettingGroup, SettingRow } from "@/components/users/commun/SettingGroup";
import { UserPageHeader } from "@/components/users/commun/UserPageHeader";
import { UserPasswordModal } from "@/components/users/commun/UserPasswordModal";
import { User, Lock, Globe, Bell, Coins, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuthStore } from "@/store/authStore";
import { useUserAccountStore } from "@/store/userAccountStore";

export default function UserSettingsPage() {
  const router = useRouter();
  const profile = useUserAccountStore((state) => state.profile);
  const isLoadingProfile = useUserAccountStore((state) => state.isLoadingProfile);
  const profileError = useUserAccountStore((state) => state.profileError);
  const loadProfile = useUserAccountStore((state) => state.loadProfile);
  const updateProfile = useUserAccountStore((state) => state.updateProfile);
  const deleteAccount = useUserAccountStore((state) => state.deleteAccount);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [preferenceError, setPreferenceError] = useState("");

  const savePreference = async (value: string, field: "language" | "currency") => {
    setPreferenceError("");
    try {
      await updateProfile({ [field]: value });
    } catch (requestError) {
      setPreferenceError(requestError instanceof Error ? requestError.message : "Impossible d’enregistrer ce paramètre.");
    }
  };

  const handleDelete = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsDeleting(true);
    try {
      await deleteAccount(currentPassword);
      setDeleteOpen(false);
      useAuthStore.getState().clearSession();
      router.replace("/");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Impossible de supprimer le compte.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <UserPageHeader title="Paramètres" description="Configurez votre compte et vos préférences." />

      <div className="space-y-6">
        {profileError && (
          <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <span>{profileError}</span>
            <button
              type="button"
              onClick={() => void loadProfile().catch(() => undefined)}
              disabled={isLoadingProfile}
              className="shrink-0 font-semibold underline disabled:opacity-50"
            >
              Réessayer
            </button>
          </div>
        )}
        <SettingGroup title="Compte">
          <SettingRow
            icon={User}
            iconBg="bg-emerald-50 text-emerald-700"
            title="Informations personnelles"
            description="Gérez vos informations de profil"
            href="/users/profil"
          />
          <SettingRow
            icon={Lock}
            iconBg="bg-blue-50 text-blue-700"
            title="Modifier le mot de passe"
            description="Changez votre mot de passe"
            onClick={() => setPasswordOpen(true)}
          />
        </SettingGroup>

        <SettingGroup title="Préférences">
          <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-violet-50 text-violet-700"><Globe className="h-4 w-4" /></div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-800">Langue</p>
              <p className="text-xs text-slate-500">Langue de votre compte</p>
            </div>
            <Select value={profile?.language ?? "fr"} onValueChange={(value) => void savePreference(value, "language")} disabled={isLoadingProfile || !profile}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-amber-50 text-amber-700"><Coins className="h-4 w-4" /></div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-800">Devise</p>
              <p className="text-xs text-slate-500">Devise préférée pour l’affichage</p>
            </div>
            <Select value={profile?.currency ?? "XOF"} onValueChange={(value) => void savePreference(value, "currency")} disabled={isLoadingProfile || !profile}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="XOF">FCFA (XOF)</SelectItem>
                <SelectItem value="EUR">Euro (EUR)</SelectItem>
                <SelectItem value="USD">Dollar (USD)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <SettingRow
            icon={Bell}
            iconBg="bg-rose-50 text-rose-700"
            title="Notifications"
            description="Consultez et gérez vos notifications"
            href="/users/notifications"
          />
          {preferenceError && <p role="alert" className="px-4 py-2 text-sm text-rose-600">{preferenceError}</p>}
        </SettingGroup>

        <SettingGroup title="Danger">
          <SettingRow
            icon={Trash2}
            title="Supprimer mon compte"
            description="Cette action est irréversible"
            onClick={() => setDeleteOpen(true)}
            variant="danger"
          />
        </SettingGroup>
      </div>

      <UserPasswordModal open={passwordOpen} onOpenChange={setPasswordOpen} />

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader><DialogTitle>Supprimer votre compte ?</DialogTitle></DialogHeader>
          <form onSubmit={handleDelete} className="space-y-4">
            <p className="text-sm text-slate-600">Cette action est définitive. Saisissez votre mot de passe et le mot DELETE pour confirmer.</p>
            <label className="block text-sm font-medium">
              Mot de passe actuel
              <input
                type="password"
                required
                minLength={8}
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                autoComplete="current-password"
                className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-rose-500"
              />
            </label>
            <label className="block text-sm font-medium">
              Écrivez DELETE pour confirmer
              <input
                required
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-rose-500"
              />
            </label>
            {error && <p role="alert" className="text-sm text-rose-600">{error}</p>}
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setDeleteOpen(false)} className="rounded-xl">Annuler</Button>
              <Button
                type="submit"
                disabled={confirmation !== "DELETE" || isDeleting}
                className="rounded-xl bg-rose-600 hover:bg-rose-700"
              >
                {isDeleting ? "Suppression…" : "Supprimer définitivement"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
