const IMG1 =
  "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=200&h=200&fit=crop";
const IMG2 =
  "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=200&h=200&fit=crop";
const FORD_IMG =
  "https://images.unsplash.com/photo-1609554496796-c3464ec2a88f?w=800&h=500&fit=crop";
const NISSAN_IMG =
  "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=200&h=200&fit=crop";

export type OffersTab = "Active" | "Won" | "Lost";

export type ActiveOfferListItem = {
  id: string;
  car: string;
  offer: string;
  position: number;
  isLeading: boolean;
  timeLeft: string;
  image: string;
  highest?: string;
};

export const DEALER_MY_OFFERS_ACTIVE: ActiveOfferListItem[] = [
  {
    id: "1",
    car: "2020 Honda Accord EX",
    offer: "$25,000",
    position: 1,
    isLeading: true,
    timeLeft: "8min",
    image: IMG1,
  },
  {
    id: "2",
    car: "2019 Toyota Camry SE",
    offer: "$22,500",
    position: 2,
    isLeading: false,
    timeLeft: "5min",
    highest: "$23,000",
    image: IMG2,
  },
];

export type WonOfferListItem = {
  id: string;
  car: string;
  winningPrice: string;
  relativeTime: string;
  image: string;
  isChatUnlocked?: boolean;
  chatThreadId?: number | string | null;
};

export const DEALER_MY_OFFERS_WON: WonOfferListItem[] = [
  {
    id: "3",
    car: "2021 Ford F-150 XLT",
    winningPrice: "$32,000",
    relativeTime: "2 hours ago",
    image: FORD_IMG,
  },
];

export type LostOfferListItem = {
  id: string;
  car: string;
  offer: string;
  winning: string;
  yourRank: number;
  image: string;
};

export const DEALER_MY_OFFERS_LOST_INITIAL: LostOfferListItem[] = [
  {
    id: "4",
    car: "2018 Nissan Altima",
    offer: "$18,000",
    winning: "$19,500",
    yourRank: 3,
    image: NISSAN_IMG,
  },
];

export type ActiveOfferBidState = {
  position: number;
  totalBidders: number;
  /** Countdown length in seconds (live tick). */
  initialSecondsRemaining: number;
  showFinalTenMinutes: boolean;
  highest: number;
  minIncrement: number;
  baseOffer: number;
};

export const ACTIVE_OFFER_BID_STATE: Record<string, ActiveOfferBidState> = {
  "1": {
    position: 1,
    totalBidders: 5,
    initialSecondsRemaining: 8 * 60 + 45,
    showFinalTenMinutes: true,
    highest: 25_200,
    minIncrement: 100,
    baseOffer: 25_000,
  },
  "2": {
    position: 2,
    totalBidders: 5,
    initialSecondsRemaining: 8 * 60 + 59,
    showFinalTenMinutes: true,
    highest: 25_500,
    minIncrement: 100,
    baseOffer: 25_000,
  },
};

export function getActiveOfferBidState(id: string): ActiveOfferBidState | undefined {
  return ACTIVE_OFFER_BID_STATE[id];
}

export type WonUnlockListing = {
  id: string;
  car: string;
  image: string;
  winningOffer: string;
  unlockFee: string;
  isChatUnlocked?: boolean;
  chatThreadId?: number | string | null;
};

const WON_UNLOCK_BY_ID: Record<string, WonUnlockListing> = {
  "3": {
    id: "3",
    car: "2021 Ford F-150 XLT",
    image: FORD_IMG,
    winningOffer: "$32,000",
    unlockFee: "$69.95",
  },
};

export function getWonUnlockListing(id: string): WonUnlockListing | undefined {
  return WON_UNLOCK_BY_ID[id];
}
