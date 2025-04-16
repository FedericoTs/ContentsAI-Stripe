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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import {
  Search,
  Plus,
  Rss,
  Globe,
  RefreshCw,
  ExternalLink,
  Info,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getCuratedRssFeeds } from "@/lib/rss-service";

interface RssFeedDiscoveryProps {
  onSelectFeed: (url: string) => void;
  onClose: () => void;
}

const RssFeedDiscovery: React.FC<RssFeedDiscoveryProps> = ({
  onSelectFeed,
  onClose,
}) => {
  const { toast } = useToast();
  const [curatedFeeds, setCuratedFeeds] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Fetch curated feeds on component mount
  useEffect(() => {
    fetchCuratedFeeds();
  }, []);

  // Fetch curated feeds
  const fetchCuratedFeeds = () => {
    setIsLoading(true);
    try {
      const { success, data, error } = getCuratedRssFeeds();
      if (success && data) {
        setCuratedFeeds(data);
      } else {
        console.error("Error fetching curated feeds:", error);
        toast({
          title: "Error",
          description: "Failed to load curated RSS feeds",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching curated feeds:", error);
      toast({
        title: "Error",
        description: "Failed to load curated RSS feeds",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle feed selection
  const handleSelectFeed = (url: string) => {
    onSelectFeed(url);
    onClose();
  };

  // Filter feeds based on search query and selected category
  const filteredFeeds = curatedFeeds
    .filter(
      (category) => !selectedCategory || category.category === selectedCategory,
    )
    .map((category) => ({
      ...category,
      feeds: category.feeds.filter(
        (feed: any) =>
          !searchQuery ||
          feed.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          feed.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          feed.url.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((category) => category.feeds.length > 0);

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gray-900/50 border-gray-800">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-400" />
              Discover RSS Feeds
            </CardTitle>
            <CardDescription>
              Browse and select from our curated list of RSS feeds
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search feeds..."
              className="pl-10 bg-gray-800 border-gray-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Category tabs */}
        <Tabs
          defaultValue="all"
          className="w-full"
          onValueChange={(value) =>
            setSelectedCategory(value === "all" ? null : value)
          }
        >
          <ScrollArea className="w-full">
            <TabsList className="bg-gray-800 border border-gray-700 h-10 p-1 w-full flex overflow-x-auto">
              <TabsTrigger value="all" className="px-3 py-1 h-8 flex-shrink-0">
                All Categories
              </TabsTrigger>
              {curatedFeeds.map((category) => (
                <TabsTrigger
                  key={category.category}
                  value={category.category}
                  className="px-3 py-1 h-8 flex-shrink-0"
                >
                  {category.category}
                </TabsTrigger>
              ))}
            </TabsList>
          </ScrollArea>
        </Tabs>

        {/* Feeds list */}
        {isLoading ? (
          <div className="text-center py-8">
            <RefreshCw className="h-8 w-8 mx-auto animate-spin text-gray-400" />
            <p className="mt-2 text-gray-400">Loading feeds...</p>
          </div>
        ) : filteredFeeds.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-gray-700 rounded-md">
            <Search className="h-8 w-8 mx-auto text-gray-400" />
            <p className="mt-2 text-gray-400">No feeds found</p>
            <p className="text-sm text-gray-500">
              Try adjusting your search query
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-6">
              {filteredFeeds.map((category) => (
                <div key={category.category} className="space-y-2">
                  {!selectedCategory && (
                    <h3 className="text-lg font-medium text-white/90 flex items-center gap-2">
                      <Badge variant="outline">{category.category}</Badge>
                    </h3>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {category.feeds.map((feed: any, index: number) => (
                      <div
                        key={`${category.category}-${index}`}
                        className="p-3 rounded-md border border-gray-800 bg-gray-900/70 hover:bg-gray-800/70 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium text-white flex items-center gap-2">
                              <Rss className="h-4 w-4 text-blue-400" />
                              {feed.title}
                            </h4>
                            <p className="text-sm text-gray-400 line-clamp-2 mt-1">
                              {feed.description}
                            </p>
                            <div className="flex items-center mt-2 gap-2">
                              <Button
                                variant="default"
                                size="sm"
                                className="h-8"
                                onClick={() => handleSelectFeed(feed.url)}
                              >
                                <Plus className="h-3.5 w-3.5 mr-1.5" />
                                Add Feed
                              </Button>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() =>
                                        window.open(feed.url, "_blank")
                                      }
                                    >
                                      <ExternalLink className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Open feed URL</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => {
                                        navigator.clipboard.writeText(feed.url);
                                        toast({
                                          title: "URL Copied",
                                          description:
                                            "Feed URL copied to clipboard",
                                        });
                                      }}
                                    >
                                      <Info className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Copy feed URL</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t border-gray-800 pt-4">
        <p className="text-sm text-gray-400">
          {filteredFeeds.reduce(
            (total, category) => total + category.feeds.length,
            0,
          )}{" "}
          feeds found
        </p>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RssFeedDiscovery;
