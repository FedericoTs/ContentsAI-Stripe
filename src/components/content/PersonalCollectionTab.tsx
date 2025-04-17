import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import EnhancedRssReader from "./EnhancedRssReader";
import ExternalContentManager from "./ExternalContentManager";
import PersonalCollectionImport from "./PersonalCollectionImport";

const PersonalCollectionTab: React.FC = () => {
  const [selectedFeedId, setSelectedFeedId] = useState<string | null>(null);
  const [showArticles, setShowArticles] = useState(false);
  const [showExternalContent, setShowExternalContent] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [activeTab, setActiveTab] = useState("rss");

  const handleFeedSelect = (feedId: string | null) => {
    setSelectedFeedId(feedId);
    setShowArticles(!!feedId);
  };

  const handleBackToFeeds = () => {
    setShowArticles(false);
  };

  const handleShowExternalContent = () => {
    setShowExternalContent(true);
  };

  const handleBackFromExternalContent = () => {
    setShowExternalContent(false);
  };

  const handleShowImport = () => {
    setShowImport(true);
  };

  const handleBackFromImport = () => {
    setShowImport(false);
  };

  const handleImportComplete = () => {
    // After import is complete, show the appropriate content view
    if (activeTab === "rss") {
      setShowImport(false);
    } else if (activeTab === "external") {
      setShowImport(false);
      setShowExternalContent(true);
    }
  };

  // Show RSS articles if selected
  if (showArticles) {
    return (
      <EnhancedRssReader feedId={selectedFeedId} onBack={handleBackToFeeds} />
    );
  }

  // Show external content if selected
  if (showExternalContent) {
    return (
      <ExternalContentManager
        onBack={handleBackFromExternalContent}
        showSavedOnly={true}
      />
    );
  }

  // Show import UI if selected
  if (showImport) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <button
            className="text-sm text-gray-400 hover:text-white flex items-center"
            onClick={handleBackFromImport}
          >
            ← Back to {activeTab === "rss" ? "RSS Feeds" : "External Content"}
          </button>
        </div>
        <PersonalCollectionImport onImportComplete={handleImportComplete} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="rss" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="rss">RSS Feeds</TabsTrigger>
          <TabsTrigger value="external">External Content</TabsTrigger>
        </TabsList>

        <TabsContent value="rss" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">RSS Feeds</h2>
            <button
              className="text-sm text-blue-500 hover:text-blue-400 flex items-center"
              onClick={handleShowImport}
            >
              + Add New Feed
            </button>
          </div>
          <EnhancedRssReader
            feedId={null}
            onBack={handleBackToFeeds}
            showSavedOnly={true}
          />
        </TabsContent>

        <TabsContent value="external" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">External Content</h2>
            <button
              className="text-sm text-blue-500 hover:text-blue-400 flex items-center"
              onClick={handleShowImport}
            >
              + Import New Content
            </button>
          </div>
          <ExternalContentManager showSavedOnly={true} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PersonalCollectionTab;
