"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState, useSyncExternalStore, type MouseEvent } from "react";
import { MARKETING_NAV_LINKS } from "@/constants/nav.constants";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

function hashSubscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => { };
  }
  const handler = () => onStoreChange();
  window.addEventListener("hashchange", handler);
  window.addEventListener("popstate", handler);
  return () => {
    window.removeEventListener("hashchange", handler);
    window.removeEventListener("popstate", handler);
  };
}

function getHashSnapshot() {
  return typeof window !== "undefined" ? window.location.hash : "";
}

function getServerHashSnapshot() {
  return "";
}

const NAVBAR_BG = "bg-[#F9FAFB]";
const NAVBAR_TEXT = "text-[#5E5E5E]";
const ACCENT = "text-[#E89B2B]";
const ACCENT_BORDER = "border-[#E89B2B]";
const ACCENT_BG = "bg-[#E89B2B]";
const CTA_TEXT = "text-[#171717]";

function isNavLinkActive(
  href: string,
  pathname: string | null,
  hash: string
): boolean {
  if (!pathname) return false;

  if (href.startsWith("/#")) {
    const fragment = "#" + href.split("#")[1];
    if (pathname !== "/") return false;
    if (fragment === "#how-it-works") {
      return hash === "#how-it-works" || hash === "";
    }
    return hash === fragment;
  }

  if (href === "/browse" || href.startsWith("/browse")) {
    return pathname === "/browse" || pathname.startsWith("/browse/");
  }

  return pathname === href;
}

/** Same-page home sections: smooth scroll + hash without full Next remount. */
function handleMarketingHashClick(
  e: MouseEvent<HTMLAnchorElement>,
  pathname: string | null,
  href: string
) {
  if (!href.startsWith("/#")) return;
  const id = href.slice("/#".length);
  if (!id) return;

  const onHome = pathname === "/" || pathname === "";
  if (!onHome) return;

  e.preventDefault();
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById(id)?.scrollIntoView({
    behavior: prefersReducedMotion ? "auto" : "smooth",
    block: "start",
  });
  window.history.replaceState(null, "", href);
  window.dispatchEvent(new Event("hashchange"));
}

export function Navbar() {
  const pathname = usePathname();
  const hash = useSyncExternalStore(
    hashSubscribe,
    getHashSnapshot,
    getServerHashSnapshot
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const linkClass = (href: string) =>
    cn(
      "text-base font-normal transition-colors hover:text-[#E89B2B]",
      NAVBAR_TEXT,
      isNavLinkActive(href, pathname, hash) && `${ACCENT} font-normal`
    );

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-neutral-200/80",
        NAVBAR_BG,
        "font-navbar text-base font-normal antialiased"
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-none items-center gap-4 px-2 sm:px-3 lg:gap-12 lg:px-4 xl:gap-16 xl:px-6">
        <div className="flex min-w-0 flex-1 items-center">
          <Link
            href={ROUTES.home}
            className="inline-flex shrink-0 items-center"
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

        <nav
          className="hidden min-w-0 flex-1 items-center justify-center gap-8 lg:flex lg:gap-14 xl:gap-16"
          aria-label="Primary"
        >
          {MARKETING_NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={linkClass(item.href)}
              onClick={(e) => handleMarketingHashClick(e, pathname, item.href)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-3 sm:gap-4">
          <Link
            href={ROUTES.auth.signIn}
            className={cn(
              "hidden rounded-md border px-4 py-2 text-base font-normal transition-colors sm:inline-flex",
              ACCENT_BORDER,
              ACCENT,
              "bg-transparent hover:bg-[#E89B2B]/10"
            )}
          >
            Sign In
          </Link>
          <Link
            href={ROUTES.auth.signUp}
            className={cn(
              "hidden rounded-md px-4 py-2 text-base font-normal transition-opacity sm:inline-flex",
              ACCENT_BG,
              CTA_TEXT,
              "hover:opacity-90"
            )}
          >
            Get Started
          </Link>

          <button
            type="button"
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-md lg:hidden",
              NAVBAR_TEXT,
              "hover:bg-neutral-200/60"
            )}
            aria-expanded={mobileOpen}
            aria-controls={menuId}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? (
              <span className="relative block h-5 w-5" aria-hidden>
                <span className="absolute left-0 top-1/2 block h-0.5 w-5 -translate-y-1/2 rotate-45 bg-current" />
                <span className="absolute left-0 top-1/2 block h-0.5 w-5 -translate-y-1/2 -rotate-45 bg-current" />
              </span>
            ) : (
              <span className="flex w-5 flex-col gap-1.5" aria-hidden>
                <span className="block h-0.5 w-full bg-current" />
                <span className="block h-0.5 w-full bg-current" />
                <span className="block h-0.5 w-full bg-current" />
              </span>
            )}
          </button>
        </div>
      </div>

      <div
        id={menuId}
        className={cn(
          "fixed inset-0 z-[60] lg:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!mobileOpen}
      >
        <button
          type="button"
          tabIndex={mobileOpen ? 0 : -1}
          className={cn(
            "absolute inset-0 bg-black/30 transition-opacity",
            mobileOpen ? "opacity-100" : "opacity-0"
          )}
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={cn(
            "absolute right-0 top-0 flex h-full w-[min(100%,20rem)] flex-col border-l border-neutral-200 bg-[#F9FAFB] shadow-lg transition-transform duration-200 ease-out",
            mobileOpen ? "translate-x-0" : "translate-x-full"
          )}
          inert={mobileOpen ? undefined : true}
        >
          <div className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 pb-6 pt-14">
            {MARKETING_NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(linkClass(item.href), "rounded-md px-3 py-3")}
                onClick={(e) => {
                  setMobileOpen(false);
                  handleMarketingHashClick(e, pathname, item.href);
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-2 border-t border-neutral-200 p-4 sm:hidden">
            <Link
              href={ROUTES.auth.signIn}
              className={cn(
                "rounded-md border px-4 py-2.5 text-center text-base font-normal",
                ACCENT_BORDER,
                ACCENT,
                "bg-transparent"
              )}
              onClick={() => setMobileOpen(false)}
            >
              Sign In
            </Link>
            <Link
              href={ROUTES.auth.signUp}
              className={cn(
                "rounded-md px-4 py-2.5 text-center text-base font-normal",
                ACCENT_BG,
                CTA_TEXT
              )}
              onClick={() => setMobileOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
