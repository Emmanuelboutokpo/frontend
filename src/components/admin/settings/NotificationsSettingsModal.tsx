"use client";

import { useEffect, useState } from "react";
import { Bell, Home, AlertCircle, XCircle, BarChart3, AlertTriangle } from "lucide-react";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useSettingsStore } from "@/store/useSettingsStore";

const ICONS: Record<string, any> = {
  "new-booking": Home,
  "pending-establishment": AlertCircle,
  cancel: XCircle,
  "weekly-report": BarChart3,
  "system-alerts": AlertTriangle,
};

const ICON_COLORS: Record<string, string> = {
  "new-booking": "bg-blue-50 text-blue-700",
  "pending-establishment": "bg-amber-50 text-amber-700",
  cancel: "bg-rose-50 text-rose-700",
  "weekly-report": "bg-violet-50 text-violet-700",
  "system-alerts": "bg-orange-50 text-orange-700",
};

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

export function NotificationsSettingsModal({ open, onOpenChange }: Props) {
  const notifications = useSettingsStore((s) => s.notifications);
  const toggleChannel = useSettingsStore((s) => s.toggleChannel);
  const updateNotifications = useSettingsStore((s) => s.updateNotifications);

  const [adminEmail, setAdminEmail] = useState(notifications.adminEmail);
  const [frequency, setFrequency] = useState(notifications.reportFrequency);

  useEffect(() => {
    if (open) {
      setAdminEmail(notifications.adminEmail);
      setFrequency(notifications.reportFrequency);
    }
  }, [open, notifications]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-2xl max-h-[90vh] overflow-y-auto lr-scrollbar">
        <DialogHeader>
          <DialogTitle>Notifications</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
              Paramètres des notifications
            </p>
            <div className="space-y-2">
              {notifications.channels.map((c) => {
                const Icon = ICONS[c.id] ?? Bell;
                const color = ICON_COLORS[c.id] ?? "bg-slate-100 text-slate-700";
                return (
                  <div
                    key={c.id}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3"
                  >
                    <div className={`grid h-9 w-9 place-items-center rounded-lg ${color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-xs font-semibold text-slate-800">
                        {c.label}
                      </p>
                      <p className="truncate text-[10px] text-slate-500">
                        {c.description}
                      </p>
                    </div>
                    <Switch
                      checked={c.enabled}
                      onCheckedChange={() => toggleChannel(c.id)}
                      className="data-[state=checked]:bg-emerald-600"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="block text-xs font-semibold">
              Email de notification
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 font-normal outline-none focus:border-emerald-500"
              />
            </label>
            <label className="block text-xs font-semibold">
              Fréquence du rapport
              <Select value={frequency} onValueChange={(v) => setFrequency(v as any)}>
                <SelectTrigger className="mt-1.5 h-11 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Quotidien</SelectItem>
                  <SelectItem value="weekly">Hebdomadaire</SelectItem>
                  <SelectItem value="monthly">Mensuel</SelectItem>
                </SelectContent>
              </Select>
            </label>
          </div>
        </div>

        <DialogFooter className="gap-2 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">
            Annuler
          </Button>
          <Button
            onClick={() => {
              updateNotifications({ adminEmail, reportFrequency: frequency });
              onOpenChange(false);
            }}
            className="rounded-xl bg-emerald-700 hover:bg-emerald-800"
          >
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}