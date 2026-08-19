"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  Gauge,
  Palette,
  Car,
  Trophy,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { MarketplaceListing } from "@/store/features/listings/listingsApi.types";

type ListingCardProps = {
  listing: MarketplaceListing;
  /** Override where the card links to (defaults to /browse/<id>). */
  href?: string;
};

/* ── Status badge ── */

function statusConfig(status: string) {
  switch (status.toUpperCase()) {
    case "ACTIVE":
      return { label: "Live", bg: "bg-emerald-500", text: "text-white", pulse: true };
    case "SOLD":
      return { label: "Sold", bg: "bg-violet-600", text: "text-white", pulse: false };
    case "EXPIRED":
      return { label: "Expired", bg: "bg-red-500/90", text: "text-white", pulse: false };
    case "DRAFT":
      return { label: "Draft", bg: "bg-neutral-400", text: "text-white", pulse: false };
    default:
      return { label: status, bg: "bg-neutral-300", text: "text-[#1E1E1E]", pulse: false };
  }
}

/* ── Timer formatter ── */

function formatTimeRemaining(seconds: number): string {
  if (seconds <= 0) return "Ended";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m left`;
  if (m > 0) return `${m}m left`;
  return `${seconds}s left`;
}

/* ── Placeholder gradient for listings without images ── */

const PLACEHOLDER_GRADIENTS = [
  "from-slate-700 to-slate-900",
  "from-zinc-700 to-zinc-900",
  "from-neutral-700 to-neutral-900",
  "from-stone-700 to-stone-900",
];

function gradientForId(id: number) {
  return PLACEHOLDER_GRADIENTS[id % PLACEHOLDER_GRADIENTS.length];
}

/* ── Card ── */

export function ListingCard({ listing, href }: ListingCardProps) {
  const title = `${listing.year} ${listing.make} ${listing.model}`;
  const status = statusConfig(listing.status);
  const hasImage = listing.images.length > 0;
  const linkTo = href ?? `/browse/${listing.id}`;

  return (
    <Link
      href={linkTo}
      id={`listing-card-${listing.id}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white",
        "shadow-sm transition-all duration-300",
        "hover:shadow-lg hover:shadow-black/8 hover:-translate-y-0.5"
      )}
    >
      {/* ── Image ── */}
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        {hasImage ? (
          <Image
            src={listing.images[0]!}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div
            className={cn(
              "flex h-full w-full items-center justify-center bg-gradient-to-br",
              gradientForId(listing.id)
            )}
          >
            <Car className="size-16 text-white/20" strokeWidth={1.2} />
          </div>
        )}

        {/* Status badge */}
        <div className="absolute left-3 top-3">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-navbar text-xs font-semibold backdrop-blur-sm",
              status.bg,
              status.text
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

        {/* Offer count overlay */}
        {listing.total_offers > 0 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 backdrop-blur-sm">
            <Trophy className="size-3.5 text-[#FFA51F]" strokeWidth={2} />
            <span className="font-navbar text-xs font-medium text-white">
              {listing.total_offers} {listing.total_offers === 1 ? "offer" : "offers"}
            </span>
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Title + trim */}
        <h3 className="font-hero-heading text-lg font-bold leading-snug text-[#1E1E1E] sm:text-xl">
          {title}
        </h3>
        {listing.trim && (
          <p className="mt-0.5 font-navbar text-xs font-medium tracking-wide text-[#FFA51F] uppercase">
            {listing.trim}
          </p>
        )}

        {/* Quick specs row */}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 font-navbar text-sm text-[#5E5E5E]">
          <span className="inline-flex items-center gap-1.5">
            <Gauge className="size-3.5 shrink-0 text-[#9CA3AF]" strokeWidth={2} aria-hidden />
            {listing.mileage.toLocaleString()} km
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Palette className="size-3.5 shrink-0 text-[#9CA3AF]" strokeWidth={2} aria-hidden />
            {listing.color}
          </span>
          <span className="inline-flex items-center gap-1.5">
            {listing.is_drivable ? (
              <CheckCircle2 className="size-3.5 shrink-0 text-emerald-500" strokeWidth={2} aria-hidden />
            ) : (
              <XCircle className="size-3.5 shrink-0 text-red-400" strokeWidth={2} aria-hidden />
            )}
            {listing.is_drivable ? "Drivable" : "Not Drivable"}
          </span>
        </div>

        {/* Divider */}
        <div className="my-3 h-px bg-[#F3F4F6]" />

        {/* Bottom row: bid + timer */}
        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="font-navbar text-xs text-[#9CA3AF]">
              {listing.current_highest_bid ? "Highest Bid" : "No bids yet"}
            </p>
            {listing.current_highest_bid ? (
              <p className="font-hero-heading text-xl font-bold tracking-tight text-emerald-600">
                ${Number(listing.current_highest_bid).toLocaleString()}
              </p>
            ) : (
              <p className="font-hero-heading text-base font-semibold text-[#D1D5DB]">—</p>
            )}
          </div>
          {listing.status.toUpperCase() === "ACTIVE" && listing.time_remaining_seconds > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1 font-navbar text-xs font-medium text-[#B45309]">
              <Clock className="size-3.5 shrink-0" strokeWidth={2} aria-hidden />
              {formatTimeRemaining(listing.time_remaining_seconds)}
            </span>
          )}
          {listing.status.toUpperCase() === "SOLD" && listing.winning_dealer_name && (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-violet-50 px-2.5 py-1 font-navbar text-xs font-medium text-violet-700">
              <Trophy className="size-3.5 shrink-0" strokeWidth={2} aria-hidden />
              {listing.winning_dealer_name}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
