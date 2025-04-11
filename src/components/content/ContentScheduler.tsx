import React, { useState } from "react";
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  ImageIcon,
  Mic,
  Plus,
  Video,
} from "lucide-react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
// Helper function for class name merging
const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

// Define content item type
interface ContentItem {
  id: number;
  title: string;
  time: string;
  platform: string;
  type: "blog" | "social" | "podcast" | "image" | "video";
  color: string;
}

// Define scheduled content item
interface ScheduledItem extends ContentItem {
  dayIndex: number;
}

// Drag item type
const ItemTypes = {
  CONTENT_CARD: "contentCard",
};

// Draggable content card component
const DraggableContentCard = ({
  item,
  isScheduled = false,
}: {
  item: ContentItem;
  isScheduled?: boolean;
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.CONTENT_CARD,
    item: { ...item },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // Get icon based on content type
  const getIcon = () => {
    switch (item.type) {
      case "blog":
        return <FileText className="h-4 w-4" />;
      case "podcast":
        return <Mic className="h-4 w-4" />;
      case "image":
        return <ImageIcon className="h-4 w-4" />;
      case "video":
        return <Video className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div
      ref={drag}
      className={`cursor-grab rounded-md border p-2 transition-all ${isDragging ? "opacity-50" : ""} ${isScheduled ? "bg-gray-900/50" : "bg-gray-800/50 hover:shadow-md"} border-l-4`}
      style={{
        opacity: isDragging ? 0.5 : 1,
        borderLeftColor: getColorClass(item.color),
      }}
    >
      <div className="flex items-start gap-2">
        <div
          className={`flex h-6 w-6 items-center justify-center rounded-md`}
          style={{ backgroundColor: getColorBgClass(item.color) }}
        >
          {getIcon()}
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="font-medium truncate">{item.title}</div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>{item.time}</span>
            {item.platform && (
              <>
                <span>•</span>
                <span>{item.platform}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get color classes
function getColorClass(color: string): string {
  const colorMap: Record<string, string> = {
    purple: "#8b5cf6",
    blue: "#3b82f6",
    green: "#10b981",
    red: "#ef4444",
    amber: "#f59e0b",
    indigo: "#6366f1",
  };
  return colorMap[color] || "#3b82f6";
}

function getColorBgClass(color: string): string {
  const colorMap: Record<string, string> = {
    purple: "rgba(139, 92, 246, 0.2)",
    blue: "rgba(59, 130, 246, 0.2)",
    green: "rgba(16, 185, 129, 0.2)",
    red: "rgba(239, 68, 68, 0.2)",
    amber: "rgba(245, 158, 11, 0.2)",
    indigo: "rgba(99, 102, 241, 0.2)",
  };
  return colorMap[color] || "rgba(59, 130, 246, 0.2)";
}

// Droppable calendar day component
const DroppableDay = ({
  day,
  dayIndex,
  isToday,
  scheduledItems,
  onDrop,
}: {
  day: number;
  dayIndex: number;
  isToday: boolean;
  scheduledItems: ScheduledItem[];
  onDrop: (item: ContentItem, dayIndex: number) => void;
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.CONTENT_CARD,
    drop: (item: ContentItem) => onDrop(item, dayIndex),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  // Filter items scheduled for this day
  const dayItems = scheduledItems.filter((item) => item.dayIndex === dayIndex);

  return (
    <div
      ref={drop}
      className={`min-h-24 rounded-md border p-1 text-sm transition-colors ${isToday ? "bg-purple-900/20" : ""} ${isOver ? "ring-2 ring-purple-500" : ""} ${dayItems.length > 0 ? "border-purple-800/50" : "border-gray-800"}`}
    >
      <div className="font-medium">{day}</div>
      {dayItems.length > 0 && (
        <div className="mt-1 space-y-1">
          {dayItems.map((item) => (
            <DraggableContentCard key={item.id} item={item} isScheduled />
          ))}
        </div>
      )}
    </div>
  );
};

export function ContentScheduler() {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [scheduledItems, setScheduledItems] = useState<ScheduledItem[]>([
    {
      id: 1,
      title: "Marketing Blog Post",
      time: "09:00 AM",
      platform: "Website",
      dayIndex: 9,
      type: "blog",
      color: "purple",
    },
    {
      id: 2,
      title: "Product Feature Announcement",
      time: "11:30 AM",
      platform: "Twitter",
      dayIndex: 9,
      type: "social",
      color: "blue",
    },
    {
      id: 3,
      title: "Customer Success Story",
      time: "02:00 PM",
      platform: "LinkedIn",
      dayIndex: 12,
      type: "blog",
      color: "purple",
    },
    {
      id: 4,
      title: "Weekly Newsletter",
      time: "04:00 PM",
      platform: "Email",
      dayIndex: 16,
      type: "blog",
      color: "indigo",
    },
  ]);

  // Sample unscheduled content
  const unscheduledContent: ContentItem[] = [
    {
      id: 5,
      title: "Industry Insights Podcast",
      time: "10:00 AM",
      platform: "Spotify",
      type: "podcast",
      color: "green",
    },
    {
      id: 6,
      title: "Product Demo Video",
      time: "01:00 PM",
      platform: "YouTube",
      type: "video",
      color: "red",
    },
    {
      id: 7,
      title: "Monthly Report",
      time: "09:00 AM",
      platform: "Website",
      type: "blog",
      color: "blue",
    },
    {
      id: 8,
      title: "Feature Comparison Infographic",
      time: "11:00 AM",
      platform: "Pinterest",
      type: "image",
      color: "amber",
    },
  ];

  // Handle dropping content on a day
  const handleDrop = (item: ContentItem, dayIndex: number) => {
    // Check if item is already scheduled
    const existingItemIndex = scheduledItems.findIndex((i) => i.id === item.id);

    if (existingItemIndex >= 0) {
      // Update existing item's day
      const updatedItems = [...scheduledItems];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        dayIndex,
      };
      setScheduledItems(updatedItems);

      toast({
        title: "Content rescheduled",
        description: `"${item.title}" moved to ${format(addDays(startOfWeek(new Date()), dayIndex), "EEEE, MMM d")}`,
      });
    } else {
      // Add new scheduled item
      setScheduledItems([...scheduledItems, { ...item, dayIndex }]);

      toast({
        title: "Content scheduled",
        description: `"${item.title}" scheduled for ${format(addDays(startOfWeek(new Date()), dayIndex), "EEEE, MMM d")}`,
      });
    }
  };

  // Generate calendar days
  const calendarDays = Array.from({ length: 35 }).map((_, i) => {
    const dayDate = addDays(startOfWeek(new Date()), i);
    const isToday = isSameDay(dayDate, new Date());
    return { day: i < 31 ? i + 1 : i - 30, dayIndex: i, isToday };
  });

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col gap-6 p-6 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Content Scheduler
            </h1>
            <p className="text-gray-400">
              Drag and drop content to schedule publishing
            </p>
          </div>
          <Button className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600">
            <Plus className="mr-2 h-4 w-4" />
            Add Content
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-7">
          <Card className="md:col-span-5 bg-gray-900/50 border-gray-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Publishing Calendar</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-gray-700 bg-gray-800/50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 border-gray-700 bg-gray-800/50"
                      >
                        <CalendarIcon className="h-4 w-4" />
                        {date ? format(date, "MMMM yyyy") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-gray-900 border-gray-800">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        className="bg-gray-900"
                      />
                    </PopoverContent>
                  </Popover>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-gray-700 bg-gray-800/50"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                  (day) => (
                    <div
                      key={day}
                      className="text-center text-sm font-medium py-1 text-gray-300"
                    >
                      {day}
                    </div>
                  ),
                )}
                {calendarDays.map(({ day, dayIndex, isToday }) => (
                  <DroppableDay
                    key={dayIndex}
                    day={day}
                    dayIndex={dayIndex}
                    isToday={isToday}
                    scheduledItems={scheduledItems}
                    onDrop={handleDrop}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle>Content Library</CardTitle>
              <CardDescription className="text-gray-400">
                Drag items to the calendar to schedule
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Unscheduled Content</h3>
                  <Badge
                    variant="outline"
                    className="text-xs border-gray-700 bg-gray-800/50"
                  >
                    {unscheduledContent.length} items
                  </Badge>
                </div>
                <div className="space-y-2">
                  {unscheduledContent.map((item) => (
                    <DraggableContentCard key={item.id} item={item} />
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <h3 className="text-sm font-medium">Today's Schedule</h3>
                  <Badge
                    variant="outline"
                    className="text-xs border-gray-700 bg-gray-800/50"
                  >
                    {
                      scheduledItems.filter((item) => item.dayIndex === 9)
                        .length
                    }{" "}
                    items
                  </Badge>
                </div>
                <div className="space-y-2">
                  {scheduledItems
                    .filter((item) => item.dayIndex === 9)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start gap-2 rounded-md border border-gray-800 p-2 bg-gray-900/50"
                      >
                        <Clock className="mt-0.5 h-4 w-4 text-gray-400" />
                        <div className="flex-1">
                          <div className="font-medium">{item.title}</div>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span>{item.time}</span>
                            <span>•</span>
                            <span>{item.platform}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Scheduling Tips</CardTitle>
                <CardDescription className="text-gray-400">
                  Make the most of your content schedule
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-md border border-gray-800 p-4 bg-gray-900/30">
                <h3 className="font-medium">Drag & Drop</h3>
                <p className="mt-1 text-sm text-gray-400">
                  Drag content cards from the library and drop them onto
                  calendar days to schedule.
                </p>
              </div>
              <div className="rounded-md border border-gray-800 p-4 bg-gray-900/30">
                <h3 className="font-medium">Rescheduling</h3>
                <p className="mt-1 text-sm text-gray-400">
                  You can drag scheduled items between days to quickly
                  reschedule content.
                </p>
              </div>
              <div className="rounded-md border border-gray-800 p-4 bg-gray-900/30">
                <h3 className="font-medium">Optimal Times</h3>
                <p className="mt-1 text-sm text-gray-400">
                  Schedule blog posts early in the week and social media content
                  throughout the week.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DndProvider>
  );
}
