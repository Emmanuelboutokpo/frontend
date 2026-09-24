"use client";

import { Download, MapPin, Star, Globe, Phone, ExternalLink } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { STATUS_STYLES_VAL, CATEGORY_STYLES_VAL } from "@/utils/validation.helpers";
import type { ValidationEstablishment } from "@/types/validation";
import { ClientOnlyDate } from "@/components/ui/clientonlydate";

interface Props {
  establishment: ValidationEstablishment | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onDecide: (e: ValidationEstablishment) => void;
}

export function ValidationDetailsModal({
  establishment, open, onOpenChange, onDecide,
}: Props) {
  if (!establishment) return null;
  const status = STATUS_STYLES_VAL[establishment.status];
  const cat = CATEGORY_STYLES_VAL[establishment.category];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl rounded-2xl p-0 max-h-[90vh] overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="sr-only">
            Détails de {establishment.name}
          </DialogTitle>

          {/* Header */}
          <div className="flex items-start gap-4">
            <img
              src={establishment.images[0]}
              alt={establishment.name}
              className="h-20 w-24 rounded-xl object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">{establishment.name}</h2>
                <Badge
                  variant="outline"
                  className={`text-[10px] font-semibold ${status.className}`}
                >
                  {status.label}
                </Badge>
              </div>
              <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                <MapPin className="h-3 w-3 text-emerald-600" />
                {establishment.city}, {establishment.country}
              </p>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <Badge variant="outline" className={`text-[10px] font-semibold ${cat.className}`}>
                  {cat.label}
                </Badge>
                <div className="flex items-center gap-1 text-xs">
                  <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                  <span className="font-semibold">{establishment.rating.toFixed(1)}</span>
                  <span className="text-slate-400">({establishment.reviewCount} avis)</span>
                </div>
              </div>
              <p className="mt-1.5 text-[11px] text-slate-400">
                Soumis le <ClientOnlyDate date={establishment.submittedAt} />
              </p>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="info" className="px-6 pb-6">
          <TabsList className="w-full justify-start gap-1 rounded-none border-b bg-transparent p-0">
            <TabsTrigger value="info" className="rounded-none border-b-2 border-transparent px-3 py-2 text-xs font-semibold data-[state=active]:border-emerald-600 data-[state=active]:text-emerald-700">
              Informations
            </TabsTrigger>
            <TabsTrigger value="photos" className="rounded-none border-b-2 border-transparent px-3 py-2 text-xs font-semibold data-[state=active]:border-emerald-600 data-[state=active]:text-emerald-700">
              Photos ({establishment.images.length})
            </TabsTrigger>
            <TabsTrigger value="documents" className="rounded-none border-b-2 border-transparent px-3 py-2 text-xs font-semibold data-[state=active]:border-emerald-600 data-[state=active]:text-emerald-700">
              Documents ({establishment.documents.length})
            </TabsTrigger>
            <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent px-3 py-2 text-xs font-semibold data-[state=active]:border-emerald-600 data-[state=active]:text-emerald-700">
              Avis
            </TabsTrigger>
            <TabsTrigger value="history" className="rounded-none border-b-2 border-transparent px-3 py-2 text-xs font-semibold data-[state=active]:border-emerald-600 data-[state=active]:text-emerald-700">
              Historique
            </TabsTrigger>
          </TabsList>

          <div className="mt-4 max-h-[55vh] overflow-y-auto lr-scrollbar">
            {/* ---------- INFOS ---------- */}
            <TabsContent value="info" className="space-y-4">
              <div>
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Informations générales
                </h3>
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <Row label="Nom commercial" value={establishment.name} />
                  <Row label="Catégorie" value={cat.label} />
                  <Row label="Adresse" value={establishment.address} />
                  <Row label="Téléphone" value={establishment.phone} />
                  <Row label="Site web" value={establishment.website} />
                </dl>
                <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                  <p className="mb-1 text-[10px] font-bold uppercase text-slate-500">
                    Description
                  </p>
                  <p className="text-sm text-slate-700">{establishment.description}</p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="mb-3 text-[10px] font-bold uppercase text-slate-500">
                  Informations sur le propriétaire
                </p>
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                    {establishment.owner.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{establishment.owner.name}</p>
                    <p className="text-xs text-slate-500">{establishment.owner.email}</p>
                    <p className="text-xs text-slate-500">{establishment.owner.phone}</p>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-lg">
                    Voir le profil
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* ---------- PHOTOS ---------- */}
            <TabsContent value="photos">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {establishment.images.map((img, i) => (
                  <div key={i} className="relative aspect-square overflow-hidden rounded-lg">
                    <img
                      src={img}
                      alt={`Photo ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                    {i === 0 && (
                      <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-semibold text-white">
                        Photo principale
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* ---------- DOCUMENTS ---------- */}
            <TabsContent value="documents" className="space-y-2">
              {establishment.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3"
                >
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-rose-50 text-rose-600">
                    <span className="text-[10px] font-bold">PDF</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-semibold">{doc.name}</p>
                    <p className="truncate text-[11px] text-slate-500">
                      PDF · {doc.fileSize}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </TabsContent>

            {/* ---------- AVIS ---------- */}
            <TabsContent value="reviews">
              <p className="rounded-xl border border-dashed border-slate-200 py-10 text-center text-xs text-slate-400">
                Aucun avis pour le moment
              </p>
            </TabsContent>

            {/* ---------- HISTORIQUE ---------- */}
            <TabsContent value="history">
              <p className="rounded-xl border border-dashed border-slate-200 py-10 text-center text-xs text-slate-400">
                Aucun historique
              </p>
            </TabsContent>
          </div>
        </Tabs>

        {/* Footer décision */}
        <div className="border-t bg-slate-50 px-6 py-4">
          <Button
            onClick={() => onDecide(establishment)}
            className="w-full rounded-xl bg-emerald-700 py-6 text-base font-semibold hover:bg-emerald-800"
          >
            Prendre une décision
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-3">
      <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </dt>
      <dd className="mt-1 text-xs font-semibold text-slate-800">{value}</dd>
    </div>
  );
}