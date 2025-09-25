import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import JPGToPNGClient from "./JPGToPNGClient";
import PNGToJPGClient from "./PNGToJPGClient";
import WEBPToJPGClient from "./WEBPToJPGClient";
import JPGToWEBPClient from "./JPGToWEBPClient";
import ImageToPDFClient from "./ImageToPDFClient";
import MERGPDFClient from "./Merge-pdfClient";
import SPLITPDFClient from "./SplitPDFClient";
import CompressPDFClient from "./CompressPDFClinet";
import WordToPDFClient from "./WordToPDFClient";
import ResizeImage from "./ResizeImage";

const toolComponents: Record<string, React.ComponentType<{ tool: string }>> = {
  "jpg-to-png": JPGToPNGClient,
  "png-to-jpg": PNGToJPGClient,
  "webp-to-jpg": WEBPToJPGClient,
  "jpg-to-webp": JPGToWEBPClient,
  "image-to-pdf": ImageToPDFClient,
  "merge-pdf": MERGPDFClient,
  "split-pdf": SPLITPDFClient,
  "compress-pdf": CompressPDFClient,
  "word-to-pdf": WordToPDFClient,
  "resize-image": ResizeImage,
};

const toolNames: Record<string, string> = {
  "jpg-to-png": "JPG to PNG Converter",
  "png-to-jpg": "PNG to JPG Converter",
  "webp-to-jpg": "WEBP to JPG Converter",
  "jpg-to-webp": "JPG to WEBP Converter",
  "image-to-pdf": "Image to PDF Converter",
  "merge-pdf": "Merge PDF Files",
  "split-pdf": "Split PDF File",
  "compress-pdf": "Compress PDF File",
  "word-to-pdf": "Word to PDF Converter",
  "resize-image": "Resize Image",
};

const toolFeatures: Record<string, string[]> = {
  "jpg-to-png": [
    "Convert JPG images to PNG",
    "No software installation",
    "Instant conversion",
  ],
  "png-to-jpg": [
    "Convert PNG images to JPG",
    "Preserve quality",
    "Fast processing",
  ],
  "webp-to-jpg": [
    "Convert WEBP to JPG",
    "Lossless quality",
    "Browser-based tool",
  ],
  "jpg-to-webp": ["Convert JPG to WEBP", "Optimized for web", "Instant result"],
  "image-to-pdf": [
    "Convert images to PDF",
    "Merge multiple images",
    "Download instantly",
  ],
  "merge-pdf": [
    "Combine multiple PDFs",
    "Maintain original quality",
    "Secure processing",
  ],
  "split-pdf": [
    "Split PDF into pages",
    "Select specific pages",
    "No installation required",
  ],
  "compress-pdf": [
    "Reduce PDF size",
    "High-quality compression",
    "Browser-based",
  ],
  "word-to-pdf": [
    "Convert Word documents to PDF",
    "Preserve formatting",
    "Fast conversion",
  ],
  "resize-image": [
    "Resize images online",
    "Multiple formats supported",
    "Adjust dimensions easily",
  ],
};

const toolDescriptions: Record<string, string> = {
  "jpg-to-png":
    "Convert your JPG images to PNG instantly with high quality. Free, browser-based tool.",
  "png-to-jpg":
    "Easily convert PNG images to JPG format online. Preserve quality and download fast.",
  "webp-to-jpg":
    "Convert WEBP images to JPG quickly without any software installation.",
  "jpg-to-webp":
    "Optimize JPG images for web by converting them to WEBP format instantly.",
  "image-to-pdf":
    "Convert images to PDF files quickly. Merge multiple images into one PDF online.",
  "merge-pdf":
    "Combine multiple PDF files into a single PDF easily and securely.",
  "split-pdf":
    "Split PDF files into individual pages or select pages you need. Fast and free.",
  "compress-pdf":
    "Reduce PDF file size while keeping quality intact. Secure and easy to use.",
  "word-to-pdf":
    "Convert Word documents to PDF online. Preserve formatting and download instantly.",
  "resize-image":
    "Resize your images to any dimension online. Supports multiple formats and instant download.",
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
const siteTitle = process.env.NEXT_PUBLIC_SITE_TITLE || "Your File Tools";
const keywords =
  process.env.NEXT_PUBLIC_SITE_KEYWORDS?.split(",").map((k) => k.trim()) || [];
const siteAuthor = process.env.NEXT_PUBLIC_SITE_AUTHOR || "Rehan Ahmad";
const siteEmail =
  process.env.NEXT_PUBLIC_SITE_EMAIL || "support@yourfileconverter.com";
export async function generateMetadata({
  params,
}: {
  params: { tool: string };
}): Promise<Metadata> {
  const { tool } = await params;
  const title = toolNames[tool] || "File Tool";
  const description = toolDescriptions[tool];
  const url = `${siteUrl}/tools/${tool}`;
  const ogImage = `${siteUrl}/images/${tool}-og.png`;

  return {
    title,
    description,
    keywords,
    authors: [{ name: siteAuthor, url: siteUrl }],
    creator: siteAuthor,
    publisher: siteAuthor,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: siteTitle,
      type: "website",
      locale: "en_US",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

const generateStructuredData = (tool: string) => {
  const title = toolNames[tool] || "File Tool";
  const url = `${siteUrl}/tools/${tool}`;
  const features = toolFeatures[tool] || [];

  const faqList = [
    {
      question: `How do I use the ${title}?`,
      answer: `Upload your files, choose the output format, and click convert. Your file is processed instantly in the browser.`,
    },
    {
      question: `Are my files safe on ${title}?`,
      answer: `Yes, all files are securely processed and automatically deleted from our servers after conversion.`,
    },
    {
      question: `Do I need to install any software for ${title}?`,
      answer: `No installation is required. All tools work directly in your browser.`,
    },
    {
      question: `Is ${title} free to use?`,
      answer: `Yes, our ${title} tool is completely free without hidden costs.`,
    },
  ];

  return {
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
        },
      },
      {
        "@type": "WebApplication",
        name: title,
        description: toolDescriptions[tool],
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any",
        browserRequirements: "Requires JavaScript",
        featureList: features,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          { "@type": "ListItem", position: 2, name: title, item: url },
        ],
      },

      {
        "@type": "FAQPage",
        mainEntity: faqList.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };
};

export default async function ToolPage({
  params,
}: {
  params: Promise<{ tool: string }>;
}) {
  const resolvedParams = await params;

  if (!resolvedParams?.tool) {
    notFound();
  }

  const { tool } = resolvedParams;
  const Component = toolComponents[tool];

  if (!Component) {
    notFound();
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateStructuredData(tool)),
        }}
      />
      <Component tool={tool} />
    </>
  );
}
