"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { selectCurrentUser } from "@/store/features/auth/authSlice";

const subtext =
  "PixyCar connects private car sellers directly with verified dealers, so you get real offers from buyers who are ready to close-without the noise.";

export function HeroSection() {
  const user = useSelector(selectCurrentUser);
  const [browseHref, setBrowseHref] = useState<string>(ROUTES.auth.signIn);

  // Fix hydration mismatch: only update href on client after mount
  useEffect(() => {
    setBrowseHref(user?.role === "DEALER" ? ROUTES.browse : ROUTES.auth.signIn);
  }, [user]);

  return (
    <section className="relative isolate min-h-screen w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-[url('/hero-background.png')] bg-cover bg-center bg-no-repeat"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-black/55"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-10 pt-8 sm:px-6 lg:px-8">
        <div className="flex flex-1 flex-col justify-center gap-8 lg:max-w-3xl lg:pr-8">
          <div
            className={cn(
              "inline-flex w-fit max-w-full items-center gap-2 rounded-full border border-white px-4 py-2",
              "bg-black/45 backdrop-blur-sm"
            )}
          >
            <span
              className="size-2 shrink-0 rounded-full bg-emerald-500"
              aria-hidden
            />
            <span className="font-navbar text-sm font-normal text-white sm:text-base">
              The Smart Way to Buy &amp; Sell Cars
            </span>
          </div>

          <h1
            className={cn(
              "font-hero-heading font-bold tracking-tight text-[#EFEFEF]",
              "text-3xl leading-[2.5rem] sm:text-4xl sm:leading-[2.75rem]",
              "md:text-5xl md:leading-[3.25rem]",
              "lg:text-[64px] lg:leading-[72px]"
            )}
          >
            <span className="text-[#EFEFEF]">Where Sellers Get </span>
            <span className="text-[#FFA51F]">The Best Offers,</span>
            <span className="text-[#EFEFEF]"> Not Just Any Offer</span>
          </h1>

          <p className="font-navbar max-w-xl text-base font-normal leading-relaxed text-white">
            {subtext}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <Link
              href={ROUTES.seller.listCar}
              className={cn(
                "inline-flex items-center justify-center rounded-lg px-6 py-3 text-center text-sm font-normal sm:text-base",
                "bg-[#FFA51F] text-black transition-opacity hover:opacity-90"
              )}
            >
              List Your Car
            </Link>
            <Link
              href={browseHref}
              className={cn(
                "inline-flex items-center justify-center rounded-lg border border-white px-6 py-3 text-center text-sm font-normal text-white sm:text-base",
                "bg-transparent transition-colors hover:bg-white/10"
              )}
            >
              Browse Cars as Dealer
            </Link>
          </div>

          {/* Stats — Fixed: <p> cannot contain <p>, use <span> instead */}
          <div
            className={cn(
              "mt-4 grid w-full gap-6 border-t border-white/25 pt-8 text-white",
              "sm:grid-cols-3 sm:gap-8"
            )}
          >
            <div className="font-navbar text-center text-base sm:text-left">
              <strong className="block font-bold text-3xl">5,000+</strong>
              <span className="block">Cars Listed</span>
            </div>
            <div className="font-navbar text-center text-base sm:text-left">
              <strong className="block font-bold text-3xl">$9.4M</strong>
              <span className="block">Deals Closed</span>
            </div>
            <div className="font-navbar text-center text-base sm:text-left">
              <strong className="block font-bold text-3xl">98%</strong>
              <span className="block">Seller Satisfaction</span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 justify-center pt-6">
          <Link
            href="/#how-it-works"
            className={cn(
              "flex size-16 shrink-0 items-center justify-center rounded-full border border-[#FFA51F] p-8",
              "transition-opacity hover:opacity-90"
            )}
            aria-label="Scroll to how it works"
          >
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full border-[3px] border-[#D4AF37]">
              <svg
                className="size-[18px] shrink-0 text-[#D4AF37]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M12 5v11" />
                <path d="m8 14 4 5 4-5" />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
