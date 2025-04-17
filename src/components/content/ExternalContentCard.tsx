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
  Youtube,
  Linkedin,
  Facebook,
  FileText,
} from "lucide-react";
import { ContentSourceType } from "@/lib/external-content-service";

interface ExternalContentCardProps {
  content: any;
  onSelect: (content: any) => void;
  onSave: (content: any, isSaved: boolean) => void;
  isSelected?: boolean;
}

const ExternalContentCard: React.FC<ExternalContentCardProps> = ({
  content,
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

  // Get source icon based on source type
  const getSourceIcon = (sourceType: ContentSourceType) => {
    switch (sourceType) {
      case "youtube":
        return <Youtube className="h-3 w-3 mr-1 text-red-500" />;
      case "linkedin":
        return <Linkedin className="h-3 w-3 mr-1 text-blue-500" />;
      case "facebook":
        return <Facebook className="h-3 w-3 mr-1 text-blue-600" />;
      case "wordpress":
        return <FileText className="h-3 w-3 mr-1 text-blue-400" />;
      default:
        return null;
    }
  };

  return (
    <Card
      className={`cursor-pointer transition-colors ${isSelected ? "bg-gray-800/70 border-purple-500/50" : "bg-gray-900/50 border-gray-800 hover:bg-gray-800/50"}`}
      onClick={() => onSelect(content)}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center mb-1">
              <Badge variant="outline" className="text-xs mr-2 capitalize">
                {getSourceIcon(content.source_type)}
                {content.source_type}
              </Badge>
            </div>
            <h3
              className={`font-medium ${content.read ? "text-gray-400" : "text-white"}`}
            >
              {content.title}
            </h3>
            <p className="text-sm text-gray-400 line-clamp-2 mt-1">
              {content.description}
            </p>
            <div className="flex items-center mt-2 text-xs text-gray-500">
              <Calendar className="h-3 w-3 mr-1" />
              {formatDate(content.published_at)}
              {content.author && (
                <span className="ml-2 flex items-center">
                  <User className="h-3 w-3 mr-1" />
                  {content.author}
                </span>
              )}
            </div>

            {/* Thumbnail for YouTube videos */}
            {content.source_type === "youtube" && content.thumbnail_url && (
              <div className="mt-2 rounded-md overflow-hidden">
                <img
                  src={content.thumbnail_url}
                  alt={content.title}
                  className="w-full h-24 object-cover"
                />
              </div>
            )}

            {/* AI Categories */}
            {content.ai_categories?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {content.ai_categories.map(
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
              className={`h-8 w-8 ${content.saved ? "text-yellow-500" : "text-gray-400 hover:text-yellow-500"}`}
              onClick={(e) => {
                e.stopPropagation();
                onSave(content, !content.saved);
              }}
            >
              {content.saved ? (
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
                window.open(content.link, "_blank");
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

export default ExternalContentCard;
