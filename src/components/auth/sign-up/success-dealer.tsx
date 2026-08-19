"use client";

import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

export function SuccessDealer() {
  const router = useRouter();

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6">
      <div
        className="flex size-14 items-center justify-center rounded-full bg-violet-600 font-hero-heading text-xl font-bold text-white shadow-md"
        aria-hidden
      >
        T
      </div>

      <div className="w-full rounded-2xl border border-neutral-200/80 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 className="size-8 text-emerald-600" strokeWidth={2} aria-hidden />
        </div>
        <h2 className="mt-6 font-hero-heading text-2xl font-bold text-[#1E1E1E]">
          Verification Complete
        </h2>
        <p className="mt-2 font-navbar text-base font-normal text-[#5E5E5E]">
          Start your bidding now
        </p>
        <button
          type="button"
          onClick={() => router.push(ROUTES.dealer.dashboard)}
          className={cn(
            "mt-8 w-full cursor-pointer rounded-xl bg-[#FFA51F] py-3 font-navbar text-base font-semibold text-black",
            "transition-opacity hover:opacity-90"
          )}
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
