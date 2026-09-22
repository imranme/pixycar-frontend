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

            // 2. Play Messenger notification chime
            try {
              const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
              if (AudioCtx) {
                const ctx = new AudioCtx();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = "sine";
                const now = ctx.currentTime;
                osc.frequency.setValueAtTime(587.33, now);
                osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.35);
              }
            } catch {
              // Handled silently if audio context is blocked
            }

            const title = data.title || "New Message";
            const message = data.message || "";
            const isDealer = user?.role?.toLowerCase() === "dealer";
            const targetMessagesUrl = isDealer ? "/dealer/messages" : "/seller/messages";

            // 3. Display Facebook Messenger Style In-App Toast
            toast.custom(
              (t) => (
                <div
                  onClick={() => {
                    toast.dismiss(t.id);
                    if (typeof window !== "undefined") {
                      window.location.href = targetMessagesUrl;
                    }
                  }}
                  className={`${
                    t.visible ? "animate-enter" : "animate-leave"
                  } w-88 max-w-[calc(100vw-2rem)] cursor-pointer overflow-hidden rounded-2xl bg-white border border-[#E4E6EB] p-3.5 shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.99]`}
                  style={{
                    boxShadow: "0 12px 28px 0 rgba(0, 0, 0, 0.2), 0 2px 4px 0 rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {/* Top Bar */}
                  <div className="flex items-center justify-between gap-2 pb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="flex size-4 items-center justify-center rounded-full bg-[#0084FF] text-[10px] text-white">
                        💬
                      </span>
                      <span className="font-navbar text-[11px] font-bold tracking-tight text-[#0084FF]">
                        MESSENGER
                      </span>
                      <span className="text-[10px] text-[#8E8E93]">• Just now</span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toast.dismiss(t.id);
                      }}
                      className="rounded-full p-1 text-[#8E8E93] hover:bg-[#F0F2F5] hover:text-[#1E1E1E]"
                      aria-label="Close"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Body with Avatar and Message Bubble */}
                  <div className="flex items-start gap-3">
                    <div className="relative shrink-0">
                      <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-tr from-[#FFA51F] to-[#FF8A00] font-hero-heading text-sm font-bold text-white shadow-xs">
                        {title.replace(/New message from /i, "").charAt(0).toUpperCase() || "M"}
                      </div>
                      <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-white bg-[#31A24C]" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-hero-heading text-xs font-bold text-[#1E1E1E]">
                        {title}
                      </p>
                      <div className="mt-1 rounded-2xl rounded-tl-sm bg-[#F0F2F5] px-3 py-2 text-xs text-[#050505] leading-snug">
                        <p className="line-clamp-2">{message}</p>
                      </div>
                      <p className="mt-1.5 font-navbar text-[11px] font-semibold text-[#0084FF] flex items-center gap-1">
                        <span>Click to reply</span>
                        <span>→</span>
                      </p>
                    </div>
                  </div>
                </div>
              ),
              {
                position: "top-right",
                duration: 6000,
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
