import { NextRequest } from "next/server";
import { PDFDocument } from "pdf-lib";


export const config = {
  api: {
    bodyParser: false,
  },
};



export async function POST(req: NextRequest) {
  try {
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

      fileBuffer = Buffer.from(await file.arrayBuffer());
    } else {
      return new Response(JSON.stringify({ message: "Invalid request type" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const pdfDoc = await PDFDocument.load(fileBuffer);

    const compressedPdfBytes = await pdfDoc.save({ useObjectStreams: true });

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
