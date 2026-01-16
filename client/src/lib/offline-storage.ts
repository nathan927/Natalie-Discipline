import type { Task, UserProgress } from "@shared/schema";

const BASE_STORAGE_KEYS = {
  TASKS: "natalie_tasks",
  PROGRESS: "natalie_progress",
  SYNC_QUEUE: "natalie_sync_queue",
  LAST_SYNC: "natalie_last_sync",
  ID_MAP: "natalie_id_map",
  CURRENT_USER: "natalie_current_user",
};

function getUserKey(baseKey: string, userId?: string): string {
  if (!userId) {
    const stored = localStorage.getItem(BASE_STORAGE_KEYS.CURRENT_USER);
    userId = stored || "anonymous";
  }
  return `${baseKey}_${userId}`;
}

export function setCurrentUser(userId: string): void {
  localStorage.setItem(BASE_STORAGE_KEYS.CURRENT_USER, userId);
}

export function getCurrentUser(): string | null {
  return localStorage.getItem(BASE_STORAGE_KEYS.CURRENT_USER);
}

export function clearCurrentUser(): void {
  localStorage.removeItem(BASE_STORAGE_KEYS.CURRENT_USER);
}

export interface SyncOperation {
  id: string;
  type: "CREATE_TASK" | "UPDATE_TASK" | "DELETE_TASK" | "COMPLETE_TASK" | "TIMER_COMPLETE";
  data: any;
  timestamp: number;
  localTaskId?: string;
}

export function getIdMap(): Record<string, string> {
  try {
    const key = getUserKey(BASE_STORAGE_KEYS.ID_MAP);
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export function setIdMapping(localId: string, serverId: string): void {
  const map = getIdMap();
  map[localId] = serverId;
  const key = getUserKey(BASE_STORAGE_KEYS.ID_MAP);
  localStorage.setItem(key, JSON.stringify(map));
}

export function getServerId(localId: string): string {
  const map = getIdMap();
  return map[localId] || localId;
}

export function clearIdMap(): void {
  const key = getUserKey(BASE_STORAGE_KEYS.ID_MAP);
  localStorage.removeItem(key);
}

export function updateLocalTaskId(oldId: string, newId: string): void {
  const tasks = getLocalTasks();
  const index = tasks.findIndex(t => t.id === oldId);
  if (index !== -1) {
    tasks[index] = { ...tasks[index], id: newId };
    setLocalTasks(tasks);
  }
}

export function getLocalTasks(): Task[] {
  try {
    const key = getUserKey(BASE_STORAGE_KEYS.TASKS);
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function setLocalTasks(tasks: Task[]): void {
  try {
    const key = getUserKey(BASE_STORAGE_KEYS.TASKS);
    localStorage.setItem(key, JSON.stringify(tasks));
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
    const key = getUserKey(BASE_STORAGE_KEYS.PROGRESS);
    const data = localStorage.getItem(key);
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
    const key = getUserKey(BASE_STORAGE_KEYS.PROGRESS);
    localStorage.setItem(key, JSON.stringify(progress));
  } catch (e) {
    console.error("Failed to save progress to localStorage", e);
  }
}

export function getSyncQueue(): SyncOperation[] {
  try {
    const key = getUserKey(BASE_STORAGE_KEYS.SYNC_QUEUE);
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addToSyncQueue(operation: Omit<SyncOperation, "id" | "timestamp">): void {
  const queue = getSyncQueue();
  const key = getUserKey(BASE_STORAGE_KEYS.SYNC_QUEUE);
  queue.push({
    ...operation,
    id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
  });
  localStorage.setItem(key, JSON.stringify(queue));
}

export function removeFromSyncQueue(id: string): void {
  const queue = getSyncQueue();
  const filtered = queue.filter((op) => op.id !== id);
  const key = getUserKey(BASE_STORAGE_KEYS.SYNC_QUEUE);
  localStorage.setItem(key, JSON.stringify(filtered));
}

export function clearSyncQueue(): void {
  const key = getUserKey(BASE_STORAGE_KEYS.SYNC_QUEUE);
  localStorage.setItem(key, JSON.stringify([]));
}

export function getLastSyncTime(): number | null {
  try {
    const key = getUserKey(BASE_STORAGE_KEYS.LAST_SYNC);
    const data = localStorage.getItem(key);
    return data ? parseInt(data, 10) : null;
  } catch {
    return null;
  }
}

export function setLastSyncTime(time: number = Date.now()): void {
  const key = getUserKey(BASE_STORAGE_KEYS.LAST_SYNC);
  localStorage.setItem(key, time.toString());
}

export function hasPendingSyncOperations(): boolean {
  return getSyncQueue().length > 0;
}

export function generateLocalId(): string {
  return `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
