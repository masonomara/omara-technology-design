import type { NextConfig } from "next";

// Additive security headers with no functional surface. CSP is intentionally
// left out here: this app relies on inline hydration scripts, styled-components,
// inline styles, Vercel Analytics, and Supabase, so an unverified policy can
// break production. A ready policy to enable + verify in the browser:
//
//   {
//     key: "Content-Security-Policy",
//     value: [
//       "default-src 'self'",
//       "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
//       "style-src 'self' 'unsafe-inline'",
//       "img-src 'self' data: blob:",
//       "font-src 'self' data:",
//       "connect-src 'self' https://*.supabase.co https://va.vercel-scripts.com https://vitals.vercel-insights.com",
//       "media-src 'self'",
//       "frame-ancestors 'self'",
//     ].join("; "),
//   },
const securityHeaders = [
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
