import { UserButton, SignOutButton } from "@clerk/nextjs";
import { Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DashboardSidebar } from "./components/DashboardSidebar";
import { DashboardHeader } from "./components/DashboardHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="flex">
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Main content */}
        <div className="flex-1 flex flex-col md:ml-0">
          {/* Mobile header with hamburger */}
          <DashboardHeader />
          
          {/* Page content */}
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
