import type { MetadataRoute } from "next";
import { FALLBACK_SITE_URL } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_SITE_URL;
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${base}/sitemap.xml`,
  };
}
