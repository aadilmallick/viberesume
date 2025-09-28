"use client";
import React from "react";
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
import { useSidebarStore } from "@/store/sidebarStore";
import { cn } from "@/lib/utils";

export const DashboardSidebar = () => {
  const { isOpen, closeSidebar } = useSidebarStore();

  const MobileOverlay = () => (
    <div
      className={cn(
        "fixed inset-0 bg-black/50 z-40 md:hidden",
        isOpen ? "block" : "hidden"
      )}
      onClick={closeSidebar}
    />
  );

  return (
    <>
      <MobileOverlay />
      <div
        className={cn(
          "w-64 min-h-screen bg-white border-r border-slate-200 shadow-sm",
          "fixed inset-y-0 left-0 z-50 md:block",
          "transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">VR</span>
            </div>
            <h1 className="text-xl font-bold text-slate-800">VibeResume</h1>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            <a
              href="/dashboard"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 font-medium"
            >
              <span>📄</span>
              <span>Dashboard</span>
            </a>
          </nav>
        </div>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 w-64 p-6 border-t border-slate-200">
          <div className="space-y-3">
            {/* Settings Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-slate-600"
                >
                  <Settings className="w-4 h-4 mr-3" />
                  Settings
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Settings</DialogTitle>
                  <DialogDescription>
                    Manage your account settings and preferences.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-sm text-slate-600">
                    Settings panel coming soon...
                  </p>
                </div>
              </DialogContent>
            </Dialog>

            {/* User Button */}
            <div className="flex items-center justify-between">
              <UserButton afterSignOutUrl="/" />
              <span className="text-sm text-slate-500">Account</span>
            </div>
            <SignOutButton>
              <Button
                variant="ghost"
                className="w-full justify-start text-slate-600"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Sign Out
              </Button>
            </SignOutButton>
          </div>
        </div>
      </div>
    </>
  );
};