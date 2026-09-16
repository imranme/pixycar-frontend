"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Calendar, FileText, Gauge, MapPin, TrendingUp, CheckCircle2 } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { ImageCarousel } from "@/components/seller/my-listings/image-carousel";
import type { DealerBiddingListing } from "@/components/dealer/dealer-dummy-data";
import type { ActiveOfferBidState } from "@/components/dealer/my-offers/dealer-my-offers-data";
import { CarSpecsGrid } from "@/components/dealer/bidding/car-specs-grid";
import { BiddingTimer } from "@/components/dealer/bidding/bidding-timer";
import { ImproveOfferModal } from "@/components/dealer/my-offers/improve-offer-modal";
import { QuickAdjust, type QuickAdjustOption } from "@/components/dealer/my-offers/quick-adjust";
import { useGetMyRankQuery, usePlaceBidMutation } from "@/store/features/listings/listingsApi";
import { useCreateStripeCheckoutSessionMutation } from "@/store/features/payments/paymentsApi";

type ActiveOfferDetailClientProps = {
  listing: DealerBiddingListing;
  bid: ActiveOfferBidState;
};

export function ActiveOfferDetailClient({ listing, bid }: ActiveOfferDetailClientProps) {
  const router = useRouter();
  const { data: myRankData } = useGetMyRankQuery(listing.id);

  const [placeBidMutation, { isLoading: isSubmittingBidApi }] = usePlaceBidMutation();
  const [createCheckout, { isLoading: isStripeLoading }] = useCreateStripeCheckoutSessionMutation();

  const isSubmittingBid = isSubmittingBidApi || isStripeLoading;

  const [selectedQuickAmount, setSelectedQuickAmount] = useState<number | undefined>(undefined);
  const [showImproveModal, setShowImproveModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const myOfferAmount = myRankData?.amount ? Number(myRankData.amount) : bid.baseOffer;
  const highestOffer = Math.max(
    bid.highest || 0,
    myRankData?.amount ? Number(myRankData.amount) : 0,
    myOfferAmount,
    25500
  );
  const minIncrement = bid.minIncrement || 100;
  const minToLead = highestOffer > myOfferAmount ? highestOffer + minIncrement : myOfferAmount + minIncrement;
  const position = myRankData?.position || (highestOffer > myOfferAmount ? 2 : 1);
  const totalDealers = myRankData?.total_dealers || 1;

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(t);
  }, [toast]);

  const quickOptions: QuickAdjustOption[] = useMemo(() => {
    const baseVal = myOfferAmount > 0 ? myOfferAmount : 25000;
    return [
      {
        key: "100",
        labelTop: "+$100",
        labelBottom: `$${(baseVal + 100).toLocaleString("en-US")}`,
        amount: baseVal + 100,
      },
      {
        key: "500",
        labelTop: "+$500",
        labelBottom: `$${(baseVal + 500).toLocaleString("en-US")}`,
        amount: baseVal + 500,
      },
      {
        key: "lead",
        labelTop: "To Lead",
        labelBottom: `$${minToLead.toLocaleString("en-US")}`,
        amount: minToLead,
        highlight: true,
      },
      {
        key: "add",
        labelTop: "Add",
        labelBottom: "$00,000",
        amount: minToLead,
      },
    ];
  }, [myOfferAmount, minToLead]);

  const handleOpenImproveModal = (amount?: number) => {
    setSelectedQuickAmount(amount || minToLead);
    setShowImproveModal(true);
  };

  const handleConfirmImproveOffer = async (amount: number) => {
    try {
      const baseUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
      const stripeRes = await createCheckout({
        payment_type: "BID_FEE" as any,
        listing_id: Number(listing.id),
        bid_amount: String(amount),
        success_url: `${baseUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/dealer/my-offers/${listing.id}`,
      }).unwrap();

      // ── One-time payment: already paid for this car ──────────────────────
      if ((stripeRes as any)?.already_paid) {
        setToast({
          message: `Your offer has been updated to $${amount.toLocaleString("en-US")}!`,
          type: "success",
        });
        setShowImproveModal(false);
        return;
      }
      // ────────────────────────────────────────────────────────────────────

      if (stripeRes?.checkout_url) {
        window.location.href = stripeRes.checkout_url;
        return;
      }

      const res = await placeBidMutation({
        listing_id: listing.id,
        amount: amount,
      }).unwrap();

      setToast({
        message: `Your offer has been updated to $${amount.toLocaleString("en-US")}!`,
        type: "success",
      });
      setShowImproveModal(false);
    } catch (err: any) {
      console.error("Stripe improve offer checkout failed, falling back:", err);
      try {
        const res = await placeBidMutation({
          listing_id: listing.id,
          amount: amount,
        }).unwrap();
        setToast({
          message: `Your offer has been updated to $${amount.toLocaleString("en-US")}!`,
          type: "success",
        });
        setShowImproveModal(false);
      } catch (fallbackErr: any) {
        const errMsg = fallbackErr?.data?.message || fallbackErr?.data?.detail || err?.data?.detail || "Could not update offer. Please try again.";
        setToast({ message: errMsg, type: "error" });
      }
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      {toast ? (
        <div
          className={`fixed bottom-6 left-1/2 z-[160] flex w-[min(90vw,420px)] -translate-x-1/2 items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-navbar font-semibold shadow-xl transition-all ${toast.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-red-200 bg-red-50 text-red-900"
            }`}
          role="status"
        >
          {toast.type === "success" && <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />}
          <span className="flex-1">{toast.message}</span>
        </div>
      ) : null}

      {/* Top Header Row matching screenshot */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-[#E5E7EB]/70 pb-5">
        <div>
          <Link
            href={ROUTES.dealer.myOffers}
            className="inline-flex items-center gap-1.5 font-navbar text-sm font-medium text-[#5E5E5E] transition hover:text-[#1E1E1E]"
          >
            <span aria-hidden>&larr;</span>
            Back to My Offers
          </Link>
          <h1 className="mt-2 font-hero-heading text-2xl sm:text-3xl font-bold text-[#1E1E1E]">
            Active Offer
          </h1>
        </div>

        {/* Live Countdown Timer on top right */}
        <BiddingTimer
          phase={listing.phase}
          initialSeconds={listing.timeRemainingSeconds ?? bid.initialSecondsRemaining}
          expiresAt={listing.expiresAt}
        />
      </div>

      {/* Main 2-Column Grid */}
      <div className="mt-6 sm:mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        {/* Left Column */}
        <div>
          <ImageCarousel images={listing.images} />

          <h2 className="mt-5 font-hero-heading text-xl sm:text-2xl font-bold text-[#1E1E1E]">
            {listing.title}
          </h2>

          <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-2 font-navbar text-xs sm:text-sm text-[#5E5E5E]">
            <span className="inline-flex items-center gap-1.5">
              <Gauge className="size-4 shrink-0 text-[#FFA51F]" strokeWidth={2} aria-hidden />
              {listing.miles}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4 shrink-0 text-[#FFA51F]" strokeWidth={2} aria-hidden />
              {listing.location}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="size-4 shrink-0 text-[#FFA51F]" strokeWidth={2} aria-hidden />
              {listing.year}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <FileText className="size-4 shrink-0 text-[#FFA51F]" strokeWidth={2} aria-hidden />
              {listing.vin}
            </span>
          </div>

          <p className="mt-4 font-navbar text-sm sm:text-base leading-relaxed text-[#5E5E5E]">
            {listing.description}
          </p>

          <CarSpecsGrid specs={listing.specs} />
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-4 sm:gap-5">
          {/* Position & Your Offer Side-by-Side Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 sm:p-5 shadow-xs">
              <p className="font-navbar text-xs sm:text-sm text-[#5E5E5E]">Your Position</p>
              <p className="mt-1 font-hero-heading text-2xl sm:text-3xl font-bold text-[#1E1E1E]">
                #{position}{" "}
                <span className="text-sm sm:text-base font-medium text-[#5E5E5E]">
                  of {totalDealers}
                </span>
              </p>
            </div>

            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 sm:p-5 shadow-xs">
              <p className="font-navbar text-xs sm:text-sm text-[#5E5E5E]">Your Offer</p>
              <p className="mt-1 font-hero-heading text-2xl sm:text-3xl font-bold text-[#1E1E1E]">
                ${myOfferAmount.toLocaleString("en-US")}
              </p>
            </div>
          </div>

          {/* Current Highest Card */}
          <div className="relative rounded-2xl border border-[#E5E7EB] bg-white p-4 sm:p-5 shadow-xs">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-navbar text-xs sm:text-sm text-[#5E5E5E]">Current Highest</p>
                <p className="mt-1 font-hero-heading text-2xl sm:text-3xl font-bold text-[#1E1E1E]">
                  ${highestOffer.toLocaleString("en-US")}
                </p>
              </div>
              <div className="rounded-full bg-red-50 p-2">
                <TrendingUp className="size-6 sm:size-7 shrink-0 text-red-500" strokeWidth={2.2} aria-hidden />
              </div>
            </div>
            <p className="mt-2 font-navbar text-xs sm:text-sm text-[#5E5E5E]">
              Minimum to lead: ${minToLead.toLocaleString("en-US")} (increase Min. ${minIncrement.toLocaleString("en-US")})
            </p>
          </div>

          {listing.phase === "timeOver" || (bid.initialSecondsRemaining !== undefined && bid.initialSecondsRemaining <= 0) ? (
            <div className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50/70 p-5 shadow-xs">
              {position === 1 ? (
                <>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
                    <p className="font-hero-heading text-lg font-bold text-[#1E1E1E]">Auction Won!</p>
                  </div>
                  <p className="font-navbar text-sm text-[#5E5E5E]">
                    Your offer of ${myOfferAmount.toLocaleString("en-US")} won this vehicle. You can now initiate contact directly with the seller to arrange handover.
                  </p>
                  <Link
                    href={ROUTES.dealer.myOffersUnlockChat(listing.id)}
                    className="mt-1 flex w-full cursor-pointer items-center justify-center rounded-xl bg-[#FFA51F] py-3.5 font-navbar text-base font-bold text-[#1E1E1E] transition hover:bg-[#e8940f] shadow-sm"
                  >
                    Contact Seller • Unlock Connection ($69.95)
                  </Link>
                </>
              ) : (
                <>
                  <p className="font-hero-heading text-lg font-bold text-[#1E1E1E]">Auction Ended</p>
                  <p className="font-navbar text-sm text-[#5E5E5E]">
                    This auction has closed and another dealer held the winning bid.
                  </p>
                </>
              )}
            </div>
          ) : (
            <>
              {/* Quick Adjust Buttons */}
              <QuickAdjust
                options={quickOptions}
                onSelect={(amount) => handleOpenImproveModal(amount)}
                onAddCustom={() => handleOpenImproveModal(minToLead)}
              />

              {/* Improve Offer Button */}
              <button
                type="button"
                disabled={isSubmittingBid}
                onClick={() => handleOpenImproveModal(minToLead)}
                className="w-full cursor-pointer rounded-xl bg-[#FFA51F] py-3.5 sm:py-4 text-center font-navbar text-base font-bold text-[#1E1E1E] transition hover:bg-[#e8940f] active:bg-[#d88709] shadow-sm disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-500"
              >
                Improve Offer
              </button>
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      <ImproveOfferModal
        key={`${myOfferAmount}-${selectedQuickAmount}-${showImproveModal}`}
        open={showImproveModal}
        onClose={() => setShowImproveModal(false)}
        carName={listing.title}
        currentOffer={myOfferAmount}
        minIncrement={minIncrement}
        initialAmount={selectedQuickAmount}
        isLoading={isSubmittingBid}
        onConfirm={handleConfirmImproveOffer}
      />
    </div>
  );
}
