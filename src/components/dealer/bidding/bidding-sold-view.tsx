"use client";

import Link from "next/link";
import { Calendar, FileText, Gauge, MapPin } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { ImageCarousel } from "@/components/seller/my-listings/image-carousel";
import type { DealerBiddingListing } from "@/components/dealer/dealer-dummy-data";
import { CarSpecsGrid } from "@/components/dealer/bidding/car-specs-grid";

type BiddingSoldViewProps = {
  listing: DealerBiddingListing;
  highestBid: string;
  totalOffers: number;
};

export function BiddingSoldView({ listing, highestBid, totalOffers }: BiddingSoldViewProps) {
  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <Link
        href={ROUTES.dealer.messages}
        className="inline-flex items-center gap-1 font-navbar text-sm font-medium text-[#5E5E5E] transition hover:text-[#1E1E1E]"
      >
        <span aria-hidden>←</span>
        Back to Message
      </Link>

      <h1 className="mt-4 font-hero-heading text-2xl font-bold text-[#1E1E1E] sm:text-3xl">Bidding Details</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:items-start">
        <div>
          <ImageCarousel images={listing.images} />
          <h2 className="mt-6 font-hero-heading text-xl font-bold text-[#1E1E1E] sm:text-2xl">{listing.title}</h2>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 font-navbar text-sm text-[#5E5E5E]">
            <span className="inline-flex items-center gap-1.5">
              <Gauge className="size-4 shrink-0" strokeWidth={2} aria-hidden />
              {listing.miles}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4 shrink-0" strokeWidth={2} aria-hidden />
              {listing.location}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="size-4 shrink-0" strokeWidth={2} aria-hidden />
              {listing.year}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <FileText className="size-4 shrink-0" strokeWidth={2} aria-hidden />
              {listing.vin}
            </span>
          </div>
          <p className="mt-4 font-navbar text-sm leading-relaxed text-[#5E5E5E] sm:text-base">{listing.description}</p>
          <CarSpecsGrid specs={listing.specs} />
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="font-hero-heading text-4xl font-bold tracking-tight text-[#FFA51F] sm:text-5xl">00:00:00</p>
              <span className="rounded-full bg-green-500 px-4 py-1 font-navbar text-xs font-semibold text-white sm:text-sm">
                Sold
              </span>
            </div>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-neutral-200">
              <div className="h-full w-full rounded-full bg-[#FFA51F]" />
            </div>
            <div className="mt-2 flex justify-between font-navbar text-xs text-[#5E5E5E] sm:text-sm">
              <span>Blind 1h50sec</span>
              <span>Open Last 10min</span>
            </div>
          </div>

          <div className="rounded-xl border border-[#E5E7EB] bg-white p-5">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="font-navbar text-xs text-[#5E5E5E] sm:text-sm">Highest Bid</p>
                <p className="mt-1 font-hero-heading text-2xl font-bold text-[#22C55E] sm:text-3xl">{highestBid}</p>
              </div>
              <div>
                <p className="font-navbar text-xs text-[#5E5E5E] sm:text-sm">Total Offers</p>
                <p className="mt-1 font-hero-heading text-2xl font-bold text-[#1E1E1E] sm:text-3xl">{totalOffers}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
