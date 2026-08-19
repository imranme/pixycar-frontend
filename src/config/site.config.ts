export const siteConfig = {
  name: "Pixycar",
  description: "Buy and sell cars the smart way.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ogImage: "/og.png",
} as const;
