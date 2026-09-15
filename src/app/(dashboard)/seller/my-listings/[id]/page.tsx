"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Car, Loader2 } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { ActiveOffersView } from "@/components/seller/my-listings/active-offers-view";
import { OfferingCompleteView } from "@/components/seller/my-listings/offering-complete-view";
import { TimeOverView } from "@/components/seller/my-listings/time-over-view";
import { useGetListingByIdQuery, useGetListingOffersQuery } from "@/store/features/listings/listingsApi";
import type { SellerListingDetail, OfferRowData } from "@/components/seller/my-listings/listings-dummy-data";

function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function SellerListingDetailPage() {
  const params = useParams();
  const id = params?.id ? String(params.id) : "";
  const listingId = Number(id);

  const { data: apiListing, isLoading, isError } = useGetListingByIdQuery(listingId, {
    skip: !listingId || isNaN(listingId),
  });

  const { data: offersData } = useGetListingOffersQuery(listingId, {
    skip: !listingId || isNaN(listingId),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
        <Loader2 className="size-8 animate-spin text-[#FFA51F]" strokeWidth={2} />
        <p className="font-navbar text-sm text-[#9CA3AF]">Loading listing details…</p>
      </div>
    );
  }

  if (isError || !apiListing) {
    return (
      <div className="mx-auto w-full max-w-screen-2xl flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <Link
          href={ROUTES.seller.myListings}
          className="inline-flex items-center gap-1 font-navbar text-sm font-medium text-[#5E5E5E] transition hover:text-[#1E1E1E]"
        >
          <span aria-hidden>←</span>
          Back to Listings
        </Link>
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
          <Car className="size-16 text-neutral-300" strokeWidth={1.2} />
          <h2 className="font-hero-heading text-xl font-bold text-[#1E1E1E]">Listing not found</h2>
          <p className="font-navbar text-sm text-[#5E5E5E]">
            The listing you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  // Raw items array from /marketplace/listings/:id/offers/ API or fallback to top_bids
  const rawOffers = offersData?.results && offersData.results.length > 0
    ? offersData.results
    : Array.isArray(offersData) && offersData.length > 0
    ? offersData
    : apiListing.top_bids || [];

  // Find maximum numeric bid amount among all offers
  const maxBidAmount = rawOffers.reduce((max: number, item: any) => {
    const num = Number(item.amount) || 0;
    return num > max ? num : max;
  }, 0);

  // Determine if the auction is still running (before isTimeOver is declared below)
  const auctionIsActive =
    apiListing.status === "ACTIVE" &&
    (apiListing.time_remaining_seconds === undefined || Number(apiListing.time_remaining_seconds) > 0) &&
    (!apiListing.expires_at || new Date(apiListing.expires_at).getTime() > Date.now());

  // Map to OfferRowData with correct isHighest calculation.
  // During an ACTIVE auction the seller must NOT see real dealer names — show "Dealer 1", "Dealer 2" etc.
  // After the auction ends the backend already reveals real names, so we use dealer_name directly.
  const offersList: OfferRowData[] = rawOffers.map((offer: any, index: number) => {
    const numAmount = Number(offer.amount) || 0;
    const displayName = auctionIsActive
      ? `Dealer ${index + 1}`
      : offer.dealer_name || `Dealer ${index + 1}`;
    return {
      id: offer.id ?? index,
      dealerId: displayName,
      dealerNumericId: offer.dealer_id || offer.dealer?.id,
      timeAgo: offer.placed_at ? formatRelativeTime(offer.placed_at) : "Recently",
      amount: `$${numAmount.toLocaleString()}`,
      numericAmount: numAmount,
      isHighest: maxBidAmount > 0 && numAmount === maxBidAmount,
    };
  });

  // Sort offers by numeric amount descending (highest bid first)
  offersList.sort((a, b) => (b.numericAmount ?? 0) - (a.numericAmount ?? 0));

  const highestBidStr = offersList.length > 0
    ? offersList[0].amount
    : apiListing.current_highest_bid !== null
      ? `$${Number(apiListing.current_highest_bid).toLocaleString()}`
      : "No bids";

  // Check if auction is completed (time over, expired, sold, or remaining time <= 0)
  const isTimeOver =
    apiListing.status === "TIME_OVER" ||
    apiListing.status === "TIMEOVER" ||
    apiListing.status === "EXPIRED" ||
    apiListing.status === "SOLD" ||
    (apiListing.time_remaining_seconds !== undefined && Number(apiListing.time_remaining_seconds) <= 0) ||
    (apiListing.expires_at && new Date(apiListing.expires_at).getTime() <= Date.now());

  const effectiveStatus: "Active" | "TimeOver" | "Sold" | "Draft" = isTimeOver
    ? apiListing.status === "SOLD"
      ? "Sold"
      : "TimeOver"
    : apiListing.status === "DRAFT"
    ? "Draft"
    : "Active";

  // Map API MarketplaceListing to SellerListingDetail
  const listing: SellerListingDetail = {
    id: String(apiListing.id),
    title: `${apiListing.year || ""} ${apiListing.make || ""} ${apiListing.model || ""} ${apiListing.trim || ""}`.trim() || "Vehicle Listing",
    mileage: apiListing.mileage ? `${apiListing.mileage.toLocaleString()} km` : "N/A",
    location: "USA",
    offersCount: offersData?.count ?? (offersList.length || apiListing.total_offers),
    highestBid: highestBidStr,
    status: effectiveStatus,
    imageSrc: (apiListing.images && apiListing.images[0]) || "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&h=800&fit=crop",
    images: apiListing.images && apiListing.images.length > 0 ? apiListing.images : ["https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&h=800&fit=crop"],
    videoUrl: apiListing.video_file || null,
    offers: offersList,
    timerSeconds: apiListing.time_remaining_seconds,
    expiresAt: apiListing.expires_at || undefined,
    year: apiListing.year,
    make: apiListing.make,
    model: apiListing.model,
    trim: apiListing.trim,
    color: apiListing.color,
    bodyType: apiListing.body_type,
    ownershipStatus: apiListing.ownership_status,
    numberOfKeys: apiListing.number_of_keys,
    tireCondition: apiListing.tire_condition,
    drivetrain: apiListing.drivetrain,
    hasAccidentHistory: apiListing.has_accident_history,
    isDrivable: apiListing.is_drivable,
    description: apiListing.description,
    mechanicalCondition: apiListing.mechanical_condition,
    registrationNumber: apiListing.registration_number,
    options: apiListing.options,
  };

  const isTimeOverWithoutOffers = effectiveStatus === "TimeOver" && listing.offers.length === 0;
  const pageTitle =
    effectiveStatus === "Active" ? "Active Offers" : isTimeOverWithoutOffers ? "Time Over" : null;

  return (
    <div className="mx-auto w-full max-w-screen-2xl flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <Link
        href={ROUTES.seller.myListings}
        className="inline-flex items-center gap-1 font-navbar text-sm font-medium text-[#5E5E5E] transition hover:text-[#1E1E1E]"
      >
        <span aria-hidden>←</span>
        Back to Listings
      </Link>

      {pageTitle ? (
        <h1 className="mt-6 font-hero-heading text-2xl font-bold text-[#1E1E1E] sm:text-3xl">{pageTitle}</h1>
      ) : null}

      <div className={pageTitle ? "mt-8" : "mt-6"}>
        {effectiveStatus === "Active" ? <ActiveOffersView listing={listing} /> : null}
        {effectiveStatus === "TimeOver" || effectiveStatus === "Sold" ? (
          listing.offers.length > 0 ? (
            <OfferingCompleteView listing={listing} />
          ) : (
            <TimeOverView listing={listing} />
          )
        ) : null}
      </div>
    </div>
  );
}
