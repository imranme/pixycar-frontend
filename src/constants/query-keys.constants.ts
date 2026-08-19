export const QUERY_KEYS = {
  listings: {
    myListings: ["listings", "my"] as const,
    byId: (id: string) => ["listings", id] as const,
  },
  messages: {
    conversations: ["messages", "conversations"] as const,
    thread: (id: string) => ["messages", "thread", id] as const,
  },
  dashboard: {
    stats: ["dashboard", "stats"] as const,
  },
  profile: {
    me: ["profile", "me"] as const,
  },
} as const;
