"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { MessageSquare, Lock } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import type { ChatMessage } from "@/components/seller/messages/messages-dummy-data";
import { ChatBubble } from "@/components/seller/messages/chat-bubble";
import { ChatHeader } from "@/components/seller/messages/chat-header";
import { ChatInput } from "@/components/seller/messages/chat-input";
import { DealerChatHeader } from "@/components/dealer/messages/dealer-chat-header";
import { TypingIndicator } from "@/components/seller/messages/typing-indicator";

type ChatWindowProps = {
  dealerId: string;
  dealerName: string;
  dealerInitial: string;
  dealerImage: string | null;
  carName: string;
  messages: ChatMessage[];
  inputValue: string;
  onInputChange: (v: string) => void;
  onSend: () => void;
  showMobileBack?: boolean;
  onMobileBack?: () => void;
  contactProfileHref?: string;
  currentRole?: "seller" | "dealer";
  dealerPartyInitial?: string;
  sellerPartyInitial?: string;
  sellerId?: string;
  sellerName?: string;
  sellerInitial?: string;
  sellerImage?: string | null;
  biddingSoldListingId?: string;
  isPartnerTyping?: boolean;
  isUnlocked?: boolean;
};

export function ChatWindow({
  dealerId,
  dealerName,
  dealerInitial,
  dealerImage,
  carName,
  messages,
  inputValue,
  onInputChange,
  onSend,
  showMobileBack,
  onMobileBack,
  contactProfileHref,
  currentRole = "seller",
  dealerPartyInitial,
  sellerPartyInitial = "J",
  sellerId,
  sellerName,
  sellerInitial,
  sellerImage,
  biddingSoldListingId,
  isPartnerTyping = false,
  isUnlocked = true,
}: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dInitial = dealerPartyInitial ?? dealerInitial;
  const sInitial = sellerPartyInitial;

  // Smooth scroll to bottom whenever new message arrives or partner starts typing
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isPartnerTyping]);

  // Instant scroll on room change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [dealerId, sellerId]);

  const isDealerInbox = currentRole === "dealer" && sellerId && sellerName;
  const partnerInitial = currentRole === "dealer" ? sInitial : dInitial;

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white lg:min-h-[calc(100dvh-12rem)] shadow-xs rounded-r-2xl overflow-hidden border-l border-[#E5E7EB]/70">
      {isDealerInbox ? (
        <DealerChatHeader
          sellerId={sellerId}
          sellerName={sellerName}
          sellerInitial={sellerInitial ?? "J"}
          sellerImage={sellerImage ?? null}
          carName={carName}
          biddingSoldListingId={biddingSoldListingId}
          showMobileBack={showMobileBack}
          onMobileBack={onMobileBack}
        />
      ) : (
        <ChatHeader
          dealerId={dealerId}
          dealerName={dealerName}
          dealerInitial={dealerInitial}
          dealerImage={dealerImage}
          carName={carName}
          showMobileBack={showMobileBack}
          onMobileBack={onMobileBack}
          contactProfileHref={contactProfileHref}
        />
      )}

      {/* Messages Feed Container */}
      <div
        ref={containerRef}
        className="min-h-0 flex-1 overflow-y-auto bg-[#F8FAFC] px-4 py-5 scroll-smooth"
      >
        <div className="mx-auto flex max-w-4xl flex-col gap-3">
          {messages.length === 0 ? (
            <div className="my-auto flex flex-col items-center justify-center py-16 text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-amber-50 text-[#FFA51F] shadow-xs">
                <MessageSquare className="size-7" />
              </div>
              <h3 className="mt-3 font-hero-heading text-base font-bold text-[#1E1E1E]">
                Direct Chat Connected
              </h3>
              <p className="mt-1 max-w-xs font-navbar text-xs text-[#5E5E5E]">
                Discuss pickup, inspection, or finalize deal details directly here.
              </p>
            </div>
          ) : (
            messages.map((m) => (
              <ChatBubble
                key={m.id}
                message={m}
                currentRole={currentRole}
                dealerPartyInitial={dInitial}
                sellerPartyInitial={sInitial}
              />
            ))
          )}

          {/* Dancing Dots Typing Indicator */}
          {isPartnerTyping && <TypingIndicator partnerInitial={partnerInitial} />}

          <div ref={bottomRef} aria-hidden className="h-2 shrink-0" />
        </div>
      </div>

      {currentRole === "seller" && !isUnlocked && (
        <div className="flex items-center gap-2 border-t border-amber-100 bg-amber-50/70 px-4 py-2 font-navbar text-xs font-medium text-amber-800">
          <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
          Waiting for dealer to unlock connection ($69.95). Your messages will be delivered and ready for the dealer.
        </div>
      )}

      {currentRole === "dealer" && !isUnlocked ? (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E5E7EB] bg-amber-50/80 px-5 py-3.5 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-[#FFA51F]">
              <Lock className="size-4" />
            </div>
            <div>
              <p className="font-hero-heading text-sm font-bold text-[#1E1E1E]">Chat is Locked</p>
              <p className="font-navbar text-xs text-[#5E5E5E]">
                Unlock this connection ($69.95) to message the seller directly.
              </p>
            </div>
          </div>
          <Link
            href={
              biddingSoldListingId
                ? ROUTES.dealer.myOffersUnlockChat(biddingSoldListingId)
                : ROUTES.dealer.myOffers
            }
            className="shrink-0 rounded-xl bg-[#FFA51F] px-4 py-2.5 font-navbar text-xs font-bold text-[#1E1E1E] shadow-sm transition hover:bg-[#e8940f]"
          >
            Unlock Connection - $69.95
          </Link>
        </div>
      ) : (
        <ChatInput value={inputValue} onChange={onInputChange} onSend={onSend} />
      )}
    </div>
  );
}
