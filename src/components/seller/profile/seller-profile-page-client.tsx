"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { useGetSellerProfileQuery } from "@/store/features/auth/authApi";
import { ContactInfoCard } from "@/components/seller/profile/contact-info-card";
import { ProfileCard } from "@/components/seller/profile/profile-card";
import { TotalAuctionSection } from "@/components/seller/profile/total-auction-section";

export function SellerProfilePageClient() {
  const searchParams = useSearchParams();
  const fromMessages = searchParams.get("from") === "messages";
  const { data: profile, isLoading } = useGetSellerProfileQuery();

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
        <Loader2 className="size-8 animate-spin text-[#FFA51F]" />
        <p className="font-navbar text-sm text-[#5E5E5E]">Loading profile…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      {fromMessages ? (
        <Link
          href={ROUTES.seller.messages}
          className="inline-flex items-center gap-1 font-navbar text-sm font-medium text-[#5E5E5E] transition hover:text-[#1E1E1E]"
        >
          <span aria-hidden>←</span>
          Back to Message
        </Link>
      ) : (
        <Link
          href={ROUTES.seller.dashboard}
          className="inline-flex items-center gap-1 font-navbar text-sm font-medium text-[#5E5E5E] transition hover:text-[#1E1E1E]"
        >
          <span aria-hidden>←</span>
          Back to Dashboard
        </Link>
      )}

      <div className="mt-8 rounded-2xl border border-[#E5E7EB] bg-white p-8 shadow-sm sm:p-10">
        <ProfileCard profile={profile} />
        <div className="mt-8">
          <ContactInfoCard profile={profile} />
        </div>
        <TotalAuctionSection cars={profile?.cars} totalAuctions={profile?.total_auctions} />
      </div>
    </div>
  );
}
