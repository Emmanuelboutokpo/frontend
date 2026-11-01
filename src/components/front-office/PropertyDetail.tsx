"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  BedDouble,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  CookingPot,
  CreditCard,
  ExternalLink,
  Heart,
  LocateFixed,
  MapPin,
  Maximize2,
  Minus,
  Plus,
  ShieldCheck,
  Star,
  Users,
  UserRound,
  Wifi,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import AuthDialog from "@/components/front-office/AuthDialog";
import { useAuthStore, usePropertyStore } from "@/store";
import PropertyShowcase from "@/components/front-office/PropertyShowcase";
import { formatLocation } from "@/utils/selectors";

// =====================================================================
// IMPORT DYNAMIQUE DE LA CARTE (Leaflet = client only)
// =====================================================================
const PropertyMap = dynamic(
  () =>
    import("@/components/front-office/PropertyMap").then(
      (m) => m.PropertyMap
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-72 w-full animate-pulse rounded-2xl border bg-muted/30 sm:h-96" />
    ),
  }
);

// =====================================================================
// TYPES
// =====================================================================
type PropertyDetailProps = { slug: string };
type PendingAction = "favorite" | "reserve" | null;

// =====================================================================
// HELPERS
// =====================================================================
const amenityIcons: Record<string, typeof Wifi> = {
  wifi: Wifi,
  securite: ShieldCheck,
  parking: MapPin,
  climatisation: Check,
  piscine: Check,
  default: Check,
};

