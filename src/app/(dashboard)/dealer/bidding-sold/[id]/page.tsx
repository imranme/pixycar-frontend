"use client";

import { use } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { BiddingSoldView } from "@/components/dealer/bidding/bidding-sold-view";
import { useGetListingByIdQuery } from "@/store/features/listings/listingsApi";
import { getDealerBiddingListing, type DealerBiddingListing } from "@/components/dealer/dealer-dummy-data";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function DealerBiddingSoldPage({ params }: PageProps) {
  const { id } = use(params);
  const { data: apiListing, isLoading } = useGetListingByIdQuery(id);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
        <Loader2 className="size-8 animate-spin text-[#FFA51F]" />
        <p className="font-navbar text-sm text-[#5E5E5E]">Loading sold listing…</p>
      </div>
    );
  }

  let listing: DealerBiddingListing | undefined;

  if (apiListing && (apiListing as any).id) {
    const l = apiListing as any;
    listing = {
      id: String(l.id),
      phase: "timeOver",
      title: `${l.year || ""} ${l.make || ""} ${l.model || ""} ${l.trim || ""}`.trim() || "Vehicle Details",
      miles: l.mileage ? `${Number(l.mileage).toLocaleString()} miles` : "N/A",
      location: l.seller_name || "USA",
      year: String(l.year || "N/A"),
      vin: l.registration_number ? `VIN/Reg: ${l.registration_number}` : "N/A",
      description: l.description || "Sold vehicle details.",
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
    };
  }

  if (!listing) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
        <h2 className="font-hero-heading text-xl font-bold text-[#1E1E1E]">Listing Not Found</h2>
        <Link
          href={ROUTES.dealer.dashboard}
          className="rounded-xl bg-[#FFA51F] px-5 py-2.5 font-navbar text-sm font-semibold text-[#1E1E1E] transition hover:bg-[#e8940f]"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const highestBid = (apiListing as any)?.current_highest_bid
    ? `$${Number((apiListing as any).current_highest_bid).toLocaleString()}`
    : (apiListing as any)?.reserve_price
    ? `$${Number((apiListing as any).reserve_price).toLocaleString()}`
    : "$0";
  const totalOffers = (apiListing as any)?.total_offers ?? 0;

  return <BiddingSoldView listing={listing} highestBid={highestBid} totalOffers={totalOffers} />;
}
