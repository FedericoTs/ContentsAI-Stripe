import React from "react";
import TopNavigation from "../dashboard/layout/TopNavigation";
import Sidebar from "../dashboard/layout/Sidebar";
import DashboardGrid from "../dashboard/DashboardGrid";
import TaskBoard from "../dashboard/TaskBoard";
import ActivityFeed from "../dashboard/ActivityFeed";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <TopNavigation />

      <div className="flex pt-16">
        <Sidebar />

        <main className="flex-1 overflow-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">
              Welcome to Your Dashboard
            </h1>
            <p className="text-white/70">
              Manage your projects and tasks efficiently.
            </p>
          </div>

          <div className="space-y-8">
            <DashboardGrid />
            <TaskBoard />
          </div>
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

export default Dashboard;
