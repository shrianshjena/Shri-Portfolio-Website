import type { Metadata, Viewport } from "next";
import { generalSans, jetbrainsMono } from "@/lib/fonts";
import { AppProviders } from "@/components/providers/AppProviders";
import { SITE } from "@/content/site";
import { FALLBACK_SITE_URL } from "@/lib/constants";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_SITE_URL;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: SITE.meta.title,
  description: SITE.meta.description,
  keywords: [...SITE.meta.keywords],
  authors: [{ name: SITE.meta.author }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    title: SITE.meta.title,
    description: SITE.meta.description,
    siteName: SITE.meta.siteName,
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.meta.title,
    description: SITE.meta.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#050a16",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE.meta.author,
  jobTitle: "Derivatives Trader and Systems Builder",
  url: siteUrl,
  email: `mailto:${SITE.contact.email}`,
  telephone: SITE.contact.phone,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Mumbai",
    addressCountry: "IN",
  },
  sameAs: SITE.socials.map((social) => social.href),
  alumniOf: "Fr. Agnel, Bandra",
  knowsAbout: [...SITE.meta.keywords],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${generalSans.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body className="bg-canvas text-fg">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            /* Escape < so no content string can ever close the script tag. */
            __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
