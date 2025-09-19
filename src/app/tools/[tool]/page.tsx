import JPGToPNGClient from "./JPGToPNGClient";
import PNGToJPGClient from "./PNGToJPGClient";
import WEBPToJPGClient from "./WEBPToJPGClient";
import JPGToWEBPClient from "./JPGToWEBPClient";
import ImageToPDFClient from "./ImageToPDFClient";
import MERGPDFClient from "./Merge-pdfClient";
import SPLITPDFClient from "./SplitPDFClient";


const toolComponents: Record<string, React.ComponentType<{ tool: string }>> = {
  "jpg-to-png": JPGToPNGClient,
  "png-to-jpg": PNGToJPGClient,
  "webp-to-jpg": WEBPToJPGClient,
  "jpg-to-webp": JPGToWEBPClient,
  "image-to-pdf": ImageToPDFClient,
  "merge-pdf": MERGPDFClient,
  "split-pdf": SPLITPDFClient,
};

const toolNames: Record<string, string> = {
  "jpg-to-png": "JPG to PNG Converter",
  "png-to-jpg": "PNG to JPG Converter",
  "webp-to-jpg": "WEBP to JPG Converter",
  "jpg-to-webp": "JPG to WEBP Converter",
  "image-to-pdf": "Image to PDF Converter",
  "pdf-to-word":"Pdf to Word Converter",
  "merge-pdf": "Merge PDF Files",
  "split-pdf": "Split PDF File",
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
