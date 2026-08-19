"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ArrowLeft, Car, Home, Loader2, Tag, LayoutDashboard, MessageSquare } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { useAppSelector } from "@/store";
import { selectCurrentUser } from "@/store/features/auth/authSlice";
import { useVerifyStripeSessionQuery } from "@/store/features/payments/paymentsApi";

export default function PaymentSuccessPage() {
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id") || "";
  const paymentTypeParam = searchParams.get("type") || "";
  const listingIdParam = searchParams.get("listing_id") || "";

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: verificationData, isLoading: verifying } = useVerifyStripeSessionQuery(sessionId, {
    skip: !sessionId,
  });
  const user = useAppSelector(selectCurrentUser);
  const isDealer = paymentTypeParam === "bid_fee" || (mounted && user?.role === "DEALER");

  const isChatUnlock =
    paymentTypeParam === "chat_unlock" ||
    (verificationData as any)?.payment_type === "CHAT_UNLOCK";

  const chatThreadId = (verificationData as any)?.thread_id;
  const chatHref = chatThreadId
    ? `${ROUTES.dealer.messages}?roomId=${chatThreadId}`
    : ROUTES.dealer.messages;

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-12 text-center sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          {verifying ? <Loader2 className="size-10 animate-spin text-amber-500" /> : <CheckCircle2 className="size-10" />}
        </div>

        <h1 className="mt-6 font-hero-heading text-2xl font-bold text-[#1E1E1E] sm:text-3xl">
          {verifying
            ? "Verifying Payment…"
            : isChatUnlock
            ? "Connection Unlocked! 🎉"
            : isDealer
            ? "Offer Placed Successfully! 🎉"
            : "Payment Successful! 🎉"}
        </h1>

        <p className="mt-3 font-navbar text-sm text-[#5E5E5E] sm:text-base">
          {verifying
            ? "Please wait while we verify your Stripe transaction."
            : isChatUnlock
            ? "Your connection fee has been verified. You can now chat directly with the seller to coordinate next steps."
            : isDealer
            ? "Your bid fee has been verified and processed by Stripe. Your offer is now active in the auction!"
            : "Your payment has been verified and processed by Stripe. Your car listing is now live!"}
        </p>

        <div className="mt-8 flex flex-col gap-3">
          {isChatUnlock ? (
            <>
              <Link
                href={chatHref}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#FFA51F] px-6 py-3 font-navbar text-base font-semibold text-[#1E1E1E] transition-opacity hover:opacity-90"
              >
                <MessageSquare className="size-5" />
                Open Chat with Seller
              </Link>

              <Link
                href={ROUTES.dealer.myOffers}
                className="flex items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white px-6 py-3 font-navbar text-base font-semibold text-[#1E1E1E] transition-colors hover:bg-neutral-50"
              >
                <Tag className="size-5 text-[#5E5E5E]" />
                Go to My Offers
              </Link>
            </>
          ) : isDealer ? (
            <>
              <Link
                href={ROUTES.dealer.myOffers}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#FFA51F] px-6 py-3 font-navbar text-base font-semibold text-white transition-opacity hover:opacity-90"
              >
                <Tag className="size-5" />
                Go to My Offers
              </Link>

              <Link
                href={ROUTES.dealer.dashboard}
                className="flex items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white px-6 py-3 font-navbar text-base font-semibold text-[#1E1E1E] transition-colors hover:bg-neutral-50"
              >
                <LayoutDashboard className="size-5 text-[#5E5E5E]" />
                Go to Dealer Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                href={ROUTES.seller.myListings}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#FFA51F] px-6 py-3 font-navbar text-base font-semibold text-white transition-opacity hover:opacity-90"
              >
                <Car className="size-5" />
                Go to My Listings
              </Link>

              <Link
                href={ROUTES.seller.dashboard}
                className="flex items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white px-6 py-3 font-navbar text-base font-semibold text-[#1E1E1E] transition-colors hover:bg-neutral-50"
              >
                <Home className="size-5 text-[#5E5E5E]" />
                Go to Seller Dashboard
              </Link>
            </>
          )}

          <Link
            href={ROUTES.home}
            className="mt-2 inline-flex items-center justify-center gap-1.5 font-navbar text-sm font-medium text-[#5E5E5E] hover:text-[#1E1E1E]"
          >
            <ArrowLeft className="size-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

