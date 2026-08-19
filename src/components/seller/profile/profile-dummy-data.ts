export type SellerProfileCar = {
  id: number;
  name: string;
  km: string;
  location: string;
  price: string;
  image: string;
};

export const SELLER_PROFILE_DUMMY = {
  name: "James Mitchell",
  email: "ast@gmail.com",
  phone: "+1 000 0356 656",
  location: "Los Angeles, CA",
  avatar: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=200&h=200&fit=crop",
  totalAuctions: 6,
} as const;

const CAR_IMG =
  "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=500&fit=crop";

const BASE_CARS: Omit<SellerProfileCar, "id">[] = [
  { name: "2021 Honda CR-V EX", km: "32,000 km", location: "Queens, NY", price: "$12,000", image: CAR_IMG },
  { name: "2021 Honda CR-V EX", km: "32,000 km", location: "Queens, NY", price: "$16,500", image: CAR_IMG },
];

export const SELLER_PROFILE_CARS: SellerProfileCar[] = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  ...BASE_CARS[i % BASE_CARS.length]!,
}));
