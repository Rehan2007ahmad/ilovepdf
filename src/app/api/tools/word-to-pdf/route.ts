import { NextRequest } from "next/server";
import { PDFDocument, rgb, StandardFonts, PDFFont, PDFPage } from "pdf-lib";
import JSZip from "jszip";

export const config = { api: { bodyParser: false } };

type ImageData = { type: "jpeg" | "png"; data: Uint8Array };

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return new Response(JSON.stringify({ message: "Invalid request type" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) throw new Error("No file uploaded");

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Load Word doc as ZIP
    const zip = await JSZip.loadAsync(buffer);
    const documentXml = await zip.file("word/document.xml")?.async("text");
    if (!documentXml) throw new Error("Invalid .docx file");

    // Extract images from /word/media
    const images = await extractImages(zip);

    // Parse paragraphs with styles & detect image references
    const paragraphs = parseParagraphsWithStyles(documentXml, images);

    // Create PDF
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

    const pageSize = { width: 595, height: 842 }; // A4
    let page = pdfDoc.addPage([pageSize.width, pageSize.height]);
    const margin = 50;
    let yPos = pageSize.height - margin;
    const lineHeight = 16;

    for (const para of paragraphs) {
      if (para.imageName && images.has(para.imageName)) {
        const imgData = images.get(para.imageName)!;
        const rendered = await renderImage(
          para.imageName,
          imgData,
          page,
          yPos,
          pageSize,
          margin,
          pdfDoc
        );
        page = rendered.page;
        yPos = rendered.yPos;
      } else {
        const { text, style } = para;
        const fontToUse = style.bold
          ? fontBold
          : style.italic
          ? fontItalic
          : font;
        const fontSize = style.heading
          ? style.heading === 1
            ? 22
            : style.heading === 2
            ? 18
            : 16
          : 12;
        const subParas = text.split("\n");

        for (const sub of subParas) {
          const lines = splitLines(
            sub,
            pageSize.width - margin * 2,
            fontToUse,
            fontSize
          );
          for (const line of lines) {
            if (yPos < margin) {
              page = pdfDoc.addPage([pageSize.width, pageSize.height]);
              yPos = pageSize.height - margin;
            }
            page.drawText(line, {
              x: margin,
              y: yPos,
              font: fontToUse,
              size: fontSize,
              color: rgb(0, 0, 0),
            });
            yPos -= lineHeight;
          }
          yPos -= lineHeight / 2;
        }
        yPos -= lineHeight / 2;
      }
    }

    const pdfBytes = await pdfDoc.save();
    return new Response(new Uint8Array(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=${file.name.replace(
          /\.[^/.]+$/,
          ".pdf"
        )}`,
      },
    });
  } catch (err: any) {
    console.error(err);
    return new Response(
      JSON.stringify({
        message: "Failed to convert Word to PDF",
        error: err.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// ------------------------- Helpers -------------------------

async function extractImages(zip: JSZip) {
  const images = new Map<string, ImageData>();
  const mediaFolder = zip.folder("word/media");
  if (!mediaFolder) return images;

  const files = mediaFolder.file(/.*/);
  if (!files) return images;

  for (const file of files) {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !["jpg", "jpeg", "png"].includes(ext)) continue;
    const data = await file.async("uint8array");
    images.set(file.name.replace("word/media/", ""), {
      type: ext === "png" ? "png" : "jpeg",
      data,
    });
  }

  return images;
}

function parseParagraphsWithStyles(
  xml: string,
  images: Map<string, ImageData>
): { text: string; style: any; imageName?: string }[] {
  const paras = xml.split(/<\/w:p>/).map((p) => {
    const text = p
      .replace(/<w:br\s*\/>/g, "\n")
      .replace(/<w:t[^>]*>(.*?)<\/w:t>/g, "$1")
      .replace(/<[^>]+>/g, "")
      .trim();

    // Detect heading style
    let heading: number | undefined;
    const matchHeading = p.match(/<w:pStyle w:val="Heading([1-6])"/);
    if (matchHeading) heading = parseInt(matchHeading[1]);

    // Detect bold/italic in paragraph
    const bold = /<w:b\s*\/?>/.test(p);
    const italic = /<w:i\s*\/?>/.test(p);

    // Detect image reference
    const matchImage = p.match(/<a:blip r:embed="rId\d+".*?\/>/);
    let imageName;
    if (matchImage) {
      // fallback: pick first media file if can't resolve relationship
      imageName = Array.from(images.keys())[0];
    }

    return { text, style: { heading, bold, italic }, imageName };
  });

  return paras.filter((p) => p.text.length > 0 || p.imageName);
}

function splitLines(
  text: string,
  maxWidth: number,
  font: PDFFont,
  fontSize: number
): string[] {
  const words = text.replace(/\n/g, " ").split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? currentLine + " " + word : word;
    const width = font.widthOfTextAtSize(testLine, fontSize);
    if (width > maxWidth && currentLine.length > 0) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

// ------------------------- Image Renderer -------------------------

async function renderImage(
  imageName: string,
  imageData: ImageData,
  page: PDFPage,
  yPos: number,
  pageSize: { width: number; height: number },
  margin: number,
  pdfDoc: PDFDocument
): Promise<{ page: PDFPage; yPos: number }> {
  try {
    let img;
    if (imageData.type === "jpeg") {
      img = await pdfDoc.embedJpg(imageData.data);
    } else if (imageData.type === "png") {
      img = await pdfDoc.embedPng(imageData.data);
    }

    if (img) {
      const maxWidth = pageSize.width - margin * 2;
      const maxHeight = 300; // Max image height

      let { width, height } = img.scale(1);

      // Scale image to fit within constraints
      if (width > maxWidth) {
        const scale = maxWidth / width;
        width *= scale;
        height *= scale;
      }

      if (height > maxHeight) {
        const scale = maxHeight / height;
        width *= scale;
        height *= scale;
      }

      if (yPos - height < margin) {
        page = pdfDoc.addPage([pageSize.width, pageSize.height]);
        yPos = pageSize.height - margin;
      }

      const xPos = margin + (maxWidth - width) / 2; // Center image

      page.drawImage(img, {
        x: xPos,
        y: yPos - height,
        width: width,
        height: height,
      });

      yPos -= height + 20; // Add some space after image
    }
  } catch (error) {
    console.warn(`Error rendering image ${imageName}:`, error);
  }

  return { page, yPos };
}

