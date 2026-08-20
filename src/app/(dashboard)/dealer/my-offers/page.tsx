"use client";

import { useState, useMemo } from "react";
import { ActiveOfferCard } from "@/components/dealer/my-offers/active-offer-card";
import { type ActiveOfferListItem, type WonOfferListItem, type LostOfferListItem, type OffersTab } from "@/components/dealer/my-offers/dealer-my-offers-data";
import { LostOfferCard } from "@/components/dealer/my-offers/lost-offer-card";
import { OffersFilter } from "@/components/dealer/my-offers/offers-filter";
import { WonOfferCard } from "@/components/dealer/my-offers/won-offer-card";
import { useGetMyOffersQuery } from "@/store/features/listings/listingsApi";

export default function DealerMyOffersPage() {
  const [tab, setTab] = useState<OffersTab>("Active");
  const [deletedLostIds, setDeletedLostIds] = useState<string[]>([]);
  const { data: apiOffersData, isLoading } = useGetMyOffersQuery();

  const apiOffers = useMemo(() => {
    return Array.isArray(apiOffersData)
      ? apiOffersData
      : apiOffersData && Array.isArray((apiOffersData as any).results)
      ? (apiOffersData as any).results
      : [];
  }, [apiOffersData]);

  // Real Active Offers from API (Auctions currently live)
  const activeOffers: ActiveOfferListItem[] = useMemo(() => {
    return apiOffers
      .filter((l: any) => {
        const isTimeOver =
          (l.time_remaining_seconds !== undefined && Number(l.time_remaining_seconds) <= 0) ||
          l.status === "TIME_OVER" ||
          l.status === "SOLD" ||
          l.status === "EXPIRED";
        return !isTimeOver && (l.status === "ACTIVE" || l.status === "PENDING_CONFIRMATION");
      })
      .map((l: any) => {
        const firstImg =
          l.images && l.images.length > 0
            ? typeof l.images[0] === "string"
              ? l.images[0]
              : l.images[0].image_url || l.images[0].image
            : l.thumbnail || "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=400&fit=crop";

        const timeRem = Number(l.time_remaining_seconds ?? 3600);
        const timeStr =
          timeRem <= 0
            ? "Time Over"
            : timeRem < 3600
            ? `${Math.max(1, Math.floor(timeRem / 60))}min`
            : `${Math.floor(timeRem / 3600)}h ${Math.floor((timeRem % 3600) / 60)}m`;

        return {
          id: String(l.id),
          car: `${l.year || ""} ${l.make || ""} ${l.model || ""} ${l.trim || ""}`.trim() || "Vehicle Details",
          offer: l.my_bid
            ? `$${Number(l.my_bid).toLocaleString()}`
            : `$${Number(l.current_highest_bid || 0).toLocaleString()}`,
          isLeading: l.my_rank?.position === 1,
          rank: l.my_rank?.position || 1,
          timeLeft: timeStr,
          image: firstImg,
          stats: {
            currentRank: l.my_rank?.position ? `#${l.my_rank.position}` : "#1",
            highestOffer: l.current_highest_bid
              ? `$${Number(l.current_highest_bid).toLocaleString()}`
              : l.my_bid
              ? `$${Number(l.my_bid).toLocaleString()}`
              : "$0",
            totalBidders: `${l.total_offers || 1} Bidders`,
          },
        };
      });
  }, [apiOffers]);

  // Real Won Offers from API (Dealer won or holds winning highest bid when auction is finished)
  const wonOffers: WonOfferListItem[] = useMemo(() => {
    return apiOffers
      .filter((l: any) => {
        const isTimeOver =
          (l.time_remaining_seconds !== undefined && Number(l.time_remaining_seconds) <= 0) ||
          l.status === "TIME_OVER" ||
          l.status === "SOLD" ||
          l.status === "EXPIRED";
        const isWinningDealer = Boolean(l.is_winner) || l.my_rank?.position === 1;

        return isTimeOver && isWinningDealer;
      })
      .map((l: any) => {
        const firstImg =
          l.images && l.images.length > 0
            ? typeof l.images[0] === "string"
              ? l.images[0]
              : l.images[0].image_url || l.images[0].image
            : l.thumbnail || "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=400&fit=crop";

        const winningAmount = l.my_bid
          ? `$${Number(l.my_bid).toLocaleString()}`
          : l.current_highest_bid
          ? `$${Number(l.current_highest_bid).toLocaleString()}`
          : "$0";

        return {
          id: String(l.id),
          car: `${l.year || ""} ${l.make || ""} ${l.model || ""} ${l.trim || ""}`.trim() || "Vehicle Details",
          winningPrice: winningAmount,
          relativeTime: "Auction Won",
          image: firstImg,
          isChatUnlocked: Boolean(l.is_chat_unlocked),
          chatThreadId: l.chat_thread_id,
        };
      });
  }, [apiOffers]);

  // Real Lost Offers from API (Auctions ended where dealer did not win)
  const lostList: LostOfferListItem[] = useMemo(() => {
    return apiOffers
      .filter((l: any) => {
        const isTimeOver =
          (l.time_remaining_seconds !== undefined && Number(l.time_remaining_seconds) <= 0) ||
          l.status === "TIME_OVER" ||
          l.status === "SOLD" ||
          l.status === "CANCELLED" ||
          l.status === "EXPIRED";
        const isWinningDealer = Boolean(l.is_winner) || l.my_rank?.position === 1;

        return isTimeOver && !isWinningDealer && !deletedLostIds.includes(String(l.id));
      })
      .map((l: any) => {
        const firstImg =
          l.images && l.images.length > 0
            ? typeof l.images[0] === "string"
              ? l.images[0]
              : l.images[0].image_url || l.images[0].image
            : l.thumbnail || "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=400&fit=crop";

        return {
          id: String(l.id),
          car: `${l.year || ""} ${l.make || ""} ${l.model || ""} ${l.trim || ""}`.trim() || "Vehicle Details",
          offer: l.my_bid ? `$${Number(l.my_bid).toLocaleString()}` : "$0",
          winning: l.current_highest_bid
            ? `$${Number(l.current_highest_bid).toLocaleString()}`
            : "$0",
          yourRank: l.my_rank?.position || 2,
          image: firstImg,
        };
      });
  }, [apiOffers, deletedLostIds]);

  const handleDeleteLostOffer = (id: string) => {
    setDeletedLostIds((prev) => [...prev, id]);
  };

  return (
    <div className="mx-auto w-full max-w-screen-2xl flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <h1 className="font-hero-heading text-2xl font-bold text-[#1E1E1E] sm:text-3xl">My Offers</h1>

      <OffersFilter value={tab} onChange={setTab} />

      {isLoading ? (
        <div className="mt-8">
          <p className="font-navbar text-sm text-[#5E5E5E]">Loading your offers…</p>
        </div>
      ) : null}

      {tab === "Active" ? (
        <div className="mt-8 flex max-w-2xl flex-col gap-4">
          {activeOffers.length === 0 ? (
            <p className="font-navbar text-sm text-[#5E5E5E]">No active offers.</p>
          ) : (
            activeOffers.map((o: ActiveOfferListItem) => <ActiveOfferCard key={o.id} offer={o} />)
          )}
        </div>
      ) : null}

      {tab === "Won" ? (
        <div className="mt-8 flex max-w-2xl flex-col gap-4">
          {wonOffers.length === 0 ? (
            <p className="font-navbar text-sm text-[#5E5E5E]">No won offers yet.</p>
          ) : (
            wonOffers.map((o: WonOfferListItem) => <WonOfferCard key={o.id} offer={o} />)
          )}
        </div>
      ) : null}

      {tab === "Lost" ? (
        <div className="mt-8 flex max-w-2xl flex-col gap-4">
          {lostList.length === 0 ? (
            <p className="font-navbar text-sm text-[#5E5E5E]">No lost offers.</p>
          ) : (
            lostList.map((o: LostOfferListItem) => (
              <LostOfferCard key={o.id} offer={o} onDelete={handleDeleteLostOffer} />
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}
