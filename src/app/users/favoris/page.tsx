"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Heart, MapPin } from "lucide-react";

 import AuthDialog from "@/components/front-office/AuthDialog";
import PropertyShowcase from "@/components/front-office/PropertyShowcase";

 
import { TabsBar, type Tab } from "@/components/admin/commun";

import { useAuthStore, usePropertyStore, useFavoriteEstablishments } from "@/store";
import { formatLocation } from "@/utils/selectors";
import { UserPageHeader } from "@/components/users/commun/UserPageHeader";
import { UserEmptyState } from "@/components/users/commun/UserEmptyState";

// =====================================================================
// PAGE
// =====================================================================
export default function UserFavoritesPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const data = usePropertyStore((s) => s.data);
  const favorites = useFavoriteEstablishments();

  const [authOpen, setAuthOpen] = useState(false);
  const [tab, setTab] = useState("all");

  // Auth : ouvrir la modal si non connecté
  useEffect(() => {
    if (!isAuthenticated) setAuthOpen(true);
  }, [isAuthenticated]);

  // ----- Maps précalculés (1 seule fois) -----
  const photos = useMemo(
    () =>
      Object.fromEntries(
        data.Photos.filter((p) => p.is_cover).map((p) => [p.establishment_id, p])
      ),
    [data.Photos]
  );

  const subcategorySlugs = useMemo(
    () =>
      Object.fromEntries(
        data.SubCategories.map((sc) => [sc.id, sc.slug])
      ),
    [data.SubCategories]
  );

  // ----- Filtrage par tab -----
  const filtered = useMemo(() => {
    if (tab === "all") return favorites;
    if (tab === "HEBERGEMENT") return favorites.filter((f) => f.category_id === 1);
    if (tab === "RESTAURANT") return favorites.filter((f) => f.category_id === 2);
    if (tab === "LOISIR") return favorites.filter((f) => f.category_id === 3);
    return favorites;
  }, [favorites, tab]);

  // ----- Tabs -----
  const tabs: Tab[] = [
    { value: "all", label: "Tous", count: favorites.length },
    { value: "HEBERGEMENT", label: "Hébergements", count: favorites.filter((f) => f.category_id === 1).length },
    { value: "RESTAURANT", label: "Restaurants", count: favorites.filter((f) => f.category_id === 2).length },
    { value: "LOISIR", label: "Loisirs", count: favorites.filter((f) => f.category_id === 3).length },
  ];

  // ----- Groupement par pays + catégorie -----
  const countryGroups = useMemo(() => {
    const byCountry = data.Countries.map((country) => {
      const countryFavorites = filtered.filter((f) => f.country_id === country.id);
      if (countryFavorites.length === 0) return null;

      const byCategory = data.Categories.map((category) => {
        const categoryFavorites = countryFavorites.filter(
          (f) => f.category_id === category.id
        );
        if (categoryFavorites.length === 0) return null;
        return { category, properties: categoryFavorites };
      }).filter(Boolean);

      return { country, categories: byCategory };
    }).filter(Boolean);

    return byCountry as {
      country: typeof data.Countries[number];
      categories: {
        category: typeof data.Categories[number];
        properties: typeof filtered;
      }[];
    }[];
  }, [filtered, data.Countries, data.Categories]);

  // =====================================================================
  // RENDER
  // =====================================================================
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <Link
          href="/users/"
          className="mb-4 inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-emerald-700"
        >
          <ArrowLeft className="h-3 w-3" />
          Retour au tableau de bord
        </Link>

        <UserPageHeader
          title="Mes favoris"
          description="Vos établissements sauvegardés pour plus tard."
        />

        {/* Tabs */}
        <div className="mb-6">
          <TabsBar tabs={tabs} active={tab} onChange={setTab} />
        </div>

        {/* Contenu */}
        {!isAuthenticated ? (
          <UserEmptyState
            icon={Heart}
            title="Connectez-vous pour retrouver vos favoris"
            description="Votre sélection sera conservée et accessible depuis tous vos appareils."
            action={{
              label: "Se connecter",
              onClick: () => setAuthOpen(true),
            }}
          />
        ) : filtered.length === 0 ? (
          <UserEmptyState
            icon={Heart}
            title="Votre sélection est vide"
            description="Explorez nos établissements et appuyez sur le cœur pour enregistrer vos adresses préférées."
            action={{
              label: "Explorer les établissements",
              href: "/explorer",
            }}
          />
        ) : (
          <div className="space-y-10">
            {countryGroups.map(({ country, categories }) => (
              <section key={country.id}>
                {/* Pays */}
                <div className="mb-5 flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                      Pays
                    </p>
                    <h2 className="text-lg font-bold sm:text-xl">{country.name}</h2>
                  </div>
                </div>

                {/* Catégories */}
                <div className="space-y-6">
                  {categories.map(({ category, properties }) => (
                    <div key={category.id}>
                      {/* Titre catégorie */}
                      <div className="mb-3 flex items-center gap-3">
                        <h3 className="text-sm font-bold text-slate-700 sm:text-base">
                          {category.name}
                        </h3>
                        <span className="text-xs text-slate-400">
                          {properties.length} établissement
                          {properties.length > 1 ? "s" : ""}
                        </span>
                      </div>

                      {/* Grille */}
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {properties.map((est) => {
                          const subcategory = data.SubCategories.find(
                            (sc) => sc.id === est.subcategory_id
                          );
                          const location =
                            formatLocation(data, est) || est.address;

                          return (
                            <PropertyShowcase
                              key={est.id}
                              property={est}
                              photo={photos[est.id]}
                              subcategorySlugs={subcategorySlugs}
                              typeName={
                                subcategory?.name ?? category.name
                              }
                              location={location}
                            />
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      {/* Auth modal */}
      <AuthDialog
        open={authOpen}
        onOpenChange={setAuthOpen}
        title="Connectez-vous pour accéder à vos favoris"
      />
    </main>
  );
}