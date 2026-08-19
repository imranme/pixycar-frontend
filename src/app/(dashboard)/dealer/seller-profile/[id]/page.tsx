"use client";

import { use } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { useGetPublicSellerProfileQuery } from "@/store/features/auth/authApi";
import { SellerProfileView } from "@/components/dealer/messages/seller-profile-view";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function DealerSellerProfilePage({ params }: PageProps) {
  const { id } = use(params);
  const { data: sellerData, isLoading } = useGetPublicSellerProfileQuery(id);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
        <Loader2 className="size-8 animate-spin text-[#FFA51F]" />
        <p className="font-navbar text-sm text-[#5E5E5E]">Loading seller profile…</p>
      </div>
    );
  }

  const seller = sellerData || {
    id: Number(id) || 1,
    full_name: "Vehicle Seller",
    email: "",
    phone_number: "Not provided",
    address: "USA",
    avatar: null,
    total_auctions: 0,
    cars: [],
  };

  return (
    <div className="mx-auto w-full max-w-lg flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <Link
        href={ROUTES.dealer.messages}
        className="inline-flex items-center gap-1 font-navbar text-sm font-medium text-[#5E5E5E] transition hover:text-[#1E1E1E]"
      >
        <span aria-hidden>&larr;</span>
        Back to Message
      </Link>

      <h1 className="mt-6 font-hero-heading text-2xl font-bold text-[#1E1E1E] sm:text-3xl">Profile</h1>

      <div className="mt-8">
        <SellerProfileView seller={seller} />
      </div>
    </div>
  );
}
