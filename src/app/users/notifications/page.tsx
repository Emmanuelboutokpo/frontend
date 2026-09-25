"use client";

import { CalendarCheck, CreditCard, Clock, Star } from "lucide-react";

import { TabsBar } from "@/components/admin/commun";
import { useState } from "react";
import { UserPageHeader } from "@/components/users/commun/UserPageHeader";
import { NotificationItem } from "@/components/users/commun/NotificationItem";

const NOTIFICATIONS = [
  { id: 1, type: "booking", icon: CalendarCheck, iconColor: "bg-emerald-50 text-emerald-700", title: "Réservation confirmée", description: "Votre réservation à l'Hôtel Azalaï a été confirmée.", time: "Il y a 2 h", unread: true },
  { id: 2, type: "payment", icon: CreditCard, iconColor: "bg-blue-50 text-blue-700", title: "Paiement effectué", description: "Votre paiement de 135 000 FCFA a bien été enregistré.", time: "Il y a 3 h", unread: true },
  { id: 3, type: "reminder", icon: Clock, iconColor: "bg-amber-50 text-amber-700", title: "Rappel de séjour", description: "Votre séjour commence demain à Hôtel Azalaï.", time: "Il y a 1 j" },
  { id: 4, type: "review", icon: Star, iconColor: "bg-violet-50 text-violet-700", title: "Votre séjour est terminé", description: "N'oubliez pas de laisser un avis sur votre expérience.", time: "Il y a 3 j" },
];

export default function UserNotificationsPage() {
  const [tab, setTab] = useState("all");

  return (
    <div>
      <UserPageHeader
        title="Notifications"
        description="Restez informé de toutes vos activités."
      />

      <div className="mb-6">
        <TabsBar
          tabs={[
            { value: "all", label: "Toutes", count: NOTIFICATIONS.length },
            { value: "reservations", label: "Réservations", count: NOTIFICATIONS.filter((n) => n.type === "booking").length },
            { value: "promotions", label: "Promotions", count: 0 },
          ]}
          active={tab}
          onChange={setTab}
        />
      </div>

      <div className="space-y-3">
        {NOTIFICATIONS.map((n) => (
          <NotificationItem
            key={n.id}
            icon={n.icon}
            iconColor={n.iconColor}
            title={n.title}
            description={n.description}
            time={n.time}
            unread={n.unread}
          />
        ))}
      </div>

      <div className="mt-6 text-center">
        <button className="text-xs font-semibold text-emerald-700 hover:underline">
          Tout marquer comme lu
        </button>
      </div>
    </div>
  );
}