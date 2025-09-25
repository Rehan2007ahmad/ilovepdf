import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://ilovepdf-seven.vercel.app";
const siteTitle = process.env.NEXT_PUBLIC_SITE_TITLE || "Your File Tools";
const siteDescription =
  process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
  "Free online tools to convert, compress, and manage your files easily.";
const siteKeywords =
  process.env.NEXT_PUBLIC_SITE_KEYWORDS?.split(",").map((k) => k.trim()) || [];
const siteAuthor =
  process.env.NEXT_PUBLIC_SITE_AUTHOR || "Your File Tools Team";
const siteLocale = process.env.NEXT_PUBLIC_SITE_LOCALE || "en_US";
const siteEmail =
  process.env.NEXT_PUBLIC_SITE_EMAIL || "support@yourfileconverter.com";
const siteGoogleVerification = process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION;
const siteYandexVerification = process.env.NEXT_PUBLIC_YANDEX_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  keywords: siteKeywords,
  authors: [{ name: siteAuthor }],
  creator: siteAuthor,
  publisher: siteAuthor,
  formatDetection: { email: false, address: false, telephone: false },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: siteLocale,
    url: siteUrl,
    siteName: siteTitle,
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: `${siteUrl}/images/card.png`,
        width: 1200,
        height: 630,
        alt: siteTitle,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: siteUrl,
    creator: siteAuthor,
    title: siteTitle,
    description: siteDescription,
    images: [`${siteUrl}/images/card.png`],
  },
  verification: {
    google: siteGoogleVerification,
    yandex: siteYandexVerification,
  },
  category: "productivity",
  classification: "File Conversion Tools",
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "theme-color": "#1a1a1a",
    "msapplication-TileColor": "#fbbf24",
    "apple-mobile-web-app-title": siteTitle,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
  ],
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: siteTitle,
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/favicon.ico`,
        width: 512,
        height: 512,
      },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: siteEmail,
        availableLanguage: ["English"],
      },
    },
    {
      "@type": "WebApplication",
      name: siteTitle,
      description: siteDescription,
      url: siteUrl,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires JavaScript",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        reviewCount: "1950",
        bestRating: "5",
        worstRating: "1",
      },
      featureList: siteKeywords,
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        ={" "}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="antialiased">

        <Navbar />
        {children}
        <Footer />
        <Analytics/>
        <SpeedInsights/>
      </body>
    </html>
  );
}
