import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import RssFeedTab from "../content/RssFeedTab";
import PersonalCollectionTab from "../content/PersonalCollectionTab";
import ApiAccessManager from "../content/ApiAccessManager";
import ContentTransformationTab from "../content/ContentTransformationTab";
import { Shield } from "lucide-react";

const Content = () => {
  const [activeTab, setActiveTab] = useState("transform"); // transform, rss, personal, api

  return (
    <>
      {/* Tabs for different content sections */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          variant={activeTab === "transform" ? "default" : "outline"}
          onClick={() => setActiveTab("transform")}
        >
          Content Transformation
        </Button>
        <Button
          variant={activeTab === "rss" ? "default" : "outline"}
          onClick={() => setActiveTab("rss")}
        >
          RSS Feeds
        </Button>
        <Button
          variant={activeTab === "personal" ? "default" : "outline"}
          onClick={() => setActiveTab("personal")}
        >
          Personal Collection
        </Button>
        <Button
          variant={activeTab === "api" ? "default" : "outline"}
          onClick={() => setActiveTab("api")}
          className="flex items-center gap-1"
        >
          <Shield className="h-4 w-4" />
          API Access
        </Button>
      </div>

      {/* RSS Feed Tab Content */}
      {activeTab === "rss" && <RssFeedTab />}

      {/* Personal Collection Tab Content */}
      {activeTab === "personal" && <PersonalCollectionTab />}

      {/* API Access Manager Tab Content */}
      {activeTab === "api" && <ApiAccessManager />}

      {/* Content Transformation Tab Content */}
      {activeTab === "transform" && <ContentTransformationTab />}
    </>
  );
};

export default Content;
