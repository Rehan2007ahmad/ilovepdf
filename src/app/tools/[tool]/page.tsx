import JPGToPNGClient from "./JPGToPNGClient";
import PNGToJPGClient from "./PNGToJPGClient";

const toolComponents: Record<string, React.ComponentType<{ tool: string }>> = {
  "jpg-to-png": JPGToPNGClient,
  "png-to-jpg": PNGToJPGClient,
};

const toolNames: Record<string, string> = {
  "jpg-to-png": "JPG to PNG Converter",
  "png-to-jpg": "PNG to JPG Converter",
  "pdf-to-word": "PDF to Word Converter",
};

export async function generateMetadata({
  params,
}: {
  params: { tool: string };
}) {
  const { tool } = await params;
  const title = toolNames[tool] || "Online File Converter";
  const description = `Use the ${title} online tool to convert your files instantly. Upload your files and download the result in seconds.`;
  const url = `https://yourwebsite.com/tools/${tool}`;
  const ogImage = `https://yourwebsite.com/images/${tool}-og.png`;

  return {
    title,
    description,
    canonical: url,
    keywords: [title, "File Converter", "Online Tool", "Free Converter"],
    authors: [{ name: "Rehan Ahmad", url: "https://yourwebsite.com" }],
    openGraph: {
      title,
      description,
      url,
      siteName: "MyTools",
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

export default async function ToolPage({
  params,
}: {
  params: { tool: string };
}) {
  const { tool } = await params;

  const Component = toolComponents[tool];

  if (!Component) return <p>Tool not found</p>;

  return <Component tool={tool} />;
}
