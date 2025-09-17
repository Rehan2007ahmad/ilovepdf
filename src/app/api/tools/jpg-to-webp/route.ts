import { NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (file.type !== "image/jpeg") {
      return NextResponse.json({ error: "Only JPG files are allowed!" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const webpBuffer = await sharp(buffer).webp().toBuffer();

    // Convert Buffer to Uint8Array for NextResponse
    const uint8Array = new Uint8Array(webpBuffer);

    return new NextResponse(uint8Array, {
      status: 200,
      headers: {
        "Content-Type": "image/webp",
        "Content-Disposition": `attachment; filename="${file.name.replace(/\.[^/.]+$/, "")}.webp"`,
      },
    });
  } catch (err) {
    console.error("Conversion failed:", err);
    return NextResponse.json({ error: "Conversion failed!" }, { status: 500 });
  }
}