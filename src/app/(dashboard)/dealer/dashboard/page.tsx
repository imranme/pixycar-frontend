"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { ActiveBidRow } from "@/components/dealer/dashboard/active-bid-row";
import { LiveMarketCard } from "@/components/dealer/dashboard/live-market-card";
import { type DealerActiveBid, type DealerLiveMarketCar } from "@/components/dealer/dealer-dummy-data";
import { useGetActiveListingsQuery, useGetMyOffersQuery } from "@/store/features/listings/listingsApi";
import { useAppSelector } from "@/store";
import { selectCurrentUser } from "@/store/features/auth/authSlice";

export default function DealerDashboardPage() {
  const router = useRouter();
  const user = useAppSelector(selectCurrentUser);
  const displayName =
    user?.business_name ||
    user?.full_name ||
    user?.name ||
    (user?.email ? user.email.split("@")[0] : "Dealer");

  const { data: activeListingsData, isLoading: isLoadingListings } = useGetActiveListingsQuery(undefined, {
    skip: user?.role === "SELLER",
  });
  const { data: myOffersData, isLoading: isLoadingOffers } = useGetMyOffersQuery(undefined, {
    skip: user?.role === "SELLER",
  });

  useEffect(() => {
    if (user?.role === "SELLER") {
      router.replace(ROUTES.seller.dashboard);
    }
  }, [user, router]);

  // Process Real Active Bids from API only (no fake dummy fallback)
  const activeBids: DealerActiveBid[] = useMemo(() => {
    const apiOffers = Array.isArray(myOffersData)
      ? myOffersData
      : myOffersData && Array.isArray((myOffersData as any).results)
      ? (myOffersData as any).results
      : null;

    if (!apiOffers || apiOffers.length === 0) {
      return [];
    }

    return apiOffers
      .filter((l: any) => {
        const isTimeOver = (l.time_remaining_seconds !== undefined && Number(l.time_remaining_seconds) <= 0) || l.status === "TIME_OVER" || l.status === "SOLD" || l.status === "EXPIRED";
        return !isTimeOver && (l.status === "ACTIVE" || l.status === "PENDING_CONFIRMATION");
      })
      .map((l: any, idx: number) => {
        const firstImg =
          l.images && l.images.length > 0
            ? typeof l.images[0] === "string"
              ? l.images[0]
              : l.images[0].image_url || l.images[0].image
            : l.thumbnail || "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=400&fit=crop";

        const timeRem = Number(l.time_remaining_seconds ?? 3600);
        const timeStr =
          timeRem < 3600
            ? `${Math.max(1, Math.floor(timeRem / 60))}min`
            : `${Math.floor(timeRem / 3600)}h ${Math.floor((timeRem % 3600) / 60)}m`;

        return {
          id: String(l.id),
          car: `${l.year || ""} ${l.make || ""} ${l.model || ""} ${l.trim || ""}`.trim() || "Vehicle Details",
          offer: l.my_bid
            ? `$${Number(l.my_bid).toLocaleString()}`
            : `$${Number(l.current_highest_bid || 0).toLocaleString()}`,
          status: l.my_rank?.position === 1 ? ("leading" as const) : ("outbid" as const),
          rank: l.my_rank?.position || (idx === 0 ? 1 : 2),
          timeLeft: timeStr,
          image: firstImg,
        };
      });
  }, [myOffersData]);

  // Process Real Live Market listings from API only (no fake dummy fallback)
  const liveMarketCards: DealerLiveMarketCar[] = useMemo(() => {
    const apiListings = Array.isArray(activeListingsData)
      ? activeListingsData
      : activeListingsData && Array.isArray((activeListingsData as any).results)
      ? (activeListingsData as any).results
      : null;

    if (!apiListings || apiListings.length === 0) {
      return [];
    }

    return apiListings.map((l: any) => {
      const firstImg =
        l.images && l.images.length > 0
          ? typeof l.images[0] === "string"
            ? l.images[0]
            : l.images[0].image_url || l.images[0].image
          : l.thumbnail || "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=400&fit=crop";

      const timeRem = Number(l.time_remaining_seconds ?? 3600);
      const isTimeOver =
        (l.time_remaining_seconds !== undefined && l.time_remaining_seconds <= 0) ||
        l.status === "TIME_OVER" ||
        l.status === "EXPIRED" ||
        l.status === "SOLD";

      const timerStr =
        isTimeOver
          ? "Time Over"
          : timeRem < 3600
          ? `${Math.max(1, Math.floor(timeRem / 60))}m left`
          : `${Math.floor(timeRem / 3600)}h ${Math.floor((timeRem % 3600) / 60)}m left`;

      return {
        id: String(l.id),
        name: `${l.year || ""} ${l.make || ""} ${l.model || ""} ${l.trim || ""}`.trim() || "Vehicle Details",
        km: l.mileage ? `${Number(l.mileage).toLocaleString()} mi` : "N/A",
        location: l.city && l.state ? `${l.city}, ${l.state}` : (l.seller_location || "USA"),
        timer: timerStr,
        status: isTimeOver ? ("timeOver" as const) : ("active" as const),
        image: firstImg,
      };
    });
  }, [activeListingsData]);

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      {/* Welcome Title */}
      <h1 className="font-hero-heading text-2xl font-bold leading-tight text-[#1E1E1E] sm:text-3xl">
        Welcome back!!!
      </h1>
      <p suppressHydrationWarning className="mt-1 font-navbar text-sm text-[#5E5E5E] sm:text-base">
        {displayName}
      </p>

      {/* Active Bids Section */}
      <section className="mt-8 sm:mt-10">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-hero-heading text-lg font-bold text-[#1E1E1E] sm:text-xl">
            Active Bids
          </h2>
          {activeBids.length > 0 && (
            <Link
              href={ROUTES.dealer.myOffers}
              className="font-navbar text-xs font-semibold text-[#FFA51F] transition hover:underline sm:text-sm"
            >
              See more
            </Link>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-3.5">
          {isLoadingOffers ? (
            <p className="font-navbar text-sm text-[#5E5E5E]">Loading your active bids…</p>
          ) : activeBids.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#E5E7EB] bg-white p-6 text-center">
              <p className="font-navbar text-sm text-[#5E5E5E]">
                You have no active bids yet. Browse the Live Market below to place your offer!
              </p>
            </div>
          ) : (
            activeBids.map((bid) => (
              <ActiveBidRow key={bid.id} bid={bid} />
            ))
          )}
        </div>
      </section>

      {/* Live Market Section */}
      <section className="mt-10 sm:mt-12">
        <div className="flex items-center gap-2">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
          </span>
          <h2 className="font-hero-heading text-lg font-bold text-[#1E1E1E] sm:text-xl">
            Live Market
          </h2>
        </div>

        <div className="mt-5">
          {isLoadingListings ? (
            <p className="py-8 text-center font-navbar text-sm text-[#5E5E5E]">
              Loading live auctions…
            </p>
          ) : liveMarketCards.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#E5E7EB] bg-white p-8 text-center">
              <p className="font-navbar text-sm text-[#5E5E5E]">
                No live vehicles currently available in the market.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {liveMarketCards.map((car) => (
                <LiveMarketCard key={car.id} car={car} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
