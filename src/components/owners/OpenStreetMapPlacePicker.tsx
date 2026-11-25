"use client";

import { useEffect, useRef, useState } from "react";
type NominatimResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
};

export function OpenStreetMapPlacePicker({
  onSelect,
}: {
  onSelect: (place: { address: string; latitude: number; longitude: number }) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortControllerRef.current?.abort(), []);

  async function searchPlaces() {
    const searchTerm = query.trim();

    if (searchTerm.length < 3) {
      setResults([]);
      setMessage("Saisissez au moins 3 caractères pour rechercher une adresse.");
      return;
    }

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    setLoading(true);
    setResults([]);
    setMessage("Recherche d’adresses OpenStreetMap...");

    try {
      const params = new URLSearchParams({
        q: searchTerm,
        format: "jsonv2",
        addressdetails: "1",
        limit: "5",
      });
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?${params.toString()}`,
        {
          headers: { "Accept-Language": "fr" },
          signal: controller.signal,
        },
      );

      if (!response.ok) {
        throw new Error(`Le service de recherche a répondu avec le statut ${response.status}.`);
      }

      const places = (await response.json()) as NominatimResult[];
      if (!Array.isArray(places)) {
        throw new Error("Le service de recherche a retourné une réponse invalide.");
      }

      setResults(places);
      setMessage(places.length ? "Choisissez une adresse dans les résultats." : "Aucune adresse trouvée.");
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "AbortError") return;
      setMessage(error instanceof Error
        ? `La recherche OpenStreetMap a échoué : ${error.message}`
        : "La recherche OpenStreetMap a échoué.");
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
        setLoading(false);
      }
    }
  }

  function selectPlace(place: NominatimResult) {
    const latitude = Number(place.lat);
    const longitude = Number(place.lon);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      setMessage("Ce résultat ne contient pas de coordonnées valides.");
      return;
    }

    onSelect({ address: place.display_name, latitude, longitude });
    setQuery(place.display_name);
    setResults([]);
    setMessage("Adresse et coordonnées renseignées depuis OpenStreetMap.");
  }

  function updateQuery(value: string) {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setLoading(false);
    setQuery(value);
    setResults([]);
    setMessage(null);
  }

  return (
    <div className="space-y-2 sm:col-span-2">
      <label htmlFor="osm-address-search" className="block text-sm font-medium text-slate-700">
        Rechercher une adresse avec OpenStreetMap
      </label>
      <div className="flex gap-2">
        <input
          id="osm-address-search"
          type="search"
          value={query}
          onChange={(event) => updateQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              void searchPlaces();
            }
          }}
          placeholder="Adresse, ville ou établissement"
          className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
        />
        <button
          type="button"
          onClick={() => void searchPlaces()}
          disabled={loading}
          className="shrink-0 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Recherche..." : "Rechercher"}
        </button>
      </div>
      {results.length > 0 && (
        <ul className="max-h-60 divide-y divide-slate-100 overflow-y-auto rounded-xl border border-slate-200 bg-white">
          {results.map((place) => (
            <li key={place.place_id}>
              <button
                type="button"
                onClick={() => selectPlace(place)}
                className="w-full px-3 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50"
              >
                {place.display_name}
              </button>
            </li>
          ))}
        </ul>
      )}
      {message && <p role="status" className="text-xs text-slate-500">{message}</p>}
      <p className="text-xs text-slate-500">
        Sélectionnez un résultat pour remplir automatiquement l’adresse, la latitude et la longitude. Données © OpenStreetMap.
      </p>
    </div>
  );
}
