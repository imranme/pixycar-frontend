"use client";

import { Check, CheckCheck } from "lucide-react";
import type { ChatMessage } from "@/components/seller/messages/messages-dummy-data";
import { cn } from "@/lib/utils";

type ChatBubbleProps = {
  message: ChatMessage;
  currentRole: "seller" | "dealer";
  dealerPartyInitial: string;
  sellerPartyInitial: string;
};

function avatarInitial(message: ChatMessage, dealerPartyInitial: string, sellerPartyInitial: string) {
  return message.sender === "dealer" ? dealerPartyInitial : sellerPartyInitial;
}

export function ChatBubble({ message, currentRole, dealerPartyInitial, sellerPartyInitial }: ChatBubbleProps) {
  const isCurrentUser = message.sender === currentRole;
  const initial = avatarInitial(message, dealerPartyInitial, sellerPartyInitial);

  if (!isCurrentUser) {
    return (
      <div className="flex max-w-[85%] sm:max-w-[70%] gap-2.5 self-start items-end transition-all duration-200 animate-in fade-in slide-in-from-bottom-1">
        {/* Avatar */}
        <div
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#1E1E1E] text-white font-navbar text-xs font-bold shadow-xs"
          aria-hidden
        >
          {initial}
        </div>

        {/* Bubble */}
        <div className="min-w-0 flex flex-col items-start">
          <div className="rounded-2xl rounded-bl-xs bg-[#F3F4F6] border border-[#E5E7EB]/60 px-4 py-2.5 font-navbar text-sm leading-relaxed text-[#1E1E1E] shadow-2xs sm:text-base break-words">
            {message.text}
          </div>
          <span className="mt-1 pl-1 font-navbar text-[11px] text-[#8C8C8C]">{message.time}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex max-w-[85%] sm:max-w-[70%] gap-2.5 self-end items-end flex-row-reverse transition-all duration-200 animate-in fade-in slide-in-from-bottom-1">
      {/* Avatar */}
      <div
        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#FFA51F] text-white font-navbar text-xs font-bold shadow-xs"
        aria-hidden
      >
        {initial}
      </div>

      {/* Bubble */}
      <div className="min-w-0 flex flex-col items-end">
        <div className="rounded-2xl rounded-br-xs bg-gradient-to-br from-[#FFA51F] to-[#F59E0B] px-4 py-2.5 text-left font-navbar text-sm leading-relaxed text-[#1E1E1E] font-medium shadow-xs sm:text-base break-words">
          {message.text}
        </div>
        <div className="mt-1 flex items-center gap-1 pr-1 font-navbar text-[11px] text-[#8C8C8C]">
          <span>{message.time}</span>
          <CheckCheck className="size-3.5 text-[#FFA51F]" strokeWidth={2.2} aria-label="Delivered" />
        </div>
      </div>
    </div>
  );
}
