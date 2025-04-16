import React from "react";
import { ContentScheduler } from "../content/ContentScheduler";

const Schedule = () => {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Content Schedule</h1>
        <p className="text-white/70">
          Plan and manage your content publishing schedule.
        </p>
      </div>

      <div className="bg-gray-900/50 border border-gray-800 rounded-lg">
        <ContentScheduler />
      </div>
    </>
  );
};

export default Schedule;
