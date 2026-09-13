"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Calendar, FileText, Gauge, MapPin, TrendingUp, CheckCircle2, Lock, ArrowRight, Video } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { ImageCarousel } from "@/components/seller/my-listings/image-carousel";
import type { DealerBiddingListing } from "@/components/dealer/dealer-dummy-data";
import { BiddingTimer } from "@/components/dealer/bidding/bidding-timer";
import { CarSpecsGrid } from "@/components/dealer/bidding/car-specs-grid";
import { QuickAdjust, type QuickAdjustOption } from "@/components/dealer/my-offers/quick-adjust";
import { ImproveOfferModal } from "@/components/dealer/my-offers/improve-offer-modal";
import { useGetMyRankQuery, usePlaceBidMutation } from "@/store/features/listings/listingsApi";
import { useCreateStripeCheckoutSessionMutation } from "@/store/features/payments/paymentsApi";
import { useAuctionTimer } from "@/hooks/use-auction-timer";

type BiddingDetailsClientProps = {
  listing: DealerBiddingListing;
};

export function BiddingDetailsClient({ listing }: BiddingDetailsClientProps) {
  const router = useRouter();
  const { data: myRankData } = useGetMyRankQuery(listing.id);
  const [placeBidMutation, { isLoading: isSubmittingBidApi }] = usePlaceBidMutation();
  const [createCheckout, { isLoading: isStripeLoading }] = useCreateStripeCheckoutSessionMutation();

  const isSubmittingBid = isSubmittingBidApi || isStripeLoading;

  const [offerInputAmount, setOfferInputAmount] = useState<string>("25000");
  const [selectedQuickAmount, setSelectedQuickAmount] = useState<number | undefined>(undefined);
  const [showImproveModal, setShowImproveModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Auction timer hook to determine phase: 50min Blind vs Last 10min Open
  const { secondsLeft, isFinal10Min, isTimeOver } = useAuctionTimer({
    expiresAt: listing.expiresAt,
    timeRemainingSeconds: listing.timeRemainingSeconds,
    isLive: listing.phase === "active",
    totalDurationSeconds: 3600,
  });

  const hasPlacedBid = Boolean(myRankData?.amount && Number(myRankData.amount) > 0);
  const myOfferAmount = myRankData?.amount ? Number(myRankData.amount) : (hasPlacedBid ? 25000 : 0);
  const minToLead = (myRankData as any)?.min_to_lead ? Number((myRankData as any).min_to_lead) : myOfferAmount + 500;
  const minIncrement = 100;

  const highestOffer = Math.max(
    listing.currentHighestBid || 0,
    myOfferAmount || 0
  );
  const position = myRankData?.position || (highestOffer > myOfferAmount ? 2 : 1);
  const totalDealers = myRankData?.total_dealers || listing.totalOffers || 1;

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(t);
  }, [toast]);

  // Quick adjust options for the final 10 minutes
  const quickOptions: QuickAdjustOption[] = useMemo(() => {
    const baseVal = myOfferAmount > 0 ? myOfferAmount : (highestOffer > 0 ? highestOffer : 25000);
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
  }, [myOfferAmount, highestOffer, minToLead]);

  const handleOpenImproveModal = (amount?: number) => {
    setSelectedQuickAmount(amount || minToLead);
    setShowImproveModal(true);
  };

  const handlePlaceInitialOffer = async () => {
    const numAmount = Number(offerInputAmount.replace(/[^0-9.]/g, ""));
    if (isNaN(numAmount) || numAmount <= 0) {
      setToast({ message: "Please enter a valid offer amount.", type: "error" });
      return;
    }

    try {
      const baseUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
      const stripeRes = await createCheckout({
        payment_type: "BID_FEE" as any,
        listing_id: Number(listing.id),
        bid_amount: String(numAmount),
        success_url: `${baseUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/dealer/bidding/${listing.id}`,
      }).unwrap();

      if (stripeRes?.checkout_url) {
        window.location.href = stripeRes.checkout_url;
        return;
      }

      const res = await placeBidMutation({
        listing_id: listing.id,
        amount: numAmount,
      }).unwrap();

      setToast({
        message: `Your offer of $${numAmount.toLocaleString("en-US")} has been submitted!`,
        type: "success",
      });
    } catch (err: any) {
      console.error("Stripe bid checkout failed, falling back:", err);
      try {
        const res = await placeBidMutation({
          listing_id: listing.id,
          amount: numAmount,
        }).unwrap();
        setToast({
          message: `Your offer of $${numAmount.toLocaleString("en-US")} has been submitted!`,
          type: "success",
        });
      } catch (fallbackErr: any) {
        const errMsg = fallbackErr?.data?.message || fallbackErr?.data?.detail || err?.data?.detail || "Could not submit offer. Please try again.";
        setToast({ message: errMsg, type: "error" });
      }
    }
  };

  const handleConfirmImproveOffer = async (amount: number) => {
    try {
      await placeBidMutation({
        listing_id: listing.id,
        amount: amount,
      }).unwrap();

      setToast({
        message: `Your offer has been improved to $${amount.toLocaleString("en-US")}!`,
        type: "success",
      });
      setShowImproveModal(false);
    } catch (err: any) {
      console.error("Improve offer failed:", err);
      const errMsg = err?.data?.message || err?.data?.detail || "Could not improve offer. Please try again.";
      setToast({ message: errMsg, type: "error" });
    }
  };

  // Determine if we show Phase 1 (Blind Bidding / Initial Offer) or Phase 2 (Open / Improve Offer in Last 10 Min)
  const showOpenBiddingPhase = isFinal10Min && hasPlacedBid;

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      {/* Toast Notification */}
      {toast ? (
        <div
          className={`fixed bottom-6 left-1/2 z-[160] flex w-[min(90vw,420px)] -translate-x-1/2 items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-navbar font-semibold shadow-xl transition-all ${
            toast.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-red-200 bg-red-50 text-red-900"
          }`}
          role="status"
        >
          {toast.type === "success" && <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />}
          <span className="flex-1">{toast.message}</span>
        </div>
      ) : null}

      {/* Top Header Row matching Frame 69 & Frame 75 */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-[#E5E7EB]/70 pb-5">
        <div>
          <Link
            href={showOpenBiddingPhase ? ROUTES.dealer.myOffers : ROUTES.dealer.dashboard}
            className="inline-flex items-center gap-1.5 font-navbar text-sm font-medium text-[#5E5E5E] transition hover:text-[#1E1E1E]"
          >
            <span aria-hidden>&larr;</span>
            {showOpenBiddingPhase ? "Back to My Offers" : "Back to Dashboard"}
          </Link>
          <h1 className="mt-2 font-hero-heading text-2xl sm:text-3xl font-bold text-[#1E1E1E]">
            {showOpenBiddingPhase ? "Active Offer" : "Bidding Details"}
          </h1>
        </div>

        {/* Live Countdown Timer with 50min Blind vs 10min Open segment */}
        <BiddingTimer
          phase={listing.phase}
          initialSeconds={listing.timeRemainingSeconds}
          expiresAt={listing.expiresAt}
        />
      </div>

      {/* Main 2-Column Grid */}
      <div className="mt-6 sm:mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        {/* Left Column: Carousel, Details, Specs */}
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

        {/* Right Column: Dynamic Phase View */}
        <div className="flex flex-col gap-4 sm:gap-5">
          {showOpenBiddingPhase ? (
            /* =========================================================================
             * PHASE 2: FINAL 10 MINUTES OPEN BIDDING & IMPROVE OFFER (Frame 75)
             * ========================================================================= */
            <>
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

              {/* Quick Adjust Buttons */}
              <QuickAdjust
                options={quickOptions}
                onSelect={(amount) => handleOpenImproveModal(amount)}
                onAddCustom={() => handleOpenImproveModal(minToLead)}
              />

              {/* Improve Offer Main Button */}
              <button
                type="button"
                disabled={isTimeOver || isSubmittingBid}
                onClick={() => handleOpenImproveModal(minToLead)}
                className="w-full cursor-pointer rounded-xl bg-[#FFA51F] py-3.5 sm:py-4 text-center font-navbar text-base font-bold text-[#1E1E1E] transition hover:bg-[#e8940f] active:bg-[#d88709] shadow-sm disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-500"
              >
                Improve Offer
              </button>
            </>
          ) : (
            /* =========================================================================
             * PHASE 1: FIRST 50 MINUTES BLIND BIDDING & INITIAL OFFER (Frame 69)
             * ========================================================================= */
            <div className="flex flex-col gap-4 rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-xs">
              {hasPlacedBid ? (
                /* Already Placed Offer during Blind Phase */
                <div className="flex flex-col gap-4">
                  <div className="rounded-xl bg-[#FFF9E6] p-4 border border-[#FFE58F]">
                    <div className="flex items-center gap-2 text-[#D48806]">
                      <Lock className="size-4 shrink-0" />
                      <p className="font-navbar text-xs font-semibold uppercase tracking-wider">
                        Blind Bidding Phase Active
                      </p>
                    </div>
                    <p className="mt-1 text-xs text-[#8C6B00]">
                      Your offer is registered. Competitor ranks and highest offer will be revealed in the final 10 minutes.
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#E5E7EB] p-4 bg-neutral-50">
                    <p className="font-navbar text-xs text-[#5E5E5E]">Your Current Offer</p>
                    <p className="mt-1 font-hero-heading text-2xl font-bold text-[#1E1E1E]">
                      ${myOfferAmount.toLocaleString("en-US")}
                    </p>
                  </div>

                  <div>
                    <label className="font-hero-heading text-sm font-bold text-[#1E1E1E]">
                      Increase Your Offer Amount
                    </label>
                    <div className="relative mt-2">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-4 font-navbar text-base font-medium text-[#5E5E5E]">
                        $
                      </span>
                      <input
                        type="text"
                        value={offerInputAmount}
                        onChange={(e) => setOfferInputAmount(e.target.value.replace(/[^0-9]/g, ""))}
                        placeholder="25,000"
                        className="w-full rounded-xl border border-[#E5E7EB] bg-white py-3 pl-8 pr-4 font-navbar text-base font-semibold text-[#1E1E1E] outline-none transition focus:border-[#FFA51F] focus:ring-1 focus:ring-[#FFA51F]"
                      />
                    </div>
                    <p className="mt-1.5 font-navbar text-xs text-[#5E5E5E]">
                      Minimum Increment: $100
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={isTimeOver || isSubmittingBid}
                    onClick={handlePlaceInitialOffer}
                    className="mt-2 w-full cursor-pointer rounded-xl bg-[#FFA51F] py-3.5 text-center font-navbar text-base font-bold text-[#1E1E1E] transition hover:bg-[#e8940f] active:bg-[#d88709] shadow-sm disabled:cursor-not-allowed disabled:bg-neutral-200"
                  >
                    {isSubmittingBid ? "Updating..." : "Update Offer Amount"}
                  </button>
                </div>
              ) : (
                /* Initial Offer Form matching Frame 69 */
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="font-hero-heading text-base font-bold text-[#1E1E1E]">
                      Your Offer Amount
                    </label>
                    <div className="relative mt-2">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-4 font-navbar text-lg font-medium text-[#5E5E5E]">
                        $
                      </span>
                      <input
                        type="text"
                        value={offerInputAmount}
                        onChange={(e) => setOfferInputAmount(e.target.value.replace(/[^0-9]/g, ""))}
                        placeholder="25,000"
                        className="w-full rounded-xl border border-[#E5E7EB] bg-white py-3.5 pl-8 pr-4 font-navbar text-lg font-semibold text-[#1E1E1E] outline-none transition focus:border-[#FFA51F] focus:ring-1 focus:ring-[#FFA51F]"
                      />
                    </div>
                    <p className="mt-1.5 font-navbar text-xs text-[#5E5E5E]">
                      Minimum Increment: $100
                    </p>
                  </div>

                  {/* Offer Fee Notice matching Frame 69 */}
                  <div className="rounded-xl border border-[#FFE58F] bg-[#FFFBE6] p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-navbar text-sm font-semibold text-[#1E1E1E]">Offer Fee</span>
                      <span className="font-navbar text-base font-bold text-[#1E1E1E]">$1.99</span>
                    </div>
                    <p className="mt-1 font-navbar text-xs text-[#8C6B00]">
                      Non-refundable • Charged when you submit your offer
                    </p>
                  </div>

                  {/* Place Offer Button */}
                  <button
                    type="button"
                    disabled={isTimeOver || isSubmittingBid}
                    onClick={handlePlaceInitialOffer}
                    className="w-full cursor-pointer rounded-xl bg-[#FFA51F] py-3.5 sm:py-4 text-center font-navbar text-base font-bold text-[#1E1E1E] transition hover:bg-[#e8940f] active:bg-[#d88709] shadow-sm disabled:cursor-not-allowed disabled:bg-neutral-200"
                  >
                    {isSubmittingBid ? "Submitting..." : "Place Offer - $1.99"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Vehicle Video Walkthrough in Right Column */}
          {listing.videoUrl && (
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 sm:p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-[#FFA51F]/15 text-[#FFA51F]">
                  <Video className="size-4.5" strokeWidth={2} />
                </div>
                <h2 className="font-hero-heading text-base font-bold text-[#1E1E1E]">
                  Vehicle Video Walkthrough
                </h2>
              </div>
              <div className="overflow-hidden rounded-xl border border-neutral-200 bg-black aspect-video max-h-[300px] w-full">
                <video
                  src={listing.videoUrl}
                  controls
                  playsInline
                  preload="metadata"
                  className="size-full object-contain mx-auto"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Improve Offer Modal (State 3) */}
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
