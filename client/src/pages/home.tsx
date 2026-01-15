import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Flame, Trophy, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TaskCard } from "@/components/task-card";
import { AddTaskModal } from "@/components/add-task-modal";
import { CelebrationModal } from "@/components/celebration-modal";
import { Mascot } from "@/components/mascot";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Task, UserProgress, Sticker, InsertTask } from "@shared/schema";
import { stickers } from "@shared/schema";

export default function Home() {
  const [showAddTask, setShowAddTask] = useState(false);
  const [celebration, setCelebration] = useState<{
    show: boolean;
    sticker?: Sticker;
    points?: number;
    message?: string;
  }>({ show: false });

  const { data: tasks = [], isLoading: tasksLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const { data: progress } = useQuery<UserProgress>({
    queryKey: ["/api/progress"],
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
        message: "Amazing work!",
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
    mutationFn: async (task: InsertTask & { stickerId?: string }) => {
      return apiRequest("POST", "/api/tasks", task);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      setShowAddTask(false);
    },
  });

  const todayTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);
  const completionRate = tasks.length > 0 
    ? Math.round((completedTasks.length / tasks.length) * 100) 
    : 0;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getMascotMood = () => {
    if (completionRate === 100 && tasks.length > 0) return "cheering";
    if (completionRate >= 50) return "happy";
    return "thinking";
  };

  return (
    <div className="min-h-screen bg-background pb-28 pt-6">
      <div className="px-6 max-w-lg mx-auto">
        <motion.div
          className="flex items-start justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-2xl font-bold text-foreground" data-testid="text-greeting">
              {getGreeting()}!
            </h1>
            <p className="text-muted-foreground mt-1">Let's have a great day</p>
          </div>
          <Mascot mood={getMascotMood()} size="sm" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 mb-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">Today's Progress</h2>
              <span className="text-2xl font-bold text-primary" data-testid="text-progress-percent">
                {completionRate}%
              </span>
            </div>
            <Progress value={completionRate} className="h-3 rounded-full" />
            <div className="flex items-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground" data-testid="text-completed-count">{completedTasks.length}</p>
                  <p className="text-xs text-muted-foreground">Done</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center">
                  <Flame className="w-4 h-4 text-orange-500" />
                </div>
                <div>
                  <p className="font-medium text-foreground" data-testid="text-streak">{progress?.currentStreak || 0}</p>
                  <p className="text-xs text-muted-foreground">Streak</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-accent/50 flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                </div>
                <div>
                  <p className="font-medium text-foreground" data-testid="text-points">{progress?.totalPoints || 0}</p>
                  <p className="text-xs text-muted-foreground">Points</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg text-foreground">Today's Tasks</h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary"
              onClick={() => setShowAddTask(true)}
              data-testid="button-add-task"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>

          {tasksLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-4 h-20 animate-pulse bg-muted/50" />
              ))}
            </div>
          ) : todayTasks.length === 0 && completedTasks.length === 0 ? (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Mascot mood="thinking" size="lg" message="Ready to plan your day?" />
              <Button
                className="mt-6"
                onClick={() => setShowAddTask(true)}
                data-testid="button-add-first-task"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add your first task
              </Button>
            </motion.div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {todayTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    sticker={stickers.find(s => s.id === task.stickerId)}
                    onComplete={(id) => completeMutation.mutate(id)}
                    onDelete={(id) => deleteMutation.mutate(id)}
                  />
                ))}
              </AnimatePresence>

              {completedTasks.length > 0 && (
                <div className="pt-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">
                    Completed ({completedTasks.length})
                  </h3>
                  <AnimatePresence>
                    {completedTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        sticker={stickers.find(s => s.id === task.stickerId)}
                        onComplete={() => {}}
                        onDelete={(id) => deleteMutation.mutate(id)}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          )}
        </motion.div>

        <motion.div
          className="fixed bottom-24 right-6 z-40"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
        >
          <Button
            size="icon"
            className="w-14 h-14 rounded-full shadow-lg"
            onClick={() => setShowAddTask(true)}
            data-testid="button-fab-add-task"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </motion.div>
      </div>

      <AddTaskModal
        isOpen={showAddTask}
        onClose={() => setShowAddTask(false)}
        onAdd={(task) => addMutation.mutate(task)}
      />

      <CelebrationModal
        isOpen={celebration.show}
        onClose={() => setCelebration({ show: false })}
        sticker={celebration.sticker}
        points={celebration.points}
        message={celebration.message}
      />
    </div>
  );
}
