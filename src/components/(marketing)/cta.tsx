import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

export function CTA() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto flex w-full max-w-screen-2xl flex-col items-center px-3 sm:px-4 lg:px-6">
        <h2 className="text-center font-hero-heading text-[32px] font-semibold leading-tight tracking-tight text-[#8F4A00]">
          Ready to Get the Best Deal?
        </h2>
        <p className="mt-3 max-w-2xl text-center font-hero-heading text-base font-normal leading-relaxed text-[#385E45]">
          Join 12,000+ sellers and 800+ dealers already using PixyCar.
        </p>

        <div className="mt-10 flex w-full max-w-2xl flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href={ROUTES.seller.listCar}
            className={cn(
              "flex w-full items-center justify-center rounded-xl bg-[#FFA51F] px-10 py-4",
              "font-hero-heading text-base font-semibold text-black transition-opacity hover:opacity-90",
              "sm:min-h-[56px] sm:flex-1"
            )}
          >
            List Your Car
          </Link>
          <Link
            href={ROUTES.browse}
            className={cn(
              "flex w-full items-center justify-center rounded-xl border border-[#FFA51F] bg-white px-10 py-4",
              "font-hero-heading text-base font-semibold text-[#8F4A00] transition-colors hover:bg-[#FFA51F]/5",
              "sm:min-h-[56px] sm:flex-1"
            )}
          >
            Browse Cars as Dealer
          </Link>
        </div>
      </div>
    </section>
  );
}
