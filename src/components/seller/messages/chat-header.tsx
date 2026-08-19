"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ROUTES } from "@/constants/routes";

type ChatHeaderProps = {
  dealerId: string;
  dealerName: string;
  dealerInitial: string;
  dealerImage: string | null;
  carName: string;
  showMobileBack?: boolean;
  onMobileBack?: () => void;
  contactProfileHref?: string;
};

export function ChatHeader({
  dealerId,
  dealerName,
  dealerInitial,
  dealerImage,
  carName,
  showMobileBack,
  onMobileBack,
  contactProfileHref,
}: ChatHeaderProps) {
  const profileHref = contactProfileHref ?? ROUTES.seller.dealerProfile(dealerId);

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
          {dealerImage ? (
            <Image
              src={dealerImage}
              alt=""
              width={44}
              height={44}
              className="size-11 rounded-full object-cover shadow-2xs"
              unoptimized
            />
          ) : (
            <div
              className="flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-500 font-navbar text-base font-bold text-white shadow-2xs"
              aria-hidden
            >
              {dealerInitial}
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
            {dealerName}
          </Link>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="font-navbar text-xs font-semibold text-emerald-600">Active now</span>
            <span className="text-neutral-300">•</span>
            <p className="truncate font-navbar text-xs text-[#5E5E5E]">{carName}</p>
          </div>
        </div>
      </div>

      <span className="shrink-0 rounded-full bg-[#16A34A] px-3 py-1 font-navbar text-xs font-semibold text-white shadow-xs">
        Connected
      </span>
    </div>
  );
}
