export const DEALER_PROFILE_USER = {
  name: "Premium Auto Group",
  email: "ast@gmail.com",
  avatar:
    "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=200&h=200&fit=crop",
} as const;

export const DEALER_PROFILE_STATS = {
  totalOffers: 47,
  won: 12,
  totalSpent: "$281,400",
} as const;

export type DealerRecentActivityItem = {
  id: number;
  car: string;
  km: string;
  location: string;
  price: string;
  status: "Won" | "Lost";
  image: string;
};

const CAR =
  "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=500&fit=crop";

export const DEALER_RECENT_ACTIVITY: DealerRecentActivityItem[] = [
  {
    id: 1,
    car: "2021 Honda CR-V EX",
    km: "32,000 km",
    location: "Queens, NY",
    price: "$12,000",
    status: "Won",
    image: CAR,
  },
  {
    id: 2,
    car: "2021 Honda CR-V EX",
    km: "32,000 km",
    location: "Queens, NY",
    price: "$16,500",
    status: "Lost",
    image: CAR,
  },
];
