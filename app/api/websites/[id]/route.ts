import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { CloudDatabase } from "@/db/CloudDatabase";
import { editCodeSummary } from "@/dal/ai";

// DELETE /api/websites/[id] - Delete a website
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const websiteId = parseInt(id);
    if (isNaN(websiteId)) {
      return NextResponse.json(
        { error: "Invalid website ID" },
        { status: 400 }
      );
    }

    // Get user from database
    const user = await CloudDatabase.getUserByClerkId(clerkId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify website exists and belongs to user
    const websites = await CloudDatabase.getWebsitesByUserId(user.id);
    const website = websites.find((w) => w.id === websiteId);

    if (!website) {
      return NextResponse.json(
        { error: "Website not found or unauthorized" },
        { status: 404 }
      );
    }

    // Delete the website
    await CloudDatabase.deleteWebsite(websiteId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Website deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete website" },
      { status: 500 }
    );
  }
}

// PATCH /api/websites/[id] - Update website slug
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const websiteId = parseInt(id);
    if (isNaN(websiteId)) {
      return NextResponse.json(
        { error: "Invalid website ID" },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { slug } = body;

    if (!slug || typeof slug !== "string") {
      return NextResponse.json(
        { error: "Valid slug is required" },
        { status: 400 }
      );
    }

    // Validate slug format (alphanumeric, hyphens, underscores only)
    const slugRegex = /^[a-zA-Z0-9-_]+$/;
    if (!slugRegex.test(slug)) {
      return NextResponse.json(
        {
          error:
            "Slug can only contain letters, numbers, hyphens, and underscores",
        },
        { status: 400 }
      );
    }

    // Get user from database
    const user = await CloudDatabase.getUserByClerkId(clerkId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify website exists and belongs to user
    const websites = await CloudDatabase.getWebsitesByUserId(user.id);
    const website = websites.find((w) => w.id === websiteId);

    if (!website) {
      return NextResponse.json(
        { error: "Website not found or unauthorized" },
        { status: 404 }
      );
    }

    // Check if slug is already taken
    const existingWebsite = await CloudDatabase.getWebsiteBySlug(slug);
    if (existingWebsite && existingWebsite.id !== websiteId) {
      return NextResponse.json(
        { error: "This slug is already taken" },
        { status: 409 }
      );
    }

    // Update the slug
    const updatedWebsite = await CloudDatabase.updateWebsiteSlug(
      websiteId,
      slug
    );

    return NextResponse.json({
      success: true,
      website: {
        id: updatedWebsite.id,
        slug: updatedWebsite.slug,
        url: `/sites/${updatedWebsite.slug}`,
      },
    });
  } catch (error) {
    console.error("Website update error:", error);
    return NextResponse.json(
      { error: "Failed to update website" },
      { status: 500 }
    );
  }
}

// PUT /api/websites/[id]/edit - Edit website content with AI
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;

    const websiteId = parseInt(id);
    if (isNaN(websiteId)) {
      return NextResponse.json(
        { error: "Invalid website ID" },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { modificationRequest } = body;

    if (!modificationRequest || typeof modificationRequest !== "string") {
      return NextResponse.json(
        { error: "Valid modification request is required" },
        { status: 400 }
      );
    }

    // Get user from database
    const user = await CloudDatabase.getUserByClerkId(clerkId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify website exists and belongs to user
    const websites = await CloudDatabase.getWebsitesByUserId(user.id);
    const website = websites.find((w) => w.id === websiteId);

    if (!website) {
      return NextResponse.json(
        { error: "Website not found or unauthorized" },
        { status: 404 }
      );
    }

    // Use AI to modify the portfolio
    const modificationResult = await editCodeSummary(
      website.code,
      modificationRequest
    );

    // Update the website with the modified code
    const updatedWebsite = await CloudDatabase.updateWebsiteCodeByID(
      websiteId,
      modificationResult.htmlCode
    );

    return NextResponse.json({
      success: true,
      website: {
        id: updatedWebsite.id,
        slug: updatedWebsite.slug,
        title: modificationResult.title,
        updated_at: updatedWebsite.updated_at,
      },
    });
  } catch (error) {
    console.error("Website modification error:", error);
    return NextResponse.json(
      { error: "Failed to modify website" },
      { status: 500 }
    );
  }
}
