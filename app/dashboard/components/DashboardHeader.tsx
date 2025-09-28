"use client";

import React from "react";
import { useSidebarStore } from "@/store/sidebarStore";
import HamburgerButton from "./HamburgerButton";

export const DashboardHeader = () => {
  const { isOpen, toggleSidebar } = useSidebarStore();

  return (
    <header className="md:hidden bg-white border-b border-slate-200 shadow-sm p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <HamburgerButton
            isOpen={isOpen}
            onClick={toggleSidebar}
            ariaLabel={isOpen ? "Close sidebar" : "Open sidebar"}
            className="text-slate-600"
          />
          
          {/* Logo for mobile header */}
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xs">VR</span>
            </div>
            <h1 className="text-lg font-bold text-slate-800">VibeResume</h1>
          </div>
        </div>
      </div>
    </header>
  );
};