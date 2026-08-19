"use client";

import { cn } from "@/lib/utils";

export type QuickAdjustOption = {
  key: string;
  labelTop: string;
  labelBottom: string;
  amount: number;
  highlight?: boolean;
};

type QuickAdjustProps = {
  options: QuickAdjustOption[];
  onSelect: (amount: number, key: string) => void;
  onAddCustom?: () => void;
};

export function QuickAdjust({ options, onSelect, onAddCustom }: QuickAdjustProps) {
  return (
    <div className="space-y-2.5">
      <p className="font-hero-heading text-sm sm:text-base font-bold text-[#1E1E1E]">Quick Adjust</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {options.map((opt) => {
          const isAdd = opt.key === "add";
          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => {
                if (isAdd && onAddCustom) {
                  onAddCustom();
                  return;
                }
                onSelect(opt.amount, opt.key);
              }}
              className={cn(
                "group cursor-pointer rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 text-center transition-all duration-150",
                "hover:border-[#FFA51F] hover:bg-amber-50/30 hover:shadow-sm",
                opt.highlight && "border-[#FFA51F] bg-amber-50/40 ring-1 ring-[#FFA51F]/40"
              )}
            >
              <span className="block font-navbar text-xs sm:text-sm font-bold text-[#1E1E1E] group-hover:text-[#FFA51F]">
                {opt.labelTop}
              </span>
              <span className="mt-0.5 block font-navbar text-xs font-medium text-[#5E5E5E]">
                {opt.labelBottom}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
