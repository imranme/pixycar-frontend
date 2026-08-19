"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Conversation } from "@/components/seller/messages/messages-dummy-data";

type ConversationItemProps = {
  conversation: Conversation;
  isSelected: boolean;
  onSelect: () => void;
};

export function ConversationItem({ conversation, isSelected, onSelect }: ConversationItemProps) {
  const isDealerInbox = Boolean(conversation.sellerId);
  const title = isDealerInbox ? (conversation.sellerName ?? conversation.dealerName) : conversation.dealerName;
  const initial = isDealerInbox ? (conversation.sellerInitial ?? conversation.dealerInitial) : conversation.dealerInitial;
  const imageUrl = isDealerInbox ? conversation.sellerImage : conversation.dealerImage;
  const hasUnread = (conversation.unreadCount || 0) > 0;

  const displayLastMessage =
    typeof conversation.lastMessage === "string"
      ? conversation.lastMessage
      : typeof conversation.lastMessage === "object" && conversation.lastMessage !== null
      ? (conversation.lastMessage as any).text || (conversation.lastMessage as any).content || (conversation.lastMessage as any).message || "No messages yet"
      : "No messages yet";

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full cursor-pointer items-center gap-3.5 px-4 py-3 text-left transition-all duration-150 border-b border-[#F3F4F6]",
        isSelected
          ? "bg-[#FFF8EE] border-l-4 border-l-[#FFA51F]"
          : "hover:bg-[#F9FAFB] bg-white"
      )}
    >
      <div className="relative shrink-0">
        {imageUrl ? (
          <div className="relative size-12 shrink-0 overflow-hidden rounded-full ring-2 ring-white">
            <Image src={imageUrl} alt="" fill className="object-cover" sizes="48px" unoptimized />
          </div>
        ) : (
          <div
            className={cn(
              "flex size-12 items-center justify-center rounded-full font-navbar text-base font-bold shadow-2xs",
              isSelected
                ? "bg-[#FFA51F] text-white"
                : "bg-neutral-100 text-[#1E1E1E]"
            )}
          >
            {initial}
          </div>
        )}
        {hasUnread && (
          <span className="absolute -right-0.5 -top-0.5 flex size-4.5 items-center justify-center rounded-full bg-[#EF4444] font-navbar text-[10px] font-bold text-white ring-2 ring-white animate-pulse">
            {conversation.unreadCount > 9 ? "9+" : conversation.unreadCount || 1}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-1.5">
          <span className={cn("truncate font-hero-heading text-sm sm:text-base", hasUnread ? "font-bold text-[#1E1E1E]" : "font-semibold text-[#1E1E1E]")}>
            {title}
          </span>
          <span className="shrink-0 font-navbar text-[11px] text-[#8C8C8C]">{conversation.time}</span>
        </div>
        <p className={cn("mt-0.5 truncate font-navbar text-xs sm:text-sm leading-snug", hasUnread ? "font-semibold text-[#1E1E1E]" : "text-[#5E5E5E]")}>
          {displayLastMessage}
        </p>
        <p className="mt-0.5 truncate font-navbar text-xs font-medium text-[#FFA51F]">{conversation.carName}</p>
      </div>
    </button>
  );
}
