import { NextRequest, NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";

type SplitRange = {
  id: string;
  startPage: number;
  endPage: number;
  name: string;
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const rangesStr = formData.get("ranges") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!rangesStr) {
      return NextResponse.json(
        { error: "No split ranges provided" },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "File must be a PDF" },
        { status: 400 }
      );
    }

    let ranges: SplitRange[];
    try {
      ranges = JSON.parse(rangesStr);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid ranges format" },
        { status: 400 }
      );
    }

    if (!Array.isArray(ranges) || ranges.length === 0) {
      return NextResponse.json(
        { error: "At least one split range is required" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    const originalPdf = await PDFDocument.load(uint8Array);
    const totalPages = originalPdf.getPageCount();

    for (const range of ranges) {
      if (range.startPage < 1 || range.endPage > totalPages) {
        return NextResponse.json(
          { error: `Page range must be between 1 and ${totalPages}` },
          { status: 400 }
        );
      }
      if (range.startPage > range.endPage) {
        return NextResponse.json(
          { error: "Start page cannot be greater than end page" },
          { status: 400 }
        );
      }
    }

    const zip = new JSZip();

    for (let i = 0; i < ranges.length; i++) {
      const range = ranges[i];

      const newPdf = await PDFDocument.create();

      const pagesToCopy = [];
      for (
        let pageNum = range.startPage - 1;
        pageNum < range.endPage;
        pageNum++
      ) {
        pagesToCopy.push(pageNum);
      }

      const copiedPages = await newPdf.copyPages(originalPdf, pagesToCopy);

      copiedPages.forEach((page) => {
        newPdf.addPage(page);
      });

      const pdfBytes = await newPdf.save();

      const sanitizedName = range.name.replace(/[^a-z0-9]/gi, "_");
      const fileName = `${sanitizedName}_pages_${range.startPage}-${range.endPage}.pdf`;

      zip.file(fileName, pdfBytes);
    }

    const zipBuffer = await zip.generateAsync({ type: "uint8array" });
    const uintbinary = new Uint8Array(zipBuffer);

    return new NextResponse(uintbinary, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": "attachment; filename=split-pdfs.zip",
      },
    });
  } catch (error) {
    console.error("Error splitting PDF:", error);
    return NextResponse.json(
      { error: "Failed to split PDF file" },
      { status: 500 }
    );
  }
}
