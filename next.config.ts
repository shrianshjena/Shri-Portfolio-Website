import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

/* Spline runtime needs wasm eval + blob workers; dev mode needs eval for HMR. */
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  /* data: lets the Spline runtime run its inline-video codec probe. */
  "media-src 'self' data:",
  "connect-src 'self' https://prod.spline.design https://unpkg.com https://api.web3forms.com",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  /* Local Windows dev: editor file-watcher handles on exFAT block
   * re-creating a previously used dist directory, so local builds use
   * .dist (excluded from watching in .vscode/settings.json and from
   * language servers in tsconfig). Vercel builds in a clean container and
   * its output collection expects the standard .next directory, so the
   * workaround must not apply there. */
  distDir: process.env.VERCEL ? ".next" : ".dist4",
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  compiler: {
    removeConsole: { exclude: ["error"] },
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
