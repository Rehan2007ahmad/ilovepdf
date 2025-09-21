import { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ilovepdf-seven.vercel.app/";

// These match your tool keys
const tools = [
  "jpg-to-png",
  "png-to-jpg",
  "webp-to-jpg",
  "jpg-to-webp",
  "image-to-pdf",
  "merge-pdf",
  "split-pdf",
  "compress-pdf",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];

  const toolRoutes: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${siteUrl}/tools/${tool}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...toolRoutes];
}
