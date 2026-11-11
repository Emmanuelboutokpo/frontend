"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
 import { Sheet, SheetContent } from "@/components/ui/sheet";
import { adminNav, ownersNav } from "../../../../config/adminNav";
import { AdminAccountMenu } from "./AdminAccountMenu";
import { useAuthStore } from "@/store/authStore";

interface AdminSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function SidebarContent({ onItemClick }: { onItemClick?: () => void }) {
  const pathname = usePathname();
  const role = useAuthStore((state) => state.role);
  const navigation = role === "PROPRIETAIRE" ? ownersNav : adminNav;

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center gap-2 border-b px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-700 text-white">
          <span className="text-lg font-bold">B</span>
        </div>
        <div>
          <div className="text-base font-extrabold tracking-tight text-slate-900">
            BestReservs
          </div>
          <div className="text-[10px] text-slate-500">
            Explorez. Réservez. Vivez mieux.
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4 lr-scrollbar">
        {navigation.map((group) => (
          <div key={group.section}>
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {group.section}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = "exact" in item && item.exact
                  ? pathname === item.href
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onItemClick}
                    className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                      isActive
                        ? "bg-emerald-50 text-emerald-800"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 shrink-0 ${
                        isActive
                          ? "text-emerald-700"
                          : "text-slate-400 group-hover:text-slate-600"
                      }`}
                    />
                    <span className="flex-1 truncate">{item.label}</span>
                     
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
 

      <div className="border-t p-3">
        <AdminAccountMenu compact />
      </div>
    </div>
  );
}

export function AdminSidebar({ open, onOpenChange }: AdminSidebarProps) {
  return (
    <>
      {/* Desktop */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r bg-white lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile */}
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent onItemClick={() => onOpenChange(false)} />
        </SheetContent>
      </Sheet>
    </>
  );
}