"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, DollarSign, TrendingUp } from "lucide-react";
import { ListingCard, type ListingCardData } from "@/components/seller/my-listings/listing-card";
import { StatsCard } from "@/components/seller/dashboard/stats-card";
import { WelcomeBanner } from "@/components/seller/dashboard/welcome-banner";
import { useGetMyListingsQuery } from "@/store/features/listings/listingsApi";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { useAppSelector } from "@/store";
import { selectCurrentUser } from "@/store/features/auth/authSlice";
import { ROUTES } from "@/constants/routes";

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

export default function SellerDashboardPage() {
  const router = useRouter();
  const user = useAppSelector(selectCurrentUser);
  const { data, isLoading, error } = useGetMyListingsQuery(undefined, {
    skip: user?.role === 'DEALER',
  });

  useEffect(() => {
    if (user?.role === 'DEALER') {
      router.replace(ROUTES.dealer.dashboard);
    }
  }, [user, router]);

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

  // Compute dynamic stats from real listings
  const biddingCount = useMemo(() => {
    if (!data?.results) return 0;
    return data.results.filter((l) => l.status?.toUpperCase() === "ACTIVE").length;
  }, [data]);

  const soldCount = useMemo(() => {
    if (!data?.results) return 0;
    return data.results.filter((l) => l.status?.toUpperCase() === "SOLD").length;
  }, [data]);

  const highestOfferStr = useMemo(() => {
    if (!data?.results) return "$0";
    const bids = data.results
      .map((l) => l.current_highest_bid)
      .filter((b): b is number => b !== null && b > 0);
    if (bids.length === 0) return "$0";
    const maxBid = Math.max(...bids);
    return `$${maxBid.toLocaleString()}`;
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner className="size-8" />
      </div>
    );
  }

  if (error) {
    const is403 = (error as any)?.status === 403;
    return (
      <div className="mx-auto max-w-md p-8 text-center">
        <p className="text-red-500 font-semibold font-navbar">Failed to load seller dashboard data.</p>
        <p className="text-sm text-neutral-500 mt-1 font-navbar">
          {is403 ? "You are currently logged in as a Dealer." : "Please check your login session or refresh the page."}
        </p>
        {is403 ? (
          <button
            type="button"
            onClick={() => router.push(ROUTES.dealer.dashboard)}
            className="mt-4 rounded-xl bg-[#FFA51F] px-4 py-2 text-sm font-bold text-[#1E1E1E]"
          >
            Go to Dealer Dashboard
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-screen-2xl flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <WelcomeBanner />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          icon={TrendingUp}
          iconWrapClass="bg-amber-100 text-amber-700"
          value={String(biddingCount)}
          label="Bidding"
        />
        <StatsCard
          icon={CheckCircle}
          iconWrapClass="bg-emerald-100 text-emerald-700"
          value={String(soldCount)}
          label="Sold"
        />
        <StatsCard
          icon={DollarSign}
          iconWrapClass="bg-violet-100 text-violet-700"
          value={highestOfferStr}
          label="Highest Offer"
        />
      </div>

      <section className="mt-10">
        <h2 className="font-hero-heading text-xl font-bold text-[#1E1E1E] sm:text-2xl">My Listings</h2>
        {allCards.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-neutral-300 p-12 text-center bg-white/50">
            <p className="font-navbar text-[#5E5E5E]">You have no listings yet.</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {allCards.slice(0, 3).map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
