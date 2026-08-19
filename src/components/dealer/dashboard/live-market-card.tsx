import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import type { DealerLiveMarketCar } from "@/components/dealer/dealer-dummy-data";

type LiveMarketCardProps = {
  car: DealerLiveMarketCar;
};

export function LiveMarketCard({ car }: LiveMarketCardProps) {
  const isOver = car.status === "timeOver";

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm transition hover:shadow-md hover:border-[#D1D5DB]">
      <Link
        href={ROUTES.dealer.bidding(car.id)}
        className="relative block h-48 w-full overflow-hidden bg-neutral-100"
      >
        <Image
          src={car.image || "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=400&fit=crop"}
          alt={car.name}
          fill
          unoptimized
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link href={ROUTES.dealer.bidding(car.id)}>
          <h3 className="font-hero-heading text-base font-bold text-[#1E1E1E] transition hover:text-[#FFA51F] sm:text-lg truncate">
            {car.name}
          </h3>
        </Link>

        <div className="mt-2 flex items-center justify-between font-navbar text-xs sm:text-sm text-[#5E5E5E]">
          <span>{car.km}</span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3.5 shrink-0 text-[#8C8C8C]" aria-hidden />
            {car.location}
          </span>
        </div>

        <div
          className={cn(
            "mt-3 inline-flex items-center gap-1.5 font-navbar text-xs sm:text-sm font-medium",
            isOver ? "text-[#8C8C8C]" : "text-[#FFA51F]"
          )}
        >
          <Clock className="size-3.5 shrink-0" strokeWidth={2} aria-hidden />
          <span>{car.timer}</span>
        </div>

        <div className="mt-4 pt-1">
          {isOver ? (
            <button
              type="button"
              disabled
              className="flex w-full cursor-not-allowed items-center justify-center rounded-xl border border-[#D9D9D9] bg-white py-2.5 text-center font-navbar text-sm font-semibold text-[#8C8C8C]"
            >
              Time Over
            </button>
          ) : (
            <Link
              href={ROUTES.dealer.bidding(car.id)}
              className="flex w-full cursor-pointer items-center justify-center rounded-xl bg-[#FFA51F] py-2.5 text-center font-navbar text-sm font-bold text-[#1E1E1E] transition hover:bg-[#e8940f]"
            >
              Place bid
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
