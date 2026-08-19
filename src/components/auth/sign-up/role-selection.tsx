"use client";

import { Car, Handshake } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { AuthTabs } from "../auth-tabs";

export type SignUpRole = "seller" | "dealer";

type RoleSelectionProps = {
  role: SignUpRole | null;
  setRole: (r: SignUpRole) => void;
  onContinue: () => void;
};

export function RoleSelection({ role, setRole, onContinue }: RoleSelectionProps) {
  return (
    <div className="flex w-full max-w-md flex-col items-stretch gap-8">
      <AuthTabs active="sign-up" />

      <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-center font-hero-heading text-2xl font-bold text-[#1E1E1E]">
          Select your role
        </h2>
        <p className="mt-2 text-center font-navbar text-sm font-normal text-[#5E5E5E] sm:text-base">
          Select a role to continue
        </p>

        <div className="mt-8 flex flex-col gap-4">
          <button
            type="button"
            onClick={() => setRole("seller")}
            className={cn(
              "flex w-full cursor-pointer items-center gap-4 rounded-xl border p-4 text-left transition-colors",
              role === "seller"
                ? "border-[#FFA51F] bg-[#FFA51F]/10"
                : "border-[#E5E7EB] bg-white hover:border-neutral-300"
            )}
          >
            <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-[#1E1E1E]">
              <Car className="size-6" strokeWidth={2} aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-navbar text-base font-bold text-[#1E1E1E]">
                I&apos;m a Seller
              </span>
              <span className="mt-0.5 block font-navbar text-sm font-normal text-[#5E5E5E]">
                List your car and get dealer bids
              </span>
            </span>
            <span
              className={cn(
                "flex size-5 shrink-0 items-center justify-center rounded-full border-2",
                role === "seller"
                  ? "border-[#FFA51F] bg-[#FFA51F]"
                  : "border-neutral-300 bg-white"
              )}
              aria-hidden
            >
              {role === "seller" ? (
                <span className="size-2 rounded-full bg-white" />
              ) : null}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setRole("dealer")}
            className={cn(
              "flex w-full cursor-pointer items-center gap-4 rounded-xl border p-4 text-left transition-colors",
              role === "dealer"
                ? "border-[#FFA51F] bg-[#FFA51F]/10"
                : "border-[#E5E7EB] bg-white hover:border-neutral-300"
            )}
          >
            <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-[#1E1E1E]">
              <Handshake className="size-6" strokeWidth={2} aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-navbar text-base font-bold text-[#1E1E1E]">
                I&apos;m a Dealer
              </span>
              <span className="mt-0.5 block font-navbar text-sm font-normal text-[#5E5E5E]">
                Find local inventory and bid on leads
              </span>
            </span>
            <span
              className={cn(
                "flex size-5 shrink-0 items-center justify-center rounded-full border-2",
                role === "dealer"
                  ? "border-[#FFA51F] bg-[#FFA51F]"
                  : "border-neutral-300 bg-white"
              )}
              aria-hidden
            >
              {role === "dealer" ? (
                <span className="size-2 rounded-full bg-white" />
              ) : null}
            </span>
          </button>
        </div>

        <button
          type="button"
          disabled={!role}
          onClick={onContinue}
          className={cn(
            "mt-8 w-full cursor-pointer rounded-xl bg-[#FFA51F] py-3 font-navbar text-base font-semibold text-black",
            "transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          )}
        >
          Continue
        </button>

        <p className="mt-6 text-center font-navbar text-sm text-[#5E5E5E] sm:text-base">
          Already have an account?{" "}
          <Link
            href={ROUTES.auth.signIn}
            className="font-semibold text-[#8F4A00] hover:underline cursor-pointer"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
