"use client";

import Image from "next/image";
import { useAppSelector } from "@/store";
import { selectCurrentUser } from "@/store/features/auth/authSlice";
import type { DealerProfileData } from "@/store/features/auth/authApi.types";

type DealerProfileCardProps = {
  profile?: DealerProfileData | null;
};

export function DealerProfileCard({ profile }: DealerProfileCardProps) {
  const user = useAppSelector(selectCurrentUser);
  const name =
    profile?.business_name ||
    user?.business_name ||
    user?.full_name ||
    user?.name ||
    (user?.email ? user.email.split("@")[0] : "Verified Dealer");
  const email = profile?.business_email || profile?.email || user?.email || "";
  const avatar = profile?.avatar || user?.avatar;
  const initial = (name.charAt(0) || "D").toUpperCase();

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative inline-flex">
        <div className="rounded-full p-0.5 ring-2 ring-orange-400 ring-offset-2 ring-offset-[#F9FAFB]">
          {avatar ? (
            <Image
              src={avatar}
              alt=""
              width={72}
              height={72}
              className="size-[72px] rounded-full object-cover"
              unoptimized
            />
          ) : (
            <div className="flex size-[72px] items-center justify-center rounded-full bg-slate-800 font-navbar text-2xl font-bold text-white">
              {initial}
            </div>
          )}
        </div>
      </div>
      <h2 className="mt-5 font-hero-heading text-xl font-bold text-[#1E1E1E] sm:text-2xl">{name}</h2>
      <p className="mt-2 font-navbar text-sm text-[#5E5E5E] sm:text-base">{email}</p>
    </div>
  );
}
