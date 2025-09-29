import { createClerkClient, User } from "@clerk/backend";
import { cache } from "react";

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

export const getUserByClerkId = cache(async (clerkId: string) => {
  const user = await clerk.users.getUser(clerkId);
  return user;
});

export const getEmailAddressFromUser = cache((user: User) => {
  return (
    user.primaryEmailAddress?.emailAddress ||
    user.emailAddresses[0].emailAddress
  );
});

export const getEmailAddressFromClerkId = cache(async (clerkId: string) => {
  const user = await getUserByClerkId(clerkId);
  if (!user) {
    throw new Error("User not found, auth error in getEmailAddressFromClerkId");
  }
  return getEmailAddressFromUser(user);
});
