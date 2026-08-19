"use client";

import { cn } from "@/lib/utils";
import type { ListingStatus } from "@/components/seller/my-listings/listings-dummy-data";

export type ListingsFilterValue = "All" | ListingStatus;

type ListingsFilterProps = {
  value: ListingsFilterValue;
  onChange: (value: ListingsFilterValue) => void;
};

const TABS: { label: ListingsFilterValue; display: string }[] = [
  { label: "All", display: "All" },
  { label: "Active", display: "Active" },
  { label: "TimeOver", display: "Time Over" },
  { label: "Sold", display: "Sold" },
  { label: "Draft", display: "Draft" },
];

export function ListingsFilter({ value, onChange }: ListingsFilterProps) {
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      {TABS.map((tab) => {
        const selected = value === tab.label;
        return (
          <button
            key={tab.label}
            type="button"
            onClick={() => onChange(tab.label)}
            className={cn(
              "cursor-pointer rounded-full px-5 py-2 font-navbar text-sm font-semibold transition-colors sm:text-base",
              selected
                ? "bg-[#FFA51F] text-white"
                : "border border-[#E5E7EB] bg-white text-[#1E1E1E] hover:border-[#FFA51F]/50"
            )}
          >
            {tab.display}
          </button>
        );
      })}
    </div>
  );
}
