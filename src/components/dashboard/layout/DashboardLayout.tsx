import React from "react";
import { Outlet } from "react-router-dom";
import TopNavigation from "./TopNavigation";
import Sidebar from "./Sidebar";
import ActivityFeed from "../ActivityFeed";

interface DashboardLayoutProps {
  activeItem?: string;
}

const DashboardLayout = ({ activeItem }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-black text-white">
      <TopNavigation />

      <div className="flex pt-16">
        <Sidebar activeItem={activeItem} />

        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>

        <div className="w-[280px] border-l border-white/10 bg-black/40 backdrop-blur-md">
          <div className="p-4">
            <ActivityFeed />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
