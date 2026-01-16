import { 
  type Task, 
  type InsertTask, 
  type UserProgress, 
  type TimerSession,
  type InsertTimerSession,
  stickers
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getTasks(): Promise<Task[]>;
  getTask(id: string): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, updates: Partial<Task>): Promise<Task | undefined>;
  deleteTask(id: string): Promise<boolean>;
  completeTask(id: string): Promise<Task | undefined>;
  
  getProgress(): Promise<UserProgress>;
  updateProgress(updates: Partial<UserProgress>): Promise<UserProgress>;
  
  createTimerSession(session: InsertTimerSession): Promise<TimerSession>;
  completeTimerSession(id: string): Promise<TimerSession | undefined>;
}

export class MemStorage implements IStorage {
  private tasks: Map<string, Task>;
  private timerSessions: Map<string, TimerSession>;
  private progress: UserProgress;

  constructor() {
    this.tasks = new Map();
    this.timerSessions = new Map();
    this.progress = {
      totalPoints: 0,
      completedTasks: 0,
      currentStreak: 0,
      unlockedStickers: [],
      timerSessionsCompleted: 0,
    };

    this.seedInitialTasks();
  }

  private seedInitialTasks() {
    const sampleTasks: InsertTask[] = [
      { title: "練習鋼琴30分鐘", scheduledTime: "09:00", durationMinutes: 30, stickerId: "mg-1" },
      { title: "閱讀一個章節", scheduledTime: "10:00", durationMinutes: 20, stickerId: "ca-1" },
      { title: "做功課", scheduledTime: "15:00", durationMinutes: 45, stickerId: "n-1" },
      { title: "幫手做家務", scheduledTime: "17:00", durationMinutes: 15, stickerId: "mg-2" },
    ];

    sampleTasks.forEach(task => {
      const id = randomUUID();
      const newTask: Task = {
        id,
        title: task.title,
        description: task.description || null,
        scheduledTime: task.scheduledTime || null,
        durationMinutes: task.durationMinutes || null,
        completed: false,
        completedAt: null,
        stickerId: task.stickerId || null,
        createdAt: new Date().toISOString(),
        recurring: task.recurring || "none",
      };
      this.tasks.set(id, newTask);
    });
  }

  async getTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values()).sort((a, b) => {
      if (a.scheduledTime && b.scheduledTime) {
        return a.scheduledTime.localeCompare(b.scheduledTime);
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  async getTask(id: string): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(task: InsertTask & { scheduledDate?: string }): Promise<Task> {
    const id = randomUUID();
    const taskDate = task.scheduledDate 
      ? new Date(task.scheduledDate + "T00:00:00").toISOString()
      : new Date().toISOString();
    const newTask: Task = {
      id,
      title: task.title,
      description: task.description || null,
      scheduledTime: task.scheduledTime || null,
      durationMinutes: task.durationMinutes || null,
      completed: false,
      completedAt: null,
      stickerId: task.stickerId || null,
      createdAt: taskDate,
      recurring: task.recurring || "none",
    };
    this.tasks.set(id, newTask);
    return newTask;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;

    const updatedTask = { ...task, ...updates };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: string): Promise<boolean> {
    return this.tasks.delete(id);
  }

  async completeTask(id: string): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task || task.completed) return undefined;

    const completedTask: Task = {
      ...task,
      completed: true,
      completedAt: new Date().toISOString(),
    };
    this.tasks.set(id, completedTask);

    this.progress.completedTasks += 1;
    this.progress.totalPoints += 10;

    if (task.stickerId) {
      const sticker = stickers.find(s => s.id === task.stickerId);
      if (sticker && this.progress.totalPoints >= sticker.requiredPoints) {
        if (!this.progress.unlockedStickers.includes(sticker.id)) {
          this.progress.unlockedStickers.push(sticker.id);
        }
      }
    }

    this.checkAndUnlockStickers();

    return completedTask;
  }

  private checkAndUnlockStickers() {
    stickers.forEach(sticker => {
      if (this.progress.totalPoints >= sticker.requiredPoints) {
        if (!this.progress.unlockedStickers.includes(sticker.id)) {
          this.progress.unlockedStickers.push(sticker.id);
        }
      }
    });
  }

  async getProgress(): Promise<UserProgress> {
    return { ...this.progress };
  }

  async updateProgress(updates: Partial<UserProgress>): Promise<UserProgress> {
    this.progress = { ...this.progress, ...updates };
    return { ...this.progress };
  }

  async createTimerSession(session: InsertTimerSession): Promise<TimerSession> {
    const id = randomUUID();
    const newSession: TimerSession = {
      id,
      durationMinutes: session.durationMinutes,
      startedAt: new Date().toISOString(),
      completedAt: null,
      taskId: session.taskId || null,
    };
    this.timerSessions.set(id, newSession);
    return newSession;
  }

  async completeTimerSession(id: string): Promise<TimerSession | undefined> {
    const session = this.timerSessions.get(id);
    if (!session) return undefined;

    const completedSession: TimerSession = {
      ...session,
      completedAt: new Date().toISOString(),
    };
    this.timerSessions.set(id, completedSession);

    this.progress.timerSessionsCompleted += 1;
    this.progress.totalPoints += session.durationMinutes;
    this.checkAndUnlockStickers();

    return completedSession;
  }
}

export const storage = new MemStorage();
