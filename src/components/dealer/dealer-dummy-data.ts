export type BiddingPhase = "active" | "timeOver";

export type DealerBiddingListing = {
  id: string;
  phase: BiddingPhase;
  title: string;
  miles: string;
  location: string;
  year: string;
  vin: string;
  description: string;
  images: string[];
  specs: { label: string; value: string }[];
  timeRemainingSeconds?: number;
  expiresAt?: string;
  currentHighestBid?: number;
  totalOffers?: number;
};

const MERC_IMGS = Array.from({ length: 6 }, (_, i) =>
  `https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&h=800&fit=crop&sig=${i}`
);

const SPECS: { label: string; value: string }[] = [
  { label: "Drivability", value: "Yes" },
  { label: "Title status", value: "Like New" },
  { label: "Number of Keys", value: "03" },
  { label: "Accident History", value: "No" },
  { label: "DRIVETRAIN", value: "All Wheel Drive" },
  { label: "Tire Condition", value: "New" },
  { label: "Trim", value: "LX" },
  { label: "Mechanical Condition", value: "Good" },
  { label: "Ownership Status", value: "Owned" },
  { label: "Body Type", value: "SUV" },
  { label: "Any Options", value: "Leather" },
];

const BASE_LISTING: Omit<DealerBiddingListing, "id" | "phase"> = {
  title: "2023 Mercedes-Benz C300",
  miles: "11,000 miles",
  location: "New York, NY",
  year: "2023",
  vin: "VIN: WDDKK4HB3GF123456",
  description:
    "Well-maintained C300 with AMG Line package, MBUX infotainment, panoramic roof, and premium sound. Single owner, full service history.",
  images: MERC_IMGS,
  specs: SPECS,
  timeRemainingSeconds: 3600,
  currentHighestBid: 25000,
  totalOffers: 5,
};

export const DEALER_BIDDING_BY_ID: Record<string, DealerBiddingListing> = {
  "1": { id: "1", phase: "active", ...BASE_LISTING },
  "2": { id: "2", phase: "timeOver", ...BASE_LISTING, timeRemainingSeconds: 0 },
  "3": { id: "3", phase: "active", ...BASE_LISTING },
  "4": { id: "4", phase: "active", ...BASE_LISTING },
  "5": { id: "5", phase: "active", ...BASE_LISTING },
  "6": { id: "6", phase: "active", ...BASE_LISTING },
};

export function getDealerBiddingListing(id: string): DealerBiddingListing | undefined {
  return DEALER_BIDDING_BY_ID[id] || { id, phase: "active", ...BASE_LISTING };
}

export type DealerActiveBid = {
  id: string;
  car: string;
  offer: string;
  status: "leading" | "outbid";
  rank: number;
  timeLeft: string;
  image: string;
};

export const DEALER_ACTIVE_BIDS: DealerActiveBid[] = [
  {
    id: "1",
    car: "2020 Honda Accord EX",
    offer: "$25,000",
    status: "leading",
    rank: 1,
    timeLeft: "8min",
    image:
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=300&h=200&fit=crop",
  },
  {
    id: "2",
    car: "2019 Toyota Camry SE",
    offer: "$22,500",
    status: "outbid",
    rank: 2,
    timeLeft: "5min",
    image:
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=300&h=200&fit=crop",
  },
];

export type DealerLiveMarketCar = {
  id: string;
  name: string;
  km: string;
  location: string;
  timer: string;
  status: "active" | "timeOver";
  image: string;
};

export const DEALER_LIVE_MARKET: DealerLiveMarketCar[] = [
  {
    id: "1",
    name: "2021 Honda CR-V EX",
    km: "32,000 km",
    location: "Queens, NY",
    timer: "1h 45m left",
    status: "active",
    image:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=400&fit=crop",
  },
  {
    id: "2",
    name: "2021 Honda CR-V EX",
    km: "32,000 km",
    location: "Queens, NY",
    timer: "13h ago",
    status: "timeOver",
    image:
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&h=400&fit=crop",
  },
  {
    id: "3",
    name: "2021 Honda CR-V EX",
    km: "32,000 km",
    location: "Queens, NY",
    timer: "1h 45m left",
    status: "active",
    image:
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600&h=400&fit=crop",
  },
  {
    id: "4",
    name: "2021 Honda CR-V EX",
    km: "32,000 km",
    location: "Queens, NY",
    timer: "1h 45m left",
    status: "active",
    image:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=400&fit=crop",
  },
  {
    id: "5",
    name: "2021 Honda CR-V EX",
    km: "32,000 km",
    location: "Queens, NY",
    timer: "1h 45m left",
    status: "active",
    image:
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&h=400&fit=crop",
  },
  {
    id: "6",
    name: "2021 Honda CR-V EX",
    km: "32,000 km",
    location: "Queens, NY",
    timer: "1h 45m left",
    status: "active",
    image:
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600&h=400&fit=crop",
  },
];
