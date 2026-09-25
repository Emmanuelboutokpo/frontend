"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store";

interface Props {
  /** URL de l'image de fond (optionnel) */
  backgroundImage?: string;
  /** Fonction appelée au clic sur "Rechercher" */
  onSearch?: (query: string) => void;
  /** Placeholder du champ de recherche */
  searchPlaceholder?: string;
  /** Afficher ou non la barre de recherche */
  showSearch?: boolean;
}

export function WelcomeBanner({
  backgroundImage = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000",
  onSearch,
  searchPlaceholder = "Où souhaitez-vous aller ?",
  showSearch = true,
}: Props) {
  const firstName = useAuthStore((s) => s.firstName) ?? "Emmanuel";

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem("search") as HTMLInputElement;
    onSearch?.(input.value);
  };

  return (
    <section className="relative overflow-hidden rounded-3xl">
      {/* Image de fond */}
      <div
        className="relative min-h-[200px] w-full bg-cover bg-center lg:min-h-[240px]"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      >
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#042d5d]/90 via-[#0b4771]/60 to-transparent" />

        {/* Contenu */}
        <div className="relative flex flex-col gap-4 px-6 py-8 lg:px-10 lg:py-12">
          {/* Titre */}
          <div>
            <h1 className="text-2xl font-bold leading-tight text-white lg:text-3xl">
              {/* Bonjour {firstName} ! 👋 */}
              Bonjour Mathias ! 👋
            </h1>
            <p className="mt-2 max-w-lg text-sm text-white/85 lg:text-base">
              Découvrez de nouveaux lieux et gérez facilement vos réservations.
            </p>
          </div>

          {/* Barre de recherche */}
          {showSearch && (
            <form
              onSubmit={handleSearch}
              className="flex w-full max-w-lg items-center gap-2 rounded-2xl bg-white p-1.5 shadow-lg"
            >
              <Search className="ml-3 h-5 w-5 shrink-0 text-slate-400" />
              <input
                name="search"
                type="search"
                placeholder={searchPlaceholder}
                className="min-w-0 flex-1 border-0 bg-transparent px-1 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />
              <Button
                type="submit"
                className="shrink-0 rounded-xl bg-emerald-700 px-5 hover:bg-emerald-800"
              >
                Rechercher
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}