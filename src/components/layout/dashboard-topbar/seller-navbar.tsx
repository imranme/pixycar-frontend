"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Bell, Menu, Settings, X } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { NotificationPanel } from "@/components/seller/notifications/notification-panel";

import { useAppSelector } from "@/store";
import { selectCurrentUser } from "@/store/features/auth/authSlice";

import { useGetUnreadNotificationCountQuery } from "@/store/features/notifications/notificationsApi";

const NAV = [
  { label: "Dashboard", href: ROUTES.seller.dashboard },
  { label: "My Listings", href: ROUTES.seller.myListings },
  { label: "List a Car", href: ROUTES.seller.listCar },
  { label: "Messages", href: ROUTES.seller.messages },
] as const;

function isActive(pathname: string, href: string) {
  if (href === ROUTES.seller.dashboard) {
    return pathname === href || pathname === `${href}/`;
  }
  if (href === ROUTES.seller.messages) {
    return (
      pathname === ROUTES.seller.messages ||
      pathname.startsWith(`${ROUTES.seller.messages}/`) ||
      pathname.startsWith("/seller/dealer-profile")
    );
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

const linkClass = "font-navbar text-base transition-colors";

export function SellerNavbar() {
  const pathname = usePathname();
  const user = useAppSelector(selectCurrentUser);
  const displayName = user?.full_name || user?.name || user?.business_name || (user?.email ? user.email.split("@")[0] : "User");
  const avatarUrl = user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face";

  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const { data: unreadData } = useGetUnreadNotificationCountQuery();
  const hasUnread = (unreadData?.unread_count ?? 0) > 0;

  useEffect(() => {
    if (!notificationsOpen) return;
    const onPointerDown = (e: MouseEvent | PointerEvent) => {
      const el = notificationsRef.current;
      if (el && !el.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [notificationsOpen]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E5E7EB] bg-white">
      <div className="mx-auto flex h-16 w-full max-w-none items-center justify-between gap-3 px-3 sm:gap-4 sm:px-4 md:px-5 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex cursor-pointer items-center justify-center rounded-lg p-2 text-[#1E1E1E] hover:bg-neutral-100 lg:hidden"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
          <Link href={ROUTES.seller.dashboard} className="inline-flex shrink-0">
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
          className={cn(
            "absolute left-0 right-0 top-16 z-40 flex-col gap-1 border-b border-[#E5E7EB] bg-white px-3 py-3 shadow-sm sm:px-4 lg:static lg:flex lg:flex-1 lg:flex-row lg:items-center lg:justify-center lg:gap-10 lg:border-0 lg:bg-transparent lg:px-2 lg:py-0 lg:shadow-none xl:gap-12",
            mobileOpen ? "flex" : "hidden lg:flex"
          )}
          aria-label="Seller"
        >
          {NAV.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  linkClass,
                  active ? "font-semibold text-[#FFA51F]" : "font-normal text-[#5E5E5E] hover:text-[#1E1E1E]"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div ref={notificationsRef} className="relative">
            <button
              type="button"
              className="relative cursor-pointer rounded-lg p-2 text-[#5E5E5E] hover:bg-neutral-100 hover:text-[#1E1E1E]"
              aria-label="Notifications"
              aria-expanded={notificationsOpen}
              onClick={() => setNotificationsOpen((o) => !o)}
            >
              <Bell className="size-5" strokeWidth={2} />
              {hasUnread ? (
                <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-red-500 ring-2 ring-white" />
              ) : null}
            </button>
            {notificationsOpen ? <NotificationPanel onClose={() => setNotificationsOpen(false)} /> : null}
          </div>
          <Link
            href={ROUTES.seller.settings}
            className="cursor-pointer rounded-lg p-2 text-[#5E5E5E] transition hover:bg-neutral-100 hover:text-[#1E1E1E]"
            aria-label="Settings"
            onClick={() => setMobileOpen(false)}
          >
            <Settings className="size-5" strokeWidth={2} />
          </Link>
          <Link
            href={ROUTES.seller.profile}
            className="ml-1 flex min-w-0 cursor-pointer items-center gap-2 border-l border-[#E5E7EB] pl-3 transition hover:opacity-90 sm:ml-2 sm:pl-4"
            onClick={() => setMobileOpen(false)}
          >
            <Image
              src={avatarUrl}
              alt=""
              width={40}
              height={40}
              className="size-9 shrink-0 rounded-full object-cover sm:size-10"
              unoptimized
            />
            <div className="hidden min-w-0 sm:block">
              <p suppressHydrationWarning className="truncate font-navbar text-sm font-bold text-[#1E1E1E]">{displayName}</p>
              <p className="font-navbar text-xs text-[#5E5E5E]">Seller</p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
