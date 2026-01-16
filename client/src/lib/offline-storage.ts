import type { Task, UserProgress } from "@shared/schema";

const STORAGE_KEYS = {
  TASKS: "natalie_tasks",
  PROGRESS: "natalie_progress",
  SYNC_QUEUE: "natalie_sync_queue",
  LAST_SYNC: "natalie_last_sync",
};

export interface SyncOperation {
  id: string;
  type: "CREATE_TASK" | "UPDATE_TASK" | "DELETE_TASK" | "COMPLETE_TASK" | "TIMER_COMPLETE";
  data: any;
  timestamp: number;
}

export function getLocalTasks(): Task[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TASKS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function setLocalTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch (e) {
    console.error("Failed to save tasks to localStorage", e);
  }
}

export function addLocalTask(task: Task): void {
  const tasks = getLocalTasks();
  tasks.push(task);
  setLocalTasks(tasks);
}

export function updateLocalTask(id: string, updates: Partial<Task>): Task | undefined {
  const tasks = getLocalTasks();
  const index = tasks.findIndex((t) => t.id === id);
  if (index !== -1) {
    tasks[index] = { ...tasks[index], ...updates };
    setLocalTasks(tasks);
    return tasks[index];
  }
  return undefined;
}

export function deleteLocalTask(id: string): boolean {
  const tasks = getLocalTasks();
  const filtered = tasks.filter((t) => t.id !== id);
  if (filtered.length !== tasks.length) {
    setLocalTasks(filtered);
    return true;
  }
  return false;
}

export function getLocalProgress(): UserProgress {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    return data
      ? JSON.parse(data)
      : {
          totalPoints: 0,
          completedTasks: 0,
          currentStreak: 0,
          unlockedStickers: [],
          timerSessionsCompleted: 0,
        };
  } catch {
    return {
      totalPoints: 0,
      completedTasks: 0,
      currentStreak: 0,
      unlockedStickers: [],
      timerSessionsCompleted: 0,
    };
  }
}

export function setLocalProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
  } catch (e) {
    console.error("Failed to save progress to localStorage", e);
  }
}

export function getSyncQueue(): SyncOperation[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addToSyncQueue(operation: Omit<SyncOperation, "id" | "timestamp">): void {
  const queue = getSyncQueue();
  queue.push({
    ...operation,
    id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
  });
  localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(queue));
}

export function removeFromSyncQueue(id: string): void {
  const queue = getSyncQueue();
  const filtered = queue.filter((op) => op.id !== id);
  localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(filtered));
}

export function clearSyncQueue(): void {
  localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify([]));
}

export function getLastSyncTime(): number | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LAST_SYNC);
    return data ? parseInt(data, 10) : null;
  } catch {
    return null;
  }
}

export function setLastSyncTime(time: number = Date.now()): void {
  localStorage.setItem(STORAGE_KEYS.LAST_SYNC, time.toString());
}

export function hasPendingSyncOperations(): boolean {
  return getSyncQueue().length > 0;
}

export function generateLocalId(): string {
  return `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
