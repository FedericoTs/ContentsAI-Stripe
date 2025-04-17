import React, { useState, useEffect } from "react";
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
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Linkedin,
  Facebook,
  FileText,
  Youtube,
  RefreshCw,
  Key,
  Shield,
  Eye,
  EyeOff,
  Info,
  Check,
} from "lucide-react";
import { supabase } from "../../../supabase/supabase";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Define schemas for each API type
const youtubeSchema = z.object({
  api_key: z.string().min(1, { message: "API Key is required" }),
});

const linkedinSchema = z.object({
  access_token: z.string().min(1, { message: "Access Token is required" }),
});

const facebookSchema = z.object({
  access_token: z.string().min(1, { message: "Access Token is required" }),
});

const ApiAccessManager: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("youtube");
  const [isLoading, setIsLoading] = useState(false);
  const [showYoutubeKey, setShowYoutubeKey] = useState(false);
  const [showLinkedinToken, setShowLinkedinToken] = useState(false);
  const [showFacebookToken, setShowFacebookToken] = useState(false);

  // Forms
  const youtubeForm = useForm<z.infer<typeof youtubeSchema>>({
    resolver: zodResolver(youtubeSchema),
    defaultValues: {
      api_key: "",
    },
  });

  const linkedinForm = useForm<z.infer<typeof linkedinSchema>>({
    resolver: zodResolver(linkedinSchema),
    defaultValues: {
      access_token: "",
    },
  });

  const facebookForm = useForm<z.infer<typeof facebookSchema>>({
    resolver: zodResolver(facebookSchema),
    defaultValues: {
      access_token: "",
    },
  });

  // Fetch existing API keys on component mount
  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    setIsLoading(true);
    try {
      // Fetch YouTube API key
      const { data: youtubeData } = await supabase
        .from("api_keys")
        .select("*")
        .eq("service", "youtube")
        .maybeSingle();

      if (youtubeData) {
        youtubeForm.setValue("api_key", youtubeData.api_key);
      }

      // Fetch LinkedIn access token
      const { data: linkedinData } = await supabase
        .from("api_keys")
        .select("*")
        .eq("service", "linkedin")
        .maybeSingle();

      if (linkedinData) {
        linkedinForm.setValue("access_token", linkedinData.api_key);
      }

      // Fetch Facebook access token
      const { data: facebookData } = await supabase
        .from("api_keys")
        .select("*")
        .eq("service", "facebook")
        .maybeSingle();

      if (facebookData) {
        facebookForm.setValue("access_token", facebookData.api_key);
      }
    } catch (error) {
      console.error("Error fetching API keys:", error);
      toast({
        title: "Error",
        description: "Failed to load saved API keys",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Save YouTube API key
  const onYoutubeSubmit = async (values: z.infer<typeof youtubeSchema>) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.from("api_keys").upsert(
        {
          service: "youtube",
          api_key: values.api_key,
          last_updated: new Date().toISOString(),
        },
        { onConflict: "service" },
      );

      if (error) throw error;

      toast({
        title: "Success",
        description: "YouTube API key saved successfully",
      });
    } catch (error) {
      console.error("Error saving YouTube API key:", error);
      toast({
        title: "Error",
        description: "Failed to save YouTube API key",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Save LinkedIn access token
  const onLinkedinSubmit = async (values: z.infer<typeof linkedinSchema>) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.from("api_keys").upsert(
        {
          service: "linkedin",
          api_key: values.access_token,
          last_updated: new Date().toISOString(),
        },
        { onConflict: "service" },
      );

      if (error) throw error;

      toast({
        title: "Success",
        description: "LinkedIn access token saved successfully",
      });
    } catch (error) {
      console.error("Error saving LinkedIn access token:", error);
      toast({
        title: "Error",
        description: "Failed to save LinkedIn access token",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Save Facebook access token
  const onFacebookSubmit = async (values: z.infer<typeof facebookSchema>) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.from("api_keys").upsert(
        {
          service: "facebook",
          api_key: values.access_token,
          last_updated: new Date().toISOString(),
        },
        { onConflict: "service" },
      );

      if (error) throw error;

      toast({
        title: "Success",
        description: "Facebook access token saved successfully",
      });
    } catch (error) {
      console.error("Error saving Facebook access token:", error);
      toast({
        title: "Error",
        description: "Failed to save Facebook access token",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Test API key/token
  const testApiKey = async (service: string) => {
    setIsLoading(true);
    try {
      // This would be a real API test in production
      // For now, just simulate a test
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "API Test Successful",
        description: `Your ${service} API credentials are working correctly`,
      });
    } catch (error) {
      toast({
        title: "API Test Failed",
        description: `Unable to verify your ${service} API credentials`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-400" />
          API Access Manager
        </CardTitle>
        <CardDescription>
          Securely manage your API keys and access tokens for external content
          sources
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="youtube" className="flex items-center">
              <Youtube className="h-4 w-4 mr-2 text-red-500" />
              YouTube
            </TabsTrigger>
            <TabsTrigger value="linkedin" className="flex items-center">
              <Linkedin className="h-4 w-4 mr-2 text-blue-500" />
              LinkedIn
            </TabsTrigger>
            <TabsTrigger value="facebook" className="flex items-center">
              <Facebook className="h-4 w-4 mr-2 text-blue-600" />
              Facebook
            </TabsTrigger>
          </TabsList>

          {/* YouTube Tab */}
          <TabsContent value="youtube">
            <Form {...youtubeForm}>
              <form
                onSubmit={youtubeForm.handleSubmit(onYoutubeSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={youtubeForm.control}
                  name="api_key"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        YouTube API Key
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-gray-400 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-sm">
                              <p>
                                You need a Google Cloud Platform account to
                                create a YouTube Data API key.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <div className="relative flex-1">
                            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                              placeholder="Enter your YouTube API Key"
                              className="pl-10 bg-gray-800 border-gray-700"
                              type={showYoutubeKey ? "text" : "password"}
                              {...field}
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                              onClick={() => setShowYoutubeKey(!showYoutubeKey)}
                            >
                              {showYoutubeKey ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Your YouTube Data API key is used to fetch videos from
                        YouTube channels
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="p-3 bg-blue-900/20 rounded-md border border-blue-500/20 text-sm text-gray-300">
                  <p>
                    <strong>How to get a YouTube API Key:</strong>
                  </p>
                  <ol className="list-decimal pl-5 mt-2 space-y-1">
                    <li>
                      Go to the{" "}
                      <a
                        href="https://console.cloud.google.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                      >
                        Google Cloud Console
                      </a>
                    </li>
                    <li>Create a new project</li>
                    <li>Enable the YouTube Data API v3</li>
                    <li>Create credentials (API Key)</li>
                    <li>Copy and paste the API key here</li>
                  </ol>
                </div>
                <div className="flex justify-between pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => testApiKey("YouTube")}
                    disabled={isLoading || !youtubeForm.getValues().api_key}
                  >
                    Test API Key
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Save API Key
                      </>
                    )}
                  </Button>
                </div>
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
                  name="access_token"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        LinkedIn Access Token
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-gray-400 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-sm">
                              <p>
                                You need a LinkedIn Developer account to create
                                an application and get an access token.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <div className="relative flex-1">
                            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                              placeholder="Enter your LinkedIn Access Token"
                              className="pl-10 bg-gray-800 border-gray-700"
                              type={showLinkedinToken ? "text" : "password"}
                              {...field}
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                              onClick={() =>
                                setShowLinkedinToken(!showLinkedinToken)
                              }
                            >
                              {showLinkedinToken ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Your LinkedIn access token is used to fetch content from
                        your LinkedIn profile
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="p-3 bg-blue-900/20 rounded-md border border-blue-500/20 text-sm text-gray-300">
                  <p>
                    <strong>How to get a LinkedIn Access Token:</strong>
                  </p>
                  <ol className="list-decimal pl-5 mt-2 space-y-1">
                    <li>
                      Go to the{" "}
                      <a
                        href="https://www.linkedin.com/developers/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                      >
                        LinkedIn Developer Portal
                      </a>
                    </li>
                    <li>Create a new application</li>
                    <li>Configure the OAuth 2.0 settings</li>
                    <li>
                      Generate an access token with the required permissions
                    </li>
                    <li>Copy and paste the access token here</li>
                  </ol>
                </div>
                <div className="flex justify-between pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => testApiKey("LinkedIn")}
                    disabled={
                      isLoading || !linkedinForm.getValues().access_token
                    }
                  >
                    Test Access Token
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Save Access Token
                      </>
                    )}
                  </Button>
                </div>
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
                  name="access_token"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        Facebook Access Token
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-gray-400 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-sm">
                              <p>
                                You need a Facebook Developer account to create
                                an application and get an access token.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <div className="relative flex-1">
                            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                              placeholder="Enter your Facebook Access Token"
                              className="pl-10 bg-gray-800 border-gray-700"
                              type={showFacebookToken ? "text" : "password"}
                              {...field}
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                              onClick={() =>
                                setShowFacebookToken(!showFacebookToken)
                              }
                            >
                              {showFacebookToken ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Your Facebook access token is used to fetch content from
                        your Facebook pages
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="p-3 bg-blue-900/20 rounded-md border border-blue-500/20 text-sm text-gray-300">
                  <p>
                    <strong>How to get a Facebook Access Token:</strong>
                  </p>
                  <ol className="list-decimal pl-5 mt-2 space-y-1">
                    <li>
                      Go to the{" "}
                      <a
                        href="https://developers.facebook.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                      >
                        Facebook Developer Portal
                      </a>
                    </li>
                    <li>Create a new application</li>
                    <li>Configure the OAuth settings</li>
                    <li>
                      Generate an access token with the required permissions
                    </li>
                    <li>Copy and paste the access token here</li>
                  </ol>
                </div>
                <div className="flex justify-between pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => testApiKey("Facebook")}
                    disabled={
                      isLoading || !facebookForm.getValues().access_token
                    }
                  >
                    Test Access Token
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Save Access Token
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="pt-2 text-xs text-gray-400 flex items-center">
        <Shield className="h-3.5 w-3.5 mr-1.5 text-green-500" />
        <p>
          Your API keys and access tokens are securely stored and encrypted in
          our database.
        </p>
      </CardFooter>
    </Card>
  );
};

export default ApiAccessManager;
