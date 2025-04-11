import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { applyTempoTheme, tempoTheme } from "@/lib/tempo-theme";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  assignee?: {
    name: string;
    avatar: string;
  };
}

interface TaskBoardProps {
  tasks?: Task[];
  onTaskMove?: (taskId: string, newStatus: Task["status"]) => void;
  onTaskClick?: (task: Task) => void;
}

const defaultTasks: Task[] = [
  {
    id: "1",
    title: "Design System Updates",
    description: "Update component library with new design tokens",
    status: "todo",
    assignee: {
      name: "Alice Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
    },
  },
  {
    id: "2",
    title: "API Integration",
    description: "Integrate new backend endpoints",
    status: "in-progress",
    assignee: {
      name: "Bob Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
    },
  },
  {
    id: "3",
    title: "User Testing",
    description: "Conduct user testing sessions",
    status: "done",
    assignee: {
      name: "Carol Williams",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carol",
    },
  },
];

const TaskBoard = ({
  tasks = defaultTasks,
  onTaskMove = () => {},
  onTaskClick = () => {},
}: TaskBoardProps) => {
  const columns = [
    {
      id: "todo",
      title: "To Do",
      color: "border-purple-500/30",
      gradient: tempoTheme.gradients.purpleToBlue,
    },
    {
      id: "in-progress",
      title: "In Progress",
      color: "border-blue-500/30",
      gradient: tempoTheme.gradients.cyanToBlue,
    },
    {
      id: "done",
      title: "Done",
      color: "border-emerald-500/30",
      gradient: tempoTheme.gradients.emeraldToTeal,
    },
  ];

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: Task["status"]) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    onTaskMove(taskId, status);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Task Board</h2>
        <Button
          size="sm"
          className="gap-1 text-sm bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
        >
          <PlusCircle className="h-4 w-4" />
          Add Task
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {columns.map((column) => (
          <div
            key={column.id}
            className={`${applyTempoTheme("card")} border-2 ${column.color} transition-all hover:${tempoTheme.effects.glow.purple}`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id as Task["status"])}
          >
            <div
              className={`h-1 w-24 mb-4 rounded-full bg-gradient-to-r ${column.gradient}`}
            ></div>
            <h3 className="font-medium text-white mb-4">{column.title}</h3>
            <div className="space-y-3">
              {tasks
                .filter((task) => task.status === column.id)
                .map((task) => (
                  <motion.div
                    key={task.id}
                    layoutId={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e as any, task.id)}
                    onClick={() => onTaskClick(task)}
                  >
                    <Card className="p-3 cursor-pointer transition-all hover:scale-[1.02] bg-black/60 backdrop-blur-md border border-white/10 rounded-xl">
                      <h4 className="font-medium text-white mb-2">
                        {task.title}
                      </h4>
                      <p className="text-sm text-white/70 mb-3">
                        {task.description}
                      </p>
                      {task.assignee && (
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage
                              src={task.assignee.avatar}
                              alt={task.assignee.name}
                            />
                            <AvatarFallback>
                              {task.assignee.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-white/70">
                            {task.assignee.name}
                          </span>
                        </div>
                      )}
                    </Card>
                  </motion.div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskBoard;
