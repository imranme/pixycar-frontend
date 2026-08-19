"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { useGetDealerProfileQuery } from "@/store/features/auth/authApi";
import { DealerProfileCard } from "@/components/dealer/profile/dealer-profile-card";
import { DealerRecentActivity } from "@/components/dealer/profile/dealer-recent-activity";
import { DealerStatsGrid } from "@/components/dealer/profile/dealer-stats-grid";

export function DealerProfilePageClient() {
  const searchParams = useSearchParams();
  const fromMessages = searchParams.get("from") === "messages";
  const { data: profile, isLoading } = useGetDealerProfileQuery();

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
        <Loader2 className="size-8 animate-spin text-[#FFA51F]" />
        <p className="font-navbar text-sm text-[#5E5E5E]">Loading profile…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-lg flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      {fromMessages ? (
        <Link
          href={ROUTES.dealer.messages}
          className="inline-flex items-center gap-1 font-navbar text-sm font-medium text-[#5E5E5E] transition hover:text-[#1E1E1E]"
        >
          <span aria-hidden>←</span>
          Back to Message
        </Link>
      ) : (
        <Link
          href={ROUTES.dealer.dashboard}
          className="inline-flex items-center gap-1 font-navbar text-sm font-medium text-[#5E5E5E] transition hover:text-[#1E1E1E]"
        >
          <span aria-hidden>←</span>
          Back to Dashboard
        </Link>
      )}

      <h1 className="mt-6 font-hero-heading text-2xl font-bold text-[#1E1E1E]">Profile</h1>

      <div className="mt-8">
        <DealerProfileCard profile={profile} />
        <DealerStatsGrid profile={profile} />
        <DealerRecentActivity profile={profile} />
      </div>
    </div>
  );
}
