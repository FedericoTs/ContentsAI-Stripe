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
} from "lucide-react";

interface ArticleViewProps {
  article: any;
  onSave: (article: any, isSaved: boolean) => void;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

const ArticleView: React.FC<ArticleViewProps> = ({
  article,
  onSave,
  onNext,
  onPrevious,
  hasNext = false,
  hasPrevious = false,
}) => {
  if (!article) {
    return (
      <div className="h-full flex items-center justify-center border border-dashed border-gray-700 rounded-md">
        <div className="text-center p-8">
          <Tag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-300">
            No Article Selected
          </h3>
          <p className="text-gray-400 mt-2">
            Select an article from the list to view its content
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

  return (
    <Card className="bg-gray-900/50 border-gray-800 h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{article.title}</CardTitle>
            <CardDescription className="mt-1">
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(article.published_at)}
                {article.author && (
                  <span className="ml-3 flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {article.author}
                  </span>
                )}
              </div>
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${article.saved ? "text-yellow-500" : "text-gray-400 hover:text-yellow-500"}`}
              onClick={() => onSave(article, !article.saved)}
            >
              {article.saved ? (
                <BookmarkCheck className="h-4 w-4" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => window.open(article.link, "_blank")}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Original
            </Button>
          </div>
        </div>

        {/* AI Categories and Summary */}
        {(article.ai_categories?.length > 0 || article.ai_summary) && (
          <div className="mt-2 p-3 bg-purple-900/20 rounded-md border border-purple-500/20">
            {article.ai_summary && (
              <p className="text-sm text-gray-300 mb-2">{article.ai_summary}</p>
            )}
            {article.ai_categories?.length > 0 && (
              <div className="flex flex-wrap gap-1">
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
        )}

        <Separator className="my-2" />
      </CardHeader>
      <CardContent className="flex-grow">
        <ScrollArea className="h-[calc(100vh-350px)] overflow-visible">
          {article.content ? (
            <div
              className="prose prose-invert max-w-none prose-img:rounded-md prose-a:text-blue-400 prose-pre:whitespace-pre-wrap prose-pre:break-words"
              dangerouslySetInnerHTML={{
                __html: article.content,
              }}
            />
          ) : (
            <div className="prose prose-invert max-w-none">
              <p>{article.description}</p>
              <p className="text-gray-400 mt-4">
                This article doesn't have full content. Click "Open Original" to
                read the complete article.
              </p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <div className="flex flex-wrap gap-1">
          {article.categories?.map((category: string, index: number) => (
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

export default ArticleView;
