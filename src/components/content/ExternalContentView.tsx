import React, { useState, useEffect } from "react";
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
  Image as ImageIcon,
  Mic,
  Video,
  Share2,
  Twitter,
  Instagram,
  Copy,
  Download,
} from "lucide-react";
import {
  ContentSourceType,
  getTransformedContent,
} from "@/lib/external-content-service";

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
  const [transformedContent, setTransformedContent] = useState<any[]>([]);
  const [isLoadingTransformed, setIsLoadingTransformed] = useState(false);

  // Fetch transformed content when the content changes
  useEffect(() => {
    if (content?.id) {
      fetchTransformedContent(content.id);
    } else {
      setTransformedContent([]);
    }
  }, [content]);

  // Fetch transformed content for the current content item
  const fetchTransformedContent = async (contentId: string) => {
    setIsLoadingTransformed(true);
    try {
      const { success, data, error } = await getTransformedContent(contentId);
      if (success && data) {
        console.log("Transformed content loaded:", data);
        setTransformedContent(data);
      } else {
        console.error("Error fetching transformed content:", error);
        setTransformedContent([]);
      }
    } catch (error) {
      console.error("Error fetching transformed content:", error);
      setTransformedContent([]);
    } finally {
      setIsLoadingTransformed(false);
    }
  };
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

          {/* Transformed Content Section */}
          {transformedContent.length > 0 && (
            <div className="mt-8 border-t border-gray-700 pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Tag className="h-5 w-5 mr-2 text-blue-400" />
                Transformed Content
                {isLoadingTransformed && (
                  <span className="ml-2 text-sm text-gray-400">
                    (Loading...)
                  </span>
                )}
              </h3>
              <div className="space-y-6">
                {transformedContent.map((item, index) => {
                  const resultData = item.result_data;

                  // Render based on transformation type
                  if (
                    item.transformation_type === "text-to-image" &&
                    resultData.images
                  ) {
                    return (
                      <div
                        key={index}
                        className="bg-gray-800/50 rounded-md p-4"
                      >
                        <h4 className="text-md font-medium mb-2 flex items-center">
                          <ImageIcon className="h-4 w-4 mr-2 text-blue-400" />
                          Generated Images
                          <span className="text-xs text-gray-400 ml-2">
                            {new Date(item.created_at).toLocaleDateString()}
                          </span>
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                          {resultData.images.map(
                            (image: any, imgIndex: number) => (
                              <div key={imgIndex} className="relative group">
                                <img
                                  src={image.url}
                                  alt={image.alt || "Generated image"}
                                  className="w-full h-auto rounded-md object-cover aspect-square"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2 opacity-0 group-hover:opacity-100 transition-opacity flex justify-end space-x-2">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() =>
                                      window.open(image.url, "_blank")
                                    }
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() =>
                                      navigator.clipboard.writeText(image.url)
                                    }
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                      const a = document.createElement("a");
                                      a.href = image.url;
                                      a.download = `generated-image-${imgIndex}.jpg`;
                                      a.click();
                                    }}
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    );
                  } else if (
                    item.transformation_type === "text-to-speech" &&
                    resultData.audioUrl
                  ) {
                    return (
                      <div
                        key={index}
                        className="bg-gray-800/50 rounded-md p-4"
                      >
                        <h4 className="text-md font-medium mb-2 flex items-center">
                          <Mic className="h-4 w-4 mr-2 text-blue-400" />
                          Generated Audio
                          <span className="text-xs text-gray-400 ml-2">
                            {new Date(item.created_at).toLocaleDateString()}
                          </span>
                        </h4>
                        <audio controls className="w-full mt-2">
                          <source
                            src={resultData.audioUrl}
                            type={`audio/${resultData.settings?.format || "mp3"}`}
                          />
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    );
                  } else if (
                    item.transformation_type === "text-to-video" &&
                    resultData.videoUrl
                  ) {
                    return (
                      <div
                        key={index}
                        className="bg-gray-800/50 rounded-md p-4"
                      >
                        <h4 className="text-md font-medium mb-2 flex items-center">
                          <Video className="h-4 w-4 mr-2 text-blue-400" />
                          Generated Video
                          <span className="text-xs text-gray-400 ml-2">
                            {new Date(item.created_at).toLocaleDateString()}
                          </span>
                        </h4>
                        <div className="aspect-video bg-black rounded-md overflow-hidden relative mt-2">
                          <video controls className="w-full h-full">
                            <source
                              src={resultData.videoUrl}
                              type="video/mp4"
                            />
                            Your browser does not support the video element.
                          </video>
                        </div>
                      </div>
                    );
                  } else if (
                    item.transformation_type === "text-to-social" &&
                    resultData.posts
                  ) {
                    return (
                      <div
                        key={index}
                        className="bg-gray-800/50 rounded-md p-4"
                      >
                        <h4 className="text-md font-medium mb-2 flex items-center">
                          <Share2 className="h-4 w-4 mr-2 text-blue-400" />
                          Generated Social Media Posts
                          <span className="text-xs text-gray-400 ml-2">
                            {new Date(item.created_at).toLocaleDateString()}
                          </span>
                        </h4>
                        <div className="space-y-3 mt-2">
                          {resultData.posts
                            .slice(0, 3)
                            .map((post: any, postIndex: number) => (
                              <div
                                key={postIndex}
                                className="bg-gray-900/50 p-3 rounded-md"
                              >
                                <div className="flex items-center mb-2">
                                  {post.platform === "twitter" && (
                                    <Twitter className="h-4 w-4 text-blue-400 mr-2" />
                                  )}
                                  {post.platform === "instagram" && (
                                    <Instagram className="h-4 w-4 text-pink-500 mr-2" />
                                  )}
                                  {post.platform === "facebook" && (
                                    <Facebook className="h-4 w-4 text-blue-600 mr-2" />
                                  )}
                                  {post.platform === "linkedin" && (
                                    <Linkedin className="h-4 w-4 text-blue-700 mr-2" />
                                  )}
                                  <span className="text-sm font-medium capitalize">
                                    {post.platform}
                                  </span>
                                </div>
                                <p className="text-sm whitespace-pre-line">
                                  {post.content}
                                </p>
                                <div className="flex justify-end mt-2">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() =>
                                      navigator.clipboard.writeText(
                                        post.content,
                                      )
                                    }
                                  >
                                    <Copy className="h-3 w-3 mr-1" />
                                    Copy
                                  </Button>
                                </div>
                              </div>
                            ))}
                          {resultData.posts.length > 3 && (
                            <Button
                              variant="link"
                              size="sm"
                              className="text-xs"
                            >
                              View {resultData.posts.length - 3} more posts...
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  } else {
                    return null;
                  }
                })}
              </div>
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
