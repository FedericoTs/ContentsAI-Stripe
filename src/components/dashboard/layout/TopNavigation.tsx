import React from "react";
import { Bell, Home, Search, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "../../../../supabase/auth";
import { Link } from "react-router-dom";
import { applyTempoTheme } from "@/lib/tempo-theme";

interface TopNavigationProps {
  onSearch?: (query: string) => void;
  notifications?: Array<{ id: string; title: string }>;
}

const TopNavigation = ({
  onSearch = () => {},
  notifications = [
    { id: "1", title: "New project assigned" },
    { id: "2", title: "Meeting reminder" },
  ],
}: TopNavigationProps) => {
  const { user, signOut, subscriptionStatus } = useAuth();

  if (!user) return null;

  return (
    <div className="w-full h-16 border-b border-white/10 bg-black/80 backdrop-blur-md flex items-center justify-between px-4 fixed top-0 z-50">
      <div className="flex items-center gap-4 flex-1">
        <Link to="/" className="flex items-center">
          <Home className="h-5 w-5 text-purple-400" />
        </Link>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-white/50" />
          <Input
            placeholder="Search projects..."
            className={`pl-8 h-9 text-sm ${applyTempoTheme("input")}`}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative text-white hover:bg-white/10"
                  >
                    <Bell className="h-5 w-5" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {notifications.length}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-64 bg-black/80 backdrop-blur-md border-white/10 text-white"
                >
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  {notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className="py-2 text-white/70 hover:text-white hover:bg-purple-500/30"
                    >
                      {notification.title}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </TooltipTrigger>
            <TooltipContent className="bg-black/80 text-white border-white/10">
              <p>Notifications</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-purple-500/30"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-black/80 text-white border-white/10">
              <p>Settings</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="gap-2 text-white hover:bg-purple-500/30"
            >
              <Avatar className="h-8 w-8 border border-white/10">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                  alt={user.email || ""}
                />
                <AvatarFallback className="bg-black/40">
                  {user.email?.[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:inline-block text-sm">
                {user.email}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-64 bg-black/80 backdrop-blur-md border-white/10 text-white"
          >
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem
              className="py-2 text-white/70 hover:text-white hover:bg-purple-500/30"
              asChild
            >
              <Link to="/profile">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="py-2 text-white/70 hover:text-white hover:bg-purple-500/30">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-white/10" />

            <DropdownMenuLabel className="text-xs text-white/50">
              Subscription Status
            </DropdownMenuLabel>
            <div className="px-2 py-1 text-sm">
              {subscriptionStatus.isActive ? (
                <div className="flex flex-col gap-1">
                  <div className="flex items-center">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                    <span className="text-green-400 font-medium">
                      {subscriptionStatus.trialActive
                        ? "Trial Active"
                        : "Active Subscription"}
                    </span>
                  </div>
                  <div className="text-xs text-white/60 pl-4">
                    {subscriptionStatus.currentPeriodEnd ? (
                      <span>
                        Renews:{" "}
                        {new Date(
                          subscriptionStatus.currentPeriodEnd * 1000,
                        ).toLocaleDateString()}
                      </span>
                    ) : (
                      <span>Manage your subscription in profile</span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center">
                  <span className="inline-block w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>
                  <span className="text-yellow-400">Free Plan</span>
                </div>
              )}
            </div>

            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem
              onSelect={() => signOut()}
              className="py-2 text-white/70 hover:text-white hover:bg-purple-500/30"
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TopNavigation;
