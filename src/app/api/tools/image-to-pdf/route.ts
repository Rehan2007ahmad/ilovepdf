
import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/bmp'];
    const invalidFiles = files.filter((file: File) => !validImageTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      return NextResponse.json(
        { error: 'Some files are not valid images' },
        { status: 400 }
      );
    }

    const pdfDoc = await PDFDocument.create();

    for (const file of files) {
      const buffer = Buffer.from(await (file as File).arrayBuffer());
      
      const processedBuffer = await sharp(buffer)
        .jpeg({ quality: 85 })
        .toBuffer();

      const image = await pdfDoc.embedJpg(processedBuffer);
      
      const { width, height } = image.scale(1);
      
      const maxWidth = 595; 
      const maxHeight = 842; 
      
      let pageWidth = width;
      let pageHeight = height;
      
      if (width > maxWidth || height > maxHeight) {
        const widthRatio = maxWidth / width;
        const heightRatio = maxHeight / height;
        const scale = Math.min(widthRatio, heightRatio);
        
        pageWidth = width * scale;
        pageHeight = height * scale;
      }

      const page = pdfDoc.addPage([pageWidth, pageHeight]);
      
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: pageWidth,
        height: pageHeight,
      });
    }

    const pdfBytes = await pdfDoc.save();
    const pdfBuffer = Buffer.from(pdfBytes);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="converted.pdf"',
        'Content-Length': pdfBytes.length.toString(),
      },
    });

  } catch (error) {
    console.error('PDF conversion error:', error);
    return NextResponse.json(
      { error: 'Failed to convert images to PDF' },
      { status: 500 }
    );
  }
}
