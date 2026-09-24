"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { SettingsMenuCards, type SettingsSection } from "@/components/admin/settings/SettingsMenuCards";
import { PlatformInfoCard } from "@/components/admin/settings/PlatformInfoCard";
import { GeneralSettingsModal } from "@/components/admin/settings/GeneralSettingsModal";
import { SecuritySettingsModal } from "@/components/admin/settings/SecuritySettingsModal";
import { PaymentSettingsModal } from "@/components/admin/settings/PaymentSettingsModal";
import { NotificationsSettingsModal } from "@/components/admin/settings/NotificationsSettingsModal";

export default function AdminSettingsPage() {
  const [section, setSection] = useState<SettingsSection | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <nav className="flex items-center gap-1 text-xs text-slate-500">
          <Link href="/admin" className="hover:text-emerald-700">Dashboard</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="font-semibold text-slate-700">Paramètres</span>
        </nav>
        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Paramètres</h1>
        <p className="mt-1 text-sm text-slate-500">
          Gérez la configuration de votre plateforme BestRev.
        </p>
      </div>

      {/* Cartes de navigation */}
      <SettingsMenuCards onSelect={setSection} />

      {/* Contenu principal */}
      <PlatformInfoCard onEdit={() => setSection("general")} />

      {/* Modals */}
      <GeneralSettingsModal
        open={section === "general"}
        onOpenChange={(o) => !o && setSection(null)}
      />
      <SecuritySettingsModal
        open={section === "security"}
        onOpenChange={(o) => !o && setSection(null)}
      />
      <PaymentSettingsModal
        open={section === "payments"}
        onOpenChange={(o) => !o && setSection(null)}
      />
      <NotificationsSettingsModal
        open={section === "notifications"}
        onOpenChange={(o) => !o && setSection(null)}
      />

 
    </div>
  );
}