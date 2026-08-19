const CAR_IMG =
  "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=500&fit=crop";

export type SellerAuctionCard = {
  id: number;
  name: string;
  km: string;
  location: string;
  price: string;
  image: string;
};

export type SellerProfileForDealer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  avatarImage: string | null;
  totalAuctions: number;
  cars: SellerAuctionCard[];
};

const BASE_CARDS: SellerAuctionCard[] = [
  { id: 1, name: "2021 Honda CR-V EX", km: "32,000 km", location: "Queens, NY", price: "$12,000", image: CAR_IMG },
  { id: 2, name: "2021 Honda CR-V EX", km: "32,000 km", location: "Queens, NY", price: "$16,500", image: CAR_IMG },
  { id: 3, name: "2021 Honda CR-V EX", km: "32,000 km", location: "Queens, NY", price: "$12,000", image: CAR_IMG },
  { id: 4, name: "2021 Honda CR-V EX", km: "32,000 km", location: "Queens, NY", price: "$16,500", image: CAR_IMG },
];

export const SELLER_PROFILES_FOR_DEALER: Record<string, SellerProfileForDealer> = {
  "1": {
    id: "1",
    name: "Premium Auto Group",
    email: "ast@gmail.com",
    phone: "+1 000 0356 656",
    location: "Los Angeless, CA",
    avatarImage: CAR_IMG,
    totalAuctions: 6,
    cars: BASE_CARDS,
  },
  "2": {
    id: "2",
    name: "Jara",
    email: "jara@example.com",
    phone: "+1 646 555 0100",
    location: "Brooklyn, NY",
    avatarImage: null,
    totalAuctions: 2,
    cars: BASE_CARDS.slice(0, 2),
  },
};

export function getSellerProfileForDealer(id: string): SellerProfileForDealer | undefined {
  return SELLER_PROFILES_FOR_DEALER[id];
}
