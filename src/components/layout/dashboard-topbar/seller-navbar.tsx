"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Bell, Menu, MessageCircle, Settings, X } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { NotificationPanel } from "@/components/seller/notifications/notification-panel";
import { MessengerPanel } from "@/components/layout/messenger-panel";

import { useAppSelector } from "@/store";
import { selectCurrentUser } from "@/store/features/auth/authSlice";

import { useGetNotificationsQuery, useGetUnreadNotificationCountQuery } from "@/store/features/notifications/notificationsApi";
import { useGetThreadsQuery } from "@/store/features/communication/communicationApi";

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
  const [messengerOpen, setMessengerOpen] = useState(false);
  const messengerRef = useRef<HTMLDivElement>(null);

  const { data: unreadData } = useGetUnreadNotificationCountQuery();
  const { data: threadsData } = useGetThreadsQuery();
  const { data: notificationsData } = useGetNotificationsQuery({ unread: true });

  const { messageNotifsCount, nonMessageNotifsCount } = useMemo(() => {
    if (!notificationsData) return { messageNotifsCount: 0, nonMessageNotifsCount: 0 };
    const items = Array.isArray(notificationsData)
      ? notificationsData
      : Array.isArray((notificationsData as any)?.results)
      ? (notificationsData as any).results
      : [];
    let msgCount = 0;
    let otherCount = 0;
    for (const item of items) {
      if (
        item.notification_type === "NEW_MESSAGE" ||
        (item.title && item.title.toLowerCase().includes("message"))
      ) {
        msgCount++;
      } else {
        otherCount++;
      }
    }
    return { messageNotifsCount: msgCount, nonMessageNotifsCount: otherCount };
  }, [notificationsData]);

  const threadsUnreadCount = useMemo(() => {
    if (!threadsData) return 0;
    const list = Array.isArray(threadsData)
      ? threadsData
      : "results" in (threadsData as object) && Array.isArray((threadsData as any).results)
      ? (threadsData as any).results
      : [];
    return list.reduce((acc: number, t: any) => acc + Number(t.unread_count || 0), 0);
  }, [threadsData]);

  const unreadMessagesCount =
    unreadData?.unread_messages_count !== undefined
      ? Math.max(unreadData.unread_messages_count, threadsUnreadCount)
      : Math.max(threadsUnreadCount, messageNotifsCount);

  const unreadNotificationCount =
    unreadData?.unread_notifications_count !== undefined
      ? unreadData.unread_notifications_count
      : nonMessageNotifsCount;

  useEffect(() => {
    const onPointerDown = (e: MouseEvent | PointerEvent) => {
      const target = e.target as Node;
      if (notificationsRef.current && !notificationsRef.current.contains(target)) {
        setNotificationsOpen(false);
      }
      if (messengerRef.current && !messengerRef.current.contains(target)) {
        setMessengerOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

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
              width={140}
              height={60}
              className="h-8 w-auto sm:h-9 object-contain"
              style={{ width: "auto", height: "auto" }}
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
          {/* Messenger Quick Chats */}
          <div ref={messengerRef} className="relative">
            <button
              type="button"
              className={cn(
                "relative cursor-pointer rounded-lg p-2 text-[#5E5E5E] transition hover:bg-neutral-100 hover:text-[#0084FF]",
                messengerOpen && "bg-[#0084FF]/10 text-[#0084FF]"
              )}
              aria-label="Chats"
              aria-expanded={messengerOpen}
              onClick={() => {
                setMessengerOpen((o) => !o);
                setNotificationsOpen(false);
              }}
            >
              <MessageCircle className="size-5" strokeWidth={2} />
              {unreadMessagesCount > 0 ? (
                <span className="absolute -top-0.5 -right-0.5 flex min-w-4 h-4 items-center justify-center rounded-full bg-[#FA383E] px-1 text-[10px] font-bold text-white shadow-xs ring-2 ring-white animate-in zoom-in-50 duration-200">
                  {unreadMessagesCount > 9 ? "9+" : unreadMessagesCount}
                </span>
              ) : null}
            </button>
            {messengerOpen ? <MessengerPanel onClose={() => setMessengerOpen(false)} userRole="seller" /> : null}
          </div>

          {/* Notifications */}
          <div ref={notificationsRef} className="relative">
            <button
              type="button"
              className={cn(
                "relative cursor-pointer rounded-lg p-2 text-[#5E5E5E] transition hover:bg-neutral-100 hover:text-[#1E1E1E]",
                notificationsOpen && "bg-neutral-100 text-[#1E1E1E]"
              )}
              aria-label="Notifications"
              aria-expanded={notificationsOpen}
              onClick={() => {
                setNotificationsOpen((o) => !o);
                setMessengerOpen(false);
              }}
            >
              <Bell className="size-5" strokeWidth={2} />
              {unreadNotificationCount > 0 ? (
                <span className="absolute -top-0.5 -right-0.5 flex min-w-4 h-4 items-center justify-center rounded-full bg-[#FA383E] px-1 text-[10px] font-bold text-white shadow-xs ring-2 ring-white animate-in zoom-in-50 duration-200">
                  {unreadNotificationCount > 9 ? "9+" : unreadNotificationCount}
                </span>
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
