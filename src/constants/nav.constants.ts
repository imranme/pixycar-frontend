export const MARKETING_NAV_LINKS = [
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Features", href: "/#features" },
  { label: "Browse Cars", href: "/#browse-cars" },
] as const;

export const DASHBOARD_NAV_LINKS = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "List a Car", href: "/list-car", icon: "PlusCircle" },
  { label: "My Listings", href: "/my-listings", icon: "Car" },
  { label: "Messages", href: "/messages", icon: "MessageSquare" },
  { label: "Profile", href: "/profile", icon: "User" },
] as const;
