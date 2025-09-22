import JPGToPNGClient from "./JPGToPNGClient";
import PNGToJPGClient from "./PNGToJPGClient";
import WEBPToJPGClient from "./WEBPToJPGClient";
import JPGToWEBPClient from "./JPGToWEBPClient";
import ImageToPDFClient from "./ImageToPDFClient";
import MERGPDFClient from "./Merge-pdfClient";
import SPLITPDFClient from "./SplitPDFClient";
import CompressPDFClient from "./CompressPDFClinet";
import WordToPDFClient from "./WordToPDFClient";

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
};

const siteUrl =process.env.NEXT_PUBLIC_SITE_URL;
const siteTitle = process.env.NEXT_PUBLIC_SITE_TITLE;
const keywords = process.env.NEXT_PUBLIC_SITE_KEYWORDS?.split(",").map((k) =>
  k.trim()
);

export async function generateMetadata({
  params,
}: {
  params: { tool: string };
}) {
  const { tool } = await params;
  const title = toolNames[tool];
  const description = `Use the ${title} online tool to convert your files instantly. Upload your files and download the result in seconds.`;
  const url = `${siteUrl}/tools/${tool}`;
  const ogImage = `${siteUrl}/images/${tool}-og.png`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    keywords: keywords,
    icons: {
      icon: ogImage,
      shortcut: ogImage,
      apple: ogImage,
    },
    authors: [{ name: "Rehan Ahmad", url: siteUrl }],
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
