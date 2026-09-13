"use client";

import { useState } from "react";
import {
  TrendingUp,
  Video,
  ChevronDown,
  Car,
  Fuel,
  Gauge,
  Palette,
  Key,
  Shield,
  CheckCircle2,
  XCircle,
  FileText,
} from "lucide-react";
import type { SellerListingDetail } from "@/components/seller/my-listings/listings-dummy-data";
import { ImageCarousel } from "@/components/seller/my-listings/image-carousel";
import { OfferRow } from "@/components/seller/my-listings/offer-row";
import { useAuctionTimer } from "@/hooks/use-auction-timer";
import { cn } from "@/lib/utils";

type ActiveOffersViewProps = {
  listing: SellerListingDetail;
};

export function ActiveOffersView({ listing }: ActiveOffersViewProps) {
  const [showAllOffers, setShowAllOffers] = useState(false);

  const { formattedTime } = useAuctionTimer({
    expiresAt: listing.expiresAt,
    timeRemainingSeconds: listing.timerSeconds,
    isLive: listing.status === "Active",
    totalDurationSeconds: 7200,
  });

  const topOffer = listing.offers[0];
  const highestDisplay = topOffer?.amount ?? listing.highestBid;
  const hasImages = Array.isArray(listing.images) && listing.images.length > 0;

  // Show top 4 offers by default, or all if expanded
  const visibleOffers = showAllOffers ? listing.offers : listing.offers.slice(0, 4);
  const remainingCount = listing.offers.length - 4;

  const specs = [
    { icon: Car, label: "Body Type", value: listing.bodyType },
    { icon: Fuel, label: "Drivetrain", value: listing.drivetrain },
    { icon: Gauge, label: "Mileage", value: listing.mileage },
    { icon: Palette, label: "Color", value: listing.color },
    { icon: Key, label: "Keys", value: listing.numberOfKeys !== undefined ? String(listing.numberOfKeys) : undefined },
    { icon: Shield, label: "Ownership", value: listing.ownershipStatus },
    { icon: CheckCircle2, label: "Drivable", value: listing.isDrivable !== undefined ? (listing.isDrivable ? "Yes" : "No") : undefined },
    { icon: XCircle, label: "Accident History", value: listing.hasAccidentHistory !== undefined ? (listing.hasAccidentHistory ? "Yes" : "No") : undefined },
    { icon: Car, label: "Tire Condition", value: listing.tireCondition },
    { icon: Shield, label: "Mechanical Condition", value: listing.mechanicalCondition },
  ].filter((s) => s.value !== undefined && s.value !== null && s.value !== "" && s.value !== "N/A");

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start">
      {/* ── Left Column: Media & Specifications ── */}
      <div className="flex flex-col gap-6">
        {hasImages && <ImageCarousel images={listing.images} />}

        {/* Video Player */}
        {listing.videoUrl && (
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-[#FFA51F]/15 text-[#FFA51F]">
                <Video className="size-4.5" strokeWidth={2} />
              </div>
              <h2 className="font-hero-heading text-lg font-bold text-[#1E1E1E]">
                Vehicle Video Walkthrough
              </h2>
            </div>
            <div className="overflow-hidden rounded-xl border border-neutral-200 bg-black aspect-video max-h-[380px] w-full">
              <video
                src={listing.videoUrl}
                controls
                playsInline
                preload="metadata"
                className="size-full object-contain mx-auto"
              />
            </div>
          </div>
        )}

        {/* ── Vehicle Specifications & Details ── */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E5E7EB]">
            <div className="flex size-8 items-center justify-center rounded-lg bg-[#FFA51F]/15 text-[#FFA51F]">
              <FileText className="size-4.5" strokeWidth={2} />
            </div>
            <h2 className="font-hero-heading text-lg font-bold text-[#1E1E1E]">
              Vehicle Overview & Specifications
            </h2>
          </div>

          {/* Description */}
          {listing.description && (
            <div>
              <h3 className="font-hero-heading text-sm font-bold text-[#1E1E1E]">Description</h3>
              <p className="mt-1 font-navbar text-sm leading-relaxed text-[#5E5E5E]">
                {listing.description}
              </p>
            </div>
          )}

          {/* Specs Grid */}
          {specs.length > 0 && (
            <div>
              <h3 className="font-hero-heading text-sm font-bold text-[#1E1E1E]">Specifications</h3>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {specs.map((s) => (
                  <div
                    key={s.label}
                    className="flex items-start gap-2.5 rounded-xl border border-[#E5E7EB] bg-neutral-50/70 p-3"
                  >
                    <s.icon className="mt-0.5 size-4 shrink-0 text-[#FFA51F]" strokeWidth={2} />
                    <div className="min-w-0 flex-1">
                      <p className="font-navbar text-xs text-[#9CA3AF]">{s.label}</p>
                      <p className="mt-0.5 truncate font-navbar text-sm font-semibold text-[#1E1E1E]">
                        {s.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Options & Features */}
          {listing.options && listing.options.length > 0 && (
            <div>
              <h3 className="font-hero-heading text-sm font-bold text-[#1E1E1E]">Features & Options</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {listing.options.map((opt, i) => (
                  <span
                    key={i}
                    className="rounded-lg bg-neutral-100 px-3 py-1 font-navbar text-xs font-medium text-[#1E1E1E]"
                  >
                    {opt}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Registration Number */}
          {listing.registrationNumber && (
            <div className="rounded-xl border border-[#E5E7EB] bg-neutral-50/80 p-3 flex justify-between items-center">
              <span className="font-navbar text-xs text-[#9CA3AF]">Registration Number</span>
              <span className="font-navbar text-sm font-bold text-[#1E1E1E]">
                {listing.registrationNumber}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Right Column: Auction Metrics & Live Bids Stream ── */}
      <div className="flex flex-col gap-6">
        {/* Auction Card */}
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

        {/* All Offers Stream (Top 4 with See More) */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="font-hero-heading text-lg font-bold text-[#1E1E1E] sm:text-xl">
              All Offers ({listing.offers.length})
            </h2>
            {listing.offers.length > 0 && (
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 font-navbar text-xs font-semibold text-emerald-600">
                Live Stream
              </span>
            )}
          </div>

          {listing.offers.length > 0 ? (
            <div className="mt-3 flex flex-col gap-2">
              {visibleOffers.map((o, idx) => (
                <OfferRow
                  key={`${o.dealerId}-${idx}`}
                  dealerName={o.dealerId}
                  timeAgo={o.timeAgo}
                  amount={o.amount}
                  isHighest={o.isHighest}
                  layout="list"
                />
              ))}

              {/* See More / Show Less Toggle Button */}
              {listing.offers.length > 4 && (
                <button
                  type="button"
                  onClick={() => setShowAllOffers((prev) => !prev)}
                  className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#E5E7EB] bg-neutral-50/90 py-2.5 font-navbar text-xs font-semibold text-[#1E1E1E] transition hover:bg-neutral-100 hover:text-[#FFA51F] cursor-pointer"
                >
                  <span>
                    {showAllOffers
                      ? "Show less"
                      : `See more (${remainingCount} more ${remainingCount === 1 ? "offer" : "offers"})`}
                  </span>
                  <ChevronDown
                    className={cn(
                      "size-4 transition-transform duration-200",
                      showAllOffers && "rotate-180"
                    )}
                  />
                </button>
              )}
            </div>
          ) : (
            <div className="flex min-h-[140px] items-center justify-center py-6">
              <p className="text-center font-navbar text-base text-[#9CA3AF]">
                No offers yet. Incoming bids will appear here live.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