function RatingStars({ value }: { value: number }) {
  return (
    <span className="flex items-center gap-0.5 text-amber-500">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${index < Math.round(value) ? "fill-current" : ""}`}
        />
      ))}
    </span>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-gray-100 p-3">
      <Icon className="h-5 w-5 text-emerald-700" />
      <p className="mt-3 text-xs text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-bold text-slate-800">{value}</p>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-gray-100 p-4">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 font-semibold text-slate-800">{value}</p>
    </div>
  );
}

// =====================================================================
// COMPOSANT PRINCIPAL
// =====================================================================
export default function PropertyDetail({ slug }: PropertyDetailProps) {
  // ---- Store ----
  const data = usePropertyStore((state) => state.data);
  const favoriteIds = usePropertyStore((state) => state.favoriteIds);
  const toggleFavorite = usePropertyStore((state) => state.toggleFavorite);
  const similarEstablishments = usePropertyStore((state) => state.similarEstablishments);
  const fetchEstablishmentBySlug = usePropertyStore((state) => state.fetchEstablishmentBySlug);
  const fetchEstablishmentReviews = usePropertyStore((state) => state.fetchEstablishmentReviews);
  const fetchSimilarEstablishments = usePropertyStore((state) => state.fetchSimilarEstablishments);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const subcategorySlugs = Object.fromEntries(
    data.SubCategories.map((item) => [item.id, item.slug])
  );

  // ---- États locaux ----
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [relatedError, setRelatedError] = useState("");
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);
  const [authOpen, setAuthOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [calendarTarget, setCalendarTarget] = useState<
    "checkIn" | "checkOut" | null
  >(null);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setLoadError("");
    setRelatedError("");

    void fetchEstablishmentBySlug(slug)
      .then((establishment) => {
        if (!active) return;
        setIsLoading(false);
        void fetchEstablishmentReviews(establishment.id).catch((error: unknown) => {
          if (active) setRelatedError(error instanceof Error ? error.message : "Impossible de charger les avis.");
        });
        void fetchSimilarEstablishments(establishment.id).catch((error: unknown) => {
          if (active) setRelatedError(error instanceof Error ? error.message : "Impossible de charger les établissements similaires.");
        });
      })
      .catch((error: unknown) => {
        if (!active) return;
        setLoadError(error instanceof Error ? error.message : "Impossible de charger cet établissement.");
        setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [fetchEstablishmentBySlug, fetchEstablishmentReviews, fetchSimilarEstablishments, slug]);

  // ---- Récupération de l'établissement ----
  const property = data.Establishments.find((item) => item.slug === slug);

  if (isLoading) {
    return <main className="mx-auto max-w-3xl px-4 py-24 text-center text-slate-600">Chargement de l’établissement...</main>;
  }

  if (loadError) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Impossible de charger cet établissement</h1>
        <p role="alert" className="mt-3 text-sm text-red-700">{loadError}</p>
        <Button asChild className="mt-6 rounded-full bg-emerald-700">
          <Link href="/explorer">Retour aux établissements</Link>
        </Button>
      </main>
    );
  }

  // ---- Cas : établissement introuvable ----
  if (!property) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Établissement introuvable</h1>
        <Button asChild className="mt-6 rounded-full bg-emerald-700">
          <Link href="/">Retour à l'accueil</Link>
        </Button>
      </main>
    );
  }

  // ---- Données liées ----
  const country = data.Countries.find((item) => item.id === property.country_id);
  const category = data.Categories.find(
    (item) => item.id === property.category_id
  ) ?? property.category;
  const subcategory = data.SubCategories.find(
    (item) => item.id === property.subcategory_id
  ) ?? property.subcategory;
  const commune = data.Communes.find((item) => item.id === property.commune_id);
  const locality = data.Localities.find(
    (item) => item.id === property.locality_id
  );
  const photos = data.Photos.filter(
    (photo) =>
      property.photo_ids.includes(photo.id) ||
      photo.establishment_id === property.id
  ).sort((first, second) => Number(second.is_cover) - Number(first.is_cover));
  const reviews = data.Reviews.filter((review) =>
    property.review_ids.includes(review.id)
  );
  const amenities = data.Amenities.filter((amenity) =>
    property.amenity_ids.includes(amenity.id)
  );

  // ---- État favori ----
  const favorite = favoriteIds.includes(property.id);

  // ---- Galerie ----
  const currentPhoto = photos[activePhoto];
  const price = property.price ?? property.price_per_night ?? property.price_per_month;
  const priceUnit = property.price_unit?.replaceAll("_", " ").toLowerCase()
    ?? (property.price_per_night ? "nuit" : property.price_per_month ? "mois" : null);
  const isNightlyRate = Boolean(priceUnit?.includes("nuit") || priceUnit?.includes("night"));

  // ---- Calculs de réservation ----
  const nights =
    checkIn && checkOut
      ? Math.max(
          0,
          Math.ceil(
            (new Date(`${checkOut}T00:00:00`).getTime() -
              new Date(`${checkIn}T00:00:00`).getTime()) /
              86400000
          )
        )
      : 0;

  const totalAmount = price && isNightlyRate && nights > 0
    ? price * nights * (priceUnit?.includes("personne") ? guests : 1)
    : price && !isNightlyRate
      ? price * guests
      : 0;

  const reservationParams = new URLSearchParams({
    checkIn,
    checkOut,
    guests: String(guests),
  });

  // ---- Calendrier ----
  const selectedCalendarDate =
    calendarTarget === "checkIn" ? checkIn : checkOut;
  const calendarDate = selectedCalendarDate
    ? new Date(`${selectedCalendarDate}T00:00:00`)
    : undefined;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const calendarMinimum =
    calendarTarget === "checkOut" && checkIn
      ? new Date(`${checkIn}T00:00:00`)
      : today;

  // ---- URLs ----
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${property.lat},${property.lng}`;
  const paymentConditions = property.payment_conditions?.length
    ? property.payment_conditions
    : data.PaymentConditions.filter((condition) =>
        property.payment_condition_ids.includes(condition.id)
      );

  // =====================================================================
  // HANDLERS
  // =====================================================================
  const handleFavoriteClick = () => {
    if (isAuthenticated) {
      toggleFavorite(property.id);
    } else {
      setPendingAction("favorite");
      setAuthOpen(true);
    }
  };

  const handleReserveClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setPendingAction("reserve");
      setAuthOpen(true);
    }
  };

  const scrollToBooking = () => {
    document
      .getElementById("booking-panel")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // =====================================================================
  // RENDER
  // =====================================================================
  return (
    <main className="min-h-screen bg-slate-50 pb-16 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 pt-5 sm:px-6 lg:px-12">
        {/* ============================================================ */}
        {/* HEADER : Retour + Favori + CTA mobile                        */}
        {/* ============================================================ */}
        <div className="flex items-center justify-between gap-4 py-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-emerald-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux établissements
          </Link>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              className="rounded-full bg-emerald-700 hover:bg-emerald-800 lg:hidden"
              onClick={scrollToBooking}
            >
              <CalendarDays className="mr-2 h-4 w-4" />
              Réserver
            </Button>

            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label={favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
              onClick={handleFavoriteClick}
              className={`rounded-full bg-white ${
                favorite ? "text-rose-500" : "text-slate-600"
              }`}
            >
              <Heart className={favorite ? "fill-current" : ""} />
            </Button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* TITRE + NOTE                                                 */}
        {/* ============================================================ */}
        <header className="mt-7 flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-emerald-800">
              {category?.name}
              {subcategory ? ` · ${subcategory.name}` : ""}
            </p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
              {property.name}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <p className="flex items-center gap-2 text-sm text-slate-500">
                <MapPin className="h-4 w-4 text-emerald-700" />
                {[property.address, country?.name ?? property.location_name]
                  .filter(Boolean)
                  .join(" · ")}
              </p>

              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                property.availability_status === "AVAILABLE"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-slate-100 text-slate-600"
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${
                  property.availability_status === "AVAILABLE" ? "bg-emerald-500" : "bg-slate-400"
                }`} />
                {property.availability_status === "AVAILABLE" ? "Disponible" : "Indisponible"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-amber-50 px-4 py-3 text-sm">
            {property.review_count || reviews.length ? (
              <>
                <RatingStars value={property.rating} />
                <strong>{property.rating.toFixed(1)}</strong>
                <span className="text-slate-500">({property.review_count ?? reviews.length} avis)</span>
              </>
            ) : (
              <>
                <Star className="h-4 w-4 text-amber-500" />
                <span className="font-semibold text-slate-700">Soyez le premier à donner votre avis</span>
              </>
            )}
          </div>
        </header>

        {/* ============================================================ */}
        {/* GALERIE PHOTOS                                               */}
        {/* ============================================================ */}
        <section className="mt-6" aria-label="Galerie photos">
          {photos.length > 0 ? (
            <div className="overflow-hidden rounded-[1.75rem] bg-white p-2 shadow-sm ring-1 ring-slate-200 sm:p-3">
              <div className="grid gap-2 sm:gap-3 lg:h-[32rem] lg:grid-cols-[1.35fr_1fr]">
                <button
                  type="button"
                  onClick={() => {
                    setActivePhoto(0);
                    setGalleryOpen(true);
                  }}
                  aria-label={`Ouvrir la galerie de ${property.name}, photo 1`}
                  className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100 text-left lg:aspect-auto"
                >
                  <img
                    src={photos[0].url}
                    alt={property.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-slate-950/10" />
                  <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold text-slate-800 shadow-sm sm:left-5 sm:top-5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                    Photo de couverture
                  </span>
                  <span className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 text-white sm:bottom-5 sm:left-5 sm:right-5">
                    <span className="min-w-0">
                      <span className="block truncate text-lg font-extrabold sm:text-2xl">{property.name}</span>
                      <span className="mt-1 flex items-center gap-1.5 truncate text-xs font-medium text-white/85 sm:text-sm">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        {property.address || country?.name || "Découvrir l’établissement"}
                      </span>
                    </span>
                    <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-bold text-slate-900 shadow-lg transition group-hover:bg-emerald-50">
                      <Maximize2 className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Voir les photos</span>
                      <span className="sm:hidden">{photos.length}</span>
                    </span>
                  </span>
                </button>

                <div className={`hidden min-h-0 gap-2 sm:gap-3 lg:grid ${
                  photos.length <= 2 ? "grid-cols-1 grid-rows-2" : "grid-cols-2 grid-rows-2"
                }`}>
                  {photos.slice(1, photos.length > 4 ? 4 : photos.length).map((photo, index) => (
                      <button
                        type="button"
                        key={photo.id}
                        onClick={() => {
                          setActivePhoto(index + 1);
                          setGalleryOpen(true);
                        }}
                        aria-label={`Ouvrir la galerie, photo ${index + 2}`}
                        className="group relative min-h-0 overflow-hidden rounded-xl bg-slate-100 text-left"
                      >
                        <img
                          src={photo.url}
                          alt={`${property.name} — photo ${index + 2}`}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                        <span className="absolute inset-0 bg-transparent transition group-hover:bg-slate-950/10" />
                      </button>
                  ))}
                  {photos.length <= 4 && (
                    <button
                      type="button"
                      onClick={() => {
                        setActivePhoto(0);
                        setGalleryOpen(true);
                      }}
                      className={`group relative min-h-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 ${
                        photos.length === 3 ? "col-span-2" : ""
                      }`}
                    >
                      <span className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                        <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-emerald-700 shadow-sm transition group-hover:scale-105">
                          <Maximize2 className="h-5 w-5" />
                        </span>
                        <span className="text-xs font-bold">Afficher les {photos.length} photos</span>
                      </span>
                    </button>
                  )}
                  {photos.length > 4 && (
                    <button
                      type="button"
                      onClick={() => {
                        setActivePhoto(4);
                        setGalleryOpen(true);
                      }}
                      className="group relative min-h-0 overflow-hidden rounded-xl bg-slate-100 text-white"
                    >
                      <img src={photos[4].url} alt={`${property.name} — photo 5`} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                      <span className="absolute inset-0 grid place-items-center bg-slate-950/55 transition group-hover:bg-slate-950/65">
                        <span className="flex flex-col items-center gap-2">
                          <Maximize2 className="h-5 w-5" />
                          <span className="text-sm font-extrabold">+{photos.length - 4} photos</span>
                        </span>
                      </span>
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-2 flex gap-2 overflow-x-auto pb-1 sm:mt-3 sm:gap-3 lg:hidden">
                {photos.slice(1).map((photo, index) => (
                  <button
                    type="button"
                    key={photo.id}
                    onClick={() => {
                      setActivePhoto(index + 1);
                      setGalleryOpen(true);
                    }}
                    aria-label={`Ouvrir la galerie, photo ${index + 2}`}
                    className="group relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-slate-100"
                  >
                    <img
                      src={photo.url}
                      alt={`${property.name} — photo ${index + 2}`}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    {index === photos.length - 2 && (
                      <span className="absolute inset-0 grid place-items-center bg-slate-950/45 text-[11px] font-bold text-white">
                        <span className="inline-flex items-center gap-1.5"><Maximize2 className="h-3.5 w-3.5" />Toutes les photos</span>
                      </span>
                    )}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setActivePhoto(0);
                    setGalleryOpen(true);
                  }}
                  className="inline-flex h-20 shrink-0 items-center gap-2 rounded-xl border border-slate-200 px-4 text-xs font-bold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50"
                >
                  <Maximize2 className="h-4 w-4 text-emerald-700" />
                  {photos.length} photos
                </button>
              </div>
            </div>
          ) : (
            <div className="grid h-72 place-items-center rounded-3xl border border-slate-200 bg-white text-center shadow-sm">
              <div>
                <MapPin className="mx-auto h-10 w-10 text-emerald-700" />
                <p className="mt-3 font-semibold text-slate-600">Photos bientôt disponibles</p>
              </div>
            </div>
          )}
        </section>

        {/* ============================================================ */}
        {/* CONTENU PRINCIPAL + SIDEBAR                                  */}
        {/* ============================================================ */}
        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
          {/* -------------------------------------------------------- */}
          {/* COLONNE GAUCHE                                            */}
          {/* -------------------------------------------------------- */}
          <div className="space-y-10">
            <section className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {property.max_guests > 0 && (
                <InfoItem icon={Users} label="Capacité" value={`${property.max_guests} personne${property.max_guests > 1 ? "s" : ""}`} />
              )}
              {property.rooms_count != null && property.rooms_count > 0 && (
                <InfoItem icon={BedDouble} label={category?.slug === "hebergement" ? "Chambres" : "Espaces"} value={String(property.rooms_count)} />
              )}
              {property.area > 0 && (
                <InfoItem icon={Maximize2} label="Surface" value={`${property.area} m²`} />
              )}
              {property.cuisine_type && (
                <InfoItem icon={CookingPot} label="Cuisine" value={property.cuisine_type} />
              )}
              <InfoItem
                icon={BadgeCheck}
                label="Disponibilité"
                value={property.availability_status === "AVAILABLE" ? "Disponible" : "Indisponible"}
              />
            </section>

            {/* À propos */}
            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">À découvrir</p>
              <h2 className="mt-2 text-2xl font-extrabold">À propos de {property.name}</h2>
              <p className="mt-4 max-w-3xl whitespace-pre-line text-[15px] leading-7 text-slate-600">
                {property.description || "Aucune description n’a encore été ajoutée pour cet établissement."}
              </p>
            </section>

            {/* Équipements */}
            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Sur place</p>
                <h2 className="mt-2 text-2xl font-extrabold">Équipements et services</h2>
                {amenities.length > 0 ? (
                <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {amenities.map((amenity) => {
                    const Icon =
                      amenityIcons[amenity.slug] ?? amenityIcons.default;
                    return (
                      <div
                        key={amenity.id}
                        className="flex items-center gap-3 text-sm text-slate-700"
                      >
                        <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-50 text-emerald-700">
                          <Icon className="h-4 w-4" />
                        </span>
                        {amenity.name}
                      </div>
                    );
                  })}
                </div>
                ) : (
                  <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">Aucun équipement n’a été renseigné pour le moment.</p>
                )}
            </section>

            {/* Informations pratiques */}
            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Avant de venir</p>
              <h2 className="mt-2 text-2xl font-extrabold">Informations pratiques</h2>
              <div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                <DetailRow
                  label="Horaires"
                  value={
                    typeof property.opening_hours === "string"
                      ? property.opening_hours
                      : property.opening_hours
                        ? Object.entries(property.opening_hours).map(([day, hours]) => `${day}: ${String(hours)}`).join(" · ")
                        : "Non renseignés"
                  }
                />
                {property.bathrooms > 0 && <DetailRow label="Salles de bain" value={String(property.bathrooms)} />}
                <DetailRow label="Type" value={[category?.name, subcategory?.name].filter(Boolean).join(" · ") || "Établissement"} />
                {property.phone && <DetailRow label="Téléphone" value={property.phone} />}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Conditions</p>
              <h2 className="mt-2 text-2xl font-extrabold">Conditions de paiement</h2>
              {paymentConditions.length > 0 ? (
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {paymentConditions.map((condition) => (
                    <li key={condition.id} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 text-sm font-medium text-slate-700">
                      <CreditCard className="h-5 w-5 shrink-0 text-emerald-700" />
                      {condition.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">Les modalités de paiement seront communiquées par l’établissement.</p>
              )}
            </section>

            {property.owner && (
              <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Votre hôte</p>
                <div className="mt-4 flex items-center gap-4">
                  {property.owner.avatar_url ? (
                    <img src={property.owner.avatar_url} alt="" className="h-14 w-14 rounded-full object-cover" />
                  ) : (
                    <span className="grid h-14 w-14 place-items-center rounded-full bg-emerald-50 text-emerald-700"><UserRound className="h-6 w-6" /></span>
                  )}
                  <div>
                    <h2 className="text-lg font-bold">{[property.owner.first_name, property.owner.last_name].filter(Boolean).join(" ") || "Propriétaire"}</h2>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500"><BadgeCheck className="h-4 w-4 text-emerald-700" /> Propriétaire de l’établissement</p>
                  </div>
                </div>
              </section>
            )}

            {/* ==================================================== */}
            {/* EMPLACEMENT — LEAFLET MAP                            */}
            {/* ==================================================== */}
            <section
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
              aria-labelledby="location-title"
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
                    Emplacement
                  </p>
                  <h2 id="location-title" className="mt-1 text-2xl font-bold">
                    Où se trouve l'établissement ?
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {[locality?.name, commune?.name, property.address, country?.name ?? property.location_name]
                      .filter(Boolean)
                      .join(", ") || "Adresse non renseignée"}
                  </p>
                </div>

                <Button
                  asChild
                  variant="outline"
                  className="w-fit rounded-full border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                >
                  <a href={directionsUrl} target="_blank" rel="noreferrer">
                    <LocateFixed className="mr-2 h-4 w-4" />
                    Itinéraire
                    <ExternalLink className="ml-2 h-3.5 w-3.5" />
                  </a>
                </Button>
              </div>

              <div className="mt-5">
               <PropertyMap
  // Infos de base
  name={property.name}
  address={[property.address, country?.name ?? property.location_name].filter(Boolean).join(", ")}
  lat={property.lat}
  lng={property.lng}
  directionsUrl={directionsUrl}
  // Infos enrichies
  price={price ?? null}
  currency={property.currency}
  priceUnit={
    isNightlyRate ? "nuit" : priceUnit === "mois" || priceUnit === "month" ? "mois" : "personne"
  }
  rating={property.rating}
  reviewCount={reviews.length}
  typeName={subcategory?.name ?? category?.name}
  coverUrl={photos[0]?.url}
  detailUrl={`/${category?.slug ?? "hebergement"}${
    subcategory?.slug ? `/${subcategory.slug}` : ""
  }/${property.slug}`}
/>
              </div>
            </section>

            {/* Avis */}
              <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Expériences</p>
                    <h2 className="mt-2 text-2xl font-extrabold">Avis des voyageurs</h2>
                    <div className="mt-2 flex items-center gap-2">
                      <RatingStars value={property.rating} />
                      {property.review_count || reviews.length ? <strong>{property.rating.toFixed(1)} / 5</strong> : <span className="text-sm text-slate-500">Aucune note pour le moment</span>}
                    </div>
                  </div>
                  <span className="text-sm text-slate-500">
                    {property.review_count ?? reviews.length} avis
                  </span>
                </div>

                {reviews.length > 0 ? <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {reviews.map((review) => (
                    <article
                      key={review.id}
                      className="rounded-xl border border-slate-200 bg-white p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <strong className="text-sm">{review.author_name}</strong>
                        <span className="text-xs text-slate-400">
                          {new Date(review.created_at).toLocaleDateString(
                            "fr-FR"
                          )}
                        </span>
                      </div>
                      <RatingStars value={review.rating} />
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {review.comment}
                      </p>
                    </article>
                  ))}
                </div> : <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">Aucun avis n’a encore été publié. Découvrez le lieu et partagez votre expérience après votre visite.</p>}
              </section>

            {similarEstablishments.some((establishment) => establishment.id !== property.id) && (
              <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">À proximité de vos envies</p>
                <h2 className="mt-2 text-2xl font-extrabold">Établissements similaires</h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {similarEstablishments
                    .filter((establishment) => establishment.id !== property.id)
                    .map((establishment) => {
                      const similarCategory = data.Categories.find(
                        (item) => item.id === establishment.category_id
                      );
                      const similarSubcategory = data.SubCategories.find(
                        (item) => item.id === establishment.subcategory_id
                      );
                      const cover = data.Photos.find(
                        (photo) => photo.establishment_id === establishment.id && photo.is_cover
                      );
                      return (
                        <PropertyShowcase
                          key={establishment.id}
                          property={establishment}
                          photo={cover}
                          subcategorySlugs={subcategorySlugs}
                          typeName={similarSubcategory?.name ?? similarCategory?.name ?? "Établissement"}
                          location={formatLocation(data, establishment) || establishment.address}
                        />
                      );
                    })}
                </div>
              </section>
            )}
            {relatedError && <p role="alert" className="text-sm text-red-700">{relatedError}</p>}
          </div>

          {/* -------------------------------------------------------- */}
          {/* SIDEBAR RÉSERVATION                                      */}
          {/* -------------------------------------------------------- */}
          <aside
            id="booking-panel"
            className="h-fit lg:sticky lg:top-24"
          >
            <div className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-xl shadow-emerald-950/5">
              <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 p-5 text-white">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-100">Réservez votre expérience</p>
                <p className="mt-3 text-3xl font-extrabold tracking-tight">
                  {price != null && price > 0 ? `${price.toLocaleString("fr-FR")} ${property.currency}` : "Tarif sur demande"}
                </p>
                {price != null && price > 0 && <p className="mt-1 text-sm capitalize text-emerald-100">par {priceUnit ?? "prestation"}</p>}
                <div className="mt-4 flex items-center gap-2 text-sm text-emerald-50">
                  <BadgeCheck className="h-4 w-4" />
                  {property.availability_status === "AVAILABLE" ? "Disponible à la réservation" : "Actuellement indisponible"}
                </div>
              </div>
              <div className="space-y-4 p-5">
                {isNightlyRate && (
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => setCalendarTarget("checkIn")} className="rounded-xl border border-slate-200 p-3 text-left transition hover:border-emerald-500">
                      <span className="block text-[11px] font-semibold uppercase tracking-wide text-slate-400">Arrivée</span>
                      <span className="mt-1 block text-sm font-bold text-slate-800">{checkIn || "Choisir"}</span>
                    </button>
                    <button type="button" onClick={() => setCalendarTarget("checkOut")} className="rounded-xl border border-slate-200 p-3 text-left transition hover:border-emerald-500">
                      <span className="block text-[11px] font-semibold uppercase tracking-wide text-slate-400">Départ</span>
                      <span className="mt-1 block text-sm font-bold text-slate-800">{checkOut || "Choisir"}</span>
                    </button>
                  </div>
                )}
                <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                  <div>
                    <span className="block text-sm font-bold text-slate-800">{isNightlyRate ? "Voyageurs" : "Participants"}</span>
                    <span className="mt-0.5 block text-xs text-slate-500">Nombre de personnes</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button type="button" variant="outline" size="icon" className="h-8 w-8 rounded-full" aria-label="Retirer une personne" disabled={guests <= 1} onClick={() => setGuests((count) => Math.max(1, count - 1))}><Minus className="h-3.5 w-3.5" /></Button>
                    <span className="min-w-4 text-center text-sm font-bold">{guests}</span>
                    <Button type="button" variant="outline" size="icon" className="h-8 w-8 rounded-full" aria-label="Ajouter une personne" disabled={property.max_guests > 0 && guests >= property.max_guests} onClick={() => setGuests((count) => property.max_guests > 0 ? Math.min(property.max_guests, count + 1) : count + 1)}><Plus className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>
                {totalAmount > 0 && (
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-sm">
                    <span className="text-slate-500">Estimation {isNightlyRate ? `(${nights} nuit${nights > 1 ? "s" : ""})` : `(${guests} personne${guests > 1 ? "s" : ""})`}</span>
                    <strong className="text-slate-900">{totalAmount.toLocaleString("fr-FR")} {property.currency}</strong>
                  </div>
                )}

              <Button
                asChild
                disabled={property.availability_status !== "AVAILABLE"}
                className="h-12 w-full rounded-xl bg-emerald-700 font-bold shadow-sm hover:bg-emerald-800"
              >
                <Link
                  href={`/reservation/${property.id}?${reservationParams.toString()}`}
                  onClick={handleReserveClick}
                >
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {property.availability_status === "AVAILABLE" ? "Continuer la réservation" : "Indisponible"}
                </Link>
              </Button>

              <p className="text-center text-xs leading-5 text-slate-400">
                {isNightlyRate ? "Les dates et le montant définitif seront confirmés à l’étape suivante." : "Les détails et modalités seront confirmés à l’étape suivante."}
              </p>
              <p className="flex items-center justify-center gap-1.5 text-xs text-slate-500"><ShieldCheck className="h-3.5 w-3.5 text-emerald-700" /> Réservation en toute confiance</p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ============================================================ */}
      {/* DIALOG CALENDRIER                                            */}
      {/* ============================================================ */}

      <Dialog
        open={calendarTarget !== null}
        onOpenChange={(open) => {
          if (!open) setCalendarTarget(null);
        }}
      >
        <DialogContent className="w-fit max-w-[calc(100%-2rem)] rounded-2xl p-2 sm:p-4">
          <DialogTitle>
            {calendarTarget === "checkIn"
              ? "Date d'arrivée"
              : "Date de départ"}
          </DialogTitle>
          <Calendar
            mode="single"
            selected={calendarDate}
            onSelect={(date) => {
              if (!date) return;
              const value = date.toISOString().slice(0, 10);
              if (calendarTarget === "checkIn") {
                setCheckIn(value);
                if (checkOut && date >= new Date(`${checkOut}T00:00:00`))
                  setCheckOut("");
              } else setCheckOut(value);
              setCalendarTarget(null);
            }}
            disabled={{ before: calendarMinimum }}
          />
        </DialogContent>
      </Dialog>

      {/* ============================================================ */}
      {/* DIALOG GALERIE                                               */}
      {/* ============================================================ */}
      <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
        <DialogContent className="w-[calc(100vw-1rem)] max-w-6xl border border-white/10 bg-slate-950 p-3 text-white sm:w-[calc(100vw-3rem)] sm:rounded-3xl sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-3 pr-9">
            <div className="min-w-0">
              <DialogTitle className="truncate text-base font-bold text-white">{property.name}</DialogTitle>
              <p className="mt-1 text-xs text-white/60">Galerie photos</p>
            </div>
            <span className="shrink-0 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/80">
              {activePhoto + 1} / {photos.length}
            </span>
          </div>
          <div className="relative grid min-h-[45vh] place-items-center overflow-hidden rounded-2xl bg-black sm:min-h-[60vh]">
            {currentPhoto && (
              <img
                src={currentPhoto.url}
                alt={property.name}
                className="max-h-[65vh] w-full object-contain sm:max-h-[68vh]"
              />
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Fermer la galerie"
              onClick={() => setGalleryOpen(false)}
              className="absolute right-2 top-2 rounded-full bg-black/50 text-white hover:bg-black/70"
            >
              <X />
            </Button>

            {photos.length > 1 && (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Photo précédente"
                  onClick={() =>
                    setActivePhoto(
                      (index) => (index - 1 + photos.length) % photos.length
                    )
                  }
                      className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/60 text-white shadow-lg hover:bg-black/80"
                >
                  <ChevronLeft />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Photo suivante"
                  onClick={() =>
                    setActivePhoto((index) => (index + 1) % photos.length)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/60 text-white shadow-lg hover:bg-black/80"
                >
                  <ChevronRight />
                </Button>
              </>
            )}
          </div>
          {photos.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {photos.map((photo, index) => (
                <button
                  type="button"
                  key={photo.id}
                  onClick={() => setActivePhoto(index)}
                  aria-label={`Afficher la photo ${index + 1}`}
                  aria-current={activePhoto === index ? "true" : undefined}
                  className={`h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition sm:h-16 sm:w-24 ${
                    activePhoto === index ? "border-emerald-400 opacity-100" : "border-transparent opacity-55 hover:opacity-90"
                  }`}
                >
                  <img src={photo.url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ============================================================ */}
      {/* DIALOG AUTH                                                  */}
      {/* ============================================================ */}
      <AuthDialog
        open={authOpen}
        onOpenChange={(open) => {
          setAuthOpen(open);
          if (!open) setPendingAction(null);
        }}
        onAuthenticated={() => {
          if (pendingAction === "favorite") toggleFavorite(property.id);
          if (pendingAction === "reserve")
            window.location.href = `/reservation/${property.id}?${reservationParams.toString()}`;
          setPendingAction(null);
        }}
        title="Connectez-vous pour continuer"
      />
    </main>
  );
}