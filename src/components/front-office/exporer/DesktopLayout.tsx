"use client";

import dynamic from "next/dynamic";
import { ResultsHeader } from "./ResultsHeader";
import { EstablishmentGrid } from "./EstablishmentGrid";
import { Pagination } from "./Pagination";
import { LayoutGrid, Bed, Utensils, Compass, LucideIcon } from "lucide-react";
import { usePropertyStore, useCategoryCounts, useCategories } from "@/store";
import { FiltersSidebar } from "./FiltersSidebar";
import { useUIStore } from "@/store/useUIStore";

const iconMap: Record<string, { icon: LucideIcon; color: string; subtitle: string }> = {
  hebergement: {
    icon: Bed,
    color: "bg-blue-100 text-blue-700",
    subtitle: "Dormez en toute sérénité",
  },
  restaurant: {
    icon: Utensils,
    color: "bg-orange-100 text-orange-700",
    subtitle: "Savourez les meilleures adresses",
  },
  loisir: {
    icon: Compass,
    color: "bg-emerald-100 text-emerald-700",
    subtitle: "Profitez de votre temps libre",
  },
};

const MapView = dynamic(
  () => import("./MapView").then((m) => m.MapView),
  {
    ssr: false,
    loading: () => (
      <div className="sticky top-24 h-[calc(100vh-120px)] animate-pulse rounded-xl border bg-muted/30" />
    ),
  }
);

export function DesktopLayout() {
  const categories = useCategories();
  const categoryCounts = useCategoryCounts();
  const selectedCategoryId = usePropertyStore((s) => s.searchQuery.categoryId);
  const setCategory = usePropertyStore((s) => s.setCategory);
  const totalApproved = usePropertyStore(
    (s) => s.data.Establishments.filter((e) => e.status === "APPROVED").length
  );
  const viewMode = useUIStore((s) => s.explorerViewMode);
  const isMap = viewMode === "map";
  const isAllActive = !selectedCategoryId;

  return (
    <div className="min-h-screen bg-background">
      {/* Bannière */}
      <section className="hidden relative h-72 lg:flex items-center  isolate overflow-visible lg:bg-[url('/images/hero12.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#042d5d]/90 via-[#0b4771]/60 to-[#081d39]/15" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <p className="text-blue-200 text-sm mb-2">Explorer</p>
          <h1 className="max-w-xl text-2xl font-bold leading-tight text-white lg:text-4xl">
            Trouvez un endroit idéal avec <span className="block text-[#ffc24b]">BestReservs</span>
          </h1>
          <p className="mt-2 text-sm text-white/85 lg:text-base">
            Hébergements, restaurants, loisirs... tout en un seul endroit.
          </p>
        </div>
      </section>

      <section className="bg-white shadow-sm sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
            {/* Bouton Tous */}
            <button
              onClick={() => setCategory(null)}
              className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition ${isAllActive
                  ? "bg-emerald-800 text-white shadow-sm"
                  : "bg-muted text-foreground hover:bg-muted/80"
                }`}
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="truncate">Tous ({totalApproved})</span>
            </button>

            {/* Boutons Catégories réelles du store */}
            {categories.map((category) => {
              const meta = iconMap[category.slug] ?? {
                icon: LayoutGrid,
                color: "bg-emerald-100 text-emerald-700",
                subtitle: category.description,
              };
              const Icon = meta.icon;
              const isActive = selectedCategoryId === category.id;
              const count = categoryCounts[category.id] ?? 0;

              return (
                <button
                  key={category.id}
                  onClick={() => setCategory(isActive ? null : category.id)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left transition ${isActive
                      ? "bg-emerald-50 ring-2 ring-emerald-700 shadow-sm"
                      : "bg-muted/50 hover:bg-muted"
                    }`}
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${meta.color}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="truncate text-sm font-semibold">
                        {category.name}s
                      </span>
                      <span className="text-xs font-bold text-muted-foreground">
                        ({count})
                      </span>
                    </div>
                    <div className="truncate text-[11px] text-muted-foreground">
                      {meta.subtitle}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Layout 3 colonnes */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-[256px_minmax(0,1fr)] gap-6">


          {/* SIDEBAR */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 h-[calc(100vh-7rem)] overflow-y-auto pr-2">
              <FiltersSidebar />
            </div>
          </aside>

          {/* MAIN */}
          <main className="min-w-0">
           
           {isMap ? (
            // 🗺️ Mode CARTE : la carte prend toute la place
            <main>
              <ResultsHeader />
              <div className="mt-4">
                <MapView />
              </div>
            </main>
          ) : (
            // 📋 Mode LISTE : grille + carte latérale
            <>
              <main>
                <ResultsHeader />
                <EstablishmentGrid />
                <Pagination />
              </main>
               
            </>
          )}
          </main>

        </div>
      </div>
    </div>
  );
}