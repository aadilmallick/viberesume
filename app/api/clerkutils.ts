import { createClerkClient } from "@clerk/backend";

export function verifyEnvironmentVariable(key: string) {
  if (!process.env[key]) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return process.env[key];
}

const clerkSecretKey = verifyEnvironmentVariable("CLERK_SECRET_KEY");
const clerkPublishableKey = verifyEnvironmentVariable(
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
);

const clerk = createClerkClient({
  secretKey: clerkSecretKey,
  publishableKey: clerkPublishableKey,
});

export async function getUserByClerkId(clerkId: string) {
  const user = await clerk.users.getUser(clerkId);
  return user;
}
