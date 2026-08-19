import Link from "next/link";
import { cn } from "@/lib/utils";

export type AuthTab = "sign-in" | "sign-up";

type AuthTabsProps = {
  active: AuthTab;
};

export function AuthTabs({ active }: AuthTabsProps) {
  return (
    <div className="flex w-full rounded-xl bg-neutral-200/70 p-1">
      <Link
        href="/sign-in"
        className={cn(
          "flex-1 cursor-pointer rounded-lg py-2.5 text-center text-sm font-medium transition-shadow sm:text-base",
          active === "sign-in"
            ? "bg-white font-semibold text-[#1E1E1E] shadow-sm"
            : "font-normal text-[#5E5E5E] hover:text-[#1E1E1E]"
        )}
      >
        Sign In
      </Link>
      <Link
        href="/sign-up"
        className={cn(
          "flex-1 cursor-pointer rounded-lg py-2.5 text-center text-sm font-medium transition-shadow sm:text-base",
          active === "sign-up"
            ? "bg-white font-semibold text-[#1E1E1E] shadow-sm"
            : "font-normal text-[#5E5E5E] hover:text-[#1E1E1E]"
        )}
      >
        Create Account
      </Link>
    </div>
  );
}
