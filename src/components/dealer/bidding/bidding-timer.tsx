"use client";

import { useAuctionTimer } from "@/hooks/use-auction-timer";
import { cn } from "@/lib/utils";

type BiddingTimerProps = {
  phase?: "active" | "timeOver";
  initialSeconds?: number;
  expiresAt?: string | null;
  className?: string;
  onPhaseChange?: (isFinal10Min: boolean) => void;
};

export function BiddingTimer({
  phase = "active",
  initialSeconds = 3600,
  expiresAt,
  className,
}: BiddingTimerProps) {
  const isLiveAuction = phase === "active";
  const { secondsLeft, formattedTime, isFinal10Min, isTimeOver, progressPct } = useAuctionTimer({
    expiresAt,
    timeRemainingSeconds: initialSeconds,
    isLive: isLiveAuction,
    totalDurationSeconds: 3600,
  });

  const minutesRemaining = Math.max(0, Math.ceil(secondsLeft / 60));

  if (isTimeOver || phase === "timeOver") {
    return (
      <div className={cn("flex flex-col gap-1.5 min-w-[260px] sm:min-w-[300px]", className)}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-hero-heading text-2xl sm:text-3xl font-bold tracking-tight text-[#5E5E5E]">
              00:00:00
            </p>
          </div>
          <span className="rounded-full bg-red-100 px-3 py-0.5 font-navbar text-xs font-semibold text-red-600">
            Time Over
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200">
          <div className="h-full w-full rounded-full bg-red-400" />
        </div>
        <div className="flex justify-between font-navbar text-xs text-[#5E5E5E]">
          <span>Auction Closed</span>
          <span>0 min</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-1.5 min-w-[260px] sm:min-w-[300px]", className)}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-hero-heading text-2xl sm:text-3xl font-bold tracking-tight text-[#FFA51F]">
            {formattedTime}
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#16A34A] px-3 py-1 font-navbar text-xs font-semibold text-white shadow-xs">
          <span className="size-1.5 rounded-full bg-white animate-pulse" />
          Live
        </span>
      </div>

      {/* Segmented Dual-Phase Progress Bar matching Frame 69 & Frame 75 */}
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-[#E5E7EB]">
        {/* Blind phase marker (First 50/60 = 83.33%) */}
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300 ease-linear",
            isFinal10Min ? "bg-[#FFA51F]" : "bg-[#FFA51F]"
          )}
          style={{ width: `${progressPct}%` }}
        />
        {/* 10-min split line */}
        <div className="absolute top-0 bottom-0 left-[83.33%] w-[2px] bg-white z-10" />
      </div>

      {/* Mode / Indicator Labels matching PDF */}
      <div className="flex justify-between items-center font-navbar text-[11px] sm:text-xs">
        <span className={cn("font-medium", !isFinal10Min ? "text-[#FFA51F] font-semibold" : "text-[#5E5E5E]")}>
          Blind (First 50 min)
        </span>
        <span className={cn("font-medium", isFinal10Min ? "text-[#FFA51F] font-bold" : "text-[#5E5E5E]")}>
          Open (Last 10 min)
        </span>
      </div>
    </div>
  );
}
