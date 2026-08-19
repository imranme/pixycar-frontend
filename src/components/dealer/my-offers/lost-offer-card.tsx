"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";
import type { LostOfferListItem } from "@/components/dealer/my-offers/dealer-my-offers-data";

type LostOfferCardProps = {
  offer: LostOfferListItem;
  onDelete: (id: string) => void;
};

export function LostOfferCard({ offer, onDelete }: LostOfferCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[#E5E7EB] bg-white p-4">
      <div className="relative size-20 shrink-0 overflow-hidden rounded-xl">
        <Image src={offer.image} alt="" fill className="object-cover" sizes="80px" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-hero-heading text-base font-bold text-[#1E1E1E] sm:text-lg">{offer.car}</p>
        <p className="mt-1 font-navbar text-sm text-[#5E5E5E]">Your offer: {offer.offer}</p>
        <p className="mt-1 font-navbar text-xs text-[#5E5E5E] sm:text-sm">
          Winning: {offer.winning} • You were #{offer.yourRank}
        </p>
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          console.log("deleted lost offer:", offer.id);
          onDelete(offer.id);
        }}
        className="shrink-0 cursor-pointer rounded-lg p-2 text-[#EF4444] transition hover:bg-red-50"
        aria-label="Remove lost offer"
      >
        <Trash2 className="size-5" strokeWidth={2} />
      </button>
    </div>
  );
}
