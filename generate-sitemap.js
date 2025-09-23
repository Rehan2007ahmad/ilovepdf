// generate-sitemap.js
const fs = require("fs");
const path = require("path");

const siteUrl = "https://ilovepdf-seven.vercel.app";

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

function generateSitemap() {
  const urls = [
    {
      loc: siteUrl,
      changefreq: "daily",
      priority: 1.0,
    },
    ...tools.map((tool) => ({
      loc: `${siteUrl}/tools/${tool}`,
      changefreq: "weekly",
      priority: 0.8,
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `
  <url>
    <loc>${u.loc}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("")}
</urlset>`;

  const publicDir = path.join(__dirname, "public");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }

  const filePath = path.join(publicDir, "sitemap.xml");

  // ✅ ensure UTF-8 without BOM
  fs.writeFileSync(filePath, Buffer.from(xml, "utf8"));
  console.log("✅ Sitemap generated clean at:", filePath);
}

generateSitemap();
