"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Car,
  CheckCircle2,
  Clock,
  Fuel,
  Gauge,
  Key,
  Palette,
  Shield,
  Trophy,
  User,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetListingByIdQuery } from "@/store/features/listings/listingsApi";
import { ImageCarousel } from "@/components/seller/my-listings/image-carousel";
import type { MarketplaceListing, TopBid } from "@/store/features/listings/listingsApi.types";

/* ── Helpers ── */

function statusConfig(status: string) {
  switch (status.toUpperCase()) {
    case "ACTIVE":
      return { label: "Live", color: "bg-emerald-500 text-white", pulse: true };
    case "SOLD":
      return { label: "Sold", color: "bg-violet-600 text-white", pulse: false };
    case "EXPIRED":
      return { label: "Expired", color: "bg-red-500 text-white", pulse: false };
    case "DRAFT":
      return { label: "Draft", color: "bg-neutral-400 text-white", pulse: false };
    default:
      return { label: status, color: "bg-neutral-300 text-[#1E1E1E]", pulse: false };
  }
}

function formatTimeRemaining(seconds: number): string {
  if (seconds <= 0) return "00:00:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

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

/* ── Spec grid for the detail page ── */

function buildSpecs(listing: MarketplaceListing) {
  return [
    { icon: Car, label: "Body Type", value: listing.body_type },
    { icon: Fuel, label: "Drivetrain", value: listing.drivetrain },
    { icon: Gauge, label: "Mileage", value: `${listing.mileage.toLocaleString()} km` },
    { icon: Palette, label: "Color", value: listing.color },
    { icon: Key, label: "Keys", value: String(listing.number_of_keys) },
    { icon: Shield, label: "Ownership", value: listing.ownership_status },
    {
      icon: CheckCircle2,
      label: "Drivable",
      value: listing.is_drivable ? "Yes" : "No",
    },
    {
      icon: XCircle,
      label: "Accident History",
      value: listing.has_accident_history ? "Yes" : "No",
    },
    { icon: Car, label: "Tire Condition", value: listing.tire_condition },
    { icon: Car, label: "Trim", value: listing.trim },
  ];
}

/* ── Skeleton loader ── */

function DetailSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-10 animate-pulse">
      <div className="h-4 w-32 rounded bg-neutral-200" />
      <div className="mt-4 h-8 w-64 rounded bg-neutral-200" />
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="aspect-[16/10] w-full rounded-2xl bg-neutral-200" />
        <div className="space-y-4">
          <div className="h-6 w-48 rounded bg-neutral-200" />
          <div className="h-4 w-full rounded bg-neutral-200" />
          <div className="h-4 w-3/4 rounded bg-neutral-200" />
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-16 rounded-xl bg-neutral-200" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main component ── */

export function ListingDetailView() {
  const params = useParams();
  const listingId = Number(params?.id);

  const { data: listing, isLoading, isError, error } = useGetListingByIdQuery(listingId, {
    skip: !listingId || isNaN(listingId),
  });

  if (isLoading) return <DetailSkeleton />;

  const isUnauthorized = error && "status" in error && error.status === 401;

  if (isError || !listing) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <Car className="size-16 text-neutral-300" strokeWidth={1.2} />
        <h2 className="font-hero-heading text-xl font-bold text-[#1E1E1E]">
          {isUnauthorized ? "Authentication Required" : "Listing not found"}
        </h2>
        <p className="max-w-md font-navbar text-sm text-[#5E5E5E]">
          {isUnauthorized
            ? "Please sign in to your account to view the full details and place offers on this vehicle."
            : "The listing you're looking for doesn't exist or has been removed."}
        </p>
        <Link
          href={isUnauthorized ? `/sign-in?callbackUrl=/browse/${listingId}` : "/browse"}
          className="mt-2 rounded-xl bg-[#FFA51F] px-6 py-3 font-navbar text-sm font-semibold text-[#1E1E1E] transition hover:bg-[#e8940f]"
        >
          {isUnauthorized ? "Sign In" : "Browse Listings"}
        </Link>
      </div>
    );
  }

  const title = `${listing.year} ${listing.make} ${listing.model}`;
  const status = statusConfig(listing.status);
  const specs = buildSpecs(listing);
  const isSold = listing.status.toUpperCase() === "SOLD";
  const isActive = listing.status.toUpperCase() === "ACTIVE";

  return (
    <div className="min-h-[60vh] bg-[#F9FAFB] py-8 sm:py-10 lg:py-12">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/browse"
          className="inline-flex items-center gap-1.5 font-navbar text-sm font-medium text-[#5E5E5E] transition hover:text-[#1E1E1E]"
        >
          <ArrowLeft className="size-4" strokeWidth={2} />
          Back to Listings
        </Link>

        {/* Title row */}
        <div className="mt-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-hero-heading text-2xl font-bold text-[#1E1E1E] sm:text-3xl">
              {title}
            </h1>
            {listing.trim && (
              <p className="mt-1 font-navbar text-sm font-medium tracking-wide text-[#FFA51F] uppercase">
                {listing.trim}
              </p>
            )}
          </div>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 font-navbar text-sm font-semibold",
              status.color
            )}
          >
            {status.pulse && (
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-white" />
              </span>
            )}
            {status.label}
          </span>
        </div>

        {/* Two-column layout */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
          {/* ── Left column: images + details ── */}
          <div>
            {/* Image carousel */}
            {listing.images.length > 0 ? (
              <ImageCarousel images={listing.images} />
            ) : (
              <div className="flex aspect-[16/10] w-full items-center justify-center rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900">
                <Car className="size-24 text-white/15" strokeWidth={1} />
              </div>
            )}

            {/* Seller info */}
            <div className="mt-6 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-[#FFA51F]/10">
                <User className="size-5 text-[#FFA51F]" strokeWidth={2} />
              </div>
              <div>
                <p className="font-navbar text-xs text-[#9CA3AF]">Listed by</p>
                <p className="font-navbar text-sm font-semibold text-[#1E1E1E]">{listing.seller_name}</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5 font-navbar text-xs text-[#9CA3AF]">
                <Calendar className="size-3.5" strokeWidth={2} />
                {new Date(listing.published_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>

            {/* Description */}
            {listing.description && (
              <div className="mt-6">
                <h2 className="font-hero-heading text-lg font-bold text-[#1E1E1E]">Description</h2>
                <p className="mt-2 font-navbar text-sm leading-relaxed text-[#5E5E5E] sm:text-base">
                  {listing.description}
                </p>
              </div>
            )}

            {/* Specs grid */}
            <div className="mt-6">
              <h2 className="font-hero-heading text-lg font-bold text-[#1E1E1E]">Specifications</h2>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {specs.map((s) => (
                  <div
                    key={s.label}
                    className="flex items-start gap-2.5 rounded-xl border border-[#E5E7EB] bg-white px-3 py-3"
                  >
                    <s.icon className="mt-0.5 size-4 shrink-0 text-[#9CA3AF]" strokeWidth={2} />
                    <div>
                      <p className="font-navbar text-xs text-[#9CA3AF]">{s.label}</p>
                      <p className="mt-0.5 font-navbar text-sm font-bold text-[#1E1E1E]">{s.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Registration */}
            <div className="mt-6 rounded-xl border border-[#E5E7EB] bg-white p-4">
              <p className="font-navbar text-xs text-[#9CA3AF]">Registration Number</p>
              <p className="mt-1 font-navbar text-base font-bold tracking-wide text-[#1E1E1E]">
                {listing.registration_number}
              </p>
            </div>
          </div>

          {/* ── Right column: bid info + leaderboard ── */}
          <div className="flex flex-col gap-5 lg:sticky lg:top-24">
            {/* Timer */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-navbar text-xs text-[#9CA3AF]">
                    {isActive ? "Time Remaining" : isSold ? "Auction Ended" : "Timer"}
                  </p>
                  <p
                    className={cn(
                      "mt-1 font-hero-heading text-3xl font-bold tracking-tight sm:text-4xl",
                      isActive ? "text-[#FFA51F]" : "text-[#D1D5DB]"
                    )}
                  >
                    {formatTimeRemaining(listing.time_remaining_seconds)}
                  </p>
                </div>
                <Clock
                  className={cn(
                    "size-8 shrink-0",
                    isActive ? "text-[#FFA51F]" : "text-[#D1D5DB]"
                  )}
                  strokeWidth={1.5}
                />
              </div>
              {/* Progress bar */}
              <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#FFA51F] to-[#FF8C00] transition-all duration-500"
                  style={{
                    width: listing.time_remaining_seconds > 0 ? "50%" : "100%",
                  }}
                />
              </div>
            </div>

            {/* Bid summary */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="font-navbar text-xs text-[#9CA3AF]">Highest Bid</p>
                  <p
                    className={cn(
                      "mt-1 font-hero-heading text-2xl font-bold sm:text-3xl",
                      listing.current_highest_bid ? "text-emerald-600" : "text-[#D1D5DB]"
                    )}
                  >
                    {listing.current_highest_bid
                      ? `$${Number(listing.current_highest_bid).toLocaleString()}`
                      : "—"}
                  </p>
                </div>
                <div>
                  <p className="font-navbar text-xs text-[#9CA3AF]">Total Offers</p>
                  <p className="mt-1 font-hero-heading text-2xl font-bold text-[#1E1E1E] sm:text-3xl">
                    {listing.total_offers}
                  </p>
                </div>
              </div>

              {/* Winner */}
              {isSold && listing.winning_dealer_name && (
                <div className="mt-5 flex items-center gap-3 rounded-xl bg-violet-50 p-3">
                  <Trophy className="size-5 shrink-0 text-violet-600" strokeWidth={2} />
                  <div>
                    <p className="font-navbar text-xs text-violet-500">Winning Dealer</p>
                    <p className="font-navbar text-sm font-bold text-violet-700">
                      {listing.winning_dealer_name}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Top bids leaderboard */}
            {listing.top_bids.length > 0 && (
              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
                <h3 className="font-hero-heading text-base font-bold text-[#1E1E1E]">
                  Top Bids
                </h3>
                <div className="mt-3 space-y-2">
                  {listing.top_bids.map((bid: TopBid, idx: number) => (
                    <div
                      key={bid.id}
                      className={cn(
                        "flex items-center justify-between rounded-xl px-3 py-2.5 transition",
                        bid.is_winning
                          ? "border border-emerald-200 bg-emerald-50"
                          : "border border-[#F3F4F6] bg-[#FAFAFA]"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            "flex size-7 items-center justify-center rounded-full font-navbar text-xs font-bold",
                            idx === 0
                              ? "bg-[#FFA51F] text-white"
                              : "bg-neutral-200 text-[#5E5E5E]"
                          )}
                        >
                          #{idx + 1}
                        </span>
                        <div>
                          <p className="font-navbar text-sm font-medium text-[#1E1E1E]">
                            {bid.dealer_name}
                          </p>
                          <p className="font-navbar text-xs text-[#9CA3AF]">
                            {formatRelativeTime(bid.placed_at)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={cn(
                            "font-hero-heading text-base font-bold",
                            bid.is_winning ? "text-emerald-600" : "text-[#1E1E1E]"
                          )}
                        >
                          ${Number(bid.amount).toLocaleString()}
                        </p>
                        {bid.is_winning && (
                          <span className="font-navbar text-[10px] font-semibold uppercase tracking-wider text-emerald-600">
                            Winner
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
