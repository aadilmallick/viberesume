import { SignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");
  return (
    <section className="bg-pattern-polka h-screen grid place-items-center">
      <SignIn forceRedirectUrl="/dashboard" afterSignOutUrl={"/"} />
    </section>
  );
}
