import type { MetadataRoute } from "next";
import { SITE } from "@/content/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.meta.siteName,
    short_name: "SJ",
    description: SITE.meta.description,
    start_url: "/",
    display: "browser",
    background_color: "#050a16",
    theme_color: "#050a16",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
