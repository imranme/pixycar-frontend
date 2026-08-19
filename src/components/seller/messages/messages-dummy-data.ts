export type ChatMessage = {
  id: number;
  sender: "dealer" | "seller";
  text: string;
  time: string;
};

export type Conversation = {
  id: string;
  dealerId: string;
  dealerName: string;
  dealerInitial: string;
  dealerImage: string | null;
  carName: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  messages: ChatMessage[];
  /** When set, inbox is the dealer view: list + header use seller as counterparty */
  sellerId?: string;
  sellerName?: string;
  sellerInitial?: string;
  sellerImage?: string | null;
  /** Dealer messages: link to read-only sold bidding details */
  biddingSoldListingId?: string;
  isUnlocked?: boolean;
};

export const SELLER_CONVERSATIONS: Conversation[] = [
  {
    id: "1",
    dealerId: "1",
    dealerName: "Premium Auto Group",
    dealerInitial: "P",
    dealerImage: null,
    carName: "2018 Toyota Camry",
    lastMessage: "Perfect, see you tomorrow!",
    time: "10:44 AM",
    unreadCount: 1,
    messages: [
      {
        id: 1,
        sender: "seller",
        text: "Hi James, congratulations on closing the deal! I'd like to coordinate pickup.",
        time: "15:00",
      },
      {
        id: 2,
        sender: "dealer",
        text: "Thanks! The car is ready. Are you thinking this week?",
        time: "15:15",
      },
      {
        id: 3,
        sender: "dealer",
        text: "Yes, Thursday works great for us. We'll bring the transport truck.",
        time: "15:20",
      },
      {
        id: 4,
        sender: "seller",
        text: "Great! I'll arrange pickup for Thursday.",
        time: "16:00",
      },
    ],
  },
  {
    id: "2",
    dealerId: "2",
    dealerName: "City Motors",
    dealerInitial: "C",
    dealerImage: null,
    carName: "2018 Toyota Camry",
    lastMessage: "Hi, i am interested in the ....",
    time: "Yesterday",
    unreadCount: 0,
    messages: [
      {
        id: 1,
        sender: "dealer",
        text: "Hi, i am interested in the car. Can we talk?",
        time: "09:00",
      },
    ],
  },
];

const CAMRY_IMG =
  "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=200&h=200&fit=crop";

/** Dealer inbox: counterparty is seller; same bubble semantics as seller inbox (sender field). */
export const DEALER_CONVERSATIONS: Conversation[] = [
  {
    id: "1",
    dealerId: "self",
    dealerName: "",
    dealerInitial: "D",
    dealerImage: null,
    sellerId: "1",
    sellerName: "James Mitchell",
    sellerInitial: "J",
    sellerImage: CAMRY_IMG,
    carName: "2018 Toyota Camry",
    lastMessage: "Perfect, see you tomorrow!",
    time: "10:44 AM",
    unreadCount: 1,
    biddingSoldListingId: "1",
    messages: [
      {
        id: 1,
        sender: "seller",
        text: "Hi James, congratulations on closing the deal! I'd like to coordinate pickup.",
        time: "15:00",
      },
      {
        id: 2,
        sender: "dealer",
        text: "Thanks! The car is ready. Are you thinking this week?",
        time: "15:15",
      },
      {
        id: 3,
        sender: "dealer",
        text: "Yes, Thursday works great for us. We'll bring the transport truck.",
        time: "15:20",
      },
      {
        id: 4,
        sender: "seller",
        text: "Great! I'll arrange pickup for Thursday.",
        time: "16:00",
      },
    ],
  },
  {
    id: "2",
    dealerId: "self",
    dealerName: "",
    dealerInitial: "D",
    dealerImage: null,
    sellerId: "2",
    sellerName: "Jara",
    sellerInitial: "J",
    sellerImage: null,
    carName: "2018 Toyota Camry",
    lastMessage: "Hi, i am interested in the ....",
    time: "Yesterday",
    unreadCount: 0,
    biddingSoldListingId: "1",
    messages: [
      {
        id: 1,
        sender: "dealer",
        text: "Hi, i am interested in the car. Can we talk?",
        time: "09:00",
      },
    ],
  },
];

export type RecentActivityStatus = "Won" | "Lost";

export type RecentActivityItem = {
  id: number;
  car: string;
  km: string;
  location: string;
  price: string;
  status: RecentActivityStatus;
  image: string;
};

export type DealerProfile = {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  avatarInitial: string;
  avatarImage: string | null;
  recentActivity: RecentActivityItem[];
};

const CAR_IMG =
  "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=500&fit=crop";

export const DEALER_PROFILES: Record<string, DealerProfile> = {
  "1": {
    id: "1",
    name: "Premium Auto Group",
    email: "ast@gmail.com",
    phone: "+1 000 0356 656",
    location: "Los Angeles, CA",
    avatarInitial: "P",
    avatarImage: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=200&h=200&fit=crop",
    recentActivity: [
      {
        id: 1,
        car: "2021 Honda CR-V EX",
        km: "32,000 km",
        location: "Queens, NY",
        price: "$12,000",
        status: "Won",
        image: CAR_IMG,
      },
      {
        id: 2,
        car: "2021 Honda CR-V EX",
        km: "32,000 km",
        location: "Queens, NY",
        price: "$16,500",
        status: "Lost",
        image: CAR_IMG,
      },
    ],
  },
  "2": {
    id: "2",
    name: "City Motors",
    email: "contact@citymotors.example",
    phone: "+1 212 555 0199",
    location: "Brooklyn, NY",
    avatarInitial: "C",
    avatarImage: null,
    recentActivity: [
      {
        id: 1,
        car: "2019 Ford F-150",
        km: "48,000 km",
        location: "Manhattan, NY",
        price: "$28,000",
        status: "Lost",
        image: CAR_IMG,
      },
    ],
  },
};

export function getDealerProfile(id: string): DealerProfile | undefined {
  return DEALER_PROFILES[id];
}
