"use server";

import { auth } from "@clerk/nextjs/server";
import { AIUsageBlockingStrategy, getIsPro } from "@/dal/payments";

interface BlockingResult {
  shouldBlock: boolean;
  reason?: string;
  limit?: number;
  currentUsage?: number;
}

export async function checkAIUsageBlocking(): Promise<BlockingResult> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        shouldBlock: true,
        reason: "User not authenticated"
      };
    }

    // Check if user is pro - pro users bypass AI usage limits
    const isPro = await getIsPro(userId);
    if (isPro) {
      return {
        shouldBlock: false,
        reason: "Pro user - unlimited AI usage"
      };
    }

    // For free users, check AI usage limit
    const blockingStrategy = new AIUsageBlockingStrategy();
    const shouldBlock = await blockingStrategy.shouldBlock(userId);

    if (shouldBlock) {
      return {
        shouldBlock: true,
        reason: `AI usage limit reached`,
        limit: blockingStrategy.limit
      };
    }

    return {
      shouldBlock: false,
      reason: "AI usage within limits"
    };

  } catch (error) {
    console.error("Error checking AI usage blocking:", error);
    return {
      shouldBlock: true,
      reason: "Error checking AI usage limits"
    };
  }
}