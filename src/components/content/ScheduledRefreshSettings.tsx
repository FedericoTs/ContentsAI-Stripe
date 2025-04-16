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
import { Clock, RefreshCw, Save } from "lucide-react";
import { supabase } from "../../../supabase/supabase";

const ScheduledRefreshSettings: React.FC = () => {
  const { toast } = useToast();
  const [isEnabled, setIsEnabled] = useState(false);
  const [interval, setInterval] = useState("60"); // Default to 60 minutes
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<string | null>(null);

  // Fetch current settings on component mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("user_settings")
        .select("*")
        .eq("setting_name", "rss_refresh")
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setIsEnabled(data.is_enabled);
        setInterval(data.value || "60");
        setLastRefresh(data.last_updated_at);
      }
    } catch (error) {
      console.error("Error fetching refresh settings:", error);
    }
  };

  const saveSettings = async () => {
    setIsLoading(true);
    try {
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

      toast({
        title: "Settings Saved",
        description: "Your refresh settings have been updated",
      });

      setLastRefresh(data[0].last_updated_at);
    } catch (error) {
      console.error("Error saving refresh settings:", error);
      toast({
        title: "Error",
        description: "Failed to save refresh settings",
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

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Scheduled Refresh</CardTitle>
        <CardDescription>
          Configure automatic refreshing of your RSS feeds
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
      </CardContent>
      <CardFooter className="flex justify-between">
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
        <Button onClick={saveSettings} disabled={isLoading}>
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ScheduledRefreshSettings;
