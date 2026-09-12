"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { communicationApi } from "@/store/features/communication/communicationApi";
import type { ChatMessage } from "@/components/seller/messages/messages-dummy-data";

export function useChatWebSocket(roomId: string | number | null) {
  const dispatch = useAppDispatch();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const user = useAppSelector((state) => state.auth.user);

  const getAccessToken = useCallback(() => {
    if (accessToken) return accessToken;
    if (typeof window !== "undefined") {
      return localStorage.getItem("pixycar_access_token") || "";
    }
    return "";
  }, [accessToken]);

  // Clear state when changing conversation room
  useEffect(() => {
    setMessages([]);
    setIsPartnerTyping(false);
  }, [roomId]);

  useEffect(() => {
    if (!roomId || String(roomId).trim() === "" || isNaN(Number(roomId))) {
      setIsConnected(false);
      return;
    }

    const activeToken = getAccessToken();
    if (!activeToken || !user) return;

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

    const wsUrl = `${wsBase}/ws/chat/${roomId}/?token=${encodeURIComponent(activeToken)}`;

    let ws: WebSocket;
    try {
      ws = new WebSocket(wsUrl);
      socketRef.current = ws;
    } catch (e) {
      console.warn("[ChatWebSocket] Could not instantiate WebSocket:", e);
      return;
    }

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // Handle typing indicator event from partner
        if (data.type === "user_typing") {
          setIsPartnerTyping(Boolean(data.is_typing));
          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
          }
          if (data.is_typing) {
            // Auto clear typing bubble after 3 seconds of silence
            typingTimeoutRef.current = setTimeout(() => {
              setIsPartnerTyping(false);
            }, 3000);
          }
          return;
        }

        const timeStr = data.created_at || data.placed_at
          ? new Date(data.created_at || data.placed_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          : new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        const isMe =
          (data.sender_id && user?.id && data.sender_id === user.id) ||
          (data.sender_email && user?.email && data.sender_email.toLowerCase() === user.email.toLowerCase());

        const myRole = user?.role?.toLowerCase() === "dealer" ? "dealer" : "seller";
        const otherRole = myRole === "dealer" ? "seller" : "dealer";
        const senderPerspective: "dealer" | "seller" = isMe ? myRole : otherRole;

        const textContent = data.text || data.message || data.content || "";

        if (textContent) {
          // Partner sent message, so they are not typing anymore
          setIsPartnerTyping(false);

          const newMsg: ChatMessage = {
            id: data.message_id || data.id || Date.now() + Math.random(),
            sender: senderPerspective,
            text: textContent,
            time: timeStr,
          };

          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id || (m.text === newMsg.text && Math.abs(Number(m.id) - Number(newMsg.id)) < 2000))) {
              return prev;
            }
            return [...prev, newMsg];
          });

          // Invalidate communication tags so conversation list and unread count update in real-time
          dispatch(communicationApi.util.invalidateTags(["Communication"]));
        }
      } catch (err) {
        console.warn("[ChatWebSocket] Error parsing message:", err);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      socketRef.current = null;
    };

    ws.onerror = (err) => {
      console.warn("[ChatWebSocket] Error:", err);
    };

    return () => {
      if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
        ws.close();
      }
      socketRef.current = null;
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [roomId, user, getAccessToken, dispatch]);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return false;
    const socket = socketRef.current;
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ message: text, text: text }));
      return true;
    }
    return false;
  }, []);

  const sendTyping = useCallback((isTyping: boolean) => {
    const socket = socketRef.current;
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "typing", is_typing: isTyping }));
    }
  }, []);

  return { messages, isConnected, isPartnerTyping, sendMessage, sendTyping, setMessages };
}
