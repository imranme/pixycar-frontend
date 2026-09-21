"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store";
import { ROUTES } from "@/constants/routes";
import { AlertCircle, Bell, Check, Clock, TrendingUp, Trophy, X } from "lucide-react";
import {
  useGetNotificationsQuery,
  useMarkNotificationsReadMutation,
} from "@/store/features/notifications/notificationsApi";

export type NotificationIconKind = "trending" | "trophy" | "clock" | "alert" | "check";

export type NotificationItemData = {
  id: string;
  icon: NotificationIconKind;
  title: string;
  subtitle: string;
  timeAgo: string;
  isRead?: boolean;
};

function IconWrap({ type }: { type: NotificationIconKind }) {
  switch (type) {
    case "trending":
      return (
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-[#FA541C]">
          <TrendingUp className="size-4" strokeWidth={2.2} />
        </span>
      );
    case "trophy":
      return (
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-[#00A854]">
          <Trophy className="size-4" strokeWidth={2.2} />
        </span>
      );
    case "clock":
      return (
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
          <Clock className="size-4" strokeWidth={2.2} />
        </span>
      );
    case "check":
      return (
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
          <Check className="size-4" strokeWidth={2.2} />
        </span>
      );
    case "alert":
    default:
      return (
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-[#FA8C16]">
          <AlertCircle className="size-4" strokeWidth={2.2} />
        </span>
      );
  }
}

type NotificationPanelProps = {
  onClose: () => void;
  items?: NotificationItemData[];
};

export function NotificationPanel({ onClose }: NotificationPanelProps) {
  const router = useRouter();
  const currentUser = useAppSelector((state) => state.auth.user);
  const { data: apiData, isLoading } = useGetNotificationsQuery();
  const [markRead] = useMarkNotificationsReadMutation();

  const liveList: NotificationItemData[] = useMemo(() => {
    const rawList: any[] = Array.isArray(apiData)
      ? apiData
      : apiData && Array.isArray((apiData as any).results)
      ? (apiData as any).results
      : [];

    return rawList.map((n: any) => {
      let iconKind: NotificationIconKind = "alert";
      if (n.notification_type === "NEW_BID" || n.notification_type === "OUTBID" || n.notification_type === "RANK_CHANGE") {
        iconKind = "trending";
      } else if (n.notification_type === "AUCTION_WON") {
        iconKind = "trophy";
      } else if (n.notification_type === "TIME_OVER" || n.notification_type === "AUCTION_EXPIRED") {
        iconKind = "clock";
      } else if (n.notification_type === "PAYMENT_SUCCESS") {
        iconKind = "check";
      }

      return {
        id: String(n.id),
        icon: iconKind,
        title: n.title || "Notification",
        subtitle: n.message || "",
        timeAgo: n.created_at
          ? new Date(n.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          : "",
        isRead: Boolean(n.is_read),
      };
    });
  }, [apiData]);

  const handleMarkAllRead = async () => {
    try {
      await markRead().unwrap();
    } catch {
      // Handled silently
    }
  };

  const handleItemClick = async (n: NotificationItemData) => {
    try {
      await markRead({ id: Number(n.id) }).unwrap();
    } catch {
      // Handled silently
    }
    if (onClose) onClose();
    const isMsg =
      n.title.toLowerCase().includes("message") ||
      n.subtitle.toLowerCase().includes("message");
    if (isMsg) {
      const isDealer = currentUser?.role?.toLowerCase() === "dealer";
      router.push(isDealer ? ROUTES.dealer.messages : ROUTES.seller.messages);
    }
  };

  return (
    <div
      className="absolute right-0 top-full z-50 mt-2 min-w-80 max-w-[calc(100vw-1.5rem)] rounded-2xl border border-[#E5E7EB] bg-white shadow-xl"
      role="dialog"
      aria-label="Notifications"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E7EB]/60">
        <div className="flex items-center gap-2">
          <Bell className="size-4 shrink-0 text-[#5E5E5E]" strokeWidth={2} aria-hidden />
          <h2 className="font-hero-heading text-sm font-bold text-[#1E1E1E] sm:text-base">Notifications</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="cursor-pointer font-navbar text-xs font-semibold text-[#FFA51F] hover:underline"
          >
            Mark all read
          </button>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg p-1.5 text-[#5E5E5E] transition hover:bg-neutral-100 hover:text-[#1E1E1E]"
            aria-label="Close notifications"
          >
            <X className="size-4" strokeWidth={2} />
          </button>
        </div>
      </div>

      <ul className="max-h-[min(70vh,420px)] overflow-y-auto px-2 pb-3 pt-1 divide-y divide-[#F3F4F6]">
        {isLoading ? (
          <li className="px-4 py-6 text-center font-navbar text-sm text-[#5E5E5E]">Loading notifications…</li>
        ) : liveList.length === 0 ? (
          <li className="px-4 py-6 text-center font-navbar text-sm text-[#5E5E5E]">No notifications found</li>
        ) : (
          liveList.map((n) => (
            <li
              key={n.id}
              className={`rounded-xl px-2 py-3 transition hover:bg-neutral-50 ${
                n.isRead ? "opacity-75" : "bg-[#FFFDF7]"
              }`}
            >
              <button
                type="button"
                className="flex w-full cursor-pointer gap-3 text-left items-start"
                onClick={() => handleItemClick(n)}
              >
                <IconWrap type={n.icon} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <p className={`font-hero-heading text-sm font-bold ${n.isRead ? "text-[#5E5E5E]" : "text-[#1E1E1E]"}`}>
                      {n.title}
                    </p>
                    {!n.isRead && (
                      <span className="size-2 rounded-full bg-[#FA8C16] shrink-0" title="Unread" />
                    )}
                  </div>
                  <p className="mt-0.5 font-navbar text-xs text-[#5E5E5E] sm:text-sm leading-snug">
                    {n.subtitle}
                  </p>
                  <p className="mt-1 font-navbar text-xs text-[#9CA3AF]">{n.timeAgo}</p>
                </div>
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
