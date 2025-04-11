import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Video, Music, Image, File } from "lucide-react";

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  type: "document" | "video" | "audio" | "image" | "other";
  tags: string[];
  source: "uploaded" | "transformed" | "collection";
  date: string;
}

interface ContentCardProps {
  item: ContentItem;
}

const ContentCard = ({ item }: ContentCardProps) => {
  const getIcon = () => {
    switch (item.type) {
      case "document":
        return <FileText className="h-6 w-6 text-blue-500" />;
      case "video":
        return <Video className="h-6 w-6 text-red-500" />;
      case "audio":
        return <Music className="h-6 w-6 text-purple-500" />;
      case "image":
        return <Image className="h-6 w-6 text-green-500" />;
      default:
        return <File className="h-6 w-6 text-gray-500" />;
    }
  };

  const getSourceColor = () => {
    switch (item.source) {
      case "uploaded":
        return "bg-blue-100 text-blue-800";
      case "transformed":
        return "bg-purple-100 text-purple-800";
      case "collection":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="overflow-hidden border border-gray-800 hover:shadow-md transition-shadow duration-200 h-full bg-gray-900/50 text-white">
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          {getIcon()}
          <Badge variant="outline" className={getSourceColor()}>
            {item.source}
          </Badge>
        </div>
        <div className="text-xs text-gray-400">{item.date}</div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <h3 className="font-medium text-lg mb-1 line-clamp-1 text-white">
          {item.title}
        </h3>
        <p className="text-gray-400 text-sm line-clamp-2">{item.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-wrap gap-1">
        {item.tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs">
            {tag}
          </Badge>
        ))}
      </CardFooter>
    </Card>
  );
};

export default ContentCard;
