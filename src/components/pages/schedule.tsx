import React from "react";
import TopNavigation from "../dashboard/layout/TopNavigation";
import Sidebar from "../dashboard/layout/Sidebar";
import ActivityFeed from "../dashboard/ActivityFeed";
import { ContentScheduler } from "../content/ContentScheduler";

const Schedule = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <TopNavigation />
      <div className="flex pt-16">
        <Sidebar activeItem="Calendar" />

        <main className="flex-1 overflow-auto p-6">
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg">
            <ContentScheduler />
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

export default Schedule;
