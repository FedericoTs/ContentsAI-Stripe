import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  LayoutGrid,
  List,
  Search,
  FileText,
  Video,
  Music,
  Image,
  File,
} from "lucide-react";
import ContentCard, { ContentItem } from "@/components/archive/ContentCard";
import Sidebar from "@/components/dashboard/layout/Sidebar";
import TopNavigation from "@/components/dashboard/layout/TopNavigation";
import { Badge } from "@/components/ui/badge";
import ActivityFeed from "@/components/dashboard/ActivityFeed";

// Mock data for demonstration
const mockContent: ContentItem[] = [
  {
    id: "1",
    title: "Marketing Strategy Document",
    description:
      "A comprehensive marketing strategy for Q3 2023 with focus on digital channels.",
    type: "document",
    tags: ["marketing", "strategy", "2023"],
    source: "uploaded",
    date: "2023-06-15",
  },
  {
    id: "2",
    title: "Product Demo Video",
    description:
      "A demonstration of our new product features and benefits for customer onboarding.",
    type: "video",
    tags: ["product", "demo", "onboarding"],
    source: "transformed",
    date: "2023-07-02",
  },
  {
    id: "3",
    title: "Weekly Podcast Episode",
    description:
      "Interview with industry expert on content marketing trends for 2023.",
    type: "audio",
    tags: ["podcast", "interview", "content marketing"],
    source: "collection",
    date: "2023-07-10",
  },
  {
    id: "4",
    title: "Brand Guidelines",
    description:
      "Updated brand guidelines with new color palette and typography specifications.",
    type: "document",
    tags: ["brand", "design", "guidelines"],
    source: "uploaded",
    date: "2023-06-28",
  },
  {
    id: "5",
    title: "Team Meeting Recording",
    description:
      "Recording of the quarterly team meeting with project updates and roadmap discussion.",
    type: "video",
    tags: ["meeting", "team", "quarterly"],
    source: "collection",
    date: "2023-07-05",
  },
  {
    id: "6",
    title: "Infographic Design",
    description:
      "Visual representation of customer survey results for social media sharing.",
    type: "image",
    tags: ["infographic", "design", "survey"],
    source: "transformed",
    date: "2023-07-12",
  },
];

const Archive = () => {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  // Filter content based on search query and active filter
  const filteredContent = mockContent.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesFilter =
      activeFilter === "all" || item.source === activeFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <TopNavigation />

      <div className="flex pt-16">
        <Sidebar activeItem="Archive" />

        <main className="flex-1 overflow-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">Content Archive</h1>
            <p className="text-white/70">
              Browse and manage your archived content.
            </p>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
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
                  variant={viewMode === "table" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                  className="px-3"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Tabs
              defaultValue="all"
              className="mb-6"
              onValueChange={setActiveFilter}
            >
              <TabsList className="bg-gray-800 border border-gray-700">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="uploaded">Uploaded</TabsTrigger>
                <TabsTrigger value="transformed">Transformed</TabsTrigger>
                <TabsTrigger value="collection">Collection</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredContent.map((item) => (
                <ContentCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="bg-gray-900/50 rounded-md border border-gray-800">
              <table className="min-w-full divide-y divide-gray-800">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Tags
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900/30 divide-y divide-gray-800">
                  {filteredContent.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-800/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {item.type === "document" && (
                            <FileText className="h-5 w-5 text-blue-500" />
                          )}
                          {item.type === "video" && (
                            <Video className="h-5 w-5 text-red-500" />
                          )}
                          {item.type === "audio" && (
                            <Music className="h-5 w-5 text-purple-500" />
                          )}
                          {item.type === "image" && (
                            <Image className="h-5 w-5 text-green-500" />
                          )}
                          {item.type === "other" && (
                            <File className="h-5 w-5 text-gray-500" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-white">
                          {item.title}
                        </div>
                        <div className="text-sm text-gray-400 line-clamp-1">
                          {item.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.source === "uploaded" ? "bg-blue-100 text-blue-800" : item.source === "transformed" ? "bg-purple-100 text-purple-800" : "bg-amber-100 text-amber-800"}`}
                        >
                          {item.source}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {item.date}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {item.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>

        <div className="w-[280px] border-l border-white/10 bg-black/40 backdrop-blur-md">
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
};

export default Archive;
