"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  CalendarCheck,
  Clock,
  CreditCard,
  Megaphone,
  Star,
} from "lucide-react";
import { TabsBar } from "@/components/admin/commun";
import { NotificationItem } from "@/components/users/commun/NotificationItem";
import { UserPageHeader } from "@/components/users/commun/UserPageHeader";
import { useUserAccountStore } from "@/store/userAccountStore";
import type { AccountNotification } from "@/store/userAccountStore";

type NotificationTab = "all" | "reservations" | "promotions";

function getCategory(type: string): Exclude<NotificationTab, "all"> | "other" {
  const normalizedType = type.toLowerCase();
  if (/booking|reservation|stay|check.?in|check.?out/.test(normalizedType)) {
    return "reservations";
  }
  if (/promo|offer|discount/.test(normalizedType)) return "promotions";
  return "other";
}

function getNotificationStyle(type: string) {
  const normalizedType = type.toLowerCase();
  if (/booking|reservation|stay|check.?in|check.?out/.test(normalizedType)) {
    return { icon: CalendarCheck, color: "bg-emerald-50 text-emerald-700" };
  }
  if (/payment|refund|invoice/.test(normalizedType)) {
    return { icon: CreditCard, color: "bg-blue-50 text-blue-700" };
  }
  if (/reminder/.test(normalizedType)) {
    return { icon: Clock, color: "bg-amber-50 text-amber-700" };
  }
  if (/review|rating/.test(normalizedType)) {
    return { icon: Star, color: "bg-violet-50 text-violet-700" };
  }
  if (/promo|offer|discount/.test(normalizedType)) {
    return { icon: Megaphone, color: "bg-orange-50 text-orange-700" };
  }
  return { icon: Bell, color: "bg-slate-100 text-slate-700" };
}

function formatRelativeTime(value: string) {
  const timestamp = new Date(value).getTime();
  if (!Number.isFinite(timestamp)) return value;

  const seconds = Math.round((timestamp - Date.now()) / 1000);
  const units: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [7, "day"],
    [4.345, "week"],
    [12, "month"],
    [Number.POSITIVE_INFINITY, "year"],
  ];
  let amount = seconds;
  for (const [threshold, unit] of units) {
    if (Math.abs(amount) < threshold) {
      return new Intl.RelativeTimeFormat("fr", { numeric: "auto" }).format(
        Math.round(amount),
        unit,
      );
    }
    amount /= threshold;
  }
  return new Intl.DateTimeFormat("fr", { dateStyle: "medium" }).format(
    new Date(timestamp),
  );
}

function NotificationRow({
  notification,
  onMarkRead,
  onDelete,
}: {
  notification: AccountNotification;
  onMarkRead: (notification: AccountNotification) => void;
  onDelete: (notification: AccountNotification) => void;
}) {
  const { icon, color } = getNotificationStyle(notification.type);
  const actionUrl = notification.action_url;

  return (
    <div className="relative">
      <NotificationItem
        icon={icon}
        iconColor={color}
        title={notification.title}
        description={notification.message}
        time={formatRelativeTime(notification.created_at)}
        unread={!notification.is_read}
        actionUrl={actionUrl}
        onMarkRead={
          notification.is_read ? undefined : () => onMarkRead(notification)
        }
        onDelete={() => onDelete(notification)}
      />
    </div>
  );
}

