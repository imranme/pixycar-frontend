"use client";

import { use } from "react";
import { useGetListingByIdQuery } from "@/store/features/listings/listingsApi";
import { UnlockChatPageClient } from "@/components/dealer/my-offers/unlock-chat-page-client";
import { getWonUnlockListing } from "@/components/dealer/my-offers/dealer-my-offers-data";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { ROUTES } from "@/constants/routes";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function DealerUnlockChatPage({ params }: PageProps) {
  const { id } = use(params);
  const { data: apiListing, isLoading } = useGetListingByIdQuery(id, { pollingInterval: 2500 });
  const fallback = getWonUnlockListing(id);

  if (isLoading && !apiListing && !fallback) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
        <Loader2 className="size-8 animate-spin text-[#FFA51F]" />
        <p className="font-navbar text-sm text-[#5E5E5E]">Loading vehicle details…</p>
      </div>
    );
  }

  const listingData = apiListing
    ? {
        id: String(apiListing.id),
        car: `${apiListing.year || ""} ${apiListing.make || ""} ${apiListing.model || ""} ${apiListing.trim || ""}`.trim(),
        winningOffer: apiListing.current_highest_bid ? `$${Number(apiListing.current_highest_bid).toLocaleString()}` : "$25,000",
        unlockFee: "$69.95",
        image: (apiListing.images && apiListing.images.length > 0)
          ? (typeof apiListing.images[0] === "string" ? apiListing.images[0] : (apiListing.images[0] as any).image_url || fallback?.image)
          : ((apiListing as any).thumbnail || fallback?.image || "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=400&fit=crop"),
        isChatUnlocked: Boolean((apiListing as any).is_chat_unlocked),
        chatThreadId: (apiListing as any).chat_thread_id,
      }
    : fallback;

  if (!listingData) {
    return (
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 text-center">
        <p className="font-hero-heading text-xl font-bold text-[#1E1E1E]">Vehicle not found.</p>
        <Link
          href={ROUTES.dealer.myOffers}
          className="mt-4 inline-block font-navbar text-sm font-medium text-[#FFA51F] hover:underline"
        >
          ← Back to My Offers
        </Link>
      </div>
    );
  }

  return <UnlockChatPageClient listing={listingData} />;
}
