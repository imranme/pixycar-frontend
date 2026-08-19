"use client";

import { use } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { useGetPublicDealerProfileQuery } from "@/store/features/auth/authApi";
import { DealerProfileCard } from "@/components/seller/dealer-profile/dealer-profile-card";
import { RecentActivity } from "@/components/seller/dealer-profile/recent-activity";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function SellerDealerProfilePage({ params }: PageProps) {
  const { id } = use(params);
  const { data: dealerData, isLoading } = useGetPublicDealerProfileQuery(id);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
        <Loader2 className="size-8 animate-spin text-[#FFA51F]" />
        <p className="font-navbar text-sm text-[#5E5E5E]">Loading dealer profile…</p>
      </div>
    );
  }

  const dealer = dealerData || {
    id: Number(id) || 1,
    business_name: `Dealer #${id}`,
    email: "",
    business_phone: "Not provided",
    business_address: "USA",
    avatar: null,
    recent_activity: [],
  };

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <Link
        href={ROUTES.seller.messages}
        className="inline-flex items-center gap-1 font-navbar text-sm font-medium text-[#5E5E5E] transition hover:text-[#1E1E1E]"
      >
        <span aria-hidden>←</span>
        Back to Message
      </Link>

      <div className="mt-8">
        <DealerProfileCard dealer={dealer} />
        <RecentActivity items={dealer.recent_activity} />
      </div>
    </div>
  );
}
