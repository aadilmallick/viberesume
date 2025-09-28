import { auth } from "@clerk/nextjs/server";
import { CloudDatabase } from "@/db/CloudDatabase";
import { Website } from "@/lib/types";
import { PortfolioCard } from "./PortfolioCard";
import { redirect } from "next/navigation";

export async function PortfoliosList() {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return redirect("/");
  }

  try {
    // Get user from database
    const user = await CloudDatabase.getUserByClerkId(clerkId);

    if (!user) {
      return (
        <div className="text-center py-8 text-slate-500">
          <p>No portfolios created yet. Upload your resume to get started!</p>
        </div>
      );
    }

    // Get user's websites
    const websites = await CloudDatabase.getWebsitesByUserId(user.id);

    if (websites.length === 0) {
      return (
        <div className="text-center py-8 text-slate-500">
          <p>No portfolios created yet. Upload your resume to get started!</p>
        </div>
      );
    }

    return (
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {websites.map((website) => (
          <PortfolioCard key={website.id} website={website} />
        ))}
      </div>
    );
  } catch (error) {
    console.error("Error fetching portfolios:", error);
    return (
      <div className="text-center py-8 text-red-500">
        <p>Error loading portfolios. Please try again.</p>
      </div>
    );
  }
}
