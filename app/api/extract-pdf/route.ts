import { NextRequest, NextResponse } from "next/server";
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("pdf") as File;
    if (!file) {
      return NextResponse.json(
        { error: "No PDF file provided" },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "File must be a PDF" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Extract text from PDF using dynamic import
    // const pdf = await import("pdf-parse").then(m => m.default);

    return NextResponse.json({
      text: "Dummy text",
      pages: 1,
      info: "Dummy info",
    });
    // const data = await pdf(buffer);
    // const extractedText = data.text;

    // if (!extractedText.trim()) {
    //   return NextResponse.json(
    //     { error: "No text could be extracted from the PDF" },
    //     { status: 400 }
    //   );
    // }

    // return NextResponse.json({
    //   text: extractedText,
    //   pages: data.numpages,
    //   info: data.info,
    // });
  } catch (error) {
    console.error("PDF extraction error:", error);
    return NextResponse.json(
      { error: "Failed to extract text from PDF" },
      { status: 500 }
    );
  }
}
