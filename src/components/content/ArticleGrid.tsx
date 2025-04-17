import React from "react";
import ContentCard from "./ContentCard";
import { Button } from "@/components/ui/button";
import { BookOpen, BookmarkCheck } from "lucide-react";

interface ArticleGridProps {
  items: any[]; // Unified prop for both articles and external content
  onSelectItem: (item: any) => void;
  onSaveItem: (item: any, isSaved: boolean) => void;
  selectedItem: any | null;
  isLoading?: boolean;
  title?: string; // Optional title for the grid
}

const ArticleGrid: React.FC<ArticleGridProps> = ({
  items,
  onSelectItem,
  onSaveItem,
  selectedItem,
  isLoading = false,
  title,
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

  if (items.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-gray-700 rounded-md">
        <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-medium text-gray-300 mb-2">
          No Content Found
        </h3>
        <p className="text-gray-400">
          Try adjusting your filters or add more content sources
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          {title || `${items.length} Item${items.length !== 1 ? "s" : ""}`}
        </h3>
        <div className="flex gap-2">
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
        {items.map((item) => (
          <ContentCard
            key={item.id}
            item={item}
            onSelect={onSelectItem}
            onSave={onSaveItem}
            isSelected={selectedItem?.id === item.id}
          />
        ))}
      </div>
    </div>
  );
};

export default ArticleGrid;
