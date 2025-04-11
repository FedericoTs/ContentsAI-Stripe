import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface PersonalCollectionImportProps {
  onImport: (content: string) => void;
  onClose: () => void;
}

const PersonalCollectionImport = ({
  onImport,
  onClose,
}: PersonalCollectionImportProps) => {
  const [importSource, setImportSource] = useState<string>("rss");
  const [url, setUrl] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleImport = async () => {
    if (!url) {
      setError("Please enter a valid URL");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // This is a placeholder for the actual API integration
      // In a real implementation, this would make API calls to the respective services
      setTimeout(() => {
        const mockContent = `Imported content from ${importSource}: ${url}`;
        onImport(mockContent);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError("Failed to import content. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="p-6 rounded-lg border border-gray-800 bg-gray-900/50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          Import from Personal Collection
        </h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </Button>
      </div>

      <Tabs defaultValue="rss" onValueChange={setImportSource}>
        <TabsList className="bg-gray-800 border border-gray-700 mb-4">
          <TabsTrigger value="rss">RSS Feed</TabsTrigger>
          <TabsTrigger value="wordpress">WordPress</TabsTrigger>
          <TabsTrigger value="youtube">YouTube</TabsTrigger>
        </TabsList>

        <TabsContent value="rss" className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              RSS Feed URL
            </label>
            <Input
              placeholder="https://example.com/feed.xml"
              className="bg-gray-800 border-gray-700"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        </TabsContent>

        <TabsContent value="wordpress" className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              WordPress Site URL
            </label>
            <Input
              placeholder="https://example.com"
              className="bg-gray-800 border-gray-700"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Content Type
            </label>
            <Select>
              <SelectTrigger className="bg-gray-800 border-gray-700">
                <SelectValue placeholder="Select content type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="posts">Posts</SelectItem>
                <SelectItem value="pages">Pages</SelectItem>
                <SelectItem value="custom">Custom Post Type</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>

        <TabsContent value="youtube" className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              YouTube Channel URL
            </label>
            <Input
              placeholder="https://youtube.com/c/channelname"
              className="bg-gray-800 border-gray-700"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              API Key (optional)
            </label>
            <Input
              placeholder="Your YouTube API Key"
              className="bg-gray-800 border-gray-700"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              type="password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Content Type
            </label>
            <Select>
              <SelectTrigger className="bg-gray-800 border-gray-700">
                <SelectValue placeholder="Select content type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="videos">Videos</SelectItem>
                <SelectItem value="playlists">Playlists</SelectItem>
                <SelectItem value="livestreams">Livestreams</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
      </Tabs>

      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}

      <div className="mt-4 flex justify-end">
        <Button
          onClick={handleImport}
          disabled={loading}
          className="flex items-center"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Importing...
            </>
          ) : (
            "Import Content"
          )}
        </Button>
      </div>
    </div>
  );
};

export default PersonalCollectionImport;
