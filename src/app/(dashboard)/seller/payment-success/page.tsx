"use client";

import Link from "next/link";
import { CheckCircle2, ArrowLeft, Car, Home } from "lucide-react";
import { ROUTES } from "@/constants/routes";

export default function SellerPaymentSuccessPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-10 text-center sm:px-6">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="size-10" />
        </div>

        <h1 className="mt-6 font-hero-heading text-2xl font-bold text-[#1E1E1E] sm:text-3xl">
          Payment Successful! 🎉
        </h1>

        <p className="mt-3 font-navbar text-sm text-[#5E5E5E] sm:text-base">
          Your payment has been verified and processed by Stripe. Your car listing is now published!
        </p>

        <div className="mt-8 flex flex-col gap-3">
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
            Go to Dashboard
          </Link>

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