export default function UserNotificationsPage() {
  const [tab, setTab] = useState<NotificationTab>("all");
  const [actionError, setActionError] = useState<string | null>(null);
  const notifications = useUserAccountStore((state) => state.notifications);
  const unreadCount = useUserAccountStore((state) => state.unreadCount);
  const hasMoreNotifications = useUserAccountStore(
    (state) => state.hasMoreNotifications,
  );
  const isLoadingNotifications = useUserAccountStore(
    (state) => state.isLoadingNotifications,
  );
  const error = useUserAccountStore((state) => state.notificationsError);
  const loadNotifications = useUserAccountStore(
    (state) => state.loadNotifications,
  );
  const loadUnreadCount = useUserAccountStore((state) => state.loadUnreadCount);
  const markNotificationRead = useUserAccountStore(
    (state) => state.markNotificationRead,
  );
  const markAllNotificationsRead = useUserAccountStore(
    (state) => state.markAllNotificationsRead,
  );
  const deleteNotification = useUserAccountStore(
    (state) => state.deleteNotification,
  );

  useEffect(() => {
    void loadNotifications(true).catch(() => undefined);
    void loadUnreadCount().catch(() => undefined);
  }, [loadNotifications, loadUnreadCount]);

  const filteredNotifications = useMemo(
    () =>
      tab === "all"
        ? notifications
        : notifications.filter(
            (notification) => getCategory(notification.type) === tab,
          ),
    [notifications, tab],
  );

  const counts = useMemo(
    () => ({
      all: notifications.length,
      reservations: notifications.filter(
        (notification) => getCategory(notification.type) === "reservations",
      ).length,
      promotions: notifications.filter(
        (notification) => getCategory(notification.type) === "promotions",
      ).length,
    }),
    [notifications],
  );

  const runAction = async (action: () => Promise<void>) => {
    setActionError(null);
    try {
      await action();
    } catch (actionFailure) {
      setActionError(
        actionFailure instanceof Error
          ? actionFailure.message
          : "L’action n’a pas pu être effectuée.",
      );
    }
  };

  return (
    <div>
      <UserPageHeader
        title="Notifications"
        description={
          unreadCount > 0
            ? `${unreadCount} notification${unreadCount > 1 ? "s" : ""} non lue${unreadCount > 1 ? "s" : ""}.`
            : "Restez informé de toutes vos activités."
        }
        actions={
          unreadCount > 0 ? (
            <button
              type="button"
              onClick={() => void runAction(markAllNotificationsRead)}
              className="text-xs font-semibold text-emerald-700 hover:underline disabled:opacity-50"
              disabled={isLoadingNotifications}
            >
              Tout marquer comme lu
            </button>
          ) : undefined
        }
      />

      <div className="mb-6">
        <TabsBar
          tabs={[
            {
              value: "all",
              label: "Toutes",
              count: hasMoreNotifications ? undefined : counts.all,
            },
            {
              value: "reservations",
              label: "Réservations",
              count: hasMoreNotifications ? undefined : counts.reservations,
            },
            {
              value: "promotions",
              label: "Promotions",
              count: hasMoreNotifications ? undefined : counts.promotions,
            },
          ]}
          active={tab}
          onChange={(value) => setTab(value as NotificationTab)}
        />
      </div>

      {(error || actionError) && (
        <div
          role="alert"
          className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <span>{actionError ?? error}</span>
          {error && (
            <button
              type="button"
              onClick={() => {
                void loadNotifications(true).catch(() => undefined);
                void loadUnreadCount().catch(() => undefined);
              }}
              className="shrink-0 font-semibold underline"
            >
              Réessayer
            </button>
          )}
        </div>
      )}

      <div className="space-y-3">
        {filteredNotifications.map((notification) => (
          <NotificationRow
            key={notification.id}
            notification={notification}
            onMarkRead={(item) =>
              void runAction(() => markNotificationRead(item.id))
            }
            onDelete={(item) =>
              void runAction(() => deleteNotification(item.id))
            }
          />
        ))}

        {!isLoadingNotifications && filteredNotifications.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
            <Bell className="mx-auto h-8 w-8 text-slate-300" />
            <p className="mt-3 text-sm font-semibold text-slate-700">
              {error
                ? "Les notifications n’ont pas pu être chargées."
                : "Aucune notification dans cette catégorie."}
            </p>
          </div>
        )}

        {isLoadingNotifications && notifications.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-500">
            Chargement des notifications…
          </p>
        )}
      </div>

      {hasMoreNotifications && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() =>
              void loadNotifications().catch(() => undefined)
            }
            disabled={isLoadingNotifications}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoadingNotifications ? "Chargement…" : "Charger plus"}
          </button>
        </div>
      )}
    </div>
  );
}
