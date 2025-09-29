import {
  getEmailAddressFromUser,
  getUserByClerkId,
  verifyEnvironmentVariable,
} from "@/app/api/clerkutils";
import { CloudDatabase } from "@/db/CloudDatabase";
import { auth } from "@clerk/nextjs/server";

const paymentKeys = {
  PRO_PLAN: "viberesume_pro",
};

const limits = {
  AI_USAGE_LIMIT: 10,
  PORTFOLIOS_LIMIT: 5,
};

interface BlockingStrategy {
  limit: number;
  name: string;
  shouldBlock: (clerkId: string) => Promise<boolean>;
  // onBlock: (clerkId: string) => void;
}

export class AIUsageBlockingStrategy implements BlockingStrategy {
  limit: number;
  name: string;
  // onBlock: (clerkId: string) => void;
  constructor() {
    this.limit = limits.AI_USAGE_LIMIT;
    this.name = "AI Usage";
    // this.onBlock = onBlock;
  }
  async shouldBlock(clerkId: string): Promise<boolean> {
    const aiUsage = await CloudDatabase.getOrCreateAIUsage({
      clerk_id: clerkId,
    });
    return aiUsage.usage >= this.limit;
  }
}

export class PortfoliosBlockingStrategy implements BlockingStrategy {
  limit: number;
  name: string;
  constructor() {
    this.limit = limits.PORTFOLIOS_LIMIT;
    this.name = "Portfolios";
  }
  async shouldBlock(clerkId: string): Promise<boolean> {
    const portfolios = await CloudDatabase.getPortfoliosCountByClerkId(clerkId);
    return portfolios >= this.limit;
  }
}

export async function getIsPro(clerkId: string) {
  const { has, userId } = await auth();
  if (!userId) {
    throw new Error("User not found, auth error in isPro");
  }
  const userFromClerk = await getUserByClerkId(userId);
  if (!userFromClerk) {
    throw new Error("User not found, auth error in isPro");
  }
  const emailAddress = getEmailAddressFromUser(userFromClerk);
  if (emailAddress === verifyEnvironmentVariable("ADMIN_EMAIL")) {
    return true;
  }
  const isPro = has({
    plan: paymentKeys.PRO_PLAN,
  });
  return isPro;
}

export async function incrementAIUsage(clerkId: string) {
  const user = await getUserByClerkId(clerkId);
  if (!user) {
    throw new Error("User not found, auth error in incrementAIUsage");
  }
  const isPro = await getIsPro(clerkId);
  if (isPro) {
    console.log("User is pro, skipping AI usage increment");
    return;
  }
  const aiUsage = await CloudDatabase.incrementAIUsage(clerkId, 1);
  return aiUsage;
}

export async function getAiUsage(clerkId: string) {
  const user = await getUserByClerkId(clerkId);
  if (!user) {
    throw new Error("User not found, auth error in getAiUsage");
  }
  const emailAddress = getEmailAddressFromUser(user);
  if (emailAddress === verifyEnvironmentVariable("ADMIN_EMAIL")) {
    return 0;
  }
  const isPro = await getIsPro(clerkId);
  if (isPro) {
    console.log("User is pro, skipping AI usage increment");
    return {
      status: "pro",
      usage: 0,
    };
  }
  const aiUsage = await CloudDatabase.getOrCreateAIUsage({
    clerk_id: clerkId,
    // user_id: user.id,
  });
  return {
    status: "free",
    usage: aiUsage?.usage || 0,
  };
}
