"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface Props {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  specialRequest: string;
  onFieldChange: (field: string, value: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function Step2ClientInfo({
  firstName, lastName, email, phone, country, specialRequest,
  onFieldChange, onNext, onPrev,
}: Props) {
  const canContinue = firstName && lastName && email && phone;

  return (
    <div className="space-y-8">
      {/* Titre */}
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Vos informations
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Ces informations apparaîtront sur votre confirmation.
        </p>
      </header>

      {/* Formulaire */}
      <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>
              Prénom <span className="text-rose-500">*</span>
            </Label>
            <Input
              value={firstName}
              onChange={(e) => onFieldChange("firstName", e.target.value)}
              placeholder="Jean"
              className="mt-1.5 h-11 rounded-xl"
            />
          </div>
          <div>
            <Label>
              Nom <span className="text-rose-500">*</span>
            </Label>
            <Input
              value={lastName}
              onChange={(e) => onFieldChange("lastName", e.target.value)}
              placeholder="Dupont"
              className="mt-1.5 h-11 rounded-xl"
            />
          </div>
        </div>

        <div>
          <Label>
            Email <span className="text-rose-500">*</span>
          </Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => onFieldChange("email", e.target.value)}
            placeholder="jean@gmail.com"
            className="mt-1.5 h-11 rounded-xl"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>
              Téléphone <span className="text-rose-500">*</span>
            </Label>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => onFieldChange("phone", e.target.value)}
              placeholder="+229 97 12 34 56"
              className="mt-1.5 h-11 rounded-xl"
            />
          </div>
          <div>
            <Label>Pays</Label>
            <Select
              value={country}
              onValueChange={(v) => onFieldChange("country", v)}
            >
              <SelectTrigger className="mt-1.5 h-11 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Bénin">Bénin</SelectItem>
                <SelectItem value="Togo">Togo</SelectItem>
                <SelectItem value="Côte d'Ivoire">Côte d'Ivoire</SelectItem>
                <SelectItem value="Nigeria">Nigeria</SelectItem>
                <SelectItem value="France">France</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>Demande spéciale (optionnel)</Label>
          <Textarea
            value={specialRequest}
            onChange={(e) => onFieldChange("specialRequest", e.target.value)}
            placeholder="Ex : étage élevé, lit bébé, arrivée tardive..."
            rows={3}
            className="mt-1.5 rounded-xl"
          />
        </div>
      </section>

      {/* Info */}
      <div className="rounded-xl bg-blue-50 p-4 text-xs text-blue-800">
        Vos informations sont utilisées uniquement pour gérer votre réservation.
      </div>

      {/* Actions */}
      <div className="flex justify-between gap-3 pt-2">
        <Button
          variant="outline"
          onClick={onPrev}
          className="h-12 rounded-xl px-6"
        >
          Retour
        </Button>
        <Button
          onClick={onNext}
          disabled={!canContinue}
          className="h-12 rounded-xl bg-emerald-700 px-8 font-semibold hover:bg-emerald-800 disabled:opacity-50"
        >
          Continuer
        </Button>
      </div>
    </div>
  );
}