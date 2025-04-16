import React from "react";
import DashboardGrid from "../dashboard/DashboardGrid";
import TaskBoard from "../dashboard/TaskBoard";

const Dashboard = () => {
  return (
    <>
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
    </>
  );
};

export default Dashboard;
