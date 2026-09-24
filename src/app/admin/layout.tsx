"use client";

import { AdminHeader } from "@/components/admin/commun/AdminHeader";
import { AdminSidebar } from "@/components/admin/commun/AdminSidebar";
import { useState } from "react";
 

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar desktop + mobile */}
      <AdminSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />

      {/* Contenu principal */}
      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}