export interface PDFExtractionResult {
  text: string;
  pages: number;
  info?: any;
}

export async function extractTextFromPDF(
  buffer: Buffer
): Promise<PDFExtractionResult> {
  try {
    // Dynamic import to avoid module evaluation issues
    const pdf = await import("pdf-parse").then((m) => m.default);
    const data = await pdf(buffer);
    const extractedText = data.text;

    if (!extractedText.trim()) {
      throw new Error("No text could be extracted from the PDF");
    }

    return {
      text: extractedText,
      pages: data.numpages,
      info: data.info,
    };
  } catch (error) {
    console.error("PDF extraction error:", error);
    throw new Error("Failed to extract text from PDF");
  }
}
