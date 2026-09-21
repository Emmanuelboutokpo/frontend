"use client";

import { MapPin } from "lucide-react";
import { usePropertyStore, useCommunes, useCountries } from "@/store";

export function ExplorerHeader() {
  const searchQuery = usePropertyStore((s) => s.searchQuery);
  const communes = useCommunes();
  const countries = useCountries();

  const activeCommune = searchQuery.communeId
    ? communes.find((c) => c.id === searchQuery.communeId)?.name
    : null;
  const activeCountry = searchQuery.countryId
    ? countries.find((c) => c.id === searchQuery.countryId)?.name
    : null;

  const locationLabel =
    activeCommune && activeCountry
      ? `${activeCommune}, ${activeCountry}`
      : activeCommune
      ? `${activeCommune}, Bénin`
      : activeCountry ?? "Tout le Bénin";

  return (
    <div className="relative">
      <div
        className="relative h-[260px] w-full overflow-hidden bg-cover bg-center lg:h-[320px]"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1597211833712-5e41faa3a4b2?q=80&w=2000')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-transparent" />

        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-4">
          <span className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#ffc24b]">
            Explorer
          </span>
          <h1 className="max-w-xl text-2xl font-bold leading-tight text-white lg:text-4xl">
            Trouvez un endroit idéal avec <span className="block text-[#ffc24b]">BestReservs</span> 
          </h1>
          <p className="mt-2 text-sm text-white/85 lg:text-base">
            Hébergements restaurants, loisirs.
          </p>
        </div>

        {/* Badge destination (mobile) */}
        <div className="absolute right-4 top-4 rounded-xl bg-white/95 px-3 py-2 shadow-lg backdrop-blur lg:hidden">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-emerald-700" />
            <span className="text-xs font-semibold">{locationLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
}