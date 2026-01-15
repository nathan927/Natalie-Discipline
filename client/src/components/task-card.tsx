import { motion } from "framer-motion";
import { Check, Clock, MoreVertical, Trash2, Edit } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Task, Sticker } from "@shared/schema";
import { StickerIcon } from "./sticker-icon";

interface TaskCardProps {
  task: Task;
  sticker?: Sticker;
  onComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onEdit?: (task: Task) => void;
}

export function TaskCard({ task, sticker, onComplete, onDelete, onEdit }: TaskCardProps) {
  const formatTime = (timeStr?: string) => {
    if (!timeStr) return null;
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      layout
    >
      <Card
        className={`p-4 flex items-center gap-4 transition-all duration-300 ${
          task.completed
            ? "bg-primary/5 border-primary/20"
            : "bg-card hover-elevate"
        }`}
        data-testid={`task-card-${task.id}`}
      >
        <motion.button
          className={`w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
            task.completed
              ? "bg-primary border-primary text-primary-foreground"
              : "border-muted-foreground/30 hover:border-primary"
          }`}
          onClick={() => !task.completed && onComplete(task.id)}
          whileTap={{ scale: 0.9 }}
          data-testid={`task-checkbox-${task.id}`}
        >
          {task.completed && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              <Check className="w-5 h-5" />
            </motion.div>
          )}
        </motion.button>

        <div className="flex-1 min-w-0">
          <h3
            className={`font-semibold text-base truncate ${
              task.completed
                ? "text-muted-foreground line-through"
                : "text-foreground"
            }`}
          >
            {task.title}
          </h3>
          {(task.scheduledTime || task.durationMinutes) && (
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              {formatTime(task.scheduledTime)}
              {task.durationMinutes && (
                <span className="text-xs">({task.durationMinutes} min)</span>
              )}
            </div>
          )}
        </div>

        {sticker && (
          <div className="flex-shrink-0">
            <motion.div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                task.completed
                  ? "bg-primary/10"
                  : "bg-muted/50"
              }`}
              animate={task.completed ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.5 }}
            >
              <StickerIcon 
                sticker={sticker} 
                unlocked={task.completed} 
                size="sm"
              />
            </motion.div>
          </div>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="flex-shrink-0"
              data-testid={`task-menu-${task.id}`}
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => onDelete(task.id)}
              className="text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Card>
    </motion.div>
  );
}
