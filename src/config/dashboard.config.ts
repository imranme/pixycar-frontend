import { ROUTES } from "@/constants/routes";

export const dashboardConfig = {
  mainNav: [{ title: "Dashboard", href: ROUTES.dashboard.home }],
  sidebarNav: [
    { title: "Dashboard", href: ROUTES.dashboard.home, icon: "LayoutDashboard" },
    { title: "List a Car", href: ROUTES.dashboard.listCar, icon: "PlusCircle" },
    { title: "My Listings", href: ROUTES.dashboard.myListings, icon: "Car" },
    { title: "Messages", href: ROUTES.dashboard.messages, icon: "MessageSquare" },
    { title: "Profile", href: ROUTES.dashboard.profile, icon: "User" },
  ],
} as const;
