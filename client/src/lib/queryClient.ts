import { QueryClient, QueryFunction } from "@tanstack/react-query";
import {
  getLocalTasks,
  getLocalProgress,
  setLocalTasks,
  setLocalProgress,
  addLocalTask,
  updateLocalTask,
  deleteLocalTask,
  addToSyncQueue,
  generateLocalId,
} from "./offline-storage";
import type { Task, UserProgress } from "@shared/schema";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

export async function offlineAwareApiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  if (!navigator.onLine) {
    throw new Error("OFFLINE");
  }
  return apiRequest(method, url, data);
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey.join("/") as string;
    
    if (!navigator.onLine) {
      if (url === "/api/tasks") {
        return getLocalTasks() as unknown;
      }
      if (url === "/api/progress") {
        return getLocalProgress() as unknown;
      }
      throw new Error("離線模式 - 無法取得資料");
    }

    try {
      const res = await fetch(url, {
        credentials: "include",
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      await throwIfResNotOk(res);
      const data = await res.json();
      
      if (url === "/api/tasks") {
        setLocalTasks(data as Task[]);
      }
      if (url === "/api/progress") {
        setLocalProgress(data as UserProgress);
      }
      
      return data;
    } catch (error) {
      if (url === "/api/tasks") {
        const cached = getLocalTasks();
        if (cached.length > 0) return cached as unknown;
      }
      if (url === "/api/progress") {
        return getLocalProgress() as unknown;
      }
      throw error;
    }
  };

export async function createTaskOfflineAware(taskData: any): Promise<Task> {
  if (navigator.onLine) {
    const res = await apiRequest("POST", "/api/tasks", taskData);
    const task = await res.json();
    addLocalTask(task);
    return task;
  } else {
    const localId = generateLocalId();
    const localTask: Task = {
      id: localId,
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
    addToSyncQueue({ type: "CREATE_TASK", data: taskData, localTaskId: localId });
    return localTask;
  }
}

export async function completeTaskOfflineAware(taskId: string): Promise<Task | null> {
  const completedAt = new Date().toISOString();
  
  if (navigator.onLine) {
    const res = await apiRequest("POST", `/api/tasks/${taskId}/complete`);
    const task = await res.json();
    updateLocalTask(taskId, { completed: true, completedAt });
    return task;
  } else {
    const updated = updateLocalTask(taskId, { completed: true, completedAt });
    addToSyncQueue({ type: "COMPLETE_TASK", data: { id: taskId } });
    return updated || null;
  }
}

export async function deleteTaskOfflineAware(taskId: string): Promise<boolean> {
  if (navigator.onLine) {
    await apiRequest("DELETE", `/api/tasks/${taskId}`);
    deleteLocalTask(taskId);
    return true;
  } else {
    deleteLocalTask(taskId);
    addToSyncQueue({ type: "DELETE_TASK", data: { id: taskId } });
    return true;
  }
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
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
