import { BadgeCheck, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

type OfferRowProps = {
  dealerName: string;
  timeAgo: string;
  amount: string;
  isHighest?: boolean;
  distance?: string;
  location?: string;
  /** "list" = bordered rows in one card; "stacked" = each row in own rounded box (offering complete) */
  layout?: "list" | "stacked";
};

export function OfferRow({
  dealerName,
  timeAgo,
  amount,
  isHighest,
  distance,
  location,
  layout = "list",
}: OfferRowProps) {
  const stacked = layout === "stacked";
  const stackedHighest = stacked && isHighest;

  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4",
        stacked
          ? cn(
              "rounded-xl px-4 py-4 sm:px-5",
              stackedHighest
                ? "border-2 border-[#FFA51F] bg-amber-50/80"
                : "border border-[#E5E7EB] bg-white"
            )
          : "border-b border-[#E5E7EB] py-4 last:border-b-0"
      )}
    >
      <div className="min-w-0 sm:flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-navbar text-sm font-bold text-[#1E1E1E] sm:text-base">{dealerName}</span>
          <BadgeCheck className="size-4 shrink-0 text-[#FFA51F] sm:size-5" strokeWidth={2} aria-hidden />
          {distance && (
            <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 font-navbar text-xs font-medium text-amber-800 border border-amber-200/60">
              <MapPin className="size-3 text-amber-600 shrink-0" />
              {distance}
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-0.5">
          <p className="font-navbar text-xs text-[#5E5E5E] sm:text-sm">{timeAgo}</p>
          {location && (
            <>
              <span className="text-gray-300 text-xs">•</span>
              <span className="font-navbar text-xs text-[#5E5E5E]">{location}</span>
            </>
          )}
        </div>
      </div>

      {isHighest ? (
        <div className="flex shrink-0 items-center justify-center sm:w-24">
          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 font-navbar text-xs font-semibold text-emerald-700">
            Highest
          </span>
        </div>
      ) : (
        <div className="hidden w-24 shrink-0 sm:block" />
      )}

      <div className="text-left sm:text-right">
        <p className="font-navbar text-xs text-[#5E5E5E]">Offer Amount</p>
        <p className="font-navbar text-base font-bold text-[#1E1E1E] sm:text-lg">{amount}</p>
      </div>
    </div>
  );
}
