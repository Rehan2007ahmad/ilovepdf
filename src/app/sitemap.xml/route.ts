import { NextRequest } from "next/server";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ilovepdf-seven.vercel.app";

const tools = [
  "jpg-to-png",
  "png-to-jpg", 
  "webp-to-jpg",
  "jpg-to-webp",
  "image-to-pdf",
  "merge-pdf",
  "split-pdf",
  "compress-pdf",
  "word-to-pdf"
];

function generateSiteMap(): string {
  const now = new Date().toISOString();
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${tools
    .map(
      (tool) => `
  <url>
    <loc>${siteUrl}/tools/${tool}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join('')}
</urlset>`;
}

export async function GET(request: NextRequest) {
  const sitemap = generateSiteMap();
  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=1800",
    },
  });
}
``