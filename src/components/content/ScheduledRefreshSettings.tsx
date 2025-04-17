import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Clock, RefreshCw, Save, Trash2 } from "lucide-react";
import { supabase } from "../../../supabase/supabase";

const ScheduledRefreshSettings: React.FC = () => {
  const { toast } = useToast();
  const [isEnabled, setIsEnabled] = useState(false);
  const [interval, setInterval] = useState("60"); // Default to 60 minutes
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<string | null>(null);
  const [cleanupEnabled, setCleanupEnabled] = useState(true);
  const [cleanupDays, setCleanupDays] = useState("30"); // Default to 30 days
  const [lastCleanup, setLastCleanup] = useState<string | null>(null);
  const [isCleanupLoading, setIsCleanupLoading] = useState(false);

  // Fetch current settings on component mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      // Fetch refresh settings
      const { data: refreshData, error: refreshError } = await supabase
        .from("user_settings")
        .select("*")
        .eq("setting_name", "rss_refresh")
        .maybeSingle();

      if (refreshError) throw refreshError;

      if (refreshData) {
        setIsEnabled(refreshData.is_enabled);
        setInterval(refreshData.value || "60");
        setLastRefresh(refreshData.last_updated_at);
      }

      // Fetch cleanup settings
      const { data: cleanupData, error: cleanupError } = await supabase
        .from("user_settings")
        .select("*")
        .eq("setting_name", "rss_cleanup")
        .maybeSingle();

      if (cleanupError) throw cleanupError;

      if (cleanupData) {
        setCleanupEnabled(cleanupData.is_enabled);
        setCleanupDays(cleanupData.value || "30");
        setLastCleanup(cleanupData.last_updated_at);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const saveSettings = async () => {
    setIsLoading(true);
    try {
      // Save refresh settings
      const { data, error } = await supabase
        .from("user_settings")
        .upsert(
          {
            setting_name: "rss_refresh",
            is_enabled: isEnabled,
            value: interval,
            last_updated_at: new Date().toISOString(),
          },
          { onConflict: "setting_name" },
        )
        .select();

      if (error) throw error;

      // Save cleanup settings
      const { data: cleanupData, error: cleanupError } = await supabase
        .from("user_settings")
        .upsert(
          {
            setting_name: "rss_cleanup",
            is_enabled: cleanupEnabled,
            value: cleanupDays,
            last_updated_at: new Date().toISOString(),
          },
          { onConflict: "setting_name" },
        )
        .select();

      if (cleanupError) throw cleanupError;

      toast({
        title: "Settings Saved",
        description: "Your RSS settings have been updated",
      });

      setLastRefresh(data[0].last_updated_at);
      setLastCleanup(cleanupData[0].last_updated_at);

      // If cleanup is enabled, schedule it to run
      if (cleanupEnabled) {
        scheduleCleanup();
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const triggerManualRefresh = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "supabase-functions-refresh-all-feeds",
        {
          body: {},
        },
      );

      if (error) throw error;

      toast({
        title: "Feeds Refreshed",
        description: `Successfully refreshed ${data.successfulFeeds} feeds`,
      });

      // Update last refresh time
      setLastRefresh(new Date().toISOString());
      await supabase.from("user_settings").upsert(
        {
          setting_name: "rss_refresh",
          is_enabled: isEnabled,
          value: interval,
          last_updated_at: new Date().toISOString(),
        },
        { onConflict: "setting_name" },
      );
    } catch (error) {
      console.error("Error refreshing feeds:", error);
      toast({
        title: "Error",
        description: "Failed to refresh feeds",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Run cleanup of old articles
  const triggerCleanup = async () => {
    setIsCleanupLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "supabase-functions-cleanup-old-articles",
        {
          body: { days: parseInt(cleanupDays), dryRun: false },
        },
      );

      if (error) throw error;

      toast({
        title: "Cleanup Complete",
        description: data.message || `Cleaned up old articles`,
      });

      // Update last cleanup time
      setLastCleanup(new Date().toISOString());
      await supabase.from("user_settings").upsert(
        {
          setting_name: "rss_cleanup",
          is_enabled: cleanupEnabled,
          value: cleanupDays,
          last_updated_at: new Date().toISOString(),
        },
        { onConflict: "setting_name" },
      );
    } catch (error) {
      console.error("Error cleaning up old articles:", error);
      toast({
        title: "Error",
        description: "Failed to clean up old articles",
        variant: "destructive",
      });
    } finally {
      setIsCleanupLoading(false);
    }
  };

  // Schedule cleanup to run in the background
  const scheduleCleanup = async () => {
    try {
      // This is just a simulation of scheduling - in a real app, this would be handled by a cron job
      // For now, we'll just run it once to demonstrate
      await supabase.functions.invoke(
        "supabase-functions-cleanup-old-articles",
        {
          body: { days: parseInt(cleanupDays), dryRun: false },
        },
      );

      console.log("Scheduled cleanup completed");
    } catch (error) {
      console.error("Error in scheduled cleanup:", error);
    }
  };

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">RSS Feed Management</CardTitle>
        <CardDescription>
          Configure automatic refreshing and cleanup of your RSS feeds
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Refresh Settings Section */}
        <div className="space-y-4">
          <h3 className="text-md font-medium">Refresh Settings</h3>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-refresh">Auto Refresh</Label>
              <p className="text-sm text-gray-400">
                Automatically refresh your feeds at regular intervals
              </p>
            </div>
            <Switch
              id="auto-refresh"
              checked={isEnabled}
              onCheckedChange={setIsEnabled}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="refresh-interval">Refresh Interval</Label>
            <Select
              value={interval}
              onValueChange={setInterval}
              disabled={!isEnabled}
            >
              <SelectTrigger
                id="refresh-interval"
                className="bg-gray-800 border-gray-700"
              >
                <SelectValue placeholder="Select interval" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">Every 15 minutes</SelectItem>
                <SelectItem value="30">Every 30 minutes</SelectItem>
                <SelectItem value="60">Every hour</SelectItem>
                <SelectItem value="120">Every 2 hours</SelectItem>
                <SelectItem value="360">Every 6 hours</SelectItem>
                <SelectItem value="720">Every 12 hours</SelectItem>
                <SelectItem value="1440">Every day</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {lastRefresh && (
            <div className="text-sm text-gray-400 flex items-center">
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              Last refreshed: {new Date(lastRefresh).toLocaleString()}
            </div>
          )}
        </div>

        {/* Cleanup Settings Section */}
        <div className="space-y-4 pt-2 border-t border-gray-800">
          <h3 className="text-md font-medium pt-2">Cleanup Settings</h3>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-cleanup">Auto Cleanup</Label>
              <p className="text-sm text-gray-400">
                Automatically delete old, unsaved articles
              </p>
            </div>
            <Switch
              id="auto-cleanup"
              checked={cleanupEnabled}
              onCheckedChange={setCleanupEnabled}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cleanup-days">Retention Period (Days)</Label>
            <Select
              value={cleanupDays}
              onValueChange={setCleanupDays}
              disabled={!cleanupEnabled}
            >
              <SelectTrigger
                id="cleanup-days"
                className="bg-gray-800 border-gray-700"
              >
                <SelectValue placeholder="Select days" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="14">14 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="60">60 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <p className="text-sm text-gray-400">
            Articles that are saved or transformed will not be deleted
            regardless of age.
          </p>

          {lastCleanup && (
            <div className="text-sm text-gray-400 flex items-center">
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              Last cleanup: {new Date(lastCleanup).toLocaleString()}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t border-gray-800 pt-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={triggerManualRefresh}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh Now
          </Button>
          <Button
            variant="outline"
            onClick={triggerCleanup}
            disabled={isCleanupLoading}
          >
            <Trash2
              className={`h-4 w-4 mr-2 ${isCleanupLoading ? "animate-spin" : ""}`}
            />
            Clean Up Now
          </Button>
        </div>
        <Button onClick={saveSettings} disabled={isLoading || isCleanupLoading}>
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ScheduledRefreshSettings;
