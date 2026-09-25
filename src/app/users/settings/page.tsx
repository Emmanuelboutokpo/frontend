"use client";

import { SettingGroup, SettingRow } from "@/components/users/commun/SettingGroup";
import { UserPageHeader } from "@/components/users/commun/UserPageHeader";
import { User, Lock, Globe, Bell, Coins, Trash2 } from "lucide-react";


export default function UserSettingsPage() {
  return (
    <div>
      <UserPageHeader
        title="Paramètres"
        description="Configurez votre compte et vos préférences."
      />

      <div className="space-y-6">
        <SettingGroup title="Compte">
          <SettingRow
            icon={User}
            iconBg="bg-emerald-50 text-emerald-700"
            title="Informations personnelles"
            description="Gérez vos informations de profil"
            href="/profile"
          />
          <SettingRow
            icon={Lock}
            iconBg="bg-blue-50 text-blue-700"
            title="Modifier le mot de passe"
            description="Changez votre mot de passe"
            onClick={() => console.log("open modal")}
          />
        </SettingGroup>

        <SettingGroup title="Préférences">
          <SettingRow
            icon={Globe}
            iconBg="bg-violet-50 text-violet-700"
            title="Langue"
            description="Français"
            onClick={() => {}}
          />
          <SettingRow
            icon={Coins}
            iconBg="bg-amber-50 text-amber-700"
            title="Devise"
            description="FCFA (XOF)"
            onClick={() => {}}
          />
          <SettingRow
            icon={Bell}
            iconBg="bg-rose-50 text-rose-700"
            title="Notifications"
            description="Gérez vos préférences de notifications"
            href="/notifications"
          />
        </SettingGroup>

        <SettingGroup title="Confidentialité">
          <SettingRow
            icon={Lock}
            iconBg="bg-slate-100 text-slate-700"
            title="Données personnelles"
            description="Consultez et gérez vos données"
            onClick={() => {}}
          />
        </SettingGroup>

        <SettingGroup title="Danger">
          <SettingRow
            icon={Trash2}
            title="Supprimer mon compte"
            description="Cette action est irréversible"
            onClick={() => {}}
            variant="danger"
          />
        </SettingGroup>
      </div>
    </div>
  );
}