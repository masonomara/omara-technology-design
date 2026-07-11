import type { NextConfig } from "next";

<<<<<<< HEAD
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
=======
const isDev = process.env.NODE_ENV !== "production";

// Derive the Supabase origin from the public env var so connect-src tracks the
// project without hard-coding it. Empty string (dropped below) if unset/invalid.
function supabaseOrigin(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return "";
  try {
    return new URL(url).origin;
  } catch {
    return "";
  }
}

const supabase = supabaseOrigin();

// Content-Security-Policy.
//
// This site is statically rendered and we want to keep it that way, so scripts
// and styles use 'unsafe-inline' rather than a per-request nonce (a nonce is read
// via headers() and opts every page out of static generation). The XSS surface
// here is low: the only dangerouslySetInnerHTML sinks are a JSON-LD data block
// (not executed) and `marked` output from the repo owner's own markdown — no user
// input reaches an HTML sink. The remaining directives are locked down tightly to
// limit exfiltration (connect-src), framing (frame-ancestors), and injection of
// base/form/object elements.
const cspDirectives: string[] = [
  `default-src 'self'`,

  // Next.js streams the RSC payload and bootstraps hydration through inline
  // <script> blocks, so 'unsafe-inline' is required. 'unsafe-eval' is dev-only
  // (Turbopack / React Fast Refresh). va.vercel-scripts.com serves Vercel
  // Analytics in dev/preview; production proxies it same-origin under /_vercel.
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://va.vercel-scripts.com`,

  // framer-motion writes inline style attributes and next/font injects inline
  // <style> tags; neither can carry a nonce, so 'unsafe-inline' is required.
  `style-src 'self' 'unsafe-inline'`,

  // next/image (incl. data: blur), inline SVGs, blob: previews.
  `img-src 'self' data: blob:`,

  // Homepage game <video>/<source> and poster, all same-origin.
  `media-src 'self'`,

  // Fonts are self-hosted at build by next/font — no external font origin.
  `font-src 'self'`,

  // Supabase REST + Vercel Analytics beacons. Dev adds the HMR websocket.
  `connect-src ${["'self'", supabase, "https://va.vercel-scripts.com", isDev ? "ws: http://localhost:*" : ""].filter(Boolean).join(" ")}`,

  `worker-src 'self' blob:`,
  `manifest-src 'self'`,
  `frame-src 'none'`,
  `object-src 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `frame-ancestors 'none'`,
  `upgrade-insecure-requests`,
];

const contentSecurityPolicy = cspDirectives.join("; ");

// Companion security headers (part of the SYS-5 security-headers baseline). HSTS
// is intentionally left to the platform (Vercel sets it on custom domains).
const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
>>>>>>> ea80834 (hell yeah supabase is workign ebtter)
  },
};

export default nextConfig;
