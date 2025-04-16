import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import {
  RefreshCw,
  ExternalLink,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Calendar,
  User,
  Tag,
  ArrowLeft,
  Search,
  Filter,
} from "lucide-react";
import {
  getFeedArticles,
  getAllUserArticles,
  markArticleAsRead,
  saveArticle,
} from "@/lib/rss-service";

interface RssArticleReaderProps {
  feedId: string | null;
  onBack?: () => void;
}

const RssArticleReader: React.FC<RssArticleReaderProps> = ({
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
        // Select the first article if none is selected
        if (!selectedArticle && data.length > 0) {
          setSelectedArticle(data[0]);
          // Mark the first article as read
          await markArticleAsRead(data[0].id);
        }
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
        // Select the first article if none is selected
        if (!selectedArticle && data.length > 0) {
          setSelectedArticle(data[0]);
          // Mark the first article as read
          await markArticleAsRead(data[0].id);
        }
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

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Articles list */}
      <div className="lg:col-span-1 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {onBack && (
              <Button
                variant="ghost"
                size="sm"
                className="mr-2"
                onClick={onBack}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            )}
            <h2 className="text-xl font-semibold">
              {feedId ? "Feed Articles" : "All Articles"}
            </h2>
          </div>
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

        {/* Search and filters */}
        <div className="space-y-2">
          <div className="relative">
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

        <ScrollArea className="h-[calc(100vh-300px)]">
          {isLoading && articles.length === 0 ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 mx-auto animate-spin text-gray-400" />
              <p className="mt-2 text-gray-400">Loading articles...</p>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-gray-700 rounded-md">
              <Search className="h-8 w-8 mx-auto text-gray-400" />
              <p className="mt-2 text-gray-400">No articles found</p>
              <p className="text-sm text-gray-500">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredArticles.map((article) => (
                <div
                  key={article.id}
                  className={`p-3 rounded-md border ${selectedArticle?.id === article.id ? "bg-gray-800/70 border-purple-500/50" : "bg-gray-900/50 border-gray-800 hover:bg-gray-800/50"} cursor-pointer transition-colors`}
                  onClick={() => handleSelectArticle(article)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3
                        className={`font-medium ${article.read ? "text-gray-400" : "text-white"}`}
                      >
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-400 line-clamp-2">
                        {article.description}
                      </p>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(article.published_at)}
                        {article.author && (
                          <span className="ml-2 flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {article.author}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 ${article.saved ? "text-yellow-500" : "text-gray-400 hover:text-yellow-500"}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSaveArticle(article, !article.saved);
                      }}
                    >
                      {article.saved ? (
                        <BookmarkCheck className="h-4 w-4" />
                      ) : (
                        <Bookmark className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Article content */}
      <div className="lg:col-span-2">
        {selectedArticle ? (
          <Card className="bg-gray-900/50 border-gray-800 h-full">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{selectedArticle.title}</CardTitle>
                  <CardDescription className="mt-1">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(selectedArticle.published_at)}
                      {selectedArticle.author && (
                        <span className="ml-3 flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {selectedArticle.author}
                        </span>
                      )}
                    </div>
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 ${selectedArticle.saved ? "text-yellow-500" : "text-gray-400 hover:text-yellow-500"}`}
                    onClick={() =>
                      handleSaveArticle(selectedArticle, !selectedArticle.saved)
                    }
                  >
                    {selectedArticle.saved ? (
                      <BookmarkCheck className="h-4 w-4" />
                    ) : (
                      <Bookmark className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8"
                    onClick={() => window.open(selectedArticle.link, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Original
                  </Button>
                </div>
              </div>

              {/* AI Categories and Summary */}
              {(selectedArticle.ai_categories?.length > 0 ||
                selectedArticle.ai_summary) && (
                <div className="mt-2 p-3 bg-purple-900/20 rounded-md border border-purple-500/20">
                  {selectedArticle.ai_summary && (
                    <p className="text-sm text-gray-300 mb-2">
                      {selectedArticle.ai_summary}
                    </p>
                  )}
                  {selectedArticle.ai_categories?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {selectedArticle.ai_categories.map(
                        (category: string, index: number) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs border-purple-500/30 text-purple-300"
                          >
                            <Tag className="h-3 w-3 mr-1" />
                            {category}
                          </Badge>
                        ),
                      )}
                    </div>
                  )}
                </div>
              )}

              <Separator className="my-2" />
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-350px)]">
                {selectedArticle.content ? (
                  <div
                    className="prose prose-invert max-w-none prose-img:rounded-md prose-a:text-blue-400"
                    dangerouslySetInnerHTML={{
                      __html: selectedArticle.content,
                    }}
                  />
                ) : (
                  <div className="prose prose-invert max-w-none">
                    <p>{selectedArticle.description}</p>
                    <p className="text-gray-400 mt-4">
                      This article doesn't have full content. Click "Open
                      Original" to read the complete article.
                    </p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
            <CardFooter className="pt-2">
              <div className="flex flex-wrap gap-1">
                {selectedArticle.categories?.map(
                  (category: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {category}
                    </Badge>
                  ),
                )}
              </div>
            </CardFooter>
          </Card>
        ) : (
          <div className="h-full flex items-center justify-center border border-dashed border-gray-700 rounded-md">
            <div className="text-center p-8">
              <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-300">
                No Article Selected
              </h3>
              <p className="text-gray-400 mt-2">
                Select an article from the list to view its content
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RssArticleReader;
