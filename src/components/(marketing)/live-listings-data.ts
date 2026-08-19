/** Shared dummy listings for marketing Live Listings + Browse page (replace with API later). */

export type LiveListing = {
  id: string;
  title: string;
  imageSrc: string;
  km: string;
  location: string;
  timerLabel: string;
};

const q = (w = 800, h = 500) => `w=${w}&h=${h}&fit=crop`;

export const LIVE_LISTINGS: LiveListing[] = [
  {
    id: "1",
    title: "2021 Honda CR-V EX",
    imageSrc: "/listing-car-placeholder.png",
    km: "32,000 km",
    location: "Queens, NY",
    timerLabel: "1h 45 m left",
  },
  {
    id: "2",
    title: "2018 Toyota Camry SE",
    imageSrc: `https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?${q()}`,
    km: "28,500 km",
    location: "Brooklyn, NY",
    timerLabel: "45 m left",
  },
  {
    id: "3",
    title: "2023 Mercedes-Benz C300",
    imageSrc: `https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?${q()}`,
    km: "11,000 miles",
    location: "New York, NY",
    timerLabel: "2h 10 m left",
  },
  {
    id: "4",
    title: "2021 Ford F-150 XLT",
    imageSrc: `https://images.unsplash.com/photo-1559416523-140ddc3d238c?${q()}`,
    km: "24,000 km",
    location: "Austin, TX",
    timerLabel: "30 m left",
  },
  {
    id: "5",
    title: "2021 Jaguar F-Type R-Dynamic",
    imageSrc: `https://images.unsplash.com/photo-1612825173281-9a193378527e?${q()}`,
    km: "18,200 km",
    location: "Miami, FL",
    timerLabel: "3h left",
  },
  {
    id: "6",
    title: "2020 McLaren 720S",
    imageSrc: `https://images.unsplash.com/photo-1544636331-2687092aa965?${q()}`,
    km: "6,500 km",
    location: "Los Angeles, CA",
    timerLabel: "50 m left",
  },
  {
    id: "7",
    title: "2015 Ferrari 488 GTB",
    imageSrc: `https://images.unsplash.com/photo-1592194996308-7b43878e0a25?${q()}`,
    km: "12,400 km",
    location: "Greenwich, CT",
    timerLabel: "20 m left",
  },
  {
    id: "8",
    title: "2022 Lamborghini Huracán STO",
    imageSrc: `https://images.unsplash.com/photo-1542362567-b07e54358753?${q()}`,
    km: "4,100 km",
    location: "Scottsdale, AZ",
    timerLabel: "1h left",
  },
  {
    id: "9",
    title: "2019 Porsche 911 Carrera",
    imageSrc: `https://images.unsplash.com/photo-1503376780353-7c08943c3226?${q()}`,
    km: "22,000 km",
    location: "Seattle, WA",
    timerLabel: "4h 15 m left",
  },
];

/** First three cards on the landing page section */
export const LIVE_LISTINGS_PREVIEW = LIVE_LISTINGS.slice(0, 3);
