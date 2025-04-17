import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Linkedin,
  Facebook,
  FileText,
  Youtube,
  RefreshCw,
  Link,
  Key,
  User,
} from "lucide-react";
import {
  fetchLinkedinContent,
  fetchFacebookContent,
  fetchWordpressContent,
  fetchYoutubeContent,
  saveExternalContent,
} from "@/lib/external-content-service";

const wordpressSchema = z.object({
  siteUrl: z
    .string()
    .url({ message: "Please enter a valid WordPress site URL" }),
});

const youtubeSchema = z.object({
  apiKey: z.string().min(1, { message: "API Key is required" }),
  channelId: z.string().min(1, { message: "Channel ID is required" }),
});

const linkedinSchema = z.object({
  accessToken: z.string().min(1, { message: "Access Token is required" }),
});

const facebookSchema = z.object({
  accessToken: z.string().min(1, { message: "Access Token is required" }),
});

interface ExternalContentImportProps {
  onImportComplete?: () => void;
}

const ExternalContentImport: React.FC<ExternalContentImportProps> = ({
  onImportComplete,
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("wordpress");
  const [isLoading, setIsLoading] = useState(false);

  // Forms
  const wordpressForm = useForm<z.infer<typeof wordpressSchema>>({
    resolver: zodResolver(wordpressSchema),
    defaultValues: {
      siteUrl: "",
    },
  });

  const youtubeForm = useForm<z.infer<typeof youtubeSchema>>({
    resolver: zodResolver(youtubeSchema),
    defaultValues: {
      apiKey: "",
      channelId: "",
    },
  });

  const linkedinForm = useForm<z.infer<typeof linkedinSchema>>({
    resolver: zodResolver(linkedinSchema),
    defaultValues: {
      accessToken: "",
    },
  });

  const facebookForm = useForm<z.infer<typeof facebookSchema>>({
    resolver: zodResolver(facebookSchema),
    defaultValues: {
      accessToken: "",
    },
  });

  // Handle WordPress import
  const onWordpressSubmit = async (values: z.infer<typeof wordpressSchema>) => {
    setIsLoading(true);
    try {
      const { success, data, error, message } = await fetchWordpressContent(
        values.siteUrl,
      );

      if (success && data && data.length > 0) {
        // Save each post to the database
        let savedCount = 0;
        for (const post of data) {
          const saveResult = await saveExternalContent(post);
          if (saveResult.success) savedCount++;
        }

        toast({
          title: "Import Successful",
          description: `Imported ${savedCount} posts from WordPress`,
        });

        if (onImportComplete) onImportComplete();
        wordpressForm.reset();
      } else {
        toast({
          title: "Import Failed",
          description:
            message || error?.message || "Failed to import WordPress content",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error importing WordPress content:", error);
      toast({
        title: "Import Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle YouTube import
  const onYoutubeSubmit = async (values: z.infer<typeof youtubeSchema>) => {
    setIsLoading(true);
    try {
      const { success, data, error } = await fetchYoutubeContent(
        values.apiKey,
        values.channelId,
      );

      if (success && data && data.length > 0) {
        // Save each video to the database
        let savedCount = 0;
        for (const video of data) {
          const saveResult = await saveExternalContent(video);
          if (saveResult.success) savedCount++;
        }

        toast({
          title: "Import Successful",
          description: `Imported ${savedCount} videos from YouTube`,
        });

        if (onImportComplete) onImportComplete();
        youtubeForm.reset();
      } else {
        toast({
          title: "Import Failed",
          description: error?.message || "Failed to import YouTube content",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error importing YouTube content:", error);
      toast({
        title: "Import Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle LinkedIn import
  const onLinkedinSubmit = async (values: z.infer<typeof linkedinSchema>) => {
    setIsLoading(true);
    try {
      const { success, data, error, message } = await fetchLinkedinContent(
        values.accessToken,
      );

      if (success && data && data.length > 0) {
        // Save each post to the database
        let savedCount = 0;
        for (const post of data) {
          const saveResult = await saveExternalContent(post);
          if (saveResult.success) savedCount++;
        }

        toast({
          title: "Import Successful",
          description: `Imported ${savedCount} posts from LinkedIn`,
        });

        if (onImportComplete) onImportComplete();
        linkedinForm.reset();
      } else {
        toast({
          title: "Import Information",
          description:
            message ||
            error?.message ||
            "LinkedIn API requires developer credentials",
        });
      }
    } catch (error) {
      console.error("Error importing LinkedIn content:", error);
      toast({
        title: "Import Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Facebook import
  const onFacebookSubmit = async (values: z.infer<typeof facebookSchema>) => {
    setIsLoading(true);
    try {
      const { success, data, error, message } = await fetchFacebookContent(
        values.accessToken,
      );

      if (success && data && data.length > 0) {
        // Save each post to the database
        let savedCount = 0;
        for (const post of data) {
          const saveResult = await saveExternalContent(post);
          if (saveResult.success) savedCount++;
        }

        toast({
          title: "Import Successful",
          description: `Imported ${savedCount} posts from Facebook`,
        });

        if (onImportComplete) onImportComplete();
        facebookForm.reset();
      } else {
        toast({
          title: "Import Information",
          description:
            message ||
            error?.message ||
            "Facebook API requires developer credentials",
        });
      }
    } catch (error) {
      console.error("Error importing Facebook content:", error);
      toast({
        title: "Import Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Import External Content</CardTitle>
        <CardDescription>
          Import content from various platforms to your personal collection
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="wordpress" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              WordPress
            </TabsTrigger>
            <TabsTrigger value="youtube" className="flex items-center">
              <Youtube className="h-4 w-4 mr-2" />
              YouTube
            </TabsTrigger>
            <TabsTrigger value="linkedin" className="flex items-center">
              <Linkedin className="h-4 w-4 mr-2" />
              LinkedIn
            </TabsTrigger>
            <TabsTrigger value="facebook" className="flex items-center">
              <Facebook className="h-4 w-4 mr-2" />
              Facebook
            </TabsTrigger>
          </TabsList>

          {/* WordPress Tab */}
          <TabsContent value="wordpress">
            <Form {...wordpressForm}>
              <form
                onSubmit={wordpressForm.handleSubmit(onWordpressSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={wordpressForm.control}
                  name="siteUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WordPress Site URL</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Link className="h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="https://example.com"
                            className="bg-gray-800 border-gray-700"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Enter the URL of a WordPress site to import posts
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    "Import WordPress Content"
                  )}
                </Button>
              </form>
            </Form>
          </TabsContent>

          {/* YouTube Tab */}
          <TabsContent value="youtube">
            <Form {...youtubeForm}>
              <form
                onSubmit={youtubeForm.handleSubmit(onYoutubeSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={youtubeForm.control}
                  name="apiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>YouTube API Key</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Key className="h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Your YouTube API Key"
                            className="bg-gray-800 border-gray-700"
                            type="password"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Enter your YouTube Data API key
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={youtubeForm.control}
                  name="channelId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Channel ID</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="UC..."
                            className="bg-gray-800 border-gray-700"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Enter the YouTube channel ID to import videos from
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    "Import YouTube Videos"
                  )}
                </Button>
              </form>
            </Form>
          </TabsContent>

          {/* LinkedIn Tab */}
          <TabsContent value="linkedin">
            <Form {...linkedinForm}>
              <form
                onSubmit={linkedinForm.handleSubmit(onLinkedinSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={linkedinForm.control}
                  name="accessToken"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn Access Token</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Key className="h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Your LinkedIn Access Token"
                            className="bg-gray-800 border-gray-700"
                            type="password"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Enter your LinkedIn API access token
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="p-3 bg-blue-900/20 rounded-md border border-blue-500/20 text-sm text-gray-300">
                  <p>
                    <strong>Note:</strong> LinkedIn API access requires a
                    LinkedIn Developer account and an approved application.
                    Visit the{" "}
                    <a
                      href="https://developer.linkedin.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      LinkedIn Developer Portal
                    </a>{" "}
                    to create an application and obtain credentials.
                  </p>
                  <p className="mt-2">
                    You can manage your API keys in the{" "}
                    <button
                      type="button"
                      onClick={() =>
                        (window.location.href = "/content?tab=api")
                      }
                      className="text-blue-400 hover:underline"
                    >
                      API Access Manager
                    </button>
                  </p>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    "Import LinkedIn Content"
                  )}
                </Button>
              </form>
            </Form>
          </TabsContent>

          {/* Facebook Tab */}
          <TabsContent value="facebook">
            <Form {...facebookForm}>
              <form
                onSubmit={facebookForm.handleSubmit(onFacebookSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={facebookForm.control}
                  name="accessToken"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facebook Access Token</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Key className="h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Your Facebook Access Token"
                            className="bg-gray-800 border-gray-700"
                            type="password"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Enter your Facebook Graph API access token
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="p-3 bg-blue-900/20 rounded-md border border-blue-500/20 text-sm text-gray-300">
                  <p>
                    <strong>Note:</strong> Facebook API access requires a
                    Facebook Developer account and an approved application.
                    Visit the{" "}
                    <a
                      href="https://developers.facebook.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      Facebook Developer Portal
                    </a>{" "}
                    to create an application and obtain credentials.
                  </p>
                  <p className="mt-2">
                    You can manage your API keys in the{" "}
                    <button
                      type="button"
                      onClick={() =>
                        (window.location.href = "/content?tab=api")
                      }
                      className="text-blue-400 hover:underline"
                    >
                      API Access Manager
                    </button>
                  </p>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    "Import Facebook Content"
                  )}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="pt-2 text-xs text-gray-400">
        <p>
          Content imported from external sources will be automatically
          classified and available in your Personal Collection.
        </p>
      </CardFooter>
    </Card>
  );
};

export default ExternalContentImport;
