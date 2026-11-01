"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { Camera, Mail, Phone, MapPin, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserAccountStore } from "@/store/userAccountStore";
import { UserPageHeader } from "@/components/users/commun/UserPageHeader";

export default function UserProfilePage() {
  const profile = useUserAccountStore((state) => state.profile);
  const isLoadingProfile = useUserAccountStore((state) => state.isLoadingProfile);
  const error = useUserAccountStore((state) => state.profileError);
  const loadProfile = useUserAccountStore((state) => state.loadProfile);
  const updateProfile = useUserAccountStore((state) => state.updateProfile);
  const uploadAvatar = useUserAccountStore((state) => state.uploadAvatar);
  const deleteAvatar = useUserAccountStore((state) => state.deleteAvatar);
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", city: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (profile) {
      setForm({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        city: profile.city,
      });
    }
  }, [profile]);

  const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSuccess("");
    setIsUploadingAvatar(true);
    try {
      await uploadAvatar(file);
      setSuccess("Votre photo de profil a été mise à jour.");
    } catch {
      // The store exposes the API error in the page.
    } finally {
      setIsUploadingAvatar(false);
      event.target.value = "";
    }
  };

  const handleSave = async () => {
    setSuccess("");
    setIsSaving(true);
    try {
      await updateProfile(form);
      setSuccess("Vos informations ont été enregistrées.");
    } catch {
      // The store exposes the API error in the page.
    } finally {
      setIsSaving(false);
    }
  };

  const initials = `${form.firstName[0] ?? ""}${form.lastName[0] ?? ""}`.toUpperCase();

  return (
    <div>
      <UserPageHeader title="Mon profil" description="Gérez vos informations personnelles." />

      <Card className="rounded-2xl p-6">
        <div className="mb-6 flex items-center gap-4 border-b border-slate-100 pb-6">
          {profile?.avatar ? (
            <img src={profile.avatar} alt="Photo de profil" className="h-20 w-20 rounded-full object-cover" />
          ) : (
            <div className="grid h-20 w-20 place-items-center rounded-full bg-emerald-700 text-2xl font-bold text-white">
              {initials || "U"}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold">Photo de profil</p>
            <input
              id="profile-avatar"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => void handleAvatarChange(event)}
              className="sr-only"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isUploadingAvatar}
                onClick={() => document.getElementById("profile-avatar")?.click()}
                className="rounded-lg"
              >
                <Camera className="mr-1.5 h-3.5 w-3.5" />
                {isUploadingAvatar ? "Envoi…" : "Changer la photo"}
              </Button>
              {profile?.avatar && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isUploadingAvatar}
                  onClick={() => {
                    setSuccess("");
                    setIsUploadingAvatar(true);
                    void deleteAvatar()
                      .then(() => setSuccess("Votre photo de profil a été supprimée."))
                      .catch(() => {})
                      .finally(() => setIsUploadingAvatar(false));
                  }}
                  className="rounded-lg"
                >
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                  Supprimer
                </Button>
              )}
            </div>
            <p className="mt-1 text-[10px] text-slate-400">JPEG, PNG ou WebP (max. 5 Mo)</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold">Informations personnelles</h3>

          {isLoadingProfile && !profile && <p className="text-sm text-slate-500">Chargement du profil…</p>}
          {error && (
            <div role="alert" className="flex flex-wrap items-center gap-3 text-sm text-rose-600">
              <span>{error}</span>
              <button
                type="button"
                onClick={() => void loadProfile().catch(() => undefined)}
                disabled={isLoadingProfile}
                className="font-semibold underline disabled:opacity-50"
              >
                Réessayer
              </button>
            </div>
          )}
          {success && <p role="status" className="text-sm text-emerald-700">{success}</p>}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="firstName">Prénom <span className="text-rose-500">*</span></Label>
              <Input
                id="firstName"
                required
                maxLength={100}
                value={form.firstName}
                onChange={(event) => setForm({ ...form, firstName: event.target.value })}
                className="mt-1.5 h-11 rounded-xl"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Nom <span className="text-rose-500">*</span></Label>
              <Input
                id="lastName"
                required
                maxLength={100}
                value={form.lastName}
                onChange={(event) => setForm({ ...form, lastName: event.target.value })}
                className="mt-1.5 h-11 rounded-xl"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <div className="relative mt-1.5">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input id="email" type="email" value={profile?.email ?? ""} readOnly className="h-11 rounded-xl pl-10" />
            </div>
            <p className="mt-1 text-xs text-slate-500">L’adresse email ne peut pas être modifiée depuis cet écran.</p>
          </div>

          <div>
            <Label htmlFor="phone">Téléphone</Label>
            <div className="relative mt-1.5">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="phone"
                maxLength={30}
                value={form.phone}
                onChange={(event) => setForm({ ...form, phone: event.target.value })}
                className="h-11 rounded-xl pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="city">Ville</Label>
            <div className="relative mt-1.5">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="city"
                maxLength={100}
                value={form.city}
                onChange={(event) => setForm({ ...form, city: event.target.value })}
                className="h-11 rounded-xl pl-10"
              />
            </div>
          </div>

          <Button
            type="button"
            disabled={isSaving || isLoadingProfile || !profile}
            onClick={() => void handleSave()}
            className="w-full rounded-xl bg-emerald-700 hover:bg-emerald-800"
          >
            {isSaving ? "Enregistrement…" : "Enregistrer les modifications"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
