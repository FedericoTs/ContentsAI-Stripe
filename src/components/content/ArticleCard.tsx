import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  User,
  Tag,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
} from "lucide-react";

interface ArticleCardProps {
  article: any;
  onSelect: (article: any) => void;
  onSave: (article: any, isSaved: boolean) => void;
  isSelected?: boolean;
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onSelect,
  onSave,
  isSelected = false,
}) => {
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
    <Card
      className={`cursor-pointer transition-colors ${isSelected ? "bg-gray-800/70 border-purple-500/50" : "bg-gray-900/50 border-gray-800 hover:bg-gray-800/50"}`}
      onClick={() => onSelect(article)}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3
              className={`font-medium ${article.read ? "text-gray-400" : "text-white"}`}
            >
              {article.title}
            </h3>
            <p className="text-sm text-gray-400 line-clamp-2 mt-1">
              {article.description}
            </p>
            <div className="flex items-center mt-2 text-xs text-gray-500">
              <Calendar className="h-3 w-3 mr-1" />
              {formatDate(article.published_at)}
              {article.author && (
                <span className="ml-2 flex items-center">
                  <User className="h-3 w-3 mr-1" />
                  {article.author}
                </span>
              )}
            </div>

            {/* AI Categories */}
            {article.ai_categories?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {article.ai_categories.map(
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
          <div className="flex flex-col gap-2">
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${article.saved ? "text-yellow-500" : "text-gray-400 hover:text-yellow-500"}`}
              onClick={(e) => {
                e.stopPropagation();
                onSave(article, !article.saved);
              }}
            >
              {article.saved ? (
                <BookmarkCheck className="h-4 w-4" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:text-blue-500"
              onClick={(e) => {
                e.stopPropagation();
                window.open(article.link, "_blank");
              }}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ArticleCard;
