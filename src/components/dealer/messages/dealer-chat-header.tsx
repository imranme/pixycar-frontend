"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ROUTES } from "@/constants/routes";

type DealerChatHeaderProps = {
  sellerId: string;
  sellerName: string;
  sellerInitial: string;
  sellerImage: string | null;
  carName: string;
  biddingSoldListingId?: string;
  showMobileBack?: boolean;
  onMobileBack?: () => void;
};

export function DealerChatHeader({
  sellerId,
  sellerName,
  sellerInitial,
  sellerImage,
  carName,
  biddingSoldListingId,
  showMobileBack,
  onMobileBack,
}: DealerChatHeaderProps) {
  const profileHref = ROUTES.dealer.sellerProfile(sellerId);

  return (
    <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[#E5E7EB] bg-white px-5 py-3.5 shadow-2xs">
      <div className="flex items-center gap-3 min-w-0">
        {showMobileBack && onMobileBack ? (
          <button
            type="button"
            onClick={onMobileBack}
            className="flex shrink-0 cursor-pointer items-center gap-0.5 rounded-lg p-1 font-navbar text-sm font-medium text-[#5E5E5E] transition hover:bg-neutral-100 hover:text-[#1E1E1E] lg:hidden"
            aria-label="Back to conversations"
          >
            <ChevronLeft className="size-5" strokeWidth={2} />
            <span className="sr-only sm:not-sr-only">Back</span>
          </button>
        ) : null}

        <div className="relative shrink-0">
          {sellerImage ? (
            <Image
              src={sellerImage}
              alt=""
              width={44}
              height={44}
              className="size-11 rounded-full object-cover shadow-2xs"
              unoptimized
            />
          ) : (
            <div
              className="flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-slate-700 to-slate-900 font-navbar text-base font-bold text-white shadow-2xs"
              aria-hidden
            >
              {sellerInitial}
            </div>
          )}
          {/* Active online green dot */}
          <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-white bg-emerald-500 shadow-2xs" />
        </div>

        <div className="min-w-0 flex-1">
          <Link
            href={profileHref}
            className="block truncate font-hero-heading text-base font-bold text-[#1E1E1E] transition hover:text-[#FFA51F]"
          >
            {sellerName}
          </Link>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="font-navbar text-xs font-semibold text-emerald-600">Active now</span>
            <span className="text-neutral-300">•</span>
            <p className="truncate font-navbar text-xs text-[#5E5E5E]">{carName}</p>
          </div>
        </div>
      </div>

      {biddingSoldListingId ? (
        <Link
          href={ROUTES.dealer.biddingSold(biddingSoldListingId)}
          className="shrink-0 rounded-full border border-[#E5E7EB] bg-neutral-50 px-3 py-1 font-navbar text-xs font-semibold text-[#5E5E5E] transition hover:border-[#FFA51F] hover:text-[#FFA51F]"
        >
          View Car
        </Link>
      ) : null}
    </div>
  );
}
