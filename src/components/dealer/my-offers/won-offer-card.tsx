"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageSquareCheck } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import type { WonOfferListItem } from "@/components/dealer/my-offers/dealer-my-offers-data";

const UNLOCK_FEE = "$69.95";

type WonOfferCardProps = {
  offer: WonOfferListItem;
};

export function WonOfferCard({ offer }: WonOfferCardProps) {
  const isUnlocked = Boolean(offer.isChatUnlocked);
  const chatHref = offer.chatThreadId
    ? `${ROUTES.dealer.messages}?roomId=${offer.chatThreadId}`
    : ROUTES.dealer.messages;

  const href = isUnlocked ? chatHref : ROUTES.dealer.myOffersUnlockChat(offer.id);

  return (
    <div className={`overflow-hidden rounded-2xl border bg-white ${isUnlocked ? "border-emerald-300 shadow-sm" : "border-green-200"}`}>
      <Link
        href={href}
        className="block cursor-pointer p-4 transition hover:bg-green-50/30"
      >
        <div className="flex items-start gap-3">
          <div className="relative size-20 shrink-0 overflow-hidden rounded-xl">
            <Image src={offer.image} alt="" fill className="object-cover" sizes="80px" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="font-hero-heading text-base font-bold text-[#1E1E1E] sm:text-lg">{offer.car}</p>
              {isUnlocked && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                  <span className="size-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Connected
                </span>
              )}
            </div>
            <p className="mt-1 font-hero-heading text-xl font-bold text-emerald-600 sm:text-2xl">{offer.winningPrice}</p>
            <p className="mt-1 font-navbar text-xs text-[#5E5E5E] sm:text-sm">
              {isUnlocked ? "Chat Unlocked • Ready to message" : offer.relativeTime}
            </p>
          </div>
        </div>
      </Link>
      <div className={`border-t px-4 pb-4 pt-2 ${isUnlocked ? "border-emerald-100 bg-emerald-50/40" : "border-green-100"}`}>
        {isUnlocked ? (
          <Link
            href={chatHref}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 font-navbar text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 sm:text-base"
          >
            <MessageSquareCheck className="size-5" />
            Connected • Open Chat
          </Link>
        ) : (
          <Link
            href={href}
            className="flex w-full cursor-pointer items-center justify-center rounded-xl bg-[#FFA51F] py-3.5 font-navbar text-sm font-bold text-[#1E1E1E] transition hover:bg-[#e8940f] sm:text-base"
          >
            Unlock Connection - {UNLOCK_FEE}
          </Link>
        )}
      </div>
    </div>
  );
}
