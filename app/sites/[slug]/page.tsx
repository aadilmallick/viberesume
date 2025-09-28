import { CloudDatabase } from "@/db/CloudDatabase";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface PublicWebsitePageProps {
  params: {
    slug: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: PublicWebsitePageProps): Promise<Metadata> {
  const { slug } = params;

  try {
    const website = await CloudDatabase.getWebsiteBySlug(slug);

    if (!website) {
      return {
        title: "Portfolio Not Found - VibeResume",
        description: "The requested portfolio could not be found.",
      };
    }

    // Extract title and description from HTML if possible
    const titleMatch = website.code.match(/<title>(.*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : "Portfolio - VibeResume";

    // Try to extract meta description or use first paragraph
    const descMatch = website.code.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i) ||
                     website.code.match(/<p[^>]*>(.*?)<\/p>/i);
    const description = descMatch ? descMatch[1].replace(/<[^>]*>/g, '').slice(0, 160) :
                       "Professional portfolio created with VibeResume";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
        url: `/sites/${slug}`,
      },
      twitter: {
        card: "summary",
        title,
        description,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Portfolio - VibeResume",
      description: "Professional portfolio created with VibeResume",
    };
  }
}

export default async function PublicWebsitePage({
  params,
}: PublicWebsitePageProps) {
  const { slug } = params;

  try {
    // Fetch website by slug
    const website = await CloudDatabase.getWebsiteBySlug(slug);

    if (!website) {
      notFound();
    }

    return (
      <div className="min-h-screen">
        {/* Render the generated HTML portfolio */}
        <div
          dangerouslySetInnerHTML={{ __html: website.code }}
          className="w-full"
        />

        {/* Subtle VibeResume branding footer */}
        <div className="fixed bottom-4 right-4 z-50">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-full px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 transition-colors shadow-sm hover:shadow-md"
          >
            <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-[8px]">VR</span>
            </div>
            <span>Made with VibeResume</span>
          </a>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching website:", error);
    notFound();
  }
}