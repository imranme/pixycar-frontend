export type ListingStatus = "Active" | "TimeOver" | "Sold" | "Draft";

export type OfferRowData = {
  id?: number | string;
  dealerId: string;
  dealerNumericId?: number;
  timeAgo: string;
  amount: string;
  numericAmount?: number;
  isHighest?: boolean;
  distance?: string;
  location?: string;
};

export type SellerListingDetail = {
  id: string;
  title: string;
  mileage: string;
  location: string;
  offersCount: number;
  highestBid: string;
  status: ListingStatus;
  imageSrc: string;
  images: string[];
  videoUrl?: string | null;
  offers: OfferRowData[];
  /** Initial countdown total seconds (Active view). */
  timerSeconds?: number;
  expiresAt?: string;
  year?: number;
  make?: string;
  model?: string;
  trim?: string;
  color?: string;
  bodyType?: string;
  ownershipStatus?: string;
  numberOfKeys?: number;
  tireCondition?: string;
  drivetrain?: string;
  hasAccidentHistory?: boolean;
  isDrivable?: boolean;
  description?: string;
  mechanicalCondition?: string;
  registrationNumber?: string;
  options?: string[];
};

const CAR_IMG =
  "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&h=800&fit=crop";
const CAR_IMG2 =
  "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1200&h=800&fit=crop";

const GALLERY = Array.from({ length: 9 }, (_, i) =>
  i % 2 === 0 ? `${CAR_IMG}&sig=${i}` : `${CAR_IMG2}&sig=${i}`
);

const STANDARD_OFFERS: OfferRowData[] = [
  { dealerId: "Dealer #1234", timeAgo: "2 min ago", amount: "$25,000", isHighest: true },
  { dealerId: "Dealer #2456", timeAgo: "5 min ago", amount: "$24,800" },
  { dealerId: "Dealer #5451", timeAgo: "10 min ago", amount: "$24,700" },
  { dealerId: "Dealer #8821", timeAgo: "12 min ago", amount: "$24,500" },
];

export const SELLER_LISTINGS: SellerListingDetail[] = [
  {
    id: "1",
    title: "2021 Honda CR-V EX",
    mileage: "45,000 miles",
    location: "Queens, NY",
    offersCount: 5,
    highestBid: "$15,200",
    status: "Active",
    imageSrc: GALLERY[0]!,
    images: GALLERY,
    offers: STANDARD_OFFERS,
    timerSeconds: 59 * 60 + 46,
  },
  {
    id: "2",
    title: "2021 Honda CR-V EX",
    mileage: "45,000 miles",
    location: "Queens, NY",
    offersCount: 5,
    highestBid: "$15,200",
    status: "TimeOver",
    imageSrc: GALLERY[0]!,
    images: GALLERY,
    offers: [],
  },
  {
    id: "3",
    title: "2021 Honda CR-V EX",
    mileage: "45,000 miles",
    location: "Queens, NY",
    offersCount: 20,
    highestBid: "$20,000",
    status: "Sold",
    imageSrc: GALLERY[1]!,
    images: GALLERY,
    offers: STANDARD_OFFERS.slice(0, 3),
  },
];

export function getSellerListing(id: string): SellerListingDetail | undefined {
  return SELLER_LISTINGS.find((l) => l.id === id);
}
