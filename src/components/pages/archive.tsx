import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  File,
  FileText,
  Image,
  LayoutGrid,
  List,
  Music,
  Search,
  Video,
} from "lucide-react";
import ContentCard from "@/components/archive/ContentCard";

// Mock content data for demonstration
const mockContent = [
  {
    id: "1",
    title: "Marketing Campaign Analysis",
    description:
      "Detailed analysis of Q2 marketing campaign performance across all channels.",
    type: "document",
    source: "uploaded",
    date: "2023-06-15",
    tags: ["marketing", "analysis", "Q2"],
  },
  {
    id: "2",
    title: "Product Demo Video",
    description: "Official product demonstration for the new feature release.",
    type: "video",
    source: "transformed",
    date: "2023-05-28",
    tags: ["product", "demo", "video"],
  },
  {
    id: "3",
    title: "Customer Testimonials",
    description: "Collection of customer testimonials from enterprise clients.",
    type: "audio",
    source: "collection",
    date: "2023-06-02",
    tags: ["testimonials", "customers", "feedback"],
  },
  {
    id: "4",
    title: "Brand Assets Pack",
    description:
      "Complete brand assets including logos, colors, and usage guidelines.",
    type: "image",
    source: "uploaded",
    date: "2023-04-10",
    tags: ["brand", "assets", "design"],
  },
  {
    id: "5",
    title: "Quarterly Financial Report",
    description: "Q1 financial performance report for stakeholders.",
    type: "document",
    source: "transformed",
    date: "2023-04-15",
    tags: ["finance", "report", "Q1"],
  },
  {
    id: "6",
    title: "Team Training Materials",
    description: "Training materials for onboarding new team members.",
    type: "other",
    source: "collection",
    date: "2023-03-22",
    tags: ["training", "onboarding", "team"],
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
    <>
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
    </>
  );
};

export default Archive;
