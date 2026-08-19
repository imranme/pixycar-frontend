"use client";

import Link from "next/link";
import { Car, Loader2 } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { useGetMarketplaceListingsQuery } from "@/store/features/listings/listingsApi";
import { ListingCard } from "@/features/listings/components/listing-card";

export default function BrowseLiveListingsPage() {
  const { data, isLoading, isError } = useGetMarketplaceListingsQuery();
  const listings = data?.results ?? [];

  return (
    <div className="min-h-[60vh] bg-[#F9FAFB] py-10 sm:py-12 lg:py-16">
      <div className="mx-auto w-full max-w-screen-2xl px-3 sm:px-4 lg:px-6">
        <Link
          href={`${ROUTES.home}#browse-cars`}
          className="inline-flex items-center gap-1 font-navbar text-sm font-medium text-[#5E5E5E] transition hover:text-[#1E1E1E]"
        >
          <span aria-hidden>←</span>
          Back to Home
        </Link>

        <div className="mt-6">
          <h1 className="font-hero-heading text-3xl font-semibold leading-tight tracking-tight text-[#1E1E1E] sm:text-4xl">
            Live Listings
          </h1>
          <p className="mt-2 max-w-2xl font-navbar text-base leading-relaxed text-[#5E5E5E]">
            All cars currently accepting offers from dealers. Select a listing to view details.
          </p>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="mt-16 flex flex-col items-center justify-center gap-3">
            <Loader2 className="size-8 animate-spin text-[#FFA51F]" strokeWidth={2} />
            <p className="font-navbar text-sm text-[#9CA3AF]">Loading listings…</p>
          </div>
        )}

        {/* Error state */}
        {isError && (
          <div className="mt-16 flex flex-col items-center justify-center gap-3">
            <Car className="size-12 text-neutral-300" strokeWidth={1.5} />
            <p className="font-navbar text-sm text-[#5E5E5E]">
              Unable to load listings. Please try again later.
            </p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && listings.length === 0 && (
          <div className="mt-16 flex flex-col items-center justify-center gap-3">
            <Car className="size-12 text-neutral-300" strokeWidth={1.5} />
            <p className="font-navbar text-sm text-[#5E5E5E]">
              No listings available right now. Check back soon!
            </p>
          </div>
        )}

        {/* Listing grid */}
        {!isLoading && listings.length > 0 && (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
