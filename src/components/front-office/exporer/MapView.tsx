"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Button } from "@/components/ui/button";
import { Star, MapPin, ExternalLink } from "lucide-react";
import {
  usePropertyStore,
  useFilteredEstablishments,
} from "@/store";
import { getCoverPhoto } from "@/utils/selectors";

// =====================================================================
// CORRECTION DES ICÔNES LEAFLET (bug classique avec Next.js)
// =====================================================================
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// =====================================================================
// ICÔNE PERSONNALISÉE AVEC PRIX
// =====================================================================
function createPriceIcon(price: number, isActive: boolean) {
  const bgColor = isActive ? "#065f46" : "#047857";
  const scale = isActive ? 1.15 : 1;
  const zIndex = isActive ? 999 : 1;

  return L.divIcon({
    className: "custom-price-marker",
    html: `
      <div style="
        display: inline-flex;
        align-items: center;
        gap: 2px;
        background: ${bgColor};
        color: white;
        padding: 4px 9px;
        border-radius: 999px;
        font-size: 11px;
        font-weight: 700;
        white-space: nowrap;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        border: 2px solid white;
        transform: scale(${scale});
        transition: transform 0.2s, background 0.2s;
        cursor: pointer;
        z-index: ${zIndex};
      ">
        ${price > 0 ? price.toLocaleString("fr-FR") : "Visiter"}
      </div>
    `,
    iconSize: [64, 28],
    iconAnchor: [32, 28],
    popupAnchor: [0, -28],
  });
}

// =====================================================================
// AUTO-FIT SUR LES RÉSULTATS FILTRÉS
// =====================================================================
function FitBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (positions.length === 0) return;
    if (positions.length === 1) {
      map.setView(positions[0], 12);
      return;
    }
    const bounds = L.latLngBounds(positions);
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
  }, [positions, map]);

  return null;
}

function InvalidateMapSize() {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();
    const observer = new ResizeObserver(() => map.invalidateSize({ pan: false }));
    observer.observe(container);
    const frame = requestAnimationFrame(() => map.invalidateSize({ pan: false }));

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [map]);

  return null;
}

// =====================================================================
// COMPOSANT PRINCIPAL
// =====================================================================
export function MapView() {
  const data = usePropertyStore((s) => s.data);
  const selectedId = usePropertyStore((s) => s.selectedEstablishmentId);
  const selectEstablishment = usePropertyStore((s) => s.selectEstablishment);
  const establishmentsLoaded = usePropertyStore((s) => s.establishmentsLoaded);
  const establishmentsLoading = usePropertyStore((s) => s.establishmentsLoading);
  const establishmentsError = usePropertyStore((s) => s.establishmentsError);
  const filteredEstablishments = useFilteredEstablishments();

  // Établissements avec coordonnées GPS valides
  const establishmentsWithCoords = useMemo(
    () =>
      filteredEstablishments.filter(
        (e) =>
          Number.isFinite(e.lat) &&
          Number.isFinite(e.lng) &&
          Math.abs(e.lat) <= 90 &&
          Math.abs(e.lng) <= 180 &&
          !(e.lat === 0 && e.lng === 0)
      ),
    [filteredEstablishments]
  );

  const positions = useMemo<[number, number][]>(
    () => establishmentsWithCoords.map((e) => [e.lat, e.lng]),
    [establishmentsWithCoords]
  );

  const defaultCenter: [number, number] = [6.3654, 2.4183]; // Cotonou

  return (
    <div className="relative sticky top-24 h-[calc(100vh-120px)] min-h-[400px] overflow-hidden rounded-xl border bg-muted/30 shadow-sm">
      <MapContainer
        center={defaultCenter}
        zoom={12}
        scrollWheelZoom={true}
        className="h-full w-full"
        style={{ zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        <InvalidateMapSize />
        {positions.length > 0 && <FitBounds positions={positions} />}

        {establishmentsWithCoords.map((est) => {
          const cover = getCoverPhoto(data, est.id);
          const isActive = est.id === selectedId;
          const price = est.price_per_night ?? est.price_per_month ?? 0;
          const category = est.category ?? data.Categories.find((c) => c.id === est.category_id);
          const subcategory = data.SubCategories.find(
            (sc) => sc.id === est.subcategory_id
          ) ?? est.subcategory;
          const categorySlug = category?.slug ?? "hebergement";
          const subPath = subcategory?.slug ? `/${subcategory.slug}` : "";
          const detailUrl = `/${categorySlug}${subPath}/${est.slug}`;

          return (
            <Marker
              key={est.id}
              position={[est.lat, est.lng]}
              icon={createPriceIcon(price, isActive)}
              eventHandlers={{
                click: () => selectEstablishment(est.id),
              }}
            >
              <Popup className="lr-popup" maxWidth={240}>
                <div className="w-[220px]">
                  {cover && (
                    <img
                      src={cover.url}
                      alt={est.name}
                      className="mb-2 h-28 w-full rounded-md object-cover"
                    />
                  )}
                  <h4 className="mb-0.5 text-sm font-bold line-clamp-1">{est.name}</h4>
                  <p className="mb-1 flex items-center gap-1 text-[11px] text-gray-500 line-clamp-1">
                    <MapPin className="h-3 w-3 shrink-0 text-emerald-600" />
                    {est.address}
                  </p>
                  <div className="mb-2 flex items-center gap-1">
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                    <span className="text-xs font-bold">{est.rating.toFixed(1)}</span>
                    <span className="text-[10px] text-gray-400">
                      ({est.review_count ?? est.review_ids.length} avis)
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between border-t border-gray-100 pt-1.5">
                    <span className="text-[10px] text-gray-500">
                      À partir de
                    </span>
                    <span className="text-xs font-bold text-emerald-800">
                      {price > 0 ? `${price.toLocaleString("fr-FR")} FCFA` : "Sur demande"}
                    </span>
                  </div>
                  <Button
                    asChild
                    size="sm"
                    className="mt-2.5 w-full bg-emerald-800 text-xs hover:bg-emerald-900"
                  >
                    <Link href={detailUrl} className="inline-flex items-center justify-center gap-1">
                      Voir le détail <ExternalLink className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      {(establishmentsLoading || !establishmentsLoaded || establishmentsError || establishmentsWithCoords.length === 0) && (
        <div
          role={establishmentsError ? "alert" : "status"}
          className={`absolute left-1/2 top-3 z-[1001] -translate-x-1/2 rounded-lg px-4 py-2 text-sm shadow ${
            establishmentsError ? "bg-red-50 text-red-800" : "bg-white/95 text-slate-600"
          }`}
        >
          {establishmentsLoading || (!establishmentsLoaded && !establishmentsError)
            ? "Chargement des établissements..."
            : establishmentsError ?? "Aucun établissement avec coordonnées GPS pour ces critères."}
        </div>
      )}
    </div>
  );
}