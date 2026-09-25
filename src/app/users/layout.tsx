"use client";

import { UserMobileNav } from "@/components/users/commun/UserMobileNav";
import { UserSidebar } from "@/components/users/commun/UserSidebar";
import { UserTopbar } from "@/components/users/commun/UserTopbar";
import { useState } from "react";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
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
  );
}