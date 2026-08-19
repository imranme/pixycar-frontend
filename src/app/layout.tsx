import type { Metadata } from "next";
import { Montserrat, Poppins } from "next/font/google";
import "./globals.css";
import ScrollToTopButton from "@/components/ButtomToTopScrolling/ScrollToTopButton";
import { Providers } from "@/providers";
import Script from "next/script";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-poppins",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: {
    default: "Pixycar",
    template: "%s | Pixycar",
  },
  description: "Buy and sell cars the smart way.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${montserrat.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <Script src="http://13.61.225.84:3000/widget.js" data-slug="elite-plumbing-pro" strategy="afterInteractive" />
        <Providers>{children}</Providers>
        <ScrollToTopButton />
      </body>
    </html>
  );
}
