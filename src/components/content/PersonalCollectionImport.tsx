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
import {
  FileText,
  Youtube,
  Linkedin,
  Facebook,
  Rss,
  Loader2,
  X,
} from "lucide-react";
import {
  fetchWordpressContent,
  fetchYoutubeContent,
  fetchLinkedinContent,
  fetchFacebookContent,
  saveExternalContent,
} from "@/lib/external-content-service";
import { useToast } from "@/components/ui/use-toast";

interface PersonalCollectionImportProps {
  onImportComplete?: () => void;
  onClose: () => void;
}

const PersonalCollectionImport = ({
  onImportComplete,
  onClose,
}: PersonalCollectionImportProps) => {
  const { toast } = useToast();
  const [importSource, setImportSource] = useState<string>("rss");
  const [url, setUrl] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  const [channelId, setChannelId] = useState<string>("");
  const [accessToken, setAccessToken] = useState<string>("");
  const [contentType, setContentType] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleImport = async () => {
    if (!url && importSource !== "linkedin" && importSource !== "facebook") {
      setError("Please enter a valid URL");
      return;
    }

    if (
      (importSource === "linkedin" || importSource === "facebook") &&
      !accessToken
    ) {
      setError("Please enter an access token");
      return;
    }

    if (importSource === "youtube" && !apiKey) {
      setError("Please enter an API key");
      return;
    }

    if (importSource === "youtube" && !channelId) {
      setError("Please enter a channel ID");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let result;

      switch (importSource) {
        case "rss":
          // This would be handled by the RSS service
          toast({
            title: "RSS Import",
            description: "RSS feeds are handled in the RSS section",
          });
          break;

        case "wordpress":
          result = await fetchWordpressContent(url);
          if (result.success && result.data) {
            // Save each content item to the database
            for (const item of result.data) {
              await saveExternalContent(item);
            }
            toast({
              title: "WordPress Import Successful",
              description: `Imported ${result.data.length} items from WordPress`,
            });
          } else {
            throw new Error(
              result.error || "Failed to import WordPress content",
            );
          }
          break;

        case "youtube":
          result = await fetchYoutubeContent(apiKey, channelId);
          if (result.success && result.data) {
            // Save each content item to the database
            for (const item of result.data) {
              await saveExternalContent(item);
            }
            toast({
              title: "YouTube Import Successful",
              description: `Imported ${result.data.length} videos from YouTube`,
            });
          } else {
            throw new Error(result.error || "Failed to import YouTube content");
          }
          break;

        case "linkedin":
          result = await fetchLinkedinContent(accessToken);
          if (result.success) {
            toast({
              title: "LinkedIn Import",
              description:
                result.message ||
                "LinkedIn integration requires a LinkedIn Developer account",
            });
          } else {
            throw new Error(
              result.error || "Failed to import LinkedIn content",
            );
          }
          break;

        case "facebook":
          result = await fetchFacebookContent(accessToken);
          if (result.success) {
            toast({
              title: "Facebook Import",
              description:
                result.message ||
                "Facebook integration requires a Facebook Developer account",
            });
          } else {
            throw new Error(
              result.error || "Failed to import Facebook content",
            );
          }
          break;
      }

      if (onImportComplete) {
        onImportComplete();
      }
    } catch (err: any) {
      setError(err.message || "Failed to import content. Please try again.");
      toast({
        title: "Import Failed",
        description: err.message || "Failed to import content",
        variant: "destructive",
      });
    } finally {
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
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="rss" onValueChange={setImportSource}>
        <TabsList className="bg-gray-800 border border-gray-700 mb-4">
          <TabsTrigger value="rss" className="flex items-center">
            <Rss className="h-4 w-4 mr-2" /> RSS Feed
          </TabsTrigger>
          <TabsTrigger value="wordpress" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" /> WordPress
          </TabsTrigger>
          <TabsTrigger value="youtube" className="flex items-center">
            <Youtube className="h-4 w-4 mr-2" /> YouTube
          </TabsTrigger>
          <TabsTrigger value="linkedin" className="flex items-center">
            <Linkedin className="h-4 w-4 mr-2" /> LinkedIn
          </TabsTrigger>
          <TabsTrigger value="facebook" className="flex items-center">
            <Facebook className="h-4 w-4 mr-2" /> Facebook
          </TabsTrigger>
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
            <Select value={contentType} onValueChange={setContentType}>
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
              YouTube Channel URL or ID
            </label>
            <Input
              placeholder="https://youtube.com/c/channelname or channel ID"
              className="bg-gray-800 border-gray-700"
              value={channelId}
              onChange={(e) => setChannelId(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              API Key (required)
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
            <Select value={contentType} onValueChange={setContentType}>
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

        <TabsContent value="linkedin" className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              LinkedIn Access Token
            </label>
            <Input
              placeholder="Your LinkedIn API Access Token"
              className="bg-gray-800 border-gray-700"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              type="password"
            />
          </div>
          <div className="p-3 bg-blue-900/20 rounded-md border border-blue-500/20 text-sm">
            <p>
              LinkedIn API integration requires a LinkedIn Developer account and
              approved application.
            </p>
            <p className="mt-2">
              For more information, visit the{" "}
              <a
                href="https://developer.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                LinkedIn Developer Portal
              </a>
              .
            </p>
          </div>
        </TabsContent>

        <TabsContent value="facebook" className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Facebook Access Token
            </label>
            <Input
              placeholder="Your Facebook API Access Token"
              className="bg-gray-800 border-gray-700"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              type="password"
            />
          </div>
          <div className="p-3 bg-blue-900/20 rounded-md border border-blue-500/20 text-sm">
            <p>
              Facebook API integration requires a Facebook Developer account and
              approved application.
            </p>
            <p className="mt-2">
              For more information, visit the{" "}
              <a
                href="https://developers.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                Facebook Developer Portal
              </a>
              .
            </p>
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
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
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
