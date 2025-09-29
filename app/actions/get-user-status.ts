"use server";

import { auth } from "@clerk/nextjs/server";
import { getAiUsage, getIsPro } from "@/dal/payments";
import { CloudDatabase } from "@/db/CloudDatabase";

interface UserStatusResult {
  isPro: boolean;
  aiUsage?: number;
  portfolioCount?: number;
  status: "pro" | "free" | "error";
  error?: string;
}

// TODO: use cacheTag and revalidateTag
export async function getUserStatus(): Promise<UserStatusResult> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        isPro: false,
        status: "error",
        error: "User not authenticated",
      };
    }

    const isPro = await getIsPro(userId);
    const portfolioCount = await CloudDatabase.getPortfoliosCountByClerkId(
      userId
    );

    if (isPro) {
      return {
        isPro: true,
        status: "pro",
        portfolioCount,
      };
    }

    const aiUsageData = await getAiUsage(userId);

    return {
      isPro: false,
      status: "free",
      aiUsage: typeof aiUsageData === "object" ? aiUsageData.usage : 0,
      portfolioCount,
    };
  } catch (error) {
    console.error("Error getting user status:", error);
    return {
      isPro: false,
      status: "error",
      error: "Failed to get user status",
    };
  }
}
