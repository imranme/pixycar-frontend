import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { LIVE_LISTINGS_PREVIEW } from "@/components/(marketing)/live-listings-data";
import { LiveListingCard } from "@/components/(marketing)/live-listing-card";

export type LiveListingsProps = {
  id?: string;
};

export function LiveListings({ id }: LiveListingsProps) {
  return (
    <section
      id={id}
      className="scroll-mt-24 bg-[#F9FAFB] py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-screen-2xl px-3 sm:px-4 lg:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-hero-heading text-[32px] font-semibold leading-tight tracking-tight text-[#1E1E1E]">
              Live Listings
            </h2>
            <p className="mt-2 font-navbar text-base font-normal leading-relaxed text-[#5E5E5E]">
              Cars currently accepting offers from dealers
            </p>
          </div>
          <Link
            href={ROUTES.browse}
            className="shrink-0 font-navbar text-base font-normal text-[#8F4A00] no-underline hover:underline sm:pb-0.5"
          >
            View all
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:mt-12 lg:grid-cols-3">
          {LIVE_LISTINGS_PREVIEW.map((listing) => (
            <LiveListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </div>
    </section>
  );
}
