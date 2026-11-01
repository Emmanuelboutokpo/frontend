"use client";

import { AdminHeader } from "@/components/admin/commun/AdminHeader";
import { AdminSidebar } from "@/components/admin/commun/AdminSidebar";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { useEffect, useState } from "react";
import { useAdminAccountStore } from "@/store/useAdminAccountStore";
 

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const loadProfile = useAdminAccountStore((state) => state.loadProfile);
  const profileError = useAdminAccountStore((state) => state.error);

  useEffect(() => {
    void loadProfile().catch(() => undefined);
  }, [loadProfile]);

  return (
    <RoleGuard audience="admin">
      <div className="flex min-h-screen bg-slate-50">
        {/* Sidebar desktop + mobile */}
        <AdminSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />

        {/* Contenu principal */}
        <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
          <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            {profileError && (
              <p role="alert" className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                Le profil administrateur n’a pas pu être actualisé depuis la base de données : {profileError}
              </p>
            )}
            {children}
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}