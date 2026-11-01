"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, CalendarDays, MapPin, Users, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { usePropertyStore } from "@/store/propertyStore";
import { useCustomerReservationsStore } from "@/store/useCustomerReservationsStore";

const STATUS: Record<string, { label: string; className: string }> = {
  EN_ATTENTE: { label: "En attente", className: "bg-amber-50 text-amber-700" },
  CONFIRMEE: { label: "Confirmée", className: "bg-emerald-50 text-emerald-700" },
  EN_COURS: { label: "En cours", className: "bg-blue-50 text-blue-700" },
  TERMINEE: { label: "Terminée", className: "bg-slate-100 text-slate-600" },
  REFUSEE: { label: "Refusée", className: "bg-rose-50 text-rose-700" },
  ANNULEE: { label: "Annulée", className: "bg-rose-50 text-rose-700" },
  EXPIREE: { label: "Expirée", className: "bg-slate-100 text-slate-600" },
};

function formatDate(value: string | null): string {
  if (!value) return "À confirmer";
  return new Date(`${value.slice(0, 10)}T00:00:00`).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function ReservationDetailPage() {
  const params = useParams<{ id: string }>();
  const reference = params.id;
  const data = usePropertyStore((state) => state.data);
  const establishmentsLoaded = usePropertyStore((state) => state.establishmentsLoaded);
  const establishmentsLoading = usePropertyStore((state) => state.establishmentsLoading);
  const establishmentsError = usePropertyStore((state) => state.establishmentsError);
  const fetchEstablishments = usePropertyStore((state) => state.fetchEstablishments);
  const reservation = useCustomerReservationsStore((state) => state.selectedReservation);
  const isLoading = useCustomerReservationsStore((state) => state.isDetailLoading);
  const error = useCustomerReservationsStore((state) => state.detailError);
  const isCancelling = useCustomerReservationsStore((state) => state.isCancelling);
  const cancelError = useCustomerReservationsStore((state) => state.cancelError);
  const loadByReference = useCustomerReservationsStore((state) => state.loadByReference);
  const cancelReservation = useCustomerReservationsStore((state) => state.cancel);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    if (!reference) return;
    void loadByReference(reference).catch(() => undefined);
  }, [loadByReference, reference]);

  useEffect(() => {
    if (!establishmentsLoaded && !establishmentsLoading) {
      void fetchEstablishments().catch(() => undefined);
    }
  }, [establishmentsLoaded, establishmentsLoading, fetchEstablishments]);

  const establishment = reservation
    ? data.Establishments.find((item) => String(item.id) === reservation.establishment_id)
    : undefined;
  const category = establishment
    ? data.Categories.find((item) => item.id === establishment.category_id) ?? establishment.category
    : undefined;
  const subcategory = establishment
    ? data.SubCategories.find((item) => item.id === establishment.subcategory_id) ?? establishment.subcategory
    : undefined;
  const photo = reservation
    ? data.Photos.find((item) => item.establishment_id === reservation.establishment_id && item.is_cover)
      ?? data.Photos.find((item) => item.establishment_id === reservation.establishment_id)
    : undefined;
  const canCancel = reservation?.status === "EN_ATTENTE" || reservation?.status === "CONFIRMEE";
  const status = reservation ? STATUS[reservation.status] ?? STATUS.EN_ATTENTE : null;
  const establishmentHref = establishment
    ? `/${category?.slug === "loisir" ? "loisirs" : category?.slug ?? "explorer"}${subcategory?.slug ? `/${subcategory.slug}` : ""}/${establishment.slug}`
    : "/explorer";

  const handleCancel = async () => {
    if (!reservation || !cancelReason.trim()) return;
    try {
      await cancelReservation(reservation.id, cancelReason.trim());
      setCancelDialogOpen(false);
    } catch {
      // The store exposes the API error in the dialog.
    }
  };

  if (isLoading) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">Chargement de la réservation...</div>;
  }
  if (!reservation || error) {
    return (
      <div className="space-y-4 rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
        <p role="alert">{error ?? "Réservation introuvable."}</p>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => void loadByReference(reference).catch(() => undefined)}>Réessayer</Button>
          <Button asChild variant="outline"><Link href="/users/reservations">Retour à mes réservations</Link></Button>
        </div>
      </div>
    );
  }

  const location = establishment?.address || establishment?.location_name || "Adresse non renseignée";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link href="/users/reservations" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-emerald-700">
            <ArrowLeft className="h-3 w-3" /> Retour à mes réservations
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">Réservation {reservation.reference}</h1>
          <p className="mt-1 text-xs text-slate-500">Demande envoyée le {formatDate(reservation.created_at.slice(0, 10))}</p>
        </div>
        {status && <Badge className={`w-fit ${status.className}`}>{status.label}</Badge>}
      </div>

      <Card className="overflow-hidden rounded-2xl p-0">
        <div className="flex flex-col sm:flex-row">
          {photo && <img src={photo.url} alt={establishment?.name ?? "Établissement"} className="h-44 w-full object-cover sm:h-auto sm:w-56" />}
          <div className="flex flex-1 flex-col justify-between gap-4 p-5">
            <div>
              <h2 className="text-lg font-bold">{establishment?.name ?? "Établissement"}</h2>
              <p className="mt-1 flex items-center gap-1 text-xs text-slate-500"><MapPin className="h-3 w-3 text-emerald-600" />{location}</p>
              {reservation.category && <p className="mt-2 text-xs text-slate-500">{reservation.category}</p>}
            </div>
            {establishment && <Link href={establishmentHref} className="w-fit text-sm font-semibold text-emerald-700 hover:underline">Voir l’établissement</Link>}
          </div>
        </div>
      </Card>

      <Card className="rounded-2xl p-5">
        <h3 className="mb-4 text-base font-bold">Détails de la réservation</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <InfoBox icon={CalendarDays} label="Début" value={formatDate(reservation.start_date ?? reservation.reservation_date)} />
          <InfoBox icon={CalendarDays} label="Fin" value={formatDate(reservation.end_date)} />
          <InfoBox icon={Users} label="Participants" value={`${reservation.quantity}`} />
          <InfoBox icon={CalendarDays} label="Durée" value={reservation.nights == null ? "Non applicable" : `${reservation.nights} nuit${reservation.nights > 1 ? "s" : ""}`} />
        </div>
        {(reservation.start_time || reservation.end_time || reservation.room_or_unit) && (
          <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-600">
            {reservation.start_time && <span className="rounded-lg bg-slate-50 px-3 py-2">Début : {reservation.start_time}</span>}
            {reservation.end_time && <span className="rounded-lg bg-slate-50 px-3 py-2">Fin : {reservation.end_time}</span>}
            {reservation.room_or_unit && <span className="rounded-lg bg-slate-50 px-3 py-2">{reservation.room_or_unit}</span>}
          </div>
        )}
        {reservation.special_requests && <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-600"><strong>Demande particulière : </strong>{reservation.special_requests}</p>}
      </Card>

      <Card className="rounded-2xl p-5">
        <h3 className="mb-4 text-base font-bold">Récapitulatif du devis</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-slate-500">Sous-total</span><span>{reservation.subtotal.toLocaleString("fr-FR")} {reservation.currency}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Frais de service</span><span>{reservation.service_fee.toLocaleString("fr-FR")} {reservation.currency}</span></div>
          <div className="flex justify-between border-t pt-3 text-base font-bold"><span>Total</span><span className="text-emerald-800">{reservation.total.toLocaleString("fr-FR")} {reservation.currency}</span></div>
          <div className="flex justify-between pt-2"><span className="text-slate-500">Mode de paiement choisi</span><span>{reservation.payment_method?.replaceAll("_", " ") ?? "À définir"}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">État du paiement</span><span>{reservation.payment_status.replaceAll("_", " ")}</span></div>
          <p className="pt-2 text-xs text-slate-500">Le devis est établi par la plateforme. L’envoi de la demande ne déclenche pas de paiement.</p>
        </div>
      </Card>

      {reservation.cancellation_reason && (
        <p className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">Motif d’annulation : {reservation.cancellation_reason}</p>
      )}
      {establishmentsError && <p role="status" className="text-xs text-amber-700">Les informations complémentaires de l’établissement n’ont pas pu être chargées.</p>}

      {cancelError && <p role="alert" className="text-sm text-rose-700">{cancelError}</p>}
      {canCancel && (
        <Button variant="outline" className="rounded-xl border-rose-200 text-rose-700 hover:bg-rose-50" onClick={() => setCancelDialogOpen(true)}>
          <XCircle className="mr-2 h-4 w-4" /> Demander l’annulation
        </Button>
      )}

      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Demander l’annulation</DialogTitle>
            <DialogDescription>Votre demande sera transmise avec le motif ci-dessous. L’annulation reste soumise aux conditions de l’établissement.</DialogDescription>
          </DialogHeader>
          <Textarea value={cancelReason} onChange={(event) => setCancelReason(event.target.value)} maxLength={1000} rows={4} placeholder="Indiquez le motif de votre demande..." />
          {cancelError && <p role="alert" className="text-sm text-rose-700">{cancelError}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setCancelDialogOpen(false)}>Retour</Button>
            <Button type="button" disabled={!cancelReason.trim() || isCancelling} onClick={() => void handleCancel()} className="bg-rose-700 hover:bg-rose-800">
              {isCancelling ? "Envoi..." : "Envoyer la demande"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InfoBox({ icon: Icon, label, value }: { icon: typeof CalendarDays; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
      <Icon className="h-4 w-4 text-emerald-700" />
      <div className="mt-2 text-[10px] uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-0.5 text-xs font-semibold text-slate-800">{value}</div>
    </div>
  );
}
