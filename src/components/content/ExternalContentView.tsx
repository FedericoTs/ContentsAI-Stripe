import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  User,
  Tag,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  ArrowLeft,
  ArrowRight,
  Youtube,
  Linkedin,
  Facebook,
  FileText,
} from "lucide-react";
import { ContentSourceType } from "@/lib/external-content-service";

interface ExternalContentViewProps {
  content: any;
  onSave: (content: any, isSaved: boolean) => void;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

const ExternalContentView: React.FC<ExternalContentViewProps> = ({
  content,
  onSave,
  onNext,
  onPrevious,
  hasNext = false,
  hasPrevious = false,
}) => {
  if (!content) {
    return (
      <div className="h-full flex items-center justify-center border border-dashed border-gray-700 rounded-md">
        <div className="text-center p-8">
          <Tag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-300">
            No Content Selected
          </h3>
          <p className="text-gray-400 mt-2">
            Select content from the list to view its details
          </p>
        </div>
      </div>
    );
  }

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
        return <Youtube className="h-4 w-4 mr-1 text-red-500" />;
      case "linkedin":
        return <Linkedin className="h-4 w-4 mr-1 text-blue-500" />;
      case "facebook":
        return <Facebook className="h-4 w-4 mr-1 text-blue-600" />;
      case "wordpress":
        return <FileText className="h-4 w-4 mr-1 text-blue-400" />;
      default:
        return null;
    }
  };

  // Render YouTube embed if it's a YouTube video
  const renderYouTubeEmbed = () => {
    if (content.source_type === "youtube" && content.metadata?.videoId) {
      return (
        <div className="mb-4">
          <div className="aspect-w-16 aspect-h-9 rounded-md overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${content.metadata.videoId}`}
              title={content.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-gray-900/50 border-gray-800 h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center mb-1">
              <Badge variant="outline" className="text-sm mr-2 capitalize">
                {getSourceIcon(content.source_type)}
                {content.source_type}
              </Badge>
            </div>
            <CardTitle>{content.title}</CardTitle>
            <CardDescription className="mt-1">
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(content.published_at)}
                {content.author && (
                  <span className="ml-3 flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {content.author}
                  </span>
                )}
              </div>
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${content.saved ? "text-yellow-500" : "text-gray-400 hover:text-yellow-500"}`}
              onClick={() => onSave(content, !content.saved)}
            >
              {content.saved ? (
                <BookmarkCheck className="h-4 w-4" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => window.open(content.link, "_blank")}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Original
            </Button>
          </div>
        </div>

        {/* AI Categories and Summary */}
        {(content.ai_categories?.length > 0 || content.ai_summary) && (
          <div className="mt-2 p-3 bg-purple-900/20 rounded-md border border-purple-500/20">
            {content.ai_summary && (
              <p className="text-sm text-gray-300 mb-2">{content.ai_summary}</p>
            )}
            {content.ai_categories?.length > 0 && (
              <div className="flex flex-wrap gap-1">
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
        )}

        <Separator className="my-2" />
      </CardHeader>
      <CardContent className="flex-grow">
        <ScrollArea className="h-[calc(100vh-350px)] overflow-visible">
          {/* YouTube Embed */}
          {renderYouTubeEmbed()}

          {/* Thumbnail for other content types */}
          {content.thumbnail_url && content.source_type !== "youtube" && (
            <div className="mb-4 rounded-md overflow-hidden">
              <img
                src={content.thumbnail_url}
                alt={content.title}
                className="w-full max-h-64 object-cover"
              />
            </div>
          )}

          {/* Content */}
          {content.content ? (
            <div
              className="prose prose-invert max-w-none prose-img:rounded-md prose-a:text-blue-400 prose-pre:whitespace-pre-wrap prose-pre:break-words"
              dangerouslySetInnerHTML={{
                __html: content.content,
              }}
            />
          ) : (
            <div className="prose prose-invert max-w-none">
              <p>{content.description}</p>
              <p className="text-gray-400 mt-4">
                This content doesn't have full details. Click "Open Original" to
                view the complete content.
              </p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <div className="flex flex-wrap gap-1">
          {content.categories?.map((category: string, index: number) => (
            <Badge key={index} variant="outline" className="text-xs">
              {category}
            </Badge>
          ))}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onPrevious}
            disabled={!hasPrevious}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onNext}
            disabled={!hasNext}
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ExternalContentView;
