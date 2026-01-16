import {
  getSyncQueue,
  removeFromSyncQueue,
  clearSyncQueue,
  setLastSyncTime,
  setLocalTasks,
  setLocalProgress,
  setIdMapping,
  getServerId,
  updateLocalTaskId,
  deleteLocalTask,
  type SyncOperation,
} from "./offline-storage";
import { apiRequest } from "./queryClient";
import type { Task, UserProgress } from "@shared/schema";

export async function syncPendingOperations(): Promise<{
  success: boolean;
  synced: number;
  failed: number;
}> {
  const queue = getSyncQueue();
  let synced = 0;
  let failed = 0;

  for (const operation of queue) {
    try {
      await processSyncOperation(operation);
      removeFromSyncQueue(operation.id);
      synced++;
    } catch (error) {
      console.error("Sync operation failed:", operation, error);
      if (operation.type === "DELETE_TASK" || operation.type === "COMPLETE_TASK") {
        const localId = operation.data.id;
        if (localId.startsWith("local_")) {
          removeFromSyncQueue(operation.id);
          deleteLocalTask(localId);
        }
      }
      failed++;
    }
  }

  if (synced > 0) {
    setLastSyncTime();
  }

  return { success: failed === 0, synced, failed };
}

async function processSyncOperation(operation: SyncOperation): Promise<void> {
  switch (operation.type) {
    case "CREATE_TASK": {
      const res = await apiRequest("POST", "/api/tasks", operation.data);
      const serverTask: Task = await res.json();
      
      if (operation.localTaskId) {
        setIdMapping(operation.localTaskId, serverTask.id);
        updateLocalTaskId(operation.localTaskId, serverTask.id);
      }
      break;
    }
    case "UPDATE_TASK": {
      const serverId = getServerId(operation.data.id);
      await apiRequest("PATCH", `/api/tasks/${serverId}`, operation.data.updates);
      break;
    }
    case "DELETE_TASK": {
      const serverId = getServerId(operation.data.id);
      if (serverId.startsWith("local_")) {
        deleteLocalTask(serverId);
      } else {
        await apiRequest("DELETE", `/api/tasks/${serverId}`);
      }
      break;
    }
    case "COMPLETE_TASK": {
      const serverId = getServerId(operation.data.id);
      if (serverId.startsWith("local_")) {
        throw new Error("Cannot complete offline-only task - waiting for sync");
      }
      await apiRequest("POST", `/api/tasks/${serverId}/complete`);
      break;
    }
    case "TIMER_COMPLETE":
      await apiRequest("POST", "/api/timer/complete", operation.data);
      break;
    default:
      console.warn("Unknown sync operation type:", operation);
  }
}

export async function fetchAndCacheServerData(): Promise<{
  tasks: Task[];
  progress: UserProgress;
}> {
  try {
    const [tasksRes, progressRes] = await Promise.all([
      fetch("/api/tasks", { credentials: "include" }),
      fetch("/api/progress", { credentials: "include" }),
    ]);

    if (!tasksRes.ok || !progressRes.ok) {
      throw new Error("Failed to fetch server data");
    }

    const tasks: Task[] = await tasksRes.json();
    const progress: UserProgress = await progressRes.json();

    setLocalTasks(tasks);
    setLocalProgress(progress);
    setLastSyncTime();

    return { tasks, progress };
  } catch (error) {
    console.error("Failed to fetch and cache server data:", error);
    throw error;
  }
}

export async function fullSync(): Promise<void> {
  await syncPendingOperations();
  await fetchAndCacheServerData();
}
