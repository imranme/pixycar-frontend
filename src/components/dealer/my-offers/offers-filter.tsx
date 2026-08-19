"use client";

import type { OffersTab } from "@/components/dealer/my-offers/dealer-my-offers-data";
import { cn } from "@/lib/utils";

const TABS: OffersTab[] = ["Active", "Won", "Lost"];

type OffersFilterProps = {
  value: OffersTab;
  onChange: (tab: OffersTab) => void;
};

export function OffersFilter({ value, onChange }: OffersFilterProps) {
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      {TABS.map((tab) => {
        const selected = value === tab;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => {
              console.log("my offers tab:", tab);
              onChange(tab);
            }}
            className={cn(
              "cursor-pointer rounded-full px-5 py-2 font-navbar text-sm font-semibold transition-colors sm:text-base",
              selected ? "bg-[#FFA51F] text-white" : "border border-[#E5E7EB] bg-white text-[#1E1E1E] hover:border-[#FFA51F]/50"
            )}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
