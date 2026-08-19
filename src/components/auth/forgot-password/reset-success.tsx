"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

export function ResetSuccess() {
  return (
    <div className="w-full max-w-[480px] rounded-2xl border border-[#E5E7EB] bg-white p-8 shadow-sm">
      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100">
        <CheckCircle2 className="size-9 text-emerald-600" strokeWidth={2} aria-hidden />
      </div>

      <h1 className="mt-6 text-center font-hero-heading text-2xl font-bold text-[#1E1E1E]">
        Password Reset Complete
      </h1>
      <p className="mt-2 text-center font-navbar text-sm font-normal text-[#5E5E5E]">
        Now First Login Again
      </p>

      <Link
        href={ROUTES.auth.signIn}
        className={cn(
          "mt-8 flex w-full cursor-pointer items-center justify-center rounded-xl bg-[#FFA51F] py-3",
          "font-navbar text-base font-semibold text-white transition-opacity hover:opacity-90"
        )}
      >
        Go to Login
      </Link>
    </div>
  );
}
