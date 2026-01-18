import { QueryClient, QueryFunction } from "@tanstack/react-query";
import {
  getLocalTasks,
  getLocalProgress,
  setLocalTasks,
  setLocalProgress,
  addLocalTask,
  updateLocalTask,
  deleteLocalTask,
  generateLocalId,
} from "./offline-storage";
import type { Task, UserProgress } from "@shared/schema";

// 純本地存儲模式 - 不再使用 API
export const getQueryFn: <T>(options: {
  on401: "returnNull" | "throw";
}) => QueryFunction<T> =
  () =>
    async ({ queryKey }) => {
      const url = queryKey.join("/") as string;

      // 所有數據從本地存儲獲取
      if (url === "/api/tasks") {
        return getLocalTasks() as unknown;
      }
      if (url === "/api/progress") {
        return getLocalProgress() as unknown;
      }

      return null;
    };

// 純本地創建任務
export async function createTaskOfflineAware(taskData: any): Promise<Task> {
  const localId = generateLocalId();
  const localTask: Task = {
    id: localId,
    userId: "local_user",
    title: taskData.title,
    description: taskData.description || null,
    scheduledTime: taskData.scheduledTime || null,
    durationMinutes: taskData.durationMinutes || null,
    completed: false,
    completedAt: null,
    stickerId: taskData.stickerId || null,
    createdAt: taskData.scheduledDate || new Date().toISOString().split("T")[0],
    recurring: taskData.recurring || "none",
  };
  addLocalTask(localTask);
  return localTask;
}

// 純本地完成任務
export async function completeTaskOfflineAware(taskId: string): Promise<Task | null> {
  const completedAt = new Date().toISOString();
  const updated = updateLocalTask(taskId, { completed: true, completedAt });

  // 更新本地進度
  if (updated) {
    const progress = getLocalProgress();
    progress.completedTasks += 1;
    progress.totalPoints += 10;
    setLocalProgress(progress);
  }

  return updated || null;
}

// 純本地刪除任務
export async function deleteTaskOfflineAware(taskId: string): Promise<boolean> {
  deleteLocalTask(taskId);
  return true;
}

// 純本地完成計時器
export async function completeTimerOfflineAware(durationMinutes: number): Promise<{ progress: UserProgress }> {
  const progress = getLocalProgress();
  progress.timerSessionsCompleted += 1;
  progress.totalPoints += durationMinutes;
  setLocalProgress(progress);
  return { progress };
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "returnNull" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
