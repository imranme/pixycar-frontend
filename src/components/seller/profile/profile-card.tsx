"use client";

import Image from "next/image";
import { useAppSelector } from "@/store";
import { selectCurrentUser } from "@/store/features/auth/authSlice";
import type { SellerProfileData } from "@/store/features/auth/authApi.types";

type ProfileCardProps = {
  profile?: SellerProfileData | null;
};

export function ProfileCard({ profile }: ProfileCardProps) {
  const user = useAppSelector(selectCurrentUser);

  const name =
    profile?.full_name ||
    user?.full_name ||
    user?.name ||
    (user?.email ? user.email.split("@")[0] : "Verified Seller");
  const email = profile?.email || user?.email || "";
  const avatar = profile?.avatar || user?.avatar;
  const initial = (name.charAt(0) || "S").toUpperCase();

  return (
    <div className="flex flex-col items-center text-center">
      <div className="rounded-full p-0.5 ring-2 ring-orange-400 ring-offset-2 ring-offset-white">
        {avatar ? (
          <Image
            src={avatar}
            alt=""
            width={96}
            height={96}
            className="size-20 rounded-full object-cover sm:size-24"
            unoptimized
          />
        ) : (
          <div className="flex size-20 items-center justify-center rounded-full bg-slate-800 font-navbar text-2xl font-bold text-white sm:size-24 sm:text-3xl">
            {initial}
          </div>
        )}
      </div>
      <h1 className="mt-6 font-hero-heading text-2xl font-bold text-[#1E1E1E] sm:text-3xl">{name}</h1>
      <p className="mt-2 font-navbar text-sm text-[#5E5E5E] sm:text-base">{email}</p>
    </div>
  );
}
