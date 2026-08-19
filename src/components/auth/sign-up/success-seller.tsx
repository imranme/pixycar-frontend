"use client";

import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

export function SuccessSeller() {
  const router = useRouter();

  return (
    <div className="flex w-full max-w-md flex-col items-stretch gap-6">
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 className="size-8 text-emerald-600" strokeWidth={2} aria-hidden />
        </div>
        <h2 className="mt-6 font-hero-heading text-2xl font-bold text-[#1E1E1E]">
          You&apos;re All Set!
        </h2>
        <p className="mt-2 font-navbar text-base font-normal text-[#5E5E5E]">
          Let&apos;s list your car and start getting offers
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => router.push(ROUTES.seller.dashboard)}
            className={cn(
              "flex-1 cursor-pointer rounded-xl border border-[#FFA51F] bg-white py-3 font-navbar text-base font-semibold text-[#FFA51F]",
              "transition-colors hover:bg-[#FFA51F]/10"
            )}
          >
            Skip Now
          </button>
          <button
            type="button"
            onClick={() => router.push(ROUTES.seller.listCar)}
            className={cn(
              "flex-1 cursor-pointer rounded-xl bg-[#FFA51F] py-3 font-navbar text-base font-semibold text-black",
              "transition-opacity hover:opacity-90"
            )}
          >
            List My Car
          </button>
        </div>
      </div>
    </div>
  );
}
