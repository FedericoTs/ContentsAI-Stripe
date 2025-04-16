import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import RssFeedManager from "./RssFeedManager";
import EnhancedRssReader from "./EnhancedRssReader";
import FeedCategoryManager from "./FeedCategoryManager";
import ScheduledRefreshSettings from "./ScheduledRefreshSettings";

const RssFeedTab: React.FC = () => {
  const [selectedFeedId, setSelectedFeedId] = useState<string | null>(null);
  const [showArticles, setShowArticles] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleFeedSelect = (feedId: string | null) => {
    setSelectedFeedId(feedId);
    setShowArticles(!!feedId);
  };

  const handleBackToFeeds = () => {
    setShowArticles(false);
  };

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
  };

  if (showArticles) {
    return (
      <EnhancedRssReader feedId={selectedFeedId} onBack={handleBackToFeeds} />
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="feeds" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="feeds">Feeds</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="feeds" className="space-y-6">
          <RssFeedManager
            onFeedSelect={handleFeedSelect}
            selectedFeedId={selectedFeedId}
            selectedCategory={selectedCategory}
          />
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <FeedCategoryManager
            onCategorySelect={handleCategorySelect}
            selectedCategory={selectedCategory}
          />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <ScheduledRefreshSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RssFeedTab;
