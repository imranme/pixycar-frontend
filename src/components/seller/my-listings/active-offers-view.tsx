"use client";

import { TrendingUp } from "lucide-react";
import type { SellerListingDetail } from "@/components/seller/my-listings/listings-dummy-data";
import { ImageCarousel } from "@/components/seller/my-listings/image-carousel";
import { OfferRow } from "@/components/seller/my-listings/offer-row";
import { useAuctionTimer } from "@/hooks/use-auction-timer";

type ActiveOffersViewProps = {
  listing: SellerListingDetail;
};

export function ActiveOffersView({ listing }: ActiveOffersViewProps) {
  const { formattedTime } = useAuctionTimer({
    expiresAt: listing.expiresAt,
    timeRemainingSeconds: listing.timerSeconds,
    isLive: listing.status === "Active",
    totalDurationSeconds: 3600,
  });

  const topOffer = listing.offers[0];
  const highestDisplay = topOffer?.amount ?? listing.highestBid;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
      <div>
        <ImageCarousel images={listing.images} />
        <div className="mt-6 rounded-2xl border border-[#E5E7EB] bg-white p-4 sm:p-6">
          <h2 className="font-hero-heading text-lg font-bold text-[#1E1E1E] sm:text-xl">
            All Offers ({listing.offers.length})
          </h2>
          {listing.offers.length > 0 ? (
            <div className="mt-2">
              {listing.offers.map((o, idx) => (
                <OfferRow
                  key={`${o.dealerId}-${idx}`}
                  dealerName={o.dealerId}
                  timeAgo={o.timeAgo}
                  amount={o.amount}
                  isHighest={o.isHighest}
                  layout="list"
                />
              ))}
            </div>
          ) : (
            <div className="flex min-h-[160px] items-center justify-center py-8">
              <p className="text-center font-navbar text-lg text-[#9CA3AF] sm:text-xl">No offer are here</p>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-sky-100 bg-sky-50/60 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-hero-heading text-xl font-bold text-[#1E1E1E] sm:text-2xl">{listing.title}</h2>
            <p className="mt-1 font-navbar text-sm text-[#5E5E5E] sm:text-base">{listing.mileage}</p>
          </div>
          <span className="shrink-0 rounded-full bg-[#FFA51F] px-3 py-1 font-navbar text-xs font-semibold text-white">
            Active
          </span>
        </div>

        <div className="my-5 border-t border-[#E5E7EB]" />

        <p className="font-navbar text-sm text-[#5E5E5E]">Time Remaining</p>
        <p className="mt-1 font-hero-heading text-3xl font-bold tracking-tight text-[#1E1E1E] sm:text-4xl">
          {formattedTime}
        </p>

        <div className="my-5 border-t border-[#E5E7EB]" />

        <p className="font-navbar text-sm text-[#5E5E5E]">Current Highest Offers</p>
        <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-white p-4 shadow-sm">
          <p className="font-hero-heading text-2xl font-bold text-[#FFA51F] sm:text-3xl">{highestDisplay}</p>
          <TrendingUp className="size-8 shrink-0 text-emerald-500 sm:size-9" strokeWidth={2} aria-hidden />
        </div>
      </div>
    </div>
  );
}
