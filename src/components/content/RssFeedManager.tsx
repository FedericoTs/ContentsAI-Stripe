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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import {
  RefreshCw,
  Plus,
  Trash2,
  Rss,
  Folder,
  Tag,
  AlertCircle,
  Check,
  X,
  Edit,
  Save,
  Globe,
  Compass,
} from "lucide-react";
import {
  addRssFeed,
  validateRssFeed,
  getUserFeeds,
  deleteFeed,
  refreshAllFeeds,
  getUserFeedCategories,
  addFeedCategory,
  updateFeedCategory,
  getCuratedRssFeeds,
} from "@/lib/rss-service";
import RssFeedDiscovery from "./RssFeedDiscovery";

interface RssFeedManagerProps {
  onFeedSelect?: (feedId: string | null) => void;
  selectedFeedId?: string | null;
  selectedCategory?: string | null;
}

const RssFeedManager: React.FC<RssFeedManagerProps> = ({
  onFeedSelect,
  selectedFeedId,
  selectedCategory,
}) => {
  const { toast } = useToast();
  const [feeds, setFeeds] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [newFeedUrl, setNewFeedUrl] = useState("");
  const [newFeedCategory, setNewFeedCategory] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [isUrlValid, setIsUrlValid] = useState<boolean | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#6366f1"); // Default indigo color
  const [addCategoryDialogOpen, setAddCategoryDialogOpen] = useState(false);
  const [discoveryDialogOpen, setDiscoveryDialogOpen] = useState(false);
  // Using the selectedCategory from props or defaulting to null
  const [internalSelectedCategory, setInternalSelectedCategory] = useState<
    string | null
  >(selectedCategory || null);

  // Fetch feeds and categories on component mount
  useEffect(() => {
    fetchFeeds();
    fetchCategories();
  }, []);

  // Fetch feeds from the database
  const fetchFeeds = async () => {
    setIsLoading(true);
    try {
      const { success, data, error } = await getUserFeeds();
      if (success && data) {
        setFeeds(data);
      } else {
        console.error("Error fetching feeds:", error);
        toast({
          title: "Error",
          description: "Failed to fetch RSS feeds",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching feeds:", error);
      toast({
        title: "Error",
        description: "Failed to fetch RSS feeds",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch categories from the database
  const fetchCategories = async () => {
    try {
      const { success, data, error } = await getUserFeedCategories();
      if (success && data) {
        setCategories(data);
      } else {
        console.error("Error fetching categories:", error);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Validate the RSS feed URL
  const validateUrl = async () => {
    if (!newFeedUrl.trim()) {
      setIsUrlValid(false);
      return;
    }

    setIsValidating(true);
    setIsUrlValid(null);

    try {
      const isValid = await validateRssFeed(newFeedUrl);
      setIsUrlValid(isValid);

      if (!isValid) {
        toast({
          title: "Invalid RSS Feed",
          description: "The URL does not appear to be a valid RSS feed",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Valid RSS Feed",
          description: "The URL is a valid RSS feed",
        });
      }
    } catch (error) {
      console.error("Error validating RSS feed:", error);
      setIsUrlValid(false);
      toast({
        title: "Error",
        description: `Failed to validate RSS feed: ${error instanceof Error ? error.message : "CORS proxy services unavailable"}`,
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  // Add a new RSS feed
  const handleAddFeed = async () => {
    if (!isUrlValid) {
      await validateUrl();
      return;
    }

    setIsLoading(true);
    try {
      const { success, error, message } = await addRssFeed(
        newFeedUrl,
        newFeedCategory || undefined,
      );

      if (success) {
        toast({
          title: "Success",
          description: message || "RSS feed added successfully",
        });
        setNewFeedUrl("");
        setNewFeedCategory("");
        setIsUrlValid(null);
        fetchFeeds();
      } else {
        toast({
          title: "Error",
          description: error?.message || "Failed to add RSS feed",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding RSS feed:", error);
      toast({
        title: "Error",
        description: "Failed to add RSS feed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a feed
  const handleDeleteFeed = async (feedId: string) => {
    if (!confirm("Are you sure you want to delete this feed?")) {
      return;
    }

    try {
      const { success, error } = await deleteFeed(feedId);

      if (success) {
        toast({
          title: "Success",
          description: "RSS feed deleted successfully",
        });
        fetchFeeds();
        if (onFeedSelect && selectedFeedId === feedId) {
          onFeedSelect(null);
        }
      } else {
        toast({
          title: "Error",
          description: error?.message || "Failed to delete RSS feed",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting RSS feed:", error);
      toast({
        title: "Error",
        description: "Failed to delete RSS feed",
        variant: "destructive",
      });
    }
  };

  // Refresh all feeds
  const handleRefreshFeeds = async () => {
    setIsRefreshing(true);
    try {
      const { success, error, successCount, failureCount } =
        await refreshAllFeeds();

      if (success) {
        toast({
          title: "Success",
          description: `Refreshed ${successCount} feeds successfully${failureCount > 0 ? `, ${failureCount} failed` : ""}`,
        });
        fetchFeeds();
      } else {
        toast({
          title: "Error",
          description: error?.message || "Failed to refresh RSS feeds",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error refreshing RSS feeds:", error);
      toast({
        title: "Error",
        description: "Failed to refresh RSS feeds",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // Add a new category
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const { success, error } = await addFeedCategory(
        newCategoryName,
        newCategoryColor,
      );

      if (success) {
        toast({
          title: "Success",
          description: "Category added successfully",
        });
        setNewCategoryName("");
        setNewCategoryColor("#6366f1");
        setAddCategoryDialogOpen(false);
        fetchCategories();
      } else {
        toast({
          title: "Error",
          description: error?.message || "Failed to add category",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding category:", error);
      toast({
        title: "Error",
        description: "Failed to add category",
        variant: "destructive",
      });
    }
  };

  // Update a feed's category
  const handleUpdateFeedCategory = async (feedId: string, category: string) => {
    try {
      const { success, error } = await updateFeedCategory(feedId, category);

      if (success) {
        toast({
          title: "Success",
          description: "Feed category updated successfully",
        });
        fetchFeeds();
      } else {
        toast({
          title: "Error",
          description: error?.message || "Failed to update feed category",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating feed category:", error);
      toast({
        title: "Error",
        description: "Failed to update feed category",
        variant: "destructive",
      });
    }
  };

  // Filter feeds by category (from props or internal state)
  const effectiveCategory = internalSelectedCategory || null;
  const filteredFeeds = effectiveCategory
    ? feeds.filter((feed) => feed.category === effectiveCategory)
    : feeds;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">RSS Feeds</h2>
        <div className="flex gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => setDiscoveryDialogOpen(true)}
          >
            <Compass className="h-4 w-4 mr-2" />
            Discover
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshFeeds}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Add new feed form */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Add New Feed</CardTitle>
          <CardDescription>
            Enter an RSS feed URL to add it to your collection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="https://example.com/feed.xml"
                    value={newFeedUrl}
                    onChange={(e) => {
                      setNewFeedUrl(e.target.value);
                      setIsUrlValid(null);
                    }}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={validateUrl}
                  disabled={isValidating || !newFeedUrl.trim()}
                >
                  {isValidating ? (
                    <span className="flex items-center">
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Validating
                    </span>
                  ) : isUrlValid === true ? (
                    <span className="flex items-center text-green-500">
                      <Check className="h-4 w-4 mr-2" />
                      Valid
                    </span>
                  ) : isUrlValid === false ? (
                    <span className="flex items-center text-red-500">
                      <X className="h-4 w-4 mr-2" />
                      Invalid
                    </span>
                  ) : (
                    "Validate"
                  )}
                </Button>
              </div>

              {isUrlValid === false && (
                <p className="text-sm text-red-500">
                  The URL does not appear to be a valid RSS feed
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <Select
                  value={newFeedCategory}
                  onValueChange={setNewFeedCategory}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Select category (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-category">No Category</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Dialog
                open={addCategoryDialogOpen}
                onOpenChange={setAddCategoryDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    New Category
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-gray-800">
                  <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                    <DialogDescription>
                      Create a new category to organize your RSS feeds
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Category Name
                      </label>
                      <Input
                        placeholder="Technology"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className="bg-gray-800 border-gray-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Color</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={newCategoryColor}
                          onChange={(e) => setNewCategoryColor(e.target.value)}
                          className="h-10 w-10 rounded cursor-pointer"
                        />
                        <Input
                          value={newCategoryColor}
                          onChange={(e) => setNewCategoryColor(e.target.value)}
                          className="bg-gray-800 border-gray-700"
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setAddCategoryDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAddCategory}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Category
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleAddFeed}
            disabled={
              isLoading || (isUrlValid !== true && newFeedUrl.trim() !== "")
            }
            className="w-full"
          >
            {isLoading ? (
              <span className="flex items-center">
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Adding...
              </span>
            ) : (
              <span className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Add Feed
              </span>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={internalSelectedCategory === null ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setInternalSelectedCategory(null)}
        >
          All Feeds
        </Badge>
        {categories.map((category) => (
          <Badge
            key={category.id}
            variant={
              internalSelectedCategory === category.name ? "default" : "outline"
            }
            className="cursor-pointer"
            style={{
              backgroundColor:
                internalSelectedCategory === category.name
                  ? category.color
                  : "transparent",
              borderColor: category.color,
              color:
                internalSelectedCategory === category.name
                  ? "white"
                  : category.color,
            }}
            onClick={() => setInternalSelectedCategory(category.name)}
          >
            {category.name}
          </Badge>
        ))}
      </div>

      {/* Discovery Dialog */}
      <Dialog open={discoveryDialogOpen} onOpenChange={setDiscoveryDialogOpen}>
        <DialogContent className="max-w-4xl bg-gray-900 border-gray-800 p-0">
          <RssFeedDiscovery
            onSelectFeed={(url) => {
              setNewFeedUrl(url);
              setIsUrlValid(null);
              setDiscoveryDialogOpen(false);
              // Automatically validate the URL
              setTimeout(() => validateUrl(), 100);
            }}
            onClose={() => setDiscoveryDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Feeds list */}
      {isLoading && feeds.length === 0 ? (
        <div className="text-center py-8">
          <RefreshCw className="h-8 w-8 mx-auto animate-spin text-gray-400" />
          <p className="mt-2 text-gray-400">Loading feeds...</p>
        </div>
      ) : feeds.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-gray-700 rounded-md">
          <Rss className="h-8 w-8 mx-auto text-gray-400" />
          <p className="mt-2 text-gray-400">No RSS feeds added yet</p>
          <p className="text-sm text-gray-500">
            Add your first feed using the form above or click "Discover" to
            browse our curated list
          </p>
          <div className="mt-4 flex justify-center">
            <Button
              variant="default"
              onClick={() => setDiscoveryDialogOpen(true)}
              className="mx-auto"
            >
              <Globe className="h-4 w-4 mr-2" />
              Discover RSS Feeds
            </Button>
          </div>
        </div>
      ) : filteredFeeds.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-gray-700 rounded-md">
          <AlertCircle className="h-8 w-8 mx-auto text-gray-400" />
          <p className="mt-2 text-gray-400">No feeds found in this category</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredFeeds.map((feed) => (
            <div
              key={feed.id}
              className={`p-3 rounded-md border ${selectedFeedId === feed.id ? "bg-gray-800/70 border-purple-500/50" : "bg-gray-900/50 border-gray-800 hover:bg-gray-800/50"} cursor-pointer transition-colors`}
              onClick={() => onFeedSelect && onFeedSelect(feed.id)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium">{feed.title}</h3>
                  <p className="text-sm text-gray-400 truncate">{feed.url}</p>
                  <div className="flex items-center mt-1">
                    {feed.category ? (
                      <Badge
                        variant="outline"
                        className="text-xs"
                        style={{
                          borderColor:
                            categories.find((c) => c.name === feed.category)
                              ?.color || "#6366f1",
                          color:
                            categories.find((c) => c.name === feed.category)
                              ?.color || "#6366f1",
                        }}
                      >
                        <Folder className="h-3 w-3 mr-1" />
                        {feed.category}
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-xs text-gray-400"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        Uncategorized
                      </Badge>
                    )}
                    <span className="text-xs text-gray-500 ml-2">
                      {feed.last_fetched_at
                        ? `Last updated: ${new Date(feed.last_fetched_at).toLocaleString()}`
                        : "Never updated"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Select
                    value={feed.category || "no-category"}
                    onValueChange={(value) => {
                      handleUpdateFeedCategory(
                        feed.id,
                        value === "no-category" ? "" : value,
                      );
                    }}
                  >
                    <SelectTrigger
                      className="h-8 w-8 p-0 bg-transparent border-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Edit className="h-4 w-4 text-gray-400 hover:text-white" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no-category">No Category</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-500/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteFeed(feed.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RssFeedManager;
