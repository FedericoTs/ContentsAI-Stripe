import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Home,
  LayoutDashboard,
  Calendar,
  Users,
  Settings,
  HelpCircle,
  FolderKanban,
  FileText,
} from "lucide-react";
import { applyTempoTheme } from "@/lib/tempo-theme";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href?: string;
  isActive?: boolean;
}

interface SidebarProps {
  items?: NavItem[];
  activeItem?: string;
  onItemClick?: (label: string) => void;
}

const defaultNavItems: NavItem[] = [
  { icon: <Home size={18} />, label: "Home", href: "/" },
  {
    icon: <LayoutDashboard size={18} />,
    label: "Dashboard",
    href: "/dashboard",
    isActive: true,
  },
  { icon: <FileText size={18} />, label: "Content", href: "/content" },
  { icon: <FolderKanban size={18} />, label: "Archive", href: "/archive" },
  { icon: <Calendar size={18} />, label: "Calendar", href: "/schedule" },
  { icon: <Users size={18} />, label: "Team", href: "/team" },
];

const defaultBottomItems: NavItem[] = [
  { icon: <Settings size={18} />, label: "Settings" },
  { icon: <HelpCircle size={18} />, label: "Help" },
];

const Sidebar = ({
  items = defaultNavItems,
  activeItem = "Dashboard",
  onItemClick = () => {},
}: SidebarProps) => {
  return (
    <div className="w-[240px] h-full border-r border-gray-800/20 bg-gray-950/90 flex flex-col">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-1 tempo-gradient-text">
          Projects
        </h2>
        <p className="text-sm text-gray-400">Manage your projects and tasks</p>
      </div>

      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1">
          {items.map((item) => (
            <Button
              key={item.label}
              variant={item.label === activeItem ? "secondary" : "ghost"}
              className={`w-full justify-start gap-2 text-sm h-10 ${item.label === activeItem ? "bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 hover:text-purple-200" : "text-gray-300 hover:bg-gray-800/50 hover:text-gray-100"}`}
              onClick={() => {
                onItemClick(item.label);
                if (item.href) {
                  window.location.href = item.href;
                }
              }}
            >
              <span
                className={
                  item.label === activeItem
                    ? "text-purple-300"
                    : "text-gray-400"
                }
              >
                {item.icon}
              </span>
              {item.label}
            </Button>
          ))}
        </div>

        <Separator className="my-4 bg-gray-800/50" />

        <div className="space-y-1">
          <h3 className="text-xs font-medium px-3 py-2 text-gray-400">
            Filters
          </h3>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-sm h-9 text-gray-300 hover:bg-gray-800/50 hover:text-gray-100"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            Active
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-sm h-9 text-gray-300 hover:bg-gray-800/50 hover:text-gray-100"
          >
            <span className="h-2 w-2 rounded-full bg-red-500"></span>
            High Priority
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-sm h-9 text-gray-300 hover:bg-gray-800/50 hover:text-gray-100"
          >
            <span className="h-2 w-2 rounded-full bg-amber-500"></span>
            In Progress
          </Button>
        </div>
      </ScrollArea>

      <div className="p-3 mt-auto border-t border-gray-800/20">
        {defaultBottomItems.map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            className="w-full justify-start gap-2 text-sm h-10 mb-1 text-gray-300 hover:bg-gray-800/50 hover:text-gray-100"
            onClick={() => onItemClick(item.label)}
          >
            <span className="text-gray-400">{item.icon}</span>
            {item.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
