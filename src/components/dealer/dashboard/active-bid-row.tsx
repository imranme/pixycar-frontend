import Image from "next/image";
import Link from "next/link";
import { Clock, Trophy } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import type { DealerActiveBid } from "@/components/dealer/dealer-dummy-data";

type ActiveBidRowProps = {
  bid: DealerActiveBid;
};

export function ActiveBidRow({ bid }: ActiveBidRowProps) {
  const isLeading = bid.status === "leading" || bid.rank === 1;

  return (
    <Link
      href={ROUTES.dealer.myOffersActive(bid.id)}
      className="group flex cursor-pointer items-center gap-4 sm:gap-5 rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm transition hover:shadow-md hover:border-[#D1D5DB]"
    >
      <div className="relative h-20 w-28 sm:h-24 sm:w-36 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
        <Image
          src={bid.image || "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=400&h=300&fit=crop"}
          alt={bid.car}
          fill
          unoptimized
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 112px, 144px"
        />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="font-hero-heading text-base font-bold text-[#1E1E1E] sm:text-lg truncate">
          {bid.car}
        </h3>
        <p className="mt-1 font-navbar text-xs sm:text-sm text-[#5E5E5E]">
          Your offer: <span className="font-medium text-[#1E1E1E]">{bid.offer}</span>
        </p>

        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          {isLeading ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E6F9EE] px-3 py-1 font-navbar text-xs font-semibold text-[#00A854]">
              <Trophy className="size-3.5" strokeWidth={2.2} aria-hidden />
              Leading
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF2E8] px-3 py-1 font-navbar text-xs font-semibold text-[#FA541C]">
              #{bid.rank || 2}
            </span>
          )}

          <span className="inline-flex items-center gap-1 font-navbar text-xs font-medium text-[#00A854]">
            <Clock className="size-3.5" strokeWidth={2} aria-hidden />
            {bid.timeLeft}
          </span>
        </div>
      </div>
    </Link>
  );
}
