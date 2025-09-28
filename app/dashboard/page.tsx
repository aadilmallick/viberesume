import UploadResume from "./components/UploadResume";
import { PortfoliosList } from "./components/PortfoliosList";
import { Suspense } from "react";

export default function DashboardPage() {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Dashboard</h1>
          <p className="text-slate-600">
            Upload your resume to generate a beautiful portfolio website
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            Create New Portfolio
          </h2>
          <UploadResume />
        </div>

        {/* Existing Sites Section */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            Your Portfolios
          </h2>
          <Suspense
            fallback={
              <div className="text-center py-8 text-slate-500">
                <p>Loading portfolios...</p>
              </div>
            }
          >
            <PortfoliosList />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
