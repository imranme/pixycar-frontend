import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import type { LiveListing } from "@/components/(marketing)/live-listings-data";

type LiveListingCardProps = {
  listing: LiveListing;
  placeBidHref?: string;
};

export function LiveListingCard({ listing, placeBidHref = ROUTES.auth.signIn }: LiveListingCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="relative h-[180px] w-full">
        <Image
          src={listing.imageSrc}
          alt={listing.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized={listing.imageSrc.startsWith("/")}
        />
      </div>
      <div className="p-4">
        <h3 className="font-hero-heading text-lg font-bold leading-snug text-[#1E1E1E]">{listing.title}</h3>
        <div className="mt-3 flex items-center justify-between gap-3">
          <span
            className={cn(
              "font-navbar font-medium tracking-[-0.6px] text-[#5E5E5E]",
              "text-[16.757px]"
            )}
          >
            {listing.km}
          </span>
          <span
            className={cn(
              "flex shrink-0 items-center gap-1 font-navbar font-medium tracking-[-0.6px] text-[#5E5E5E]",
              "text-[16.757px]"
            )}
          >
            <MapPin className="size-4 shrink-0" strokeWidth={2} aria-hidden />
            {listing.location}
          </span>
        </div>
        <div className="mt-3 flex items-center gap-1.5 font-navbar text-sm font-normal text-[#FFA51F]">
          <Clock className="size-4 shrink-0" strokeWidth={2} aria-hidden />
          {listing.timerLabel}
        </div>
        <Link
          href={placeBidHref}
          className={cn(
            "mt-4 flex w-full items-center justify-center rounded-xl bg-[#FFA51F] py-3",
            "font-navbar text-base font-semibold text-black transition-opacity hover:opacity-90"
          )}
        >
          Place bid
        </Link>
      </div>
    </article>
  );
}
