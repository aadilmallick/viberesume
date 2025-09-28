import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { CloudDatabase } from "@/db/CloudDatabase";
import { generatePortfolioFromPDF } from "@/dal/ai";
// import { nanoid } from "nanoid";
import { getUserByClerkId } from "../clerkutils";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the uploaded PDF from form data
    const formData = await request.formData();
    const pdfFile = formData.get("pdf") as File;

    if (!pdfFile) {
      return NextResponse.json(
        { error: "No PDF file provided" },
        { status: 400 }
      );
    }

    if (pdfFile.type !== "application/pdf") {
      return NextResponse.json(
        { error: "File must be a PDF" },
        { status: 400 }
      );
    }

    // // Convert file to buffer
    // const bytes = await pdfFile.arrayBuffer();
    // const buffer = Buffer.from(bytes);

    const userFromClerk = await getUserByClerkId(clerkId);

    // Get or create user in database
    const user = await CloudDatabase.getOrCreateUser({
      clerk_id: clerkId,
      email: userFromClerk.emailAddresses[0].emailAddress,
    });

    // Generate portfolio using AI
    const portfolioResult = await generatePortfolioFromPDF(
      pdfFile,
      pdfFile.type
    );

    // Generate unique slug
    // const slug = nanoid(10); // Generates a 10-character random string
    const slug = crypto.randomUUID();

    // Save website to database
    const website = await CloudDatabase.addWebsite({
      user_id: user.id,
      slug,
      code: portfolioResult.htmlCode,
    });

    return NextResponse.json({
      success: true,
      website: {
        id: website.id,
        slug: website.slug,
        url: `/sites/${website.slug}`,
      },
    });
  } catch (error) {
    console.error("Website generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate portfolio website" },
      { status: 500 }
    );
  }
}
