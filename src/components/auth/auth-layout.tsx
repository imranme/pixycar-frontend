import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { AUTH_CHECKLIST, AUTH_DESCRIPTION } from "./auth-constants";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh w-full flex-col bg-[#F9FAFB] lg:flex-row lg:bg-white">
      <aside className="relative hidden min-h-dvh w-full shrink-0 overflow-hidden lg:block lg:w-[40%]">
        <Image
          src="/authorization_image.jpg"
          alt=""
          fill
          className="object-cover"
          priority
          sizes="40vw"
        />
        <div className="absolute inset-0 bg-black/50" aria-hidden />
        <div className="relative z-10 flex min-h-dvh flex-col p-8 text-white lg:p-10">
          <Link href={ROUTES.home} className="inline-flex shrink-0 cursor-pointer self-start">
            {/* <Image
              src="/pixycar-logo.png"
              alt="PixyCar"
              width={260}
              height={200}
              className="h-9 w-auto brightness-0 invert"
              priority
            /> */}
            <span className="font-hero-heading text-3xl font-bold tracking-tight">PixyCar</span>
          </Link>
          <div className="flex flex-1 flex-col justify-center py-10">
            <h1 className="font-hero-heading text-3xl font-bold leading-tight tracking-tight lg:text-4xl">
              <span className="text-white">The Smartest Car Marketplace</span>
              <br />
              <span className="text-[#FFA51F]">for Everyone.</span>
            </h1>
            <p className="mt-6 max-w-md font-navbar text-base font-normal leading-relaxed text-white/95">
              {AUTH_DESCRIPTION}
            </p>
            <ul className="mt-8 flex max-w-md flex-col gap-4" role="list">
              {AUTH_CHECKLIST.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2
                    className="mt-0.5 size-5 shrink-0 text-[#FFA51F]"
                    strokeWidth={2}
                    aria-hidden
                  />
                  <span className="font-navbar text-sm font-normal leading-snug text-white/95 sm:text-base">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>

      <div className="flex w-full flex-1 flex-col items-center justify-center px-4 py-10 sm:px-6 lg:w-[60%] lg:bg-[#F9FAFB] lg:px-8 lg:py-12">
        {children}
      </div>
    </div>
  );
}
