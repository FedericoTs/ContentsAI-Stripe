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
import ExternalContentGrid from "./ExternalContentGrid";
import ExternalContentView from "./ExternalContentView";
import {
  getAllExternalContent,
  ContentSourceType,
} from "@/lib/external-content-service";
import { useToast } from "@/components/ui/use-toast";

interface ExternalContentManagerProps {
  onBack?: () => void;
}

const ExternalContentManager: React.FC<ExternalContentManagerProps> = ({
  onBack,
  showSavedOnly: initialShowSavedOnly = false,
}) => {
  const { toast } = useToast();
  const [content, setContent] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedContent, setSelectedContent] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [showSavedOnly, setShowSavedOnly] = useState(initialShowSavedOnly);
  const [viewMode, setViewMode] = useState<"grid" | "detail">("grid");
  const [selectedContentIndex, setSelectedContentIndex] = useState<number>(-1);
  const [sourceTypeFilter, setSourceTypeFilter] =
    useState<ContentSourceType | null>(null);

  // Fetch content on component mount
  useEffect(() => {
    fetchContent();
  }, [sourceTypeFilter]);

  // Fetch all external content
  const fetchContent = async () => {
    setIsLoading(true);
    try {
      const { success, data, error } = await getAllExternalContent({
        source_type: sourceTypeFilter,
      });
      if (success && data) {
        setContent(data);
        // Reset selected content
        setSelectedContent(null);
        setSelectedContentIndex(-1);
      } else {
        console.error("Error fetching external content:", error);
        toast({
          title: "Error",
          description: "Failed to fetch external content",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching external content:", error);
      toast({
        title: "Error",
        description: "Failed to fetch external content",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle content selection
  const handleSelectContent = async (content: any) => {
    setSelectedContent(content);
    setViewMode("detail");

    // Find the index of the selected content in the filtered list
    const index = filteredContent.findIndex((c) => c.id === content.id);
    setSelectedContentIndex(index);

    // Mark the content as read (would implement this in a real app)
    // For now, just update the local state
    if (!content.read) {
      setContent((prevContent) =>
        prevContent.map((c) =>
          c.id === content.id ? { ...c, read: true } : c,
        ),
      );
    }
  };

  // Handle saving/unsaving content
  const handleSaveContent = async (content: any, isSaved: boolean) => {
    // In a real app, this would call an API to update the database
    // For now, just update the local state
    setContent((prevContent) =>
      prevContent.map((c) =>
        c.id === content.id ? { ...c, saved: isSaved } : c,
      ),
    );

    // Update the selected content if it's the one being saved/unsaved
    if (selectedContent && selectedContent.id === content.id) {
      setSelectedContent({ ...selectedContent, saved: isSaved });
    }

    toast({
      title: isSaved ? "Content Saved" : "Content Unsaved",
      description: isSaved
        ? "The content has been saved to your collection"
        : "The content has been removed from your collection",
    });
  };

  // Navigate to next content
  const handleNextContent = () => {
    if (selectedContentIndex < filteredContent.length - 1) {
      const nextIndex = selectedContentIndex + 1;
      handleSelectContent(filteredContent[nextIndex]);
    }
  };

  // Navigate to previous content
  const handlePreviousContent = () => {
    if (selectedContentIndex > 0) {
      const prevIndex = selectedContentIndex - 1;
      handleSelectContent(filteredContent[prevIndex]);
    }
  };

  // Filter content based on search query and filters
  const filteredContent = content.filter((item) => {
    // Search filter
    const matchesSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Unread filter
    const matchesUnread = !showUnreadOnly || !item.read;

    // Saved filter
    const matchesSaved = !showSavedOnly || item.saved;

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
              Back
            </Button>
          )}
          <h2 className="text-xl font-semibold">External Content</h2>
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
              if (selectedContent || filteredContent.length > 0) {
                setViewMode("detail");
                if (!selectedContent && filteredContent.length > 0) {
                  handleSelectContent(filteredContent[0]);
                }
              }
            }}
            className="px-3"
            disabled={filteredContent.length === 0}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchContent}
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
            placeholder="Search content..."
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
        <ExternalContentGrid
          content={filteredContent}
          onSelectContent={handleSelectContent}
          onSaveContent={handleSaveContent}
          selectedContent={selectedContent}
          isLoading={isLoading}
          onFilterBySource={setSourceTypeFilter}
        />
      ) : (
        <ExternalContentView
          content={
            selectedContent ||
            (filteredContent.length > 0 ? filteredContent[0] : null)
          }
          onSave={handleSaveContent}
          onNext={handleNextContent}
          onPrevious={handlePreviousContent}
          hasNext={selectedContentIndex < filteredContent.length - 1}
          hasPrevious={selectedContentIndex > 0}
        />
      )}
    </div>
  );
};

export default ExternalContentManager;
