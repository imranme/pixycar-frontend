"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { PaymentCard, type SavedPaymentCard } from "@/components/seller/payment/payment-card";
import { ConfirmOfferModal } from "@/components/dealer/offer/confirm-offer-modal";
import { useCreateStripeCheckoutSessionMutation } from "@/store/features/payments/paymentsApi";
import { useGetListingByIdQuery } from "@/store/features/listings/listingsApi";

const INITIAL_CARD: SavedPaymentCard = {
  id: 1,
  type: "Debit Card",
  brand: "Visa",
  last4: "4245",
  balance: "$5,666",
};

type OfferFeePageProps = {
  listingId: string;
};

export function OfferFeePage({ listingId }: OfferFeePageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawAmount = searchParams?.get("amount") || "25000";
  const cleanAmount = rawAmount.replace(/[^0-9.]/g, "") || "25000";

  const { data: apiListing } = useGetListingByIdQuery(listingId);
  const vehicleTitle = apiListing
    ? `${apiListing.year || ""} ${apiListing.make || ""} ${apiListing.model || ""} ${apiListing.trim || ""}`.trim()
    : "Vehicle Offer";

  const [cards, setCards] = useState<SavedPaymentCard[]>([INITIAL_CARD]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [createCheckout, { isLoading }] = useCreateStripeCheckoutSessionMutation();

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(t);
  }, [toast]);

  const handleConfirm = async () => {
    try {
      setShowConfirm(false);
      setToast("Redirecting to Stripe Checkout…");
      const baseUrl = window.location.origin;
      const res = await createCheckout({
        payment_type: "BID_FEE",
        listing_id: Number(listingId),
        bid_amount: cleanAmount,
        success_url: `${baseUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}&type=bid_fee&listing_id=${listingId}`,
        cancel_url: `${baseUrl}/dealer/my-offers`,
      }).unwrap();

      if (res.checkout_url) {
        window.location.href = res.checkout_url;
      }
    } catch (err: any) {
      setShowConfirm(false);
      setToast(err?.data?.detail || err?.data?.message || "Failed to initiate Stripe payment.");
    }
  };

  return (
    <div className="mx-auto w-full max-w-lg flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      {toast ? (
        <div
          className="fixed bottom-6 left-1/2 z-[110] w-[min(90vw,400px)] -translate-x-1/2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center font-navbar text-sm font-medium text-emerald-900 shadow-lg"
          role="status"
        >
          {toast}
        </div>
      ) : null}

      <Link
        href={ROUTES.dealer.bidding(listingId)}
        className="inline-flex items-center gap-1 font-navbar text-sm font-medium text-[#5E5E5E] transition hover:text-[#1E1E1E]"
      >
        <span aria-hidden>←</span>
        Back to Bidding Details
      </Link>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-2">
        <h1 className="font-hero-heading text-2xl font-bold text-[#1E1E1E] sm:text-3xl">Offer Fee</h1>
        <span className="font-hero-heading text-2xl font-bold text-emerald-600 sm:text-3xl">$1.99</span>
      </div>
      <p className="mt-2 font-navbar text-sm text-[#5E5E5E]">Non-refundable • Charged when you submit your offer</p>

      <div className="mt-8 rounded-xl bg-indigo-50 px-4 py-4">
        <p className="font-hero-heading text-sm font-bold text-indigo-900 sm:text-base">What you&apos;ll get:</p>
        <ul className="mt-2 list-inside list-disc space-y-1 font-navbar text-sm text-indigo-900 sm:text-base">
          <li>Your car listed for 2 Hours</li>
          <li>Multiple offers from verified dealers</li>
          <li>Direct chat with winning dealer</li>
          <li>Full refund if no offers received</li>
        </ul>
      </div>

      <h2 className="mt-8 font-hero-heading text-lg font-bold text-[#1E1E1E]">Payment by card</h2>
      <div className="mt-3 space-y-3">
        {cards.map((c) => (
          <PaymentCard
            key={c.id}
            card={c}
            editHref={ROUTES.dealer.settingsAddPaymentCard}
            onDelete={(id) => setCards((prev) => prev.filter((x) => x.id !== id))}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() => {
          setShowConfirm(true);
        }}
        className="mt-8 w-full cursor-pointer rounded-xl bg-[#FFA51F] py-4 font-navbar text-base font-bold text-white shadow-sm transition hover:bg-[#e8940f]"
      >
        Pay & Publish
      </button>

      <ConfirmOfferModal
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirm}
        title={vehicleTitle}
        amount={cleanAmount}
        isLoading={isLoading}
      />
    </div>
  );
}
