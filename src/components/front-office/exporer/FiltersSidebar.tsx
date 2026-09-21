"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  usePropertyStore,
  useCountries,
  useCommunes,
  useCategories,
  useAmenities,
  useAmenityCounts,
  useCategoryCounts,
  useGlobalPriceRange,
} from "@/store";

export function FiltersSidebar() {
  const countries = useCountries();
  const communes = useCommunes();
  const categories = useCategories();
  const amenities = useAmenities();
  const amenityCounts = useAmenityCounts();
  const categoryCounts = useCategoryCounts();
  const priceRange = useGlobalPriceRange();

  const searchQuery = usePropertyStore((s) => s.searchQuery);
  const searchFilters = usePropertyStore((s) => s.searchFilters);
  const setSearchQuery = usePropertyStore((s) => s.setSearchQuery);
  const setSearchFilters = usePropertyStore((s) => s.setSearchFilters);
  const resetFilters = usePropertyStore((s) => s.resetFilters);

  const [showAllAmenities, setShowAllAmenities] = useState(false);

  const maxPrice = priceRange.max > 0 ? priceRange.max : 200000;
  const currentPriceRange: [number, number] = [
    searchFilters.priceMin ?? 0,
    searchFilters.priceMax ?? maxPrice,
  ];

  const handlePriceChange = (val: number[]) => {
    setSearchFilters({
      priceMin: val[0],
      priceMax: val[1],
    });
  };

  const handleCountryChange = (val: string) => {
    setSearchQuery({
      countryId: val === "all" ? undefined : Number(val),
      communeId: undefined, // reset commune when country changes
    });
  };

  const handleCommuneChange = (val: string) => {
    setSearchQuery({
      communeId: val === "all" ? undefined : Number(val),
    });
  };

  const handleCategoryToggle = (categoryId?: number) => {
    if (!categoryId) {
      setSearchQuery({ categoryId: undefined });
    } else {
      setSearchQuery({
        categoryId: searchQuery.categoryId === categoryId ? undefined : categoryId,
      });
    }
  };

  const handleRatingChange = (rating?: number) => {
    setSearchFilters({
      ratingMin: searchFilters.ratingMin === rating ? undefined : rating,
    });
  };

  const handleAmenityToggle = (amenityId: number) => {
    const exists = searchFilters.amenityIds.includes(amenityId);
    const newIds = exists
      ? searchFilters.amenityIds.filter((id) => id !== amenityId)
      : [...searchFilters.amenityIds, amenityId];
    setSearchFilters({ amenityIds: newIds });
  };

  const visibleAmenities = showAllAmenities ? amenities : amenities.slice(0, 5);

  return (
    <div className="bg-white sm:rounded-2xl sm:shadow-sm sm:p-5 p-3 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">Filtres</h3>
        <button
          onClick={resetFilters}
          className="flex items-center gap-1 text-xs font-medium text-emerald-700 hover:underline"
        >
          <RotateCcw className="h-3 w-3" />
          Réinitialiser
        </button>
      </div>

      {/* Destination */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold">Destination</h4>
        <Select
          value={searchQuery.countryId ? String(searchQuery.countryId) : "all"}
          onValueChange={handleCountryChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Pays" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les pays</SelectItem>
            {countries.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={searchQuery.communeId ? String(searchQuery.communeId) : "all"}
          onValueChange={handleCommuneChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Ville / Commune" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les communes</SelectItem>
            {communes
              .filter((commune) =>
                searchQuery.countryId
                  ? true
                  : true
              )
              .map((com) => (
                <SelectItem key={com.id} value={String(com.id)}>
                  {com.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {/* Prix */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold">Prix / nuit (FCFA)</h4>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{currentPriceRange[0].toLocaleString("fr-FR")}</span>
          <span>{currentPriceRange[1].toLocaleString("fr-FR")}</span>
        </div>
        <Slider
          value={currentPriceRange}
          onValueChange={handlePriceChange}
          max={maxPrice}
          step={5000}
          className="[&_[role=slider]]:bg-emerald-700"
        />
      </div>

      {/* Catégories */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold">Catégorie</h4>
        <label
          onClick={() => handleCategoryToggle(undefined)}
          className="flex cursor-pointer items-center justify-between gap-2 rounded-md px-1 py-1 hover:bg-muted/50"
        >
          <div className="flex items-center gap-2">
            <Checkbox checked={!searchQuery.categoryId} />
            <span className="text-sm">Tous</span>
          </div>
        </label>
        {categories.map((cat) => (
          <label
            key={cat.id}
            onClick={() => handleCategoryToggle(cat.id)}
            className="flex cursor-pointer items-center justify-between gap-2 rounded-md px-1 py-1 hover:bg-muted/50"
          >
            <div className="flex items-center gap-2">
              <Checkbox checked={searchQuery.categoryId === cat.id} />
              <span className="text-sm">{cat.name}s</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {categoryCounts[cat.id] ?? 0}
            </span>
          </label>
        ))}
      </div>

      {/* Note minimum */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold">Note minimum</h4>
        {[
          { label: "4.5 ★ et plus", val: 4.5 },
          { label: "4 ★ et plus", val: 4.0 },
          { label: "3.5 ★ et plus", val: 3.5 },
        ].map((item) => (
          <label
            key={item.val}
            onClick={() => handleRatingChange(item.val)}
            className="flex cursor-pointer items-center gap-2 rounded-md px-1 py-1 hover:bg-muted/50"
          >
            <input
              type="radio"
              name="rating"
              checked={searchFilters.ratingMin === item.val}
              onChange={() => handleRatingChange(item.val)}
              className="accent-emerald-700"
            />
            <span className="text-sm">{item.label}</span>
          </label>
        ))}
        {searchFilters.ratingMin && (
          <button
            onClick={() => handleRatingChange(undefined)}
            className="text-xs text-emerald-700 underline"
          >
            Effacer la note minimum
          </button>
        )}
      </div>

      {/* Équipements réels du store */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold">Équipements</h4>
        {visibleAmenities.map((amenity) => {
          const count = amenityCounts[amenity.id] ?? 0;
          const isChecked = searchFilters.amenityIds.includes(amenity.id);
          return (
            <label
              key={amenity.id}
              onClick={() => handleAmenityToggle(amenity.id)}
              className="flex cursor-pointer items-center justify-between gap-2 rounded-md px-1 py-1 hover:bg-muted/50"
            >
              <div className="flex items-center gap-2">
                <Checkbox checked={isChecked} />
                <span className="text-sm">{amenity.name}</span>
              </div>
              <span className="text-xs text-muted-foreground">{count}</span>
            </label>
          );
        })}
        {amenities.length > 5 && (
          <button
            onClick={() => setShowAllAmenities(!showAllAmenities)}
            className="flex items-center gap-1 text-xs font-medium text-emerald-700 hover:underline pt-1"
          >
            {showAllAmenities ? (
              <>
                Voir moins <ChevronUp className="h-3 w-3" />
              </>
            ) : (
              <>
                Voir plus ({amenities.length - 5}) <ChevronDown className="h-3 w-3" />
              </>
            )}
          </button>
        )}
      </div>

      {/* Bouton réinitialiser rapide */}
      <Button
        variant="outline"
        onClick={resetFilters}
        className="w-full text-xs font-medium text-slate-600 hover:bg-slate-100"
      >
        Réinitialiser tous les filtres
      </Button>
    </div>
  );
}