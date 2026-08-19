import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone, Car } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import type { SellerProfileData } from "@/store/features/auth/authApi.types";

type SellerProfileViewProps = {
  seller: SellerProfileData | any;
};

export function SellerProfileView({ seller }: SellerProfileViewProps) {
  const name = seller.full_name || seller.name || (seller.email ? seller.email.split("@")[0] : "Verified Seller");
  const email = seller.email || "";
  const phone = seller.phone_number || seller.phone || "Not provided";
  const location = seller.address
    ? `${seller.address}${seller.zip_code ? `, ${seller.zip_code}` : ""}`
    : seller.location || "USA";
  const avatar = seller.avatar || seller.avatarImage;
  const totalAuctions = seller.total_auctions ?? seller.total_listings ?? seller.totalAuctions ?? (seller.cars?.length || 0);
  const cars: any[] = seller.cars || [];

  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-8 shadow-sm sm:p-10">
      <div className="flex flex-col items-center text-center">
        <div className="relative inline-flex">
          <div className="rounded-full p-0.5 ring-2 ring-orange-400 ring-offset-2 ring-offset-white">
            {avatar ? (
              <Image
                src={avatar}
                alt=""
                width={80}
                height={80}
                className="size-20 rounded-full object-cover sm:size-[80px]"
                unoptimized
              />
            ) : (
              <div className="flex size-20 items-center justify-center rounded-full bg-slate-800 font-hero-heading text-2xl font-bold text-white sm:size-[80px] sm:text-3xl">
                {name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>
        <h2 className="mt-5 font-hero-heading text-xl font-bold text-[#1E1E1E] sm:text-2xl">{name}</h2>
        <p className="mt-2 font-navbar text-sm text-[#5E5E5E] sm:text-base">{email}</p>
      </div>

      <div className="mx-auto mt-8 max-w-xs divide-y divide-[#E5E7EB] rounded-xl border border-[#E5E7EB] bg-white p-0">
        <div className="flex items-center gap-3 px-4 py-3">
          <Mail className="size-5 shrink-0 text-[#5E5E5E]" strokeWidth={2} aria-hidden />
          <span className="font-navbar text-sm text-[#1E1E1E] truncate">{email}</span>
        </div>
        <div className="flex items-center gap-3 px-4 py-3">
          <Phone className="size-5 shrink-0 text-[#5E5E5E]" strokeWidth={2} aria-hidden />
          <span className="font-navbar text-sm text-[#1E1E1E] truncate">{phone}</span>
        </div>
        <div className="flex items-center gap-3 px-4 py-3">
          <MapPin className="size-5 shrink-0 text-[#5E5E5E]" strokeWidth={2} aria-hidden />
          <span className="font-navbar text-sm text-[#1E1E1E] truncate">{location}</span>
        </div>
      </div>

      <section className="mt-10">
        <h3 className="font-hero-heading text-lg font-bold text-[#1E1E1E] sm:text-xl">
          Total Auction ({String(totalAuctions).padStart(2, "0")})
        </h3>
        {cars.length === 0 ? (
          <div className="mt-4 flex flex-col items-center justify-center rounded-xl border border-dashed border-[#E5E7EB] py-8 text-center">
            <Car className="size-8 text-[#5E5E5E]/50" />
            <p className="mt-2 font-navbar text-xs text-[#5E5E5E]">No active auctions from this seller.</p>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {cars.map((car) => (
              <article key={car.id} className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
                <div className="relative h-32 w-full bg-neutral-100">
                  {car.image ? (
                    <Image src={car.image} alt="" fill className="rounded-t-xl object-cover" sizes="250px" unoptimized />
                  ) : (
                    <div className="flex h-full items-center justify-center text-neutral-400">
                      <Car className="size-8" />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="font-hero-heading text-xs font-bold leading-tight text-[#1E1E1E] sm:text-sm line-clamp-1">{car.name}</p>
                  <p className="mt-1 font-navbar text-[10px] text-[#5E5E5E] sm:text-xs">
                    {car.km}
                    <span className="mx-1">·</span>
                    <span className="inline-flex items-center gap-0.5">
                      <MapPin className="size-3 shrink-0" strokeWidth={2} aria-hidden />
                      {car.location}
                    </span>
                  </p>
                  <Link
                    href={ROUTES.dealer.bidding(String(car.id))}
                    className="mt-2.5 block w-full rounded-lg bg-[#FFA51F] py-2 text-center font-navbar text-xs font-bold text-[#1E1E1E] transition hover:bg-[#e8940f] sm:text-sm"
                  >
                    {car.price}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
