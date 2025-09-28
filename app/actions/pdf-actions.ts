"use server";

// import { extractTextFromPDF } from "@/dal/pdf";
import PdfParse from "pdf-parse";

export async function extractTextFromPdf(formData: FormData) {
  const pdfFile = formData.get("pdfFile") as File;
  if (!pdfFile) {
    return { error: "No file uploaded." };
  }

  try {
    const buffer = Buffer.from(await (pdfFile as File).arrayBuffer());
    const data = await PdfParse(buffer);
    return { text: data.text };
  } catch (e) {
    console.error("Error extracting text:", e);
    return { error: "Failed to extract text from PDF." };
  }
}

// export async function extractPDFText(formData: FormData) {
//   try {
//     const file = formData.get("pdf") as File;

//     if (!file) {
//       throw new Error("No PDF file provided");
//     }

//     if (file.type !== "application/pdf") {
//       throw new Error("File must be a PDF");
//     }

//     // Convert file to buffer
//     const bytes = await file.arrayBuffer();
//     const buffer = Buffer.from(bytes);

//     // Extract text using DAL function
//     const result = await extractTextFromPDF(buffer);

//     return {
//       success: true,
//       data: result,
//     };
//   } catch (error) {
//     console.error("PDF extraction error:", error);
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : "Failed to extract text from PDF",
//     };
//   }
// }
