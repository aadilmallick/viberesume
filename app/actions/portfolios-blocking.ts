"use server";

import { auth } from "@clerk/nextjs/server";
import { PortfoliosBlockingStrategy, getIsPro } from "@/dal/payments";

interface BlockingResult {
  shouldBlock: boolean;
  reason?: string;
  limit?: number;
  currentCount?: number;
}

export async function checkPortfoliosBlocking(): Promise<BlockingResult> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        shouldBlock: true,
        reason: "User not authenticated"
      };
    }

    // Check if user is pro - pro users bypass portfolio limits
    const isPro = await getIsPro(userId);
    if (isPro) {
      return {
        shouldBlock: false,
        reason: "Pro user - unlimited portfolios"
      };
    }

    // For free users, check portfolio limit
    const blockingStrategy = new PortfoliosBlockingStrategy();
    const shouldBlock = await blockingStrategy.shouldBlock(userId);

    if (shouldBlock) {
      return {
        shouldBlock: true,
        reason: `Portfolio limit reached`,
        limit: blockingStrategy.limit
      };
    }

    return {
      shouldBlock: false,
      reason: "Portfolio count within limits"
    };

  } catch (error) {
    console.error("Error checking portfolios blocking:", error);
    return {
      shouldBlock: true,
      reason: "Error checking portfolio limits"
    };
  }
}