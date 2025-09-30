"use client";
import React, { useEffect, useState } from "react";
import { UserButton, SignOutButton } from "@clerk/nextjs";
import { Settings, LogOut, Crown, Zap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSidebarStore } from "@/store/sidebarStore";
import { useUserStatusStore } from "@/store/userStatusStore";
import { cn } from "@/lib/utils";
import HamburgerButton from "./HamburgerButton";
import { PaywallInfo } from "./Paywall";

export const DashboardSidebar = () => {
  const { isOpen, closeSidebar } = useSidebarStore();
  const [paywallOpen, setPaywallOpen] = useState(false);

  const { userStatus, loading, fetchUserStatus } = useUserStatusStore();

  useEffect(() => {
    if (!userStatus && !loading) {
      fetchUserStatus();
    }
  }, [userStatus, loading, fetchUserStatus]);

  const MobileOverlay = () => {
    return (
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40 md:hidden",
          isOpen ? "block" : "hidden"
        )}
        onClick={closeSidebar}
      />
    );
  };

  const UserStatusDisplay = () => {
    return (
      <div className="space-y-4">
        {userStatus && (
          <div className="bg-slate-50 rounded-lg p-3 border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">
                Plan Status
              </span>
              {userStatus.isPro ? (
                <Badge
                  variant="default"
                  className="bg-amber-100 text-amber-800 hover:bg-amber-100"
                >
                  <Crown className="w-3 h-3 mr-1" />
                  PRO
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="bg-slate-100 text-slate-600"
                >
                  <Zap className="w-3 h-3 mr-1" />
                  FREE
                </Badge>
              )}
            </div>
            <div className="space-y-1 p-1">
              {!userStatus.isPro && userStatus.aiUsage !== undefined && (
                <p className="text-xs text-slate-500">
                  AI Usage: {userStatus.aiUsage}/10 this month
                </p>
              )}
              {userStatus.portfolioCount !== undefined && (
                <p className="text-xs text-slate-500">
                  Portfolios: {userStatus.portfolioCount}
                  {!userStatus.isPro ? "/5" : ""}
                </p>
              )}
              {userStatus.isPro && (
                <p className="text-xs text-slate-500">
                  Unlimited AI usage & portfolios
                </p>
              )}
            </div>
            {!userStatus.isPro && (
              <div className="mt-3">
                <Button
                  onClick={() => setPaywallOpen(true)}
                  size="sm"
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                >
                  <Crown className="w-3 h-3 mr-1" />
                  Go Pro
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // if (!isOpen) {
  //   return null;
  // }

  return (
    <>
      <MobileOverlay />
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/*  main link logo */}
          <div className="hidden md:flex items-center space-x-2 p-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">VR</span>
            </div>
            <h1 className="text-lg font-bold text-slate-800">VibeResume</h1>
          </div>
          {/* <HamburgerButton
            isOpen={isOpen}
            onClick={toggleSidebar}
            className="text-slate-700"
          /> */}
          {/* Main content area */}
          <div className="flex-1 p-6">
            {loading ? (
              <div className="flex items-startjustify-center h-full">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            ) : (
              <UserStatusDisplay />
            )}
          </div>

          {/* Bottom section */}
          <div className="p-6 border-t border-slate-200">
            <div className="space-y-3">
              {/* User Button */}
              <div className="flex items-center gap-4">
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
            </div>
          </div>
        </div>
      </aside>
      <PaywallInfo
        message="Upgrade to PRO for unlimited AI usage and portfolios!"
        open={paywallOpen}
        setOpen={setPaywallOpen}
      />
    </>
  );
};
