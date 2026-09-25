"use client";

import { useState } from "react";
import { Camera, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/store";
import { UserPageHeader } from "@/components/users/commun/UserPageHeader";

export default function UserProfilePage() {
  const { firstName, lastName, email, updateProfile } = useAuthStore();
  const [form, setForm] = useState({
    firstName: firstName ?? "",
    lastName: lastName ?? "",
    email: email ?? "",
    phone: "+229 97 12 34 56",
    country: "Bénin",
  });

  return (
    <div>
      <UserPageHeader
        title="Mon profil"
        description="Gérez vos informations personnelles."
      />

      <Card className="rounded-2xl p-6">
        {/* Avatar */}
        <div className="mb-6 flex items-center gap-4 border-b border-slate-100 pb-6">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-emerald-700 text-2xl font-bold text-white">
            {form.firstName[0]}{form.lastName[0]}
          </div>
          <div>
            <p className="text-sm font-semibold">Photo de profil</p>
            <Button variant="outline" size="sm" className="mt-2 rounded-lg">
              <Camera className="mr-1.5 h-3.5 w-3.5" /> Changer la photo
            </Button>
            <p className="mt-1 text-[10px] text-slate-400">JPG, PNG (max 2 Mo)</p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold">Informations personnelles</h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label>Prénom <span className="text-rose-500">*</span></Label>
              <Input
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                className="mt-1.5 h-11 rounded-xl"
              />
            </div>
            <div>
              <Label>Nom <span className="text-rose-500">*</span></Label>
              <Input
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className="mt-1.5 h-11 rounded-xl"
              />
            </div>
          </div>

          <div>
            <Label>Email <span className="text-rose-500">*</span></Label>
            <div className="relative mt-1.5">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="h-11 rounded-xl pl-10"
              />
            </div>
          </div>

          <div>
            <Label>Téléphone <span className="text-rose-500">*</span></Label>
            <div className="relative mt-1.5">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="h-11 rounded-xl pl-10"
              />
            </div>
          </div>

          <div>
            <Label>Pays</Label>
            <Select value={form.country} onValueChange={(v) => setForm({ ...form, country: v })}>
              <SelectTrigger className="mt-1.5 h-11 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Bénin">Bénin</SelectItem>
                <SelectItem value="Togo">Togo</SelectItem>
                <SelectItem value="Côte d'Ivoire">Côte d'Ivoire</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={() => updateProfile(form)}
            className="w-full rounded-xl bg-emerald-700 hover:bg-emerald-800"
          >
            Enregistrer les modifications
          </Button>
        </div>
      </Card>
    </div>
  );
}