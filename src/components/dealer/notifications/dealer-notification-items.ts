import type { NotificationItemData } from "@/components/seller/notifications/notification-panel";

export const DEALER_NOTIFICATION_ITEMS: NotificationItemData[] = [
  {
    id: "d1",
    icon: "trending",
    title: "Your Position #2",
    subtitle: "2020 Honda Accord EX — Offers may increase in the final minutes",
    timeAgo: "5 min ago",
  },
  {
    id: "d2",
    icon: "alert",
    title: "You've been outbid",
    subtitle: "2018 Toyota Camry — A higher bid was placed on this listing",
    timeAgo: "1 hour ago",
  },
  {
    id: "d3",
    icon: "trophy",
    title: "Offer Won!",
    subtitle: "2021 Ford F-150 XLT — Unlock chat with the seller to coordinate next steps",
    timeAgo: "3 hours ago",
  },
];

export const DEALER_NOTIFICATIONS_EXIST = DEALER_NOTIFICATION_ITEMS.length > 0;
