import React from "react";
import type { Metadata } from "next";
import Hero from "@/Components/Hero";
import Features from "@/Components/Features";
import WhatWeDo from "@/Components/WhatWeDo";

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
const siteEmail =
  process.env.NEXT_PUBLIC_SITE_EMAIL || "support@yourfileconverter.com";

export const generateMetadata = async (): Promise<Metadata> => ({
  title: siteTitle,
  description: siteDescription,
  keywords: siteKeywords,
  authors: [{ name: siteAuthor }],
  creator: siteAuthor,
  publisher: siteAuthor,
  alternates: { canonical: siteUrl },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    siteName: siteTitle,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: `${siteUrl}/images/card.png`,
        width: 1200,
        height: 630,
        alt: siteTitle,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [`${siteUrl}/images/card.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  category: "productivity",
  classification: "File Conversion Tools",
  other: {
    "theme-color": "#1a1a1a",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": siteTitle,
  },
});

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
      "@type": "WebSite",
      url: siteUrl,
      name: siteTitle,
      description: siteDescription,
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteUrl}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How do I convert JPG to PNG?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Simply upload your JPG image, choose PNG as the output format, and click convert. Your file will be processed instantly.",
          },
        },
        {
          "@type": "Question",
          name: "Are my files safe when I upload them?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, your files are processed securely and automatically deleted from our servers after conversion.",
          },
        },
        {
          "@type": "Question",
          name: "Do I need to install any software?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No installation required. All tools work directly in your browser on any device.",
          },
        },
        {
          "@type": "Question",
          name: "Is this service free to use?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, our file conversion tools are completely free to use without hidden costs.",
          },
        },
      ],
    },
  ],
};

export default function Home() {
  return (
    <div className="bg-gray-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Hero />
      <Features />
      <WhatWeDo />
    </div>
  );
}
