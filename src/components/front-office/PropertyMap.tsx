"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";
import { MapPin, Star, ExternalLink, ArrowRight } from "lucide-react";

// =====================================================================
// FIX ICÔNES LEAFLET
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
function createPriceIcon(price: number | null, currency: string, isActive = false) {
  const bgColor = isActive ? "#065f46" : "#047857";
  const label =
    price && price > 0
      ? `${price.toLocaleString("fr-FR")}`
      : "Visiter";

  return L.divIcon({
    className: "custom-price-marker-detail",
    html: `
      <div style="
        display: inline-flex;
        align-items: center;
        gap: 2px;
        background: ${bgColor};
        color: white;
        padding: 6px 12px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 700;
        white-space: nowrap;
        box-shadow: 0 3px 10px rgba(0,0,0,0.3);
        border: 2px solid white;
        cursor: pointer;
        font-family: inherit;
      ">
        ${label}${price && price > 0 ? ` ${currency}` : ""}
      </div>
    `,
    iconSize: [80, 32],
    iconAnchor: [40, 32],
    popupAnchor: [0, -32],
  });
}

// =====================================================================
// RECENTRER LA CARTE QUAND LA POSITION CHANGE
// =====================================================================
function RecenterOnChange({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 15, { animate: true });
  }, [lat, lng, map]);
  return null;
}

// =====================================================================
// PROPS
// =====================================================================
interface PropertyMapProps {
  // Infos de base
  name: string;
  address: string;
  lat: number;
  lng: number;
  directionsUrl: string;

  // Infos enrichies pour le popup
  price: number | null;
  currency: string;
  priceUnit?: "nuit" | "mois" | "personne";
  rating: number;
  reviewCount: number;
  typeName?: string;
  coverUrl?: string;
  detailUrl?: string;
}

// =====================================================================
// COMPOSANT
// =====================================================================
export function PropertyMap({
  name,
  address,
  lat,
  lng,
  directionsUrl,
  price,
  currency,
  priceUnit = "nuit",
  rating,
  reviewCount,
  typeName,
  coverUrl,
  detailUrl,
}: PropertyMapProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        scrollWheelZoom={false}
        className="h-72 w-full sm:h-96"
        style={{ zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        <RecenterOnChange lat={lat} lng={lng} />

        <Marker
          position={[lat, lng]}
          icon={createPriceIcon(price, currency)}
        >
          <Popup className="lr-popup" maxWidth={260} autoPan={true}>
            <div className="w-[240px]">
              {/* Photo de couverture */}
              {coverUrl && (
                <div className="relative mb-2.5 h-32 w-full overflow-hidden rounded-lg bg-slate-100">
                  <img
                    src={coverUrl}
                    alt={name}
                    className="h-full w-full object-cover"
                  />
                  {typeName && (
                    <span className="absolute bottom-2 left-2 rounded-md bg-white/95 px-2 py-0.5 text-[10px] font-semibold text-slate-700 shadow-sm backdrop-blur">
                      {typeName}
                    </span>
                  )}
                </div>
              )}

              {/* Nom */}
              <h4 className="mb-1 line-clamp-1 text-sm font-bold text-slate-900">
                {name}
              </h4>

              {/* Adresse */}
              <p className="mb-2 flex items-start gap-1 text-[11px] text-slate-500">
                <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-emerald-600" />
                <span className="line-clamp-2">{address}</span>
              </p>

              {/* Note + avis */}
              <div className="mb-2 flex items-center gap-1.5">
                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                <span className="text-xs font-bold text-slate-800">
                  {rating.toFixed(1)}
                </span>
                <span className="text-[10px] text-slate-400">
                  ({reviewCount} avis)
                </span>
              </div>

              {/* Prix */}
              <div className="mb-3 flex items-baseline justify-between border-t border-slate-100 pt-2">
                <span className="text-[10px] text-slate-500">
                  À partir de
                </span>
                <span className="text-sm font-bold text-emerald-800">
                  {price && price > 0
                    ? `${price.toLocaleString("fr-FR")} ${currency}`
                    : "Sur demande"}
                  {price && price > 0 && (
                    <span className="ml-1 text-[10px] font-normal text-slate-400">
                      / {priceUnit}
                    </span>
                  )}
                </span>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-1.5">
                {detailUrl && (
                  <Link
                    href={detailUrl}
                    style={{color : '#fff'}}
                    className="inline-flex w-full items-center justify-center gap-1.5 leaflet-text! rounded-md bg-emerald-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-800"
                  >
                    Voir les détails
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                )}
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <ExternalLink className="h-3 w-3" />
                  Itinéraire
                </a>
              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}