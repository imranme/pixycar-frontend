"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import type { SellerListingDetail } from "@/components/seller/my-listings/listings-dummy-data";
import { OfferRow } from "@/components/seller/my-listings/offer-row";
import { ConfirmSelectionModal } from "@/components/seller/my-listings/confirm-selection-modal";
import { useConfirmWinnerMutation } from "@/store/features/listings/listingsApi";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

type OfferingCompleteViewProps = {
  listing: SellerListingDetail;
};

export function OfferingCompleteView({ listing }: OfferingCompleteViewProps) {
  const router = useRouter();
  const [confirmWinnerApi, { isLoading: isConfirming }] = useConfirmWinnerMutation();
  const [showModal, setShowModal] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [showAllOffers, setShowAllOffers] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const visibleOffers = showAllOffers ? listing.offers : listing.offers.slice(0, 4);
  const remainingCount = listing.offers.length - 4;

  const selectedDealer = listing.offers[selectedIndex] ?? listing.offers[0] ?? null;

  const openConnect = () => {
    setShowModal(true);
  };

  const handleConfirm = async () => {
    if (!selectedDealer) return;
    let targetRoomId: string | number = listing.id;

    // Safely extract numeric dealer ID
    const extractedDealerId = selectedDealer.dealerNumericId 
      ? Number(selectedDealer.dealerNumericId)
      : (() => {
          const match = String(selectedDealer.dealerId || "").match(/\d+/);
          return match ? parseInt(match[0], 10) : undefined;
        })();

    try {
      const res = await confirmWinnerApi({
        listingId: listing.id,
        dealerId: extractedDealerId,
        offerId: typeof selectedDealer.id === "number" || (typeof selectedDealer.id === "string" && !isNaN(Number(selectedDealer.id))) ? selectedDealer.id : undefined,
      }).unwrap();

      if (res && (res as any).thread_id) {
        targetRoomId = (res as any).thread_id;
      }

      setShowModal(false);
      setToast({
        message: "Winner confirmed! You’re now connected with the dealer.",
        type: "success",
      });

      window.setTimeout(() => {
        setToast(null);
        router.push(`${ROUTES.seller.messages}?roomId=${targetRoomId}`);
      }, 1200);
    } catch (err: any) {
      console.error("Winner confirmation failed:", err);
      const errMsg = err?.data?.detail || err?.data?.message || err?.data?.error || "Could not confirm winner. Please try again.";
      setToast({ message: errMsg, type: "error" });
      setShowModal(false);
      window.setTimeout(() => setToast(null), 3500);
    }
  };

  return (
    <div>
      {toast ? (
        <div
          className={`fixed bottom-6 left-1/2 z-[110] w-[min(90vw,420px)] -translate-x-1/2 rounded-xl border px-4 py-3 text-center font-navbar text-sm font-semibold shadow-lg ${
            toast.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-red-200 bg-red-50 text-red-900"
          }`}
          role="status"
        >
          {toast.message}
        </div>
      ) : null}

      <h1 className="font-hero-heading text-2xl font-bold text-[#1E1E1E] sm:text-3xl">Offering Complete!</h1>
      <p className="mt-2 max-w-xl font-navbar text-sm text-[#5E5E5E] sm:text-base">
        You received offers from {listing.offersCount || listing.offers.length} dealers. Select one to start conversations.
      </p>

      <div className="mt-8 max-w-xl rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-8 shadow-xs">
        <h2 className="font-hero-heading text-lg font-bold text-[#1E1E1E] sm:text-xl">
          All Offers ({listing.offers.length})
        </h2>
        <div className="mt-4 flex flex-col gap-3">
          {visibleOffers.map((o, idx) => {
            const isSelected = selectedIndex === idx;

            return (
              <button
                key={o.id ?? `${o.dealerId}-${idx}`}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={cn(
                  "w-full cursor-pointer text-left transition rounded-xl border-2 px-3 py-1.5",
                  isSelected
                    ? "border-[#FFA51F] bg-amber-50/50 shadow-sm"
                    : "border-[#E5E7EB] bg-white hover:border-neutral-300"
                )}
              >
                <OfferRow
                  dealerName={o.dealerId}
                  timeAgo={o.timeAgo}
                  amount={o.amount}
                  isHighest={o.isHighest}
                  distance={o.distance}
                  location={o.location}
                  layout="list"
                />
              </button>
            );
          })}
        </div>

        {/* See More / Show Less Toggle Button */}
        {listing.offers.length > 4 && (
          <button
            type="button"
            onClick={() => setShowAllOffers((prev) => !prev)}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#E5E7EB] bg-neutral-50 py-2.5 font-navbar text-xs font-semibold text-[#1E1E1E] transition hover:bg-neutral-100 hover:text-[#FFA51F] cursor-pointer"
          >
            <span>
              {showAllOffers
                ? "Show less"
                : `See more (${remainingCount} more ${remainingCount === 1 ? "offer" : "offers"})`}
            </span>
            <ChevronDown
              className={cn(
                "size-4 transition-transform duration-200",
                showAllOffers && "rotate-180"
              )}
            />
          </button>
        )}

        <button
          type="button"
          disabled={listing.offers.length === 0}
          onClick={openConnect}
          className="mt-6 w-full cursor-pointer rounded-xl bg-[#FFA51F] py-3.5 font-navbar text-base font-bold text-[#1E1E1E] transition hover:bg-[#e8940f] disabled:cursor-not-allowed disabled:bg-neutral-200"
        >
          Connect with dealer
        </button>
      </div>

      <ConfirmSelectionModal
        open={showModal}
        dealerName={selectedDealer?.dealerId ?? ""}
        amount={selectedDealer?.amount ?? ""}
        distance={selectedDealer?.distance}
        location={selectedDealer?.location}
        isLoading={isConfirming}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
