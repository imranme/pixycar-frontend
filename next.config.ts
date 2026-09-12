import type { NextConfig } from "next";

// ── Trusted backend host (for CSP) ────────────────────────────────────────────
const API_HOST = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8005";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8005",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8005",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.ngrok-free.dev",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    // Build a tight Content-Security-Policy allowing only known origins
    const csp = [
      `default-src 'self'`,
      // Scripts: allow self + Next.js inline hydration scripts
      `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com`,
      // Styles: allow self + Google Fonts
      `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
      // Fonts: allow self + Google Fonts CDN
      `font-src 'self' https://fonts.gstatic.com`,
      // Images: allow self + backend media + unsplash
      `img-src 'self' data: blob: ${API_HOST} https://images.unsplash.com`,
      // Videos/Audio: allow self + backend media server
      `media-src 'self' blob: ${API_HOST}`,
      // API connect: allow self + backend API + Stripe
      `connect-src 'self' ${API_HOST} ${API_HOST.replace('http', 'ws')} https://api.stripe.com`,
      // iframes: Stripe payment elements only
      `frame-src https://js.stripe.com https://hooks.stripe.com`,
      // No Flash or Java plugins
      `object-src 'none'`,
      // Prevent base-tag hijacking
      `base-uri 'self'`,
      // Only allow forms to POST to same origin
      `form-action 'self'`,
      // Upgrade insecure requests (HTTP → HTTPS) in production
      `upgrade-insecure-requests`,
    ].join('; ');

    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: csp,
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(self https://js.stripe.com)",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

