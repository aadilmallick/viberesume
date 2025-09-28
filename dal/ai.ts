import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_AI_API_KEY,
});

const PORTFOLIO_SYSTEM_PROMPT = `
You are an expert web developer and designer specializing in creating beautiful, professional portfolio websites.

Your task is to generate a complete, single-page HTML portfolio website based on a resume PDF that the user will upload.

REQUIREMENTS:
1. Generate pure HTML with inline CSS in <style> tags and using TailwindCSS classes (CDN will be available)
2. Create a modern, professional, and visually appealing design
3. Include sections that the user included in their resume like: Header/Hero, About, Experience, Skills, Education, Projects (if mentioned), Contact
4. Use a cohesive color scheme (preferably blue/purple gradient theme to match the VibeResume brand)
5. Make it fully responsive for mobile and desktop, make it mobile-friendly by using tailwind's breakpoints
6. Add subtle animations and hover effects using Tailwind
7. Include professional typography and proper spacing
8. Extract and organize all information from the resume intelligently
9. If contact information is available, make email/phone clickable
10. Add a professional headshot placeholder if no photo is provided, like an avatar of the initials

OUTPUT FORMAT:
Return ONLY the complete HTML code as a single string. Do not include any explanations, markdown formatting, or code blocks. The HTML should be ready to render directly.

IMPORTANT: The HTML will be stored in a database and rendered using dangerouslySetInnerHTML, so ensure it's clean and secure.

Include the TailwindCSS CDN in the head:
<script src="https://cdn.tailwindcss.com"></script>

Use font awesome icons for icons by including the CDN in the head and also using the classnames prefix 'fa', 'fas', etc.:
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css" integrity="sha512-2SwdPD6INVrV/lHTZbO2nodKhrnDdJK9/kg2XD1r9uGqPo1cUbujc+IYdlYdEErWNu69gVcYgdxlmVmzTWnetw==" crossorigin="anonymous" referrerpolicy="no-referrer" />


Start the HTML with:
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[Name] - Portfolio</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css" integrity="sha512-2SwdPD6INVrV/lHTZbO2nodKhrnDdJK9/kg2XD1r9uGqPo1cUbujc+IYdlYdEErWNu69gVcYgdxlmVmzTWnetw==" crossorigin="anonymous" referrerpolicy="no-referrer" />
</head>
<body>
...

Now, analyze the uploaded resume PDF and create a beautiful portfolio website.
`;

export interface PortfolioGenerationResult {
  htmlCode: string;
  title?: string;
}

export async function generatePortfolioFromPDF(
  pdfBuffer: Blob,
  mimeType: string = "application/pdf"
): Promise<PortfolioGenerationResult> {
  try {
    // Upload the PDF file to Google AI
    const uuid = crypto.randomUUID();
    const filename = `resume-${uuid}.pdf`;
    const uploadResponse = await ai.files.upload({
      file: pdfBuffer,
      config: {
        mimeType,
        displayName: filename,
      },
    });

    // Generate portfolio using the uploaded file
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              fileData: {
                fileUri: uploadResponse.uri,
                mimeType: uploadResponse.mimeType,
              },
            },
            {
              text: PORTFOLIO_SYSTEM_PROMPT,
            },
          ],
        },
      ],
    });

    // Clean up: delete the uploaded file
    await ai.files.delete({ name: uploadResponse.name || filename });

    const htmlCode = response.text || "";

    // Extract title from HTML if possible
    const titleMatch = htmlCode.match(/<title>(.*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : undefined;

    return {
      htmlCode,
      title,
    };
  } catch (error) {
    console.error("AI portfolio generation error:", error);
    throw new Error("Failed to generate portfolio from PDF");
  }
}

const PORTFOLIO_EDIT_SYSTEM_PROMPT = `
You are an expert web developer tasked with modifying an existing HTML portfolio website based on user requests.

CONTEXT:
- You will receive the current HTML code of a portfolio website
- You will receive specific modification requests from the user
- You must surgically modify the HTML to implement the requested changes

REQUIREMENTS:
1. Preserve the existing structure and styling as much as possible
2. Only modify what the user specifically requests
3. Maintain all existing TailwindCSS classes and CDN links
4. Keep the responsive design intact
5. Ensure all changes blend seamlessly with the existing design
6. If adding images, use placeholder URLs or the URLs provided by the user
7. For color changes, update the TailwindCSS classes appropriately
8. Maintain professional appearance and accessibility

COMMON MODIFICATION TYPES:
- Adding/updating profile photos or images
- Changing color schemes or themes
- Updating contact information
- Adding new sections or content
- Modifying existing text content
- Adjusting layout or styling elements
- Adding new projects or experiences

OUTPUT FORMAT:
Return ONLY the complete modified HTML code as a single string. Do not include any explanations, markdown formatting, or code blocks. The HTML should be ready to render directly.

IMPORTANT: Ensure the modified HTML maintains the same structure and quality as the original while implementing the requested changes precisely.
`;

export async function editCodeSummary(
  currentHtmlCode: string,
  userModificationRequest: string
): Promise<PortfolioGenerationResult> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${PORTFOLIO_EDIT_SYSTEM_PROMPT}

CURRENT HTML CODE:
${currentHtmlCode}

USER MODIFICATION REQUEST:
${userModificationRequest}

Please modify the HTML code according to the user's request.`,
            },
          ],
        },
      ],
    });

    const modifiedHtmlCode = response.text || currentHtmlCode;

    // Extract title from modified HTML if possible
    const titleMatch = modifiedHtmlCode.match(/<title>(.*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : undefined;

    return {
      htmlCode: modifiedHtmlCode,
      title,
    };
  } catch (error) {
    console.error("AI portfolio modification error:", error);
    throw new Error("Failed to modify portfolio");
  }
}
