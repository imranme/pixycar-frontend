"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { ChatMessage, Conversation } from "@/components/seller/messages/messages-dummy-data";
import { ConversationList } from "@/components/seller/messages/conversation-list";
import { ChatWindow } from "@/components/seller/messages/chat-window";
import { useChatWebSocket } from "@/features/chat/hooks/useChatWebSocket";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  useGetThreadsQuery,
  useGetThreadMessagesQuery,
  useSendMessageMutation,
  useMarkThreadReadMutation,
} from "@/store/features/communication/communicationApi";
import {
  useGetNotificationsQuery,
  useMarkNotificationsReadMutation,
} from "@/store/features/notifications/notificationsApi";
import { useAppSelector } from "@/store";
import { selectCurrentUser } from "@/store/features/auth/authSlice";

function SellerMessagesContent() {
  const searchParams = useSearchParams();
  const urlRoomId = searchParams.get("roomId") || searchParams.get("listingId");
  const currentUser = useAppSelector(selectCurrentUser);

  const { data: threadsData, isLoading: isLoadingThreads } = useGetThreadsQuery();
  const { data: notificationsData } = useGetNotificationsQuery({ unread: true });
  const [sendMessageApi] = useSendMessageMutation();
  const [markThreadReadApi] = useMarkThreadReadMutation();
  const [markNotificationsReadApi] = useMarkNotificationsReadMutation();
  const [activeConvoId, setActiveConvoId] = useState<string>("");
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [localPendingMessages, setLocalPendingMessages] = useState<{ [threadId: string]: ChatMessage[] }>({});
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const unreadMessageNotifs = useMemo(() => {
    if (!notificationsData) return [];
    const items = Array.isArray(notificationsData)
      ? notificationsData
      : Array.isArray((notificationsData as any)?.results)
      ? (notificationsData as any).results
      : [];
    return items.filter(
      (n: any) =>
        n.notification_type === "NEW_MESSAGE" ||
        (n.title && n.title.toLowerCase().includes("message"))
    );
  }, [notificationsData]);

  const conversations: Conversation[] = useMemo(() => {
    const list: any[] = Array.isArray(threadsData)
      ? threadsData
      : threadsData && "results" in (threadsData as object) && Array.isArray((threadsData as any).results)
      ? (threadsData as any).results
      : [];

    if (!list || list.length === 0) return [];

    return list.map((t, index) => {
      const otherParty = t.dealer_name || t.other_party_label || "Verified Dealer";
      const initial = otherParty.charAt(0).toUpperCase() || "D";
      const directUnread = Number(t.unread_count || 0);
      const listingId = Number(t.listing_id || t.listing || 0);
      const fallbackFromListing = listingId
        ? unreadMessageNotifs.filter((n: any) => Number(n.related_listing_id) === listingId).length
        : 0;
      const fallbackSingleThread = list.length === 1 ? unreadMessageNotifs.length : 0;
      const unreadCount = directUnread > 0 ? directUnread : (fallbackFromListing || (index === 0 ? fallbackSingleThread : 0));

      return {
        id: String(t.id),
        dealerId: String(t.dealer || "1"),
        dealerName: otherParty,
        dealerInitial: initial,
        dealerImage: null,
        carName: t.listing_title || "Vehicle",
        lastMessage:
          typeof t.last_message === "string"
            ? t.last_message
            : typeof t.last_message === "object" && t.last_message !== null
            ? (t.last_message as any).text || "No messages yet"
            : "No messages yet",
        time: t.updated_at
          ? new Date(t.updated_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          : "",
        unread: unreadCount,
        unreadCount,
        badge: t.is_unlocked ? undefined : "Unlock Required",
        isUnlocked: Boolean(t.is_unlocked),
        biddingSoldListingId: String(t.listing_id || t.listing || t.id),
        messages: [],
      };
    });
  }, [threadsData, unreadMessageNotifs]);

  useEffect(() => {
    if (conversations.length > 0) {
      if (!activeConvoId || !conversations.some((c) => c.id === activeConvoId)) {
        let match = urlRoomId ? conversations.find((c) => c.id === urlRoomId) : null;
        if (!match && urlRoomId) {
          const threadsList: any[] = Array.isArray(threadsData)
            ? threadsData
            : threadsData && "results" in (threadsData as object) && Array.isArray((threadsData as any).results)
            ? (threadsData as any).results
            : [];
          const tMatch = threadsList.find((t) => String(t.listing) === urlRoomId);
          if (tMatch) {
            match = conversations.find((c) => c.id === String(tMatch.id));
          }
        }
        setActiveConvoId(match ? match.id : conversations[0].id);
      }
    }
  }, [conversations, urlRoomId, activeConvoId, threadsData]);

  const { data: threadMessagesData } = useGetThreadMessagesQuery(activeConvoId, {
    skip: !activeConvoId || isNaN(Number(activeConvoId)),
  });

  const activeConvo = useMemo(() => {
    return conversations.find((c) => c.id === activeConvoId) || conversations[0];
  }, [conversations, activeConvoId]);

  const {
    messages: wsMessages,
    isPartnerTyping,
    sendMessage,
    sendTyping,
  } = useChatWebSocket(activeConvoId);

  // Directly combine messages from API, WebSocket, and local pending
  const displayedMessages: ChatMessage[] = useMemo(() => {
    const msgsList: any[] = Array.isArray(threadMessagesData)
      ? threadMessagesData
      : threadMessagesData && "results" in (threadMessagesData as object) && Array.isArray((threadMessagesData as any).results)
      ? (threadMessagesData as any).results
      : [];

    const serverMsgs: ChatMessage[] = msgsList.map((m) => {
      const isMe =
        (m.sender_id && currentUser?.id && m.sender_id === currentUser.id) ||
        (m.sender_email && currentUser?.email && m.sender_email.toLowerCase() === currentUser.email.toLowerCase());
      return {
        id: m.id,
        sender: (isMe ? "seller" : "dealer") as "seller" | "dealer",
        text: m.text || "",
        time: m.created_at
          ? new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          : "",
      };
    });

    // Merge WebSocket messages and optimistic pending messages seamlessly
    const combined = [...serverMsgs];
    const existingIds = new Set(serverMsgs.map((m) => m.id));
    const existingTexts = new Set(serverMsgs.map((m) => m.text));

    for (const wsMsg of wsMessages) {
      if (!existingIds.has(wsMsg.id) && !existingTexts.has(wsMsg.text)) {
        combined.push(wsMsg);
        existingIds.add(wsMsg.id);
        existingTexts.add(wsMsg.text);
      }
    }

    const pending = localPendingMessages[activeConvoId] || [];
    for (const p of pending) {
      if (!existingTexts.has(p.text)) {
        combined.push(p);
      }
    }

    return combined;
  }, [threadMessagesData, wsMessages, currentUser, localPendingMessages, activeConvoId]);

  useEffect(() => {
    if (activeConvoId && !isNaN(Number(activeConvoId))) {
      markThreadReadApi(activeConvoId);
      const currentConvo = conversations.find((c) => c.id === activeConvoId);
      const listingId = currentConvo?.biddingSoldListingId ? Number(currentConvo.biddingSoldListingId) : 0;
      for (const notif of unreadMessageNotifs) {
        if (!listingId || Number(notif.related_listing_id) === listingId || conversations.length === 1) {
          markNotificationsReadApi({ id: notif.id });
        }
      }
    }
  }, [activeConvoId, markThreadReadApi, markNotificationsReadApi, conversations, unreadMessageNotifs]);

  useEffect(() => {
    if (activeConvoId && wsMessages.length > 0 && !isNaN(Number(activeConvoId))) {
      markThreadReadApi(activeConvoId);
      const currentConvo = conversations.find((c) => c.id === activeConvoId);
      const listingId = currentConvo?.biddingSoldListingId ? Number(currentConvo.biddingSoldListingId) : 0;
      for (const notif of unreadMessageNotifs) {
        if (!listingId || Number(notif.related_listing_id) === listingId || conversations.length === 1) {
          markNotificationsReadApi({ id: notif.id });
        }
      }
    }
  }, [activeConvoId, wsMessages.length, markThreadReadApi, markNotificationsReadApi, conversations, unreadMessageNotifs]);

  const handleSelectConvo = (id: string) => {
    setActiveConvoId(id);
    setMobileShowChat(true);
    setInputValue("");
    sendTyping(false);
    if (id && !isNaN(Number(id))) {
      markThreadReadApi(id);
      const currentConvo = conversations.find((c) => c.id === id);
      const listingId = currentConvo?.biddingSoldListingId ? Number(currentConvo.biddingSoldListingId) : 0;
      for (const notif of unreadMessageNotifs) {
        if (!listingId || Number(notif.related_listing_id) === listingId || conversations.length === 1) {
          markNotificationsReadApi({ id: notif.id });
        }
      }
    }
  };

  const handleInputChange = (val: string) => {
    setInputValue(val);
    if (val.trim()) {
      sendTyping(true);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => {
        sendTyping(false);
      }, 2500);
    } else {
      sendTyping(false);
    }
  };

  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text || !activeConvoId) return;

    setInputValue("");
    sendTyping(false);

    const newMsg: ChatMessage = {
      id: Date.now(),
      sender: "seller",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setLocalPendingMessages((prev) => ({
      ...prev,
      [activeConvoId]: [...(prev[activeConvoId] || []), newMsg],
    }));

    const sentViaWs = sendMessage(text);
    if (!sentViaWs) {
      try {
        await sendMessageApi({ threadId: activeConvoId, text }).unwrap();
      } catch (err: any) {
        console.error("Failed to send message via REST API:", err);
        setLocalPendingMessages((prev) => ({
          ...prev,
          [activeConvoId]: (prev[activeConvoId] || []).filter((m) => m.id !== newMsg.id),
        }));
      }
    }
  };

  if (isLoadingThreads) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
        <Loader2 className="size-8 animate-spin text-[#FFA51F]" />
        <p className="font-navbar text-sm text-[#5E5E5E]">Loading conversations...</p>
      </div>
    );
  }

  if (!activeConvo) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
        <p className="font-navbar text-base text-[#5E5E5E]">No active conversations found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-screen-2xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="sr-only">Messages</h1>
      <div className="flex h-[calc(100dvh-9.5rem)] min-h-[480px] overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-xs">
        <ConversationList
          conversations={conversations}
          activeId={activeConvoId}
          onSelect={handleSelectConvo}
          className={cn(mobileShowChat && "hidden lg:flex")}
        />
        <section
          className={cn(
            "flex min-h-0 flex-1 flex-col border-[#E5E7EB] lg:border-l",
            !mobileShowChat && "hidden lg:flex"
          )}
        >
          <ChatWindow
            dealerId={activeConvo.dealerId}
            dealerName={activeConvo.dealerName}
            dealerInitial={activeConvo.dealerInitial}
            dealerImage={activeConvo.dealerImage}
            carName={activeConvo.carName}
            messages={displayedMessages}
            inputValue={inputValue}
            onInputChange={handleInputChange}
            onSend={handleSend}
            showMobileBack
            onMobileBack={() => setMobileShowChat(false)}
            currentRole="seller"
            dealerPartyInitial={activeConvo.dealerInitial}
            sellerPartyInitial="S"
            isPartnerTyping={isPartnerTyping}
            isUnlocked={activeConvo.isUnlocked}
          />
        </section>
      </div>
    </div>
  );
}

export default function SellerMessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
          <Loader2 className="size-8 animate-spin text-[#FFA51F]" />
          <p className="font-navbar text-sm text-[#5E5E5E]">Loading messages...</p>
        </div>
      }
    >
      <SellerMessagesContent />
    </Suspense>
  );
}
