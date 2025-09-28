"use client";

import { DashboardSidebar } from "./components/DashboardSidebar";
import HamburgerButton from "./components/HamburgerButton";
import { useSidebarStore } from "@/store/sidebarStore";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen, toggleSidebar } = useSidebarStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 relative">
      <DashboardSidebar />
      <div className="md:pl-64">
        <header className="md:hidden sticky top-0 bg-white/80 backdrop-blur-sm z-30 shadow-sm flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">VR</span>
            </div>
            <h1 className="text-lg font-bold text-slate-800">VibeResume</h1>
          </div>
          <HamburgerButton
            isOpen={isOpen}
            onClick={toggleSidebar}
            className="text-slate-700"
          />
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}