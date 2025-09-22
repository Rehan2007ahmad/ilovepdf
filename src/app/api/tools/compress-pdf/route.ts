import { NextRequest } from "next/server";
import { PDFDocument } from "pdf-lib";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

// Disable default body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

// Middleware runner for NextRequest
const runMiddleware = (req: NextRequest, fn: any) =>
  new Promise<void>((resolve, reject) => {
    fn(req, {} as any, (result: any) => {
      if (result instanceof Error) reject(result);
      else resolve();
    });
  });

// POST method handler
export async function POST(req: NextRequest) {
  try {
    // Parse multipart/form-data
    let fileBuffer: Buffer | null = null;
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;

      if (!file) {
        return new Response(JSON.stringify({ message: "No file uploaded" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Convert File to Buffer
      fileBuffer = Buffer.from(await file.arrayBuffer());
    } else {
      return new Response(JSON.stringify({ message: "Invalid request type" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Load PDF
    const pdfDoc = await PDFDocument.load(fileBuffer);

    // Compress PDF
    const compressedPdfBytes = await pdfDoc.save({ useObjectStreams: true, compress: true });

    // Return PDF as response
    return new Response(Buffer.from(compressedPdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=compressed.pdf",
      },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Failed to compress PDF" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
