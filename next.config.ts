import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Default .next is held open by another IDE process on this machine;
   * exFAT offers no way to reclaim it without closing that app. */
  distDir: ".next-dist",
};

export default nextConfig;
