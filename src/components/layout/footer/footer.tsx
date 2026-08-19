import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

const LEGAL_LINKS = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
] as const;

const HELP_LINKS = [
  { label: "Support", href: "/support" },
  { label: "Contact", href: "/contact" },
] as const;

const linkClass = cn(
  "font-navbar text-base font-normal text-[#1E1E1E] underline-offset-2 hover:underline"
);

export function Footer() {
  return (
    <footer className="w-full bg-[#FFA51F] px-6 py-12 sm:px-10 sm:py-14 md:px-16 md:py-16">
      <div
        className={cn(
          "mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-10 text-center",
          "sm:flex-row sm:items-center sm:justify-between sm:gap-12 sm:text-left"
        )}
      >
        <div className="shrink-0">
          <Link
            href={ROUTES.home}
            className="inline-flex items-center"
            aria-label="PixyCar home"
          >
            <Image
              src="/pixycar-logo.png"
              alt="PixyCar"
              width={140}   // w-32 = 128px
              height={100}   // h-24 = 96px
              className="object-contain"
              priority
            />
          </Link>
        </div>

        <div
          className={cn(
            "flex flex-col items-center gap-8 sm:flex-row sm:items-start sm:gap-10 sm:text-left md:gap-14"
          )}
        >
          <nav
            className="flex flex-col items-center gap-3 text-center sm:items-start sm:text-left"
            aria-label="Legal"
          >
            {LEGAL_LINKS.map((item) => (
              <Link key={item.href} href={item.href} className={linkClass}>
                {item.label}
              </Link>
            ))}
          </nav>

          <nav
            className="flex flex-col items-center gap-3 text-center sm:items-start sm:text-left"
            aria-label="Help"
          >
            {HELP_LINKS.map((item) => (
              <Link key={item.href} href={item.href} className={linkClass}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
