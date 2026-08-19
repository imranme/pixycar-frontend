"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Clock, Leaf, TriangleAlert } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import type { ActiveOfferListItem } from "@/components/dealer/my-offers/dealer-my-offers-data";
import { cn } from "@/lib/utils";

type ActiveOfferCardProps = {
  offer: ActiveOfferListItem;
};

export function ActiveOfferCard({ offer }: ActiveOfferCardProps) {
  const router = useRouter();
  const href = ROUTES.dealer.myOffersActive(offer.id);
  const showExpand = !offer.isLeading;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => {
        console.log("active offer card click:", offer.id);
        router.push(href);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          router.push(href);
        }
      }}
      className="cursor-pointer overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white transition hover:bg-gray-50/80"
    >
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center gap-3">
          <div className="relative size-20 shrink-0 overflow-hidden rounded-xl">
            <Image src={offer.image} alt="" fill className="object-cover" sizes="80px" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-hero-heading text-base font-bold text-[#1E1E1E] sm:text-lg">{offer.car}</p>
            <p className="mt-1 font-navbar text-sm text-[#5E5E5E]">Your offer: {offer.offer}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {offer.isLeading ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-0.5 font-navbar text-xs font-semibold text-green-600 sm:text-sm">
                  <Leaf className="size-3.5 shrink-0" strokeWidth={2} aria-hidden />
                  Leading
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-0.5 font-navbar text-xs font-semibold text-orange-600 sm:text-sm">
                  <TriangleAlert className="size-3.5 shrink-0" strokeWidth={2} aria-hidden />
                  Leading
                </span>
              )}
              <span className="inline-flex items-center gap-1 rounded-full border border-[#E5E7EB] bg-white px-3 py-0.5 font-navbar text-xs text-[#5E5E5E] sm:text-sm">
                <Clock className="size-3.5" strokeWidth={2} aria-hidden />
                {offer.timeLeft}
              </span>
            </div>
          </div>
        </div>
      </div>

      {showExpand ? (
        <div
          className={cn(
            "flex items-center justify-between gap-3 border-t border-[#E5E7EB]/60 px-4 py-3",
            "rounded-b-2xl bg-[#FFFBF5]"
          )}
        >
          <div>
            <p className="font-hero-heading text-sm font-bold text-[#1E1E1E] sm:text-base">Position #{offer.position}</p>
            {offer.highest ? (
              <p className="mt-0.5 font-navbar text-xs text-[#5E5E5E] sm:text-sm">Highest: {offer.highest}</p>
            ) : null}
          </div>
          <span
            className="shrink-0 font-navbar text-sm font-semibold text-[#FFA51F] sm:text-base"
            onClick={(e) => {
              e.stopPropagation();
              console.log("improve offer link:", offer.id);
              router.push(href);
            }}
          >
            Improve Offer →
          </span>
        </div>
      ) : null}
    </div>
  );
}
