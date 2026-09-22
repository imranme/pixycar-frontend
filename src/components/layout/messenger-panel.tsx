"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, MessageCircle, ArrowRight, X } from "lucide-react";
import { useGetThreadsQuery } from "@/store/features/communication/communicationApi";
import { useAppSelector } from "@/store";
import { ROUTES } from "@/constants/routes";

type MessengerPanelProps = {
  onClose: () => void;
  userRole: "seller" | "dealer";
};

export function MessengerPanel({ onClose, userRole }: MessengerPanelProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: threadsData, isLoading, isError } = useGetThreadsQuery();

  const messagesUrl = userRole === "dealer" ? ROUTES.dealer.messages : ROUTES.seller.messages;

  const conversationList = useMemo(() => {
    const rawList: any[] = Array.isArray(threadsData)
      ? threadsData
      : threadsData && "results" in (threadsData as object) && Array.isArray((threadsData as any).results)
      ? (threadsData as any).results
      : [];

    if (!rawList || rawList.length === 0) return [];

    return rawList.map((t: any) => {
      const isSeller = userRole === "seller";
      const name = isSeller
        ? t.dealer_name || t.other_party_label || "Verified Dealer"
        : t.seller_name || t.other_party_label || "Car Seller";

      const initial = (name.charAt(0) || "U").toUpperCase();

      const lastMsgText =
        typeof t.last_message === "string"
          ? t.last_message
          : typeof t.last_message === "object" && t.last_message !== null
          ? (t.last_message as any).text || "No messages yet"
          : "No messages yet";

      const lastMsgTime =
        typeof t.last_message === "object" && t.last_message?.created_at
          ? new Date(t.last_message.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          : t.updated_at
          ? new Date(t.updated_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          : "";

      return {
        id: String(t.id),
        name,
        initial,
        carName: t.listing_title || "Vehicle",
        lastMessage: lastMsgText,
        time: lastMsgTime,
        unreadCount: Number(t.unread_count || 0),
        isUnlocked: Boolean(t.is_unlocked),
      };
    });
  }, [threadsData, userRole]);

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversationList;
    const q = searchQuery.toLowerCase();
    return conversationList.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.carName.toLowerCase().includes(q) ||
        c.lastMessage.toLowerCase().includes(q)
    );
  }, [conversationList, searchQuery]);

  const handleSelectThread = (threadId: string) => {
    onClose();
    router.push(`${messagesUrl}?roomId=${threadId}`);
  };

  return (
    <div
      className="absolute right-0 top-full z-50 mt-2 w-84 sm:w-96 max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-2xl transition-all"
      role="dialog"
      aria-label="Messenger Chats"
      style={{
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#F0F2F5] px-4 py-3 bg-white">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-full bg-[#0084FF]/10 text-[#0084FF]">
            <MessageCircle className="size-4" strokeWidth={2.4} />
          </span>
          <h2 className="font-hero-heading text-base font-bold text-[#1E1E1E]">Chats</h2>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={messagesUrl}
            onClick={onClose}
            className="cursor-pointer font-navbar text-xs font-semibold text-[#0084FF] transition hover:underline"
          >
            See all
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg p-1 text-[#5E5E5E] transition hover:bg-neutral-100 hover:text-[#1E1E1E]"
            aria-label="Close"
          >
            <X className="size-4" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-3 pt-2.5 pb-2 bg-white">
        <div className="relative flex items-center">
          <Search className="pointer-events-none absolute left-3 size-3.5 text-[#8E8E93]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Messenger..."
            className="w-full rounded-full bg-[#F0F2F5] py-1.5 pl-8 pr-3 font-navbar text-xs text-[#1E1E1E] outline-none placeholder:text-[#8E8E93] focus:bg-white focus:ring-1 focus:ring-[#0084FF]"
          />
        </div>
      </div>

      {/* Conversations List */}
      <ul className="max-h-[min(65vh,380px)] overflow-y-auto px-1.5 py-1 divide-y divide-[#F3F4F6]/60">
        {isLoading ? (
          <li className="flex flex-col items-center justify-center gap-2 px-4 py-8 text-center font-navbar text-xs text-[#8E8E93]">
            <span className="size-5 animate-spin rounded-full border-2 border-[#0084FF] border-t-transparent" />
            Loading chats...
          </li>
        ) : isError ? (
          <li className="px-4 py-8 text-center font-navbar text-xs text-red-500">
            Could not load conversations.
          </li>
        ) : filteredConversations.length === 0 ? (
          <li className="flex flex-col items-center justify-center gap-2 px-4 py-8 text-center">
            <div className="flex size-10 items-center justify-center rounded-full bg-[#F0F2F5] text-[#8E8E93]">
              <MessageCircle className="size-5 opacity-40" />
            </div>
            <p className="font-navbar text-xs font-semibold text-[#1E1E1E]">No conversations yet</p>
            <p className="font-navbar text-[11px] text-[#8E8E93]">
              When you connect or chat, messages will appear here.
            </p>
          </li>
        ) : (
          filteredConversations.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => handleSelectThread(c.id)}
                className="group flex w-full cursor-pointer items-center gap-3 rounded-xl p-2.5 text-left transition hover:bg-[#F0F2F5]/80 active:bg-[#E4E6E9]"
              >
                {/* Avatar with active green dot */}
                <div className="relative shrink-0">
                  <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-tr from-[#FFA51F] to-[#FF8A00] font-hero-heading text-sm font-bold text-white shadow-xs">
                    {c.initial}
                  </div>
                  <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-white bg-[#31A24C]" />
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <p className="truncate font-hero-heading text-xs sm:text-sm font-semibold text-[#1E1E1E] group-hover:text-[#0084FF] transition-colors">
                      {c.name}
                    </p>
                    <span className="shrink-0 font-navbar text-[10px] text-[#8E8E93]">{c.time}</span>
                  </div>

                  <p className="truncate font-navbar text-[11px] font-medium text-[#FFA51F]">
                    {c.carName}
                  </p>

                  <div className="mt-0.5 flex items-center justify-between gap-2">
                    <p className={`truncate font-navbar text-xs ${c.unreadCount > 0 ? "font-bold text-[#1E1E1E]" : "text-[#65676B]"}`}>
                      {c.lastMessage}
                    </p>
                    {c.unreadCount > 0 ? (
                      <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-[#0084FF] text-[9px] font-bold text-white">
                        {c.unreadCount}
                      </span>
                    ) : null}
                  </div>
                </div>
              </button>
            </li>
          ))
        )}
      </ul>

      {/* Footer */}
      <div className="border-t border-[#F0F2F5] p-2 bg-[#FAFBFD]">
        <Link
          href={messagesUrl}
          onClick={onClose}
          className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl py-2 font-navbar text-xs font-semibold text-[#0084FF] transition hover:bg-[#0084FF]/10 active:bg-[#0084FF]/20"
        >
          <span>Open in Messages</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}
