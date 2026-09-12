"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ROUTES } from "@/constants/routes";
import { PaymentCard, type SavedPaymentCard } from "@/components/seller/payment/payment-card";
import { useUnlockChatMutation } from "@/store/features/communication/communicationApi";
import { useCreateStripeCheckoutSessionMutation } from "@/store/features/payments/paymentsApi";

const INITIAL_CARD: SavedPaymentCard = {
  id: 1,
  type: "Debit Card",
  brand: "Visa",
  last4: "4245",
  balance: "$5,666",
};

type PayUnlockPageClientProps = {
  listingId: string;
};

export function PayUnlockPageClient({ listingId }: PayUnlockPageClientProps) {
  const router = useRouter();
  const [cards, setCards] = useState<SavedPaymentCard[]>([INITIAL_CARD]);
  const [toast, setToast] = useState<string | null>(null);
  const [unlockChat, { isLoading: isUnlockLoading }] = useUnlockChatMutation();
  const [createCheckoutSession, { isLoading: isStripeLoading }] = useCreateStripeCheckoutSessionMutation();

  const isLoading = isUnlockLoading || isStripeLoading;

  const handlePayAndUnlock = async () => {
    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
      const res = await createCheckoutSession({
        payment_type: "CHAT_UNLOCK" as any,
        listing_id: Number(listingId),
        success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}&type=chat_unlock&listing_id=${listingId}`,
        cancel_url: `${origin}${ROUTES.dealer.myOffersUnlockChat(listingId)}?payment=cancel`,
      }).unwrap();

      if (res.checkout_url) {
        window.location.href = res.checkout_url;
        return;
      }
      
      const fallbackRes = await unlockChat(listingId).unwrap();
      setToast(fallbackRes.detail || "Payment successful. Chat unlocked.");
      const roomId = fallbackRes.thread_id || (fallbackRes.thread as any)?.id;
      window.setTimeout(() => {
        router.push(roomId ? `${ROUTES.dealer.messages}?roomId=${roomId}` : ROUTES.dealer.messages);
      }, 900);
    } catch (err: any) {
      console.error("Stripe checkout error, trying direct card fallback:", err);
      try {
        const fallbackRes = await unlockChat(listingId).unwrap();
        setToast(fallbackRes.detail || "Payment successful. Chat unlocked.");
        const roomId = fallbackRes.thread_id || (fallbackRes.thread as any)?.id;
        window.setTimeout(() => {
          router.push(roomId ? `${ROUTES.dealer.messages}?roomId=${roomId}` : ROUTES.dealer.messages);
        }, 900);
      } catch (fallbackErr: any) {
        setToast(fallbackErr?.data?.detail || err?.data?.detail || "Failed to process payment. Please try again.");
      }
    }
  };

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(t);
  }, [toast]);

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      {toast ? (
        <div
          className="fixed bottom-6 left-1/2 z-[110] w-[min(90vw,400px)] -translate-x-1/2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center font-navbar text-sm font-medium text-emerald-900 shadow-lg"
          role="status"
        >
          {toast}
        </div>
      ) : null}

      <Link
        href={ROUTES.dealer.myOffersUnlockChat(listingId)}
        className="inline-flex items-center gap-1 font-navbar text-sm font-medium text-[#5E5E5E] transition hover:text-[#1E1E1E]"
      >
        <span aria-hidden>←</span>
        Back to Bidding Details
      </Link>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-2">
        <h1 className="font-hero-heading text-2xl font-bold text-[#1E1E1E] sm:text-3xl">Unlock to Connect with Seller</h1>
        <span className="font-hero-heading text-2xl font-bold text-[#22C55E] sm:text-3xl">$69.95</span>
      </div>
      <p className="mt-2 font-navbar text-sm text-[#5E5E5E]">
        If the Seller does not respond to connection requests within 72 hrs (3 days), we will automatically refund your $69.95 Connection Fee.
      </p>

      <div className="mt-8 rounded-xl bg-[#EEF2FF] px-4 py-4">
        <p className="font-hero-heading text-sm font-bold text-indigo-900 sm:text-base">What you&apos;ll get:</p>
        <ul className="mt-2 list-inside list-disc space-y-1 font-navbar text-sm text-indigo-900 sm:text-base">
          <li>Direct Real-Time Messaging</li>
          <li>Seller Contact & Phone Information</li>
          <li>Exact Vehicle Location Details</li>
        </ul>
      </div>

      <h2 className="mt-8 font-hero-heading text-lg font-bold text-[#1E1E1E]">Payment by card</h2>
      <div className="mt-3 space-y-3">
        {cards.map((c) => (
          <PaymentCard
            key={c.id}
            card={c}
            editHref={ROUTES.dealer.settingsAddPaymentCard}
            onDelete={(id) => {
              setCards((prev) => prev.filter((x) => x.id !== id));
            }}
          />
        ))}
      </div>

      <button
        type="button"
        disabled={isLoading}
        onClick={handlePayAndUnlock}
        className="mt-8 w-full cursor-pointer rounded-xl bg-[#FFA51F] py-4 font-navbar text-base font-bold text-[#1E1E1E] shadow-sm transition hover:bg-[#e8940f] disabled:opacity-60"
      >
        {isLoading ? "Connecting…" : "Pay $69.95 & Connect"}
      </button>
    </div>
  );
}
