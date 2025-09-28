import { auth } from "@clerk/nextjs/server";
import { CloudDatabase } from "@/db/CloudDatabase";
import { Website } from "@/lib/types";
import { PortfolioCard } from "./PortfolioCard";
import { redirect } from "next/navigation";
// export default function PortfoliosList() {
//   const [websites, setWebsites] = useState<Website[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchWebsites = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch("/api/websites");
//       if (!response.ok) {
//         throw new Error("Failed to fetch portfolios");
//       }
//       const data = await response.json();
//       setWebsites(data.websites || []);
//     } catch (error) {
//       console.error("Error fetching portfolios:", error);
//       setError("Error loading portfolios. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchWebsites();
//   }, []);

//   if (loading) {
//     return (
//       <div className="text-center py-8 text-slate-500">
//         <p>Loading portfolios...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center py-8 text-red-500">
//         <p>{error}</p>
//       </div>
//     );
//   }

//   if (websites.length === 0) {
//     return (
//       <div className="text-center py-8 text-slate-500">
//         <p>No portfolios created yet. Upload your resume to get started!</p>
//       </div>
//     );
//   }

//   return (
//     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//       {websites.map((website) => (
//         <PortfolioCard
//           key={website.id}
//           website={website}
//           onUpdate={fetchWebsites}
//         />
//       ))}
//     </div>
//   );
// }
export async function PortfoliosList() {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return redirect("/");
  }

  try {
    // Get user from database
    const user = await CloudDatabase.getUserByClerkId(clerkId);

    if (!user) {
      return (
        <div className="text-center py-8 text-slate-500">
          <p>No portfolios created yet. Upload your resume to get started!</p>
        </div>
      );
    }

    // Get user's websites
    const websites = await CloudDatabase.getWebsitesByUserId(user.id);

    if (websites.length === 0) {
      return (
        <div className="text-center py-8 text-slate-500">
          <p>No portfolios created yet. Upload your resume to get started!</p>
        </div>
      );
    }

    return (
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {websites.map((website) => (
          <PortfolioCard key={website.id} website={website} />
        ))}
      </div>
    );
  } catch (error) {
    console.error("Error fetching portfolios:", error);
    return (
      <div className="text-center py-8 text-red-500">
        <p>Error loading portfolios. Please try again.</p>
      </div>
    );
  }
}
