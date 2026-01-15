import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  CalendarDays
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TaskCard } from "@/components/task-card";
import { AddTaskModal } from "@/components/add-task-modal";
import { CelebrationModal } from "@/components/celebration-modal";
import { Mascot } from "@/components/mascot";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Task, Sticker } from "@shared/schema";
import { stickers } from "@shared/schema";
import { 
  format, 
  startOfWeek, 
  addDays, 
  isSameDay, 
  addWeeks, 
  subWeeks,
  isToday
} from "date-fns";

export default function Schedule() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddTask, setShowAddTask] = useState(false);
  const [celebration, setCelebration] = useState<{
    show: boolean;
    sticker?: Sticker;
    points?: number;
  }>({ show: false });

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const completeMutation = useMutation({
    mutationFn: async (taskId: string) => {
      return apiRequest("POST", `/api/tasks/${taskId}/complete`);
    },
    onSuccess: async (_, taskId) => {
      const task = tasks.find(t => t.id === taskId);
      const sticker = task?.stickerId ? stickers.find(s => s.id === task.stickerId) : undefined;
      
      setCelebration({
        show: true,
        sticker,
        points: 10,
      });

      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/progress"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (taskId: string) => {
      return apiRequest("DELETE", `/api/tasks/${taskId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
  });

  const addMutation = useMutation({
    mutationFn: async (task: any) => {
      return apiRequest("POST", "/api/tasks", task);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      setShowAddTask(false);
    },
  });

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 0 });
  const weekDays = useMemo(() => 
    Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  const selectedDateTasks = useMemo(() => 
    tasks.filter(task => {
      if (!task.createdAt) return isSameDay(selectedDate, new Date());
      return isSameDay(new Date(task.createdAt), selectedDate);
    }),
    [tasks, selectedDate]
  );

  const getTaskCountForDate = (date: Date) => {
    return tasks.filter(task => {
      if (!task.createdAt) return isSameDay(date, new Date());
      return isSameDay(new Date(task.createdAt), date);
    }).length;
  };

  return (
    <div className="min-h-screen bg-background pb-28 pt-6">
      <div className="px-6 max-w-lg mx-auto">
        <motion.div
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3">
            <CalendarDays className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Schedule</h1>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
                data-testid="button-prev-week"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <h2 className="font-semibold text-foreground" data-testid="text-week-range">
                {format(weekStart, "MMM d")} - {format(addDays(weekStart, 6), "MMM d, yyyy")}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
                data-testid="button-next-week"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {weekDays.map((day, i) => {
                const isSelected = isSameDay(day, selectedDate);
                const today = isToday(day);
                const taskCount = getTaskCountForDate(day);

                return (
                  <motion.button
                    key={i}
                    className={`flex flex-col items-center py-3 px-1 rounded-xl transition-all ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : today
                        ? "bg-primary/10"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => setSelectedDate(day)}
                    whileTap={{ scale: 0.95 }}
                    data-testid={`day-${format(day, "yyyy-MM-dd")}`}
                  >
                    <span className={`text-xs ${isSelected ? "" : "text-muted-foreground"}`}>
                      {format(day, "EEE")}
                    </span>
                    <span className={`text-lg font-bold mt-1 ${
                      isSelected ? "" : today ? "text-primary" : "text-foreground"
                    }`}>
                      {format(day, "d")}
                    </span>
                    {taskCount > 0 && (
                      <div className={`flex gap-0.5 mt-1`}>
                        {Array.from({ length: Math.min(taskCount, 3) }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full ${
                              isSelected ? "bg-primary-foreground" : "bg-primary"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg text-foreground" data-testid="text-selected-date">
              {isToday(selectedDate) ? "Today" : format(selectedDate, "EEEE, MMM d")}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary"
              onClick={() => setShowAddTask(true)}
              data-testid="button-add-task-schedule"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <Card key={i} className="p-4 h-20 animate-pulse bg-muted/50" />
              ))}
            </div>
          ) : selectedDateTasks.length === 0 ? (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Mascot mood="thinking" size="md" message="No tasks for this day" />
              <Button
                className="mt-6"
                onClick={() => setShowAddTask(true)}
                data-testid="button-add-task-empty"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add a task
              </Button>
            </motion.div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {selectedDateTasks
                  .sort((a, b) => {
                    if (a.completed !== b.completed) return a.completed ? 1 : -1;
                    if (a.scheduledTime && b.scheduledTime) {
                      return a.scheduledTime.localeCompare(b.scheduledTime);
                    }
                    return 0;
                  })
                  .map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      sticker={stickers.find(s => s.id === task.stickerId)}
                      onComplete={(id) => completeMutation.mutate(id)}
                      onDelete={(id) => deleteMutation.mutate(id)}
                    />
                  ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>

      <AddTaskModal
        isOpen={showAddTask}
        onClose={() => setShowAddTask(false)}
        onAdd={(task) => addMutation.mutate(task)}
        selectedDate={format(selectedDate, "yyyy-MM-dd")}
      />

      <CelebrationModal
        isOpen={celebration.show}
        onClose={() => setCelebration({ show: false })}
        sticker={celebration.sticker}
        points={celebration.points}
        message="Great job!"
      />
    </div>
  );
}
