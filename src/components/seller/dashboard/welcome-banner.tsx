import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

export function WelcomeBanner() {
  return (
    <div
      className={cn(
        "flex w-full flex-col gap-4 rounded-2xl bg-[#FFA51F] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8"
      )}
    >
      <div>
        <h1 className="font-hero-heading text-2xl font-bold text-[#1E1E1E] sm:text-3xl">Welcome back!</h1>
        <p className="mt-1 font-navbar text-base font-normal text-[#1E1E1E]">
          Here is your selling overview
        </p>
      </div>
      <Link
        href={ROUTES.seller.listCar}
        className={cn(
          "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 self-start rounded-full bg-white",
          "px-5 py-2.5 font-navbar text-sm font-semibold text-[#1E1E1E] shadow-sm transition-opacity hover:opacity-90 sm:self-auto sm:px-6 sm:py-3 sm:text-base"
        )}
      >
        <PlusCircle className="size-5 shrink-0 text-[#1E1E1E]" strokeWidth={2} aria-hidden />
        List a New Car
      </Link>
    </div>
  );
}
