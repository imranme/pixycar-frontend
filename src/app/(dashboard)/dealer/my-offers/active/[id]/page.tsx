"use client";

import { use } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import type { DealerBiddingListing } from "@/components/dealer/dealer-dummy-data";
import type { ActiveOfferBidState } from "@/components/dealer/my-offers/dealer-my-offers-data";
import { ActiveOfferDetailClient } from "@/components/dealer/my-offers/active-offer-detail-client";
import { useGetListingByIdQuery, useGetMyRankQuery } from "@/store/features/listings/listingsApi";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function DealerActiveOfferPage({ params }: PageProps) {
  const { id } = use(params);
  const { data: apiListing, isLoading } = useGetListingByIdQuery(id);
  const { data: myRankData } = useGetMyRankQuery(id);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
        <Loader2 className="size-8 animate-spin text-[#FFA51F]" />
        <p className="font-navbar text-sm text-[#5E5E5E]">Loading offer details…</p>
      </div>
    );
  }

  let listing: DealerBiddingListing | undefined;

  if (apiListing && (apiListing as any).id) {
    const l = apiListing as any;
    listing = {
      id: String(l.id),
      phase: l.time_remaining_seconds > 0 ? "active" : "timeOver",
      title: `${l.year || ""} ${l.make || ""} ${l.model || ""} ${l.trim || ""}`.trim() || "Vehicle Details",
      miles: l.mileage ? `${Number(l.mileage).toLocaleString()} miles` : "N/A",
      location: l.seller_location ? (l.distance_display ? `${l.seller_location} (${l.distance_display})` : l.seller_location) : "USA",
      year: String(l.year || "N/A"),
      vin: l.registration_number ? `VIN/Reg: ${l.registration_number}` : "N/A",
      description: l.description || "Active vehicle details.",
      images: Array.isArray(l.images) && l.images.length > 0
        ? l.images
        : l.thumbnail
        ? [l.thumbnail]
        : ["https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=500&fit=crop"],
      specs: [
        { label: "Drivability", value: l.is_drivable ? "Yes" : "No" },
        { label: "Title status", value: l.title_status || "Clean" },
        { label: "Number of Keys", value: String(l.number_of_keys || 1) },
        { label: "Accident History", value: l.has_accident_history ? "Yes" : "No" },
        { label: "DRIVETRAIN", value: l.drivetrain || "N/A" },
        { label: "Tire Condition", value: l.tire_condition || "Good" },
        { label: "Trim", value: l.trim || "Standard" },
        { label: "Mechanical Condition", value: l.mechanical_condition || "Good" },
        { label: "Ownership Status", value: l.ownership_status || "Owned" },
        { label: "Body Type", value: l.body_type || "N/A" },
      ],
      timeRemainingSeconds: l.time_remaining_seconds ?? 7200,
      expiresAt: l.expires_at || undefined,
      currentHighestBid: l.current_highest_bid ? Number(l.current_highest_bid) : 0,
      totalOffers: l.total_offers ?? 0,
    };
  }

  const reserveOrZero = Number((apiListing as any)?.reserve_price || 0);
  const rawHighest = Number((apiListing as any)?.current_highest_bid || myRankData?.amount || reserveOrZero);
  const rawMyOffer = Number(myRankData?.amount || (apiListing as any)?.current_highest_bid || reserveOrZero);
  const timeRemainingSec = Number((apiListing as any)?.time_remaining_seconds || 0);

  const bid: ActiveOfferBidState = {
    position: myRankData?.position || 1,
    totalBidders: myRankData?.total_dealers || (apiListing as any)?.total_offers || 1,
    initialSecondsRemaining: timeRemainingSec,
    showFinalTenMinutes: timeRemainingSec <= 600,
    highest: rawHighest,
    minIncrement: 100,
    baseOffer: rawMyOffer,
  };

  if (!listing) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
        <h2 className="font-hero-heading text-xl font-bold text-[#1E1E1E]">Listing Not Found</h2>
        <Link
          href={ROUTES.dealer.myOffers}
          className="rounded-xl bg-[#FFA51F] px-5 py-2.5 font-navbar text-sm font-semibold text-[#1E1E1E] transition hover:bg-[#e8940f]"
        >
          Back to Offers
        </Link>
      </div>
    );
  }

  return <ActiveOfferDetailClient listing={listing} bid={bid} />;
}
