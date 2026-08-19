"use client";

import { useNotificationWebSocket } from "@/features/notifications/hooks/useNotificationWebSocket";

export function NotificationListener() {
  useNotificationWebSocket();
  return null;
}
