import Image from "next/image";
import Link from "next/link";
import { MapPin, Car } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import type { SellerAuctionItem } from "@/store/features/auth/authApi.types";

type TotalAuctionSectionProps = {
  cars?: SellerAuctionItem[];
  totalAuctions?: number;
};

export function TotalAuctionSection({ cars = [], totalAuctions }: TotalAuctionSectionProps) {
  const count = totalAuctions ?? cars.length;
  const label = `Total Auction (${String(count).padStart(2, "0")})`;

  return (
    <section className="mt-10 w-full">
      <h2 className="font-hero-heading text-lg font-bold text-[#1E1E1E] sm:text-xl">{label}</h2>
      {cars.length === 0 ? (
        <div className="mt-4 flex flex-col items-center justify-center rounded-xl border border-dashed border-[#E5E7EB] py-8 text-center">
          <Car className="size-8 text-[#5E5E5E]/50" />
          <p className="mt-2 font-navbar text-xs text-[#5E5E5E]">No active auctions listed yet.</p>
        </div>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {cars.map((car) => (
            <article
              key={car.id}
              className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm"
            >
              <div className="relative h-40 w-full bg-neutral-100">
                {car.image ? (
                  <Image src={car.image} alt="" fill className="rounded-t-xl object-cover" sizes="(max-width:640px) 100vw, 50vw" unoptimized />
                ) : (
                  <div className="flex h-full items-center justify-center text-neutral-400">
                    <Car className="size-8" />
                  </div>
                )}
              </div>
              <div className="p-3">
                <h3 className="font-hero-heading text-base font-bold text-[#1E1E1E] line-clamp-1">{car.name}</h3>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2 font-navbar text-sm text-[#5E5E5E]">
                  <span>{car.km}</span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-3.5 shrink-0" aria-hidden />
                    {car.location}
                  </span>
                </div>
                <Link
                  href={ROUTES.seller.myListingsDetail(String(car.id))}
                  className="mt-3 block w-full rounded-lg bg-[#FFA51F] py-2 text-center font-navbar text-sm font-bold text-[#1E1E1E] transition hover:bg-[#e8940f]"
                >
                  {car.price}
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
