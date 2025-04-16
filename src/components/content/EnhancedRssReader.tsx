import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  RefreshCw,
  Search,
  BookOpen,
  BookmarkCheck,
  ArrowLeft,
  Filter,
  LayoutGrid,
  List,
} from "lucide-react";
import ArticleGrid from "./ArticleGrid";
import ArticleView from "./ArticleView";
import {
  getFeedArticles,
  getAllUserArticles,
  markArticleAsRead,
  saveArticle,
} from "@/lib/rss-service";
import { useToast } from "@/components/ui/use-toast";

interface EnhancedRssReaderProps {
  feedId: string | null;
  onBack?: () => void;
}

const EnhancedRssReader: React.FC<EnhancedRssReaderProps> = ({
  feedId,
  onBack,
}) => {
  const { toast } = useToast();
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "detail">("grid");
  const [selectedArticleIndex, setSelectedArticleIndex] = useState<number>(-1);

  // Fetch articles when feedId changes
  useEffect(() => {
    if (feedId) {
      fetchArticles(feedId);
    } else {
      fetchAllArticles();
    }
  }, [feedId]);

  // Fetch articles for a specific feed
  const fetchArticles = async (feedId: string) => {
    setIsLoading(true);
    try {
      const { success, data, error } = await getFeedArticles(feedId);
      if (success && data) {
        setArticles(data);
        // Reset selected article
        setSelectedArticle(null);
        setSelectedArticleIndex(-1);
      } else {
        console.error("Error fetching articles:", error);
        toast({
          title: "Error",
          description: "Failed to fetch articles",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
      toast({
        title: "Error",
        description: "Failed to fetch articles",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all articles for the user
  const fetchAllArticles = async () => {
    setIsLoading(true);
    try {
      const { success, data, error } = await getAllUserArticles();
      if (success && data) {
        setArticles(data);
        // Reset selected article
        setSelectedArticle(null);
        setSelectedArticleIndex(-1);
      } else {
        console.error("Error fetching articles:", error);
        toast({
          title: "Error",
          description: "Failed to fetch articles",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
      toast({
        title: "Error",
        description: "Failed to fetch articles",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle article selection
  const handleSelectArticle = async (article: any) => {
    setSelectedArticle(article);
    setViewMode("detail");

    // Find the index of the selected article in the filtered list
    const index = filteredArticles.findIndex((a) => a.id === article.id);
    setSelectedArticleIndex(index);

    // Mark the article as read
    if (!article.read) {
      try {
        await markArticleAsRead(article.id);
        // Update the article in the list
        setArticles((prevArticles) =>
          prevArticles.map((a) =>
            a.id === article.id ? { ...a, read: true } : a,
          ),
        );
      } catch (error) {
        console.error("Error marking article as read:", error);
      }
    }
  };

  // Handle saving/unsaving an article
  const handleSaveArticle = async (article: any, isSaved: boolean) => {
    try {
      await saveArticle(article.id, isSaved);
      // Update the article in the list
      setArticles((prevArticles) =>
        prevArticles.map((a) =>
          a.id === article.id ? { ...a, saved: isSaved } : a,
        ),
      );
      // Update the selected article if it's the one being saved/unsaved
      if (selectedArticle && selectedArticle.id === article.id) {
        setSelectedArticle({ ...selectedArticle, saved: isSaved });
      }

      toast({
        title: isSaved ? "Article Saved" : "Article Unsaved",
        description: isSaved
          ? "The article has been saved to your bookmarks"
          : "The article has been removed from your bookmarks",
      });
    } catch (error) {
      console.error("Error saving article:", error);
      toast({
        title: "Error",
        description: "Failed to save article",
        variant: "destructive",
      });
    }
  };

  // Navigate to next article
  const handleNextArticle = () => {
    if (selectedArticleIndex < filteredArticles.length - 1) {
      const nextIndex = selectedArticleIndex + 1;
      handleSelectArticle(filteredArticles[nextIndex]);
    }
  };

  // Navigate to previous article
  const handlePreviousArticle = () => {
    if (selectedArticleIndex > 0) {
      const prevIndex = selectedArticleIndex - 1;
      handleSelectArticle(filteredArticles[prevIndex]);
    }
  };

  // Filter articles based on search query and filters
  const filteredArticles = articles.filter((article) => {
    // Search filter
    const matchesSearch =
      !searchQuery ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Unread filter
    const matchesUnread = !showUnreadOnly || !article.read;

    // Saved filter
    const matchesSaved = !showSavedOnly || article.saved;

    return matchesSearch && matchesUnread && matchesSaved;
  });

  return (
    <div className="space-y-6">
      {/* Header with back button and refresh */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {onBack && (
            <Button
              variant="ghost"
              size="sm"
              className="mr-2"
              onClick={() => {
                onBack();
                setViewMode("grid");
              }}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Feeds
            </Button>
          )}
          <h2 className="text-xl font-semibold">
            {feedId ? "Feed Articles" : "All Articles"}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="px-3"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "detail" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              if (selectedArticle || filteredArticles.length > 0) {
                setViewMode("detail");
                if (!selectedArticle && filteredArticles.length > 0) {
                  handleSelectArticle(filteredArticles[0]);
                }
              }
            }}
            className="px-3"
            disabled={filteredArticles.length === 0}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              feedId ? fetchArticles(feedId) : fetchAllArticles()
            }
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search articles..."
            className="pl-10 bg-gray-800 border-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={showUnreadOnly ? "default" : "outline"}
            size="sm"
            className="text-xs h-8"
            onClick={() => setShowUnreadOnly(!showUnreadOnly)}
          >
            <BookOpen className="h-3 w-3 mr-1" />
            Unread Only
          </Button>
          <Button
            variant={showSavedOnly ? "default" : "outline"}
            size="sm"
            className="text-xs h-8"
            onClick={() => setShowSavedOnly(!showSavedOnly)}
          >
            <BookmarkCheck className="h-3 w-3 mr-1" />
            Saved Only
          </Button>
        </div>
      </div>

      {/* Content based on view mode */}
      {viewMode === "grid" ? (
        <ArticleGrid
          articles={filteredArticles}
          onSelectArticle={handleSelectArticle}
          onSaveArticle={handleSaveArticle}
          selectedArticle={selectedArticle}
          isLoading={isLoading}
        />
      ) : (
        <ArticleView
          article={
            selectedArticle ||
            (filteredArticles.length > 0 ? filteredArticles[0] : null)
          }
          onSave={handleSaveArticle}
          onNext={handleNextArticle}
          onPrevious={handlePreviousArticle}
          hasNext={selectedArticleIndex < filteredArticles.length - 1}
          hasPrevious={selectedArticleIndex > 0}
        />
      )}
    </div>
  );
};

export default EnhancedRssReader;
