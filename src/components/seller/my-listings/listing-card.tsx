import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import type { ListingStatus } from "@/components/seller/my-listings/listings-dummy-data";

export type ListingCardData = {
  id: string;
  title: string;
  offers: number;
  location: string;
  highestBid: string;
  status: ListingStatus;
  imageSrc: string;
};

type ListingCardProps = {
  listing: ListingCardData;
};

function statusBadgeClass(status: ListingStatus) {
  if (status === "Active") return "bg-emerald-500 text-white";
  if (status === "TimeOver") return "bg-red-500 text-white";
  if (status === "Draft") return "bg-[#FFA51F] text-black";
  if (status === "Sold") return "bg-purple-600 text-white";
  return "bg-neutral-500 text-white";
}

function statusLabel(status: ListingStatus) {
  if (status === "TimeOver") return "Time Over";
  return status;
}

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <Link
      href={`${ROUTES.seller.myListings}/${listing.id}`}
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm",
        "transition-shadow hover:shadow-md"
      )}
    >
      <div className="relative aspect-[16/10] w-full">
        <Image
          src={listing.imageSrc}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
          unoptimized
        />
      </div>
      <div className="relative flex flex-1 flex-col p-4 sm:p-5">
        <div className="absolute right-4 top-4 sm:right-5 sm:top-5">
          <span
            className={cn(
              "inline-flex rounded-full px-3 py-1 font-navbar text-xs font-semibold",
              statusBadgeClass(listing.status)
            )}
          >
            {statusLabel(listing.status)}
          </span>
        </div>
        <h2 className="pr-24 font-hero-heading text-lg font-bold text-[#1E1E1E] sm:text-xl">{listing.title}</h2>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-navbar text-sm text-[#5E5E5E]">
          <span>{listing.offers} Offers received</span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3.5 shrink-0" aria-hidden />
            {listing.location}
          </span>
        </div>
        <p className="mt-4 font-navbar text-sm font-semibold text-emerald-600 sm:text-base">
          Highest Bid: {listing.highestBid}
        </p>
      </div>
    </Link>
  );
}
