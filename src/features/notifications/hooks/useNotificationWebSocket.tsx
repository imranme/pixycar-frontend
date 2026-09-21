"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { notificationsApi } from "@/store/features/notifications/notificationsApi";
import { listingsApi } from "@/store/features/listings/listingsApi";
import { communicationApi } from "@/store/features/communication/communicationApi";
import toast from "react-hot-toast";

export interface PushNotificationPayload {
  type: string;
  notification_type?: string;
  title?: string;
  message?: string;
  notification_id?: number | string;
  related_listing_id?: number | string | null;
  created_at?: string;
}

export function useNotificationWebSocket() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.accessToken);
  const user = useAppSelector((state) => state.auth.user);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getAccessToken = useCallback(() => {
    if (token) return token;
    if (typeof window !== "undefined") {
      return localStorage.getItem("pixycar_access_token") || "";
    }
    return "";
  }, [token]);

  const connect = useCallback(() => {
    const activeToken = getAccessToken();
    if (!activeToken || !user) {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      setIsConnected(false);
      return;
    }

    // Determine WS Base URL
    let wsBase = process.env.NEXT_PUBLIC_WS_URL;
    if (!wsBase) {
      const apiEnvUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        "http://127.0.0.1:8005";
      wsBase = apiEnvUrl
        .replace(/^http:\/\//, "ws://")
        .replace(/^https:\/\//, "wss://")
        .replace(/\/api\/v1\/?$/, "")
        .replace(/\/$/, "");
    } else {
      wsBase = wsBase.replace(/\/ws\/?$/, "").replace(/\/$/, "");
    }

    const wsUrl = `${wsBase}/ws/notifications/?token=${encodeURIComponent(activeToken)}`;

    try {
      const ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const data: PushNotificationPayload = JSON.parse(event.data);

          if (data.type === "notification" || data.title || data.message) {
            // 1. Invalidate RTK Query cache so unread-count, notifications, live listings, and chat threads immediately refresh
            dispatch(notificationsApi.util.invalidateTags(["Notifications"]));
            dispatch(listingsApi.util.invalidateTags(["Listings"]));
            dispatch(communicationApi.util.invalidateTags(["Communication"]));

            const isMessageNotification =
              data.notification_type === "NEW_MESSAGE" ||
              data.type === "NEW_MESSAGE" ||
              (data.title && data.title.toLowerCase().includes("message")) ||
              (data.message && data.message.toLowerCase().includes("message"));

            const isOnMessagesPage =
              typeof window !== "undefined" &&
              window.location.pathname.toLowerCase().includes("/messages");

            // 2. If the user is already on the Messages page, suppress the pop-up toast banner
            if (isMessageNotification && isOnMessagesPage) {
              return;
            }

            // 3. Display In-App Toast Alert for other events or when outside the Messages page
            const title = data.title || "New Notification";
            const message = data.message || "";

            toast.custom(
              (t) => (
                <div
                  className={`${
                    t.visible ? "animate-enter" : "animate-leave"
                  } max-w-sm w-full bg-white shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black/5 p-4 border border-[#ECECEC] transition-all`}
                  style={{
                    boxShadow:
                      "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <div className="flex-1 w-0">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FA8C16]/10 text-lg">
                        🔔
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#1E1E1E] leading-tight truncate">
                          {title}
                        </p>
                        <p className="mt-1 text-xs text-[#5E5E5E] leading-snug line-clamp-2">
                          {message}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ),
              {
                position: "top-right",
                duration: 5000,
              }
            );
          }
        } catch (err) {
          console.warn("[Notification WS] Error parsing message:", err);
        }
      };

      ws.onerror = () => {
        // Will close and trigger onclose
      };

      ws.onclose = (e) => {
        setIsConnected(false);
        socketRef.current = null;

        // Auto reconnect after 5s if user is still logged in
        if (e.code !== 4001 && e.code !== 1000) {
          if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, 5000);
        }
      };
    } catch (e) {
      console.warn("[Notification WS] Connection error:", e);
    }
  }, [getAccessToken, user, dispatch]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socketRef.current) {
        socketRef.current.close(1000, "Component unmounted");
        socketRef.current = null;
      }
    };
  }, [connect]);

  return { isConnected };
}
