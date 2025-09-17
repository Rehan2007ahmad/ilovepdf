import { NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (file.type !== "image/webp") {
      return NextResponse.json(
        { error: "Only WEBP files are allowed!" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const jpgBuffer = await sharp(buffer).jpeg().toBuffer();

    return new NextResponse(new Uint8Array(jpgBuffer), {
      status: 200,
      headers: {
        "Content-Type": "image/jpeg",
        "Content-Disposition": `attachment; filename="${file.name.replace(
          /\.[^/.]+$/,
          ""
        )}.jpg"`,

      },
    });
  } catch (err) {
    console.error("Conversion failed:", err);
    return NextResponse.json({ error: "Conversion failed!" }, { status: 500 });
  }
}
