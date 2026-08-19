import Link from "next/link";
import { Car, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-[#F9FAFB] px-4 text-center">
      <div className="relative mb-6 flex size-24 items-center justify-center rounded-full bg-amber-50 text-[#FFA51F]">
        <Car className="size-12 animate-pulse" strokeWidth={1.5} />
        <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 font-navbar text-xs font-bold text-white shadow-sm">
          404
        </span>
      </div>
      <h1 className="font-hero-heading text-4xl font-extrabold tracking-tight text-[#1E1E1E] sm:text-5xl">
        Page Not Found
      </h1>
      <p className="mt-3 max-w-md font-navbar text-base text-[#5E5E5E]">
        Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-[#FFA51F] px-6 py-3 font-navbar text-sm font-semibold text-[#1E1E1E] shadow-sm transition hover:bg-[#e8940f]"
        >
          <Home className="size-4" />
          Go to Home
        </Link>
        <Link
          href="/browse"
          className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-6 py-3 font-navbar text-sm font-semibold text-[#1E1E1E] transition hover:bg-neutral-50"
        >
          <ArrowLeft className="size-4" />
          Browse Cars
        </Link>
      </div>
    </div>
  );
}

