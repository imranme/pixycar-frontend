"use client";

import { useMemo, useState } from "react";
import { ListingCard, type ListingCardData } from "@/components/seller/my-listings/listing-card";
import { ListingsFilter, type ListingsFilterValue } from "@/components/seller/my-listings/listings-filter";
import { useGetMyListingsQuery } from "@/store/features/listings/listingsApi";
import { LoadingSpinner } from "@/components/shared/loading-spinner";

function mapStatus(apiStatus: string): "Active" | "TimeOver" | "Sold" | "Draft" {
  switch (apiStatus?.toUpperCase()) {
    case "ACTIVE":
      return "Active";
    case "SOLD":
      return "Sold";
    case "DRAFT":
      return "Draft";
    case "TIME_OVER":
    case "TIMEOVER":
    case "EXPIRED":
      return "TimeOver";
    default:
      return "Active";
  }
}

export default function SellerMyListingsPage() {
  const [filter, setFilter] = useState<ListingsFilterValue>("All");
  const { data, isLoading, error } = useGetMyListingsQuery();

  const allCards = useMemo<ListingCardData[]>(() => {
    if (!data?.results) return [];
    return data.results.map((l) => ({
      id: String(l.id),
      title: `${l.year} ${l.make} ${l.model} ${l.trim}`,
      offers: l.total_offers,
      location: "USA",
      highestBid: l.current_highest_bid !== null ? `$${l.current_highest_bid.toLocaleString()}` : "No bids",
      status: mapStatus(l.status),
      imageSrc: l.thumbnail || "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&h=800&fit=crop",
    }));
  }, [data]);

  const visible = useMemo(() => {
    if (filter === "All") return allCards;
    return allCards.filter((c) => c.status === filter);
  }, [allCards, filter]);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner className="size-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-md p-8 text-center">
        <p className="text-red-500 font-semibold">Failed to load listings.</p>
        <p className="text-sm text-neutral-500 mt-1">Please try refreshing the page.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-screen-2xl flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <h1 className="font-hero-heading text-2xl font-bold text-[#1E1E1E] sm:text-3xl">My Listings</h1>
      <p className="mt-2 font-navbar text-sm text-[#5E5E5E] sm:text-base">Here is your listing overview</p>

      <ListingsFilter value={filter} onChange={setFilter} />

      {visible.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-neutral-300 p-12 text-center bg-white/50">
          <p className="font-navbar text-[#5E5E5E]">No listings found in this category.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}
