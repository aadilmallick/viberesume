import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">VR</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            Portfolio Not Found
          </h1>
          <p className="text-slate-600">
            The portfolio you're looking for doesn't exist or may have been removed.
          </p>
        </div>

        <div className="space-y-3">
          <Link href="/">
            <Button className="w-full">
              Visit VibeResume
            </Button>
          </Link>

          <Link href="/dashboard">
            <Button variant="outline" className="w-full">
              Go to Dashboard
            </Button>
          </Link>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-200">
          <p className="text-sm text-slate-500">
            Want to create your own portfolio?{" "}
            <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
              Get started with VibeResume
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}