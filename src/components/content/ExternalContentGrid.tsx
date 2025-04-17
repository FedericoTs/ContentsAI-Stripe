import React from "react";
import ExternalContentCard from "./ExternalContentCard";
import { Button } from "@/components/ui/button";
import { BookOpen, BookmarkCheck, Filter } from "lucide-react";
import { ContentSourceType } from "@/lib/external-content-service";

interface ExternalContentGridProps {
  content: any[];
  onSelectContent: (content: any) => void;
  onSaveContent: (content: any, isSaved: boolean) => void;
  selectedContent: any | null;
  isLoading?: boolean;
  onFilterBySource?: (sourceType: ContentSourceType | null) => void;
}

const ExternalContentGrid: React.FC<ExternalContentGridProps> = ({
  content,
  onSelectContent,
  onSaveContent,
  selectedContent,
  isLoading = false,
  onFilterBySource,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="bg-gray-800/30 border border-gray-700/50 rounded-md p-4 h-40 animate-pulse"
          >
            <div className="h-5 bg-gray-700/50 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-700/50 rounded w-full mb-1"></div>
            <div className="h-4 bg-gray-700/50 rounded w-2/3 mb-4"></div>
            <div className="h-3 bg-gray-700/50 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (content.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-gray-700 rounded-md">
        <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-medium text-gray-300 mb-2">
          No External Content Found
        </h3>
        <p className="text-gray-400">
          Import content from external sources to see it here
        </p>
      </div>
    );
  }

  // Get unique source types for filtering
  const sourceTypes = [...new Set(content.map((item) => item.source_type))];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          {content.length} Item{content.length !== 1 ? "s" : ""}
        </h3>
        <div className="flex gap-2">
          {onFilterBySource && (
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => onFilterBySource(null)}
                >
                  All
                </Button>
                {sourceTypes.map((sourceType) => (
                  <Button
                    key={sourceType}
                    variant="outline"
                    size="sm"
                    className="text-xs capitalize"
                    onClick={() =>
                      onFilterBySource(sourceType as ContentSourceType)
                    }
                  >
                    {sourceType}
                  </Button>
                ))}
              </div>
            </div>
          )}
          <Button variant="outline" size="sm" className="text-xs">
            <BookOpen className="h-3.5 w-3.5 mr-1.5" />
            Mark All as Read
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            <BookmarkCheck className="h-3.5 w-3.5 mr-1.5" />
            Save All
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {content.map((item) => (
          <ExternalContentCard
            key={item.id}
            content={item}
            onSelect={onSelectContent}
            onSave={onSaveContent}
            isSelected={selectedContent?.id === item.id}
          />
        ))}
      </div>
    </div>
  );
};

export default ExternalContentGrid;
