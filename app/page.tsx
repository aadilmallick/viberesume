import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/logo";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="relative min-h-dvh overflow-hidden">
      {/* Background glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-10%] h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,oklch(0.95_0.03_260)_0%,transparent_60%)] blur-2xl" />
        <div className="absolute right-[-10%] bottom-[-10%] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(ellipse_at_center,oklch(0.92_0.05_130)_0%,transparent_60%)] blur-2xl" />
      </div>

      {/* Nav */}
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <Logo />
        <div className="flex items-center gap-3">
          {/* <Link href="/sign-in"> */}

          <SignInButton forceRedirectUrl={"/dashboard"}>
            <Button variant="ghost">Sign in</Button>
          </SignInButton>
          {/* </Link> */}
          {/* <Link href="/sign-up"> */}
          {/* <Button className="shadow-[0_8px_30px_rgba(0,0,0,0.08)]">Get started</Button> */}
          <SignInButton forceRedirectUrl={"/dashboard"}>
            <Button className="shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
              Get started
            </Button>
          </SignInButton>
          {/* </Link> */}
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-20 pt-6">
        <div className="mx-auto max-w-3xl text-center">
          <Badge className="mb-4 animate-[fade-in_0.6s_ease-out]">
            AI-powered portfolio generator
          </Badge>
          <h1 className="animate-[fade-in-up_0.7s_ease-out] text-balance text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
            Turn your resume into a beautiful one-page portfolio
          </h1>
          <p className="mt-4 text-pretty text-base text-muted-foreground sm:text-lg">
            Upload a PDF. We extract your story and craft a clean, responsive
            site with Tailwind, ready to share in seconds.
          </p>
          <div className="mt-7 flex items-center justify-center gap-3">
            {/* <Link href="/sign-in">
              <Button size="lg" className="animate-[fade-in_0.8s_ease-out]">
                Sign in with Google or GitHub
              </Button>
            </Link> */}
            <SignInButton forceRedirectUrl={"/dashboard"}>
              <Button size="lg" className="animate-[fade-in_0.8s_ease-out]">
                Sign in with Google or GitHub
              </Button>
            </SignInButton>
            <Link href="#how-it-works">
              <Button size="lg" variant="outline" className="backdrop-blur">
                See how it works
              </Button>
            </Link>
          </div>
        </div>

        {/* Mock screenshot card */}
        <div className="mt-12">
          <Card className="mx-auto max-w-5xl border-border/60 bg-gradient-to-b from-card to-card/95 p-0 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6),_0_30px_60px_-30px_rgba(0,0,0,0.25)]">
            <CardHeader className="flex flex-row items-center justify-between border-b bg-secondary/50">
              <CardTitle className="text-base">Preview</CardTitle>
              <CardDescription>Your portfolio, generated</CardDescription>
            </CardHeader>
            <CardContent className="relative overflow-hidden">
              <div className="relative isolate mt-6 grid gap-6 rounded-xl bg-gradient-to-br from-white to-white/80 p-6 shadow-[inset_6px_6px_18px_rgba(0,0,0,0.06),_inset_-6px_-6px_18px_rgba(255,255,255,0.8)] dark:from-neutral-900 dark:to-neutral-900/80 dark:shadow-[inset_6px_6px_18px_rgba(0,0,0,0.35),_inset_-6px_-6px_18px_rgba(255,255,255,0.05)] md:grid-cols-2">
                <div className="space-y-3">
                  <div className="h-6 w-40 rounded-md bg-secondary animate-pulse" />
                  <div className="h-4 w-64 rounded-md bg-secondary/80" />
                  <div className="h-4 w-56 rounded-md bg-secondary/70 animate-pulse" />
                  <div className="mt-4 h-3 w-full rounded-md bg-secondary/60" />
                  <div className="h-3 w-[90%] rounded-md bg-secondary/60 animate-pulse" />
                  <div className="h-3 w-[75%] rounded-md bg-secondary/60 animate-pulse" />
                </div>
                <div className="relative">
                  <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-[radial-gradient(ellipse_at_center,oklch(0.92_0.05_260)_0%,transparent_70%)] blur-xl" />
                  <div className="aspect-video w-full overflow-hidden rounded-lg border bg-background shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
                    <Image
                      src="/images/viberesumeexample.jpg"
                      alt="Portfolio preview example"
                      fill
                      className="object-cover object-top rounded-lg hover:scale-105 transition-transform duration-150"
                      priority
                      // height={1324}
                      // width={916}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="mx-auto w-full max-w-6xl px-6 pb-24"
      >
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Upload your resume",
              desc: "AI will extract the essentials from your resume, crafting a beautiful portfolio just for you.",
            },
            {
              title: "AI crafts your site",
              desc: "Clean HTML + Tailwind, consistent typography, responsive by default.",
            },
            {
              title: "Share instantly",
              desc: "Hosted under a unique slug you can rename anytime.",
            },
          ].map((f, i) => (
            <Card
              key={i}
              className="group relative overflow-hidden bg-card/95 transition-transform will-change-transform hover:-translate-y-0.5"
            >
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="absolute -inset-20 bg-[radial-gradient(200px_200px_at_var(--x,50%)_var(--y,50%),oklch(0.97_0.03_260)_0%,transparent_60%)]" />
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{f.title}</CardTitle>
                <CardDescription>{f.desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <Logo className="opacity-80" />
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} vibe-resume
          </p>
          {/* <div className="flex gap-3">
            <SignInButton />
            <SignInButton />
          </div> */}
        </div>
      </footer>
    </main>
  );
}
