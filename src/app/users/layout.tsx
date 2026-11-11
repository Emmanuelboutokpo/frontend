"use client";

import { UserMobileNav } from "@/components/users/commun/UserMobileNav";
import { UserSidebar } from "@/components/users/commun/UserSidebar";
import { UserTopbar } from "@/components/users/commun/UserTopbar";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useUserAccountStore } from "@/store/userAccountStore";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const role = useAuthStore((state) => state.role);
  const canLoadUserAccount = isAuthenticated && role === "CLIENT";
  const profile = useUserAccountStore((state) => state.profile);
  const loadProfile = useUserAccountStore((state) => state.loadProfile);
  const loadUnreadCount = useUserAccountStore((state) => state.loadUnreadCount);
  const resetAccount = useUserAccountStore((state) => state.reset);

  useEffect(() => {
    if (!canLoadUserAccount) {
      resetAccount();
      return;
    }

    if (!profile) {
      void loadProfile().catch(() => undefined);
    }
  }, [canLoadUserAccount, profile, loadProfile, resetAccount]);

  useEffect(() => {
    if (canLoadUserAccount) {
      void loadUnreadCount().catch(() => undefined);
    }
  }, [canLoadUserAccount, loadUnreadCount]);

  return (
    <RoleGuard audience="users">
      <div className="flex min-h-screen bg-slate-50">
        {/* Sidebar desktop + mobile drawer */}
        <UserSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />

        {/* Contenu */}
        <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
          <UserTopbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:pb-8">
            {children}
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}