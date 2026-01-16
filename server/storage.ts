import { 
  type Task, 
  type InsertTask, 
  type UserProgress, 
  type TimerSession,
  type InsertTimerSession,
  tasks,
  timerSessions,
  userProgress,
  stickers
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  getTasks(userId: string): Promise<Task[]>;
  getTask(userId: string, id: string): Promise<Task | undefined>;
  createTask(userId: string, task: InsertTask & { scheduledDate?: string }): Promise<Task>;
  updateTask(userId: string, id: string, updates: Partial<Task>): Promise<Task | undefined>;
  deleteTask(userId: string, id: string): Promise<boolean>;
  completeTask(userId: string, id: string): Promise<Task | undefined>;
  
  getProgress(userId: string): Promise<UserProgress>;
  updateProgress(userId: string, updates: Partial<UserProgress>): Promise<UserProgress>;
  
  createTimerSession(userId: string, session: InsertTimerSession): Promise<TimerSession>;
  completeTimerSession(userId: string, id: string): Promise<TimerSession | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getTasks(userId: string): Promise<Task[]> {
    const result = await db.select().from(tasks).where(eq(tasks.userId, userId));
    return result.sort((a, b) => {
      if (a.scheduledTime && b.scheduledTime) {
        return a.scheduledTime.localeCompare(b.scheduledTime);
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  async getTask(userId: string, id: string): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(
      and(eq(tasks.id, id), eq(tasks.userId, userId))
    );
    return task;
  }

  async createTask(userId: string, task: InsertTask & { scheduledDate?: string }): Promise<Task> {
    const taskDate = task.scheduledDate 
      ? new Date(task.scheduledDate + "T00:00:00").toISOString()
      : new Date().toISOString();
    
    const [newTask] = await db.insert(tasks).values({
      userId,
      title: task.title,
      description: task.description || null,
      scheduledTime: task.scheduledTime || null,
      durationMinutes: task.durationMinutes || null,
      completed: false,
      completedAt: null,
      stickerId: task.stickerId || null,
      createdAt: taskDate,
      recurring: task.recurring || "none",
    }).returning();
    
    return newTask;
  }

  async updateTask(userId: string, id: string, updates: Partial<Task>): Promise<Task | undefined> {
    const [updatedTask] = await db.update(tasks)
      .set(updates)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .returning();
    return updatedTask;
  }

  async deleteTask(userId: string, id: string): Promise<boolean> {
    const result = await db.delete(tasks).where(
      and(eq(tasks.id, id), eq(tasks.userId, userId))
    ).returning();
    return result.length > 0;
  }

  async completeTask(userId: string, id: string): Promise<Task | undefined> {
    const task = await this.getTask(userId, id);
    if (!task || task.completed) return undefined;

    const [completedTask] = await db.update(tasks)
      .set({ completed: true, completedAt: new Date().toISOString() })
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .returning();

    const progress = await this.getProgress(userId);
    const newPoints = progress.totalPoints + 10;
    const newCompleted = progress.completedTasks + 1;
    const newUnlocked = [...progress.unlockedStickers];

    if (task.stickerId) {
      const sticker = stickers.find(s => s.id === task.stickerId);
      if (sticker && newPoints >= sticker.requiredPoints && !newUnlocked.includes(sticker.id)) {
        newUnlocked.push(sticker.id);
      }
    }

    stickers.forEach(sticker => {
      if (newPoints >= sticker.requiredPoints && !newUnlocked.includes(sticker.id)) {
        newUnlocked.push(sticker.id);
      }
    });

    await this.updateProgress(userId, {
      totalPoints: newPoints,
      completedTasks: newCompleted,
      unlockedStickers: newUnlocked,
    });

    return completedTask;
  }

  async getProgress(userId: string): Promise<UserProgress> {
    const [progress] = await db.select().from(userProgress).where(eq(userProgress.userId, userId));
    
    if (!progress) {
      const [newProgress] = await db.insert(userProgress).values({
        userId,
        totalPoints: 0,
        completedTasks: 0,
        currentStreak: 0,
        unlockedStickers: [],
        timerSessionsCompleted: 0,
      }).returning();
      
      return {
        totalPoints: newProgress.totalPoints,
        completedTasks: newProgress.completedTasks,
        currentStreak: newProgress.currentStreak,
        unlockedStickers: newProgress.unlockedStickers,
        timerSessionsCompleted: newProgress.timerSessionsCompleted,
      };
    }
    
    return {
      totalPoints: progress.totalPoints,
      completedTasks: progress.completedTasks,
      currentStreak: progress.currentStreak,
      unlockedStickers: progress.unlockedStickers,
      timerSessionsCompleted: progress.timerSessionsCompleted,
    };
  }

  async updateProgress(userId: string, updates: Partial<UserProgress>): Promise<UserProgress> {
    const [updated] = await db.update(userProgress)
      .set(updates)
      .where(eq(userProgress.userId, userId))
      .returning();
    
    if (!updated) {
      const [newProgress] = await db.insert(userProgress).values({
        userId,
        totalPoints: updates.totalPoints || 0,
        completedTasks: updates.completedTasks || 0,
        currentStreak: updates.currentStreak || 0,
        unlockedStickers: updates.unlockedStickers || [],
        timerSessionsCompleted: updates.timerSessionsCompleted || 0,
      }).returning();
      
      return {
        totalPoints: newProgress.totalPoints,
        completedTasks: newProgress.completedTasks,
        currentStreak: newProgress.currentStreak,
        unlockedStickers: newProgress.unlockedStickers,
        timerSessionsCompleted: newProgress.timerSessionsCompleted,
      };
    }
    
    return {
      totalPoints: updated.totalPoints,
      completedTasks: updated.completedTasks,
      currentStreak: updated.currentStreak,
      unlockedStickers: updated.unlockedStickers,
      timerSessionsCompleted: updated.timerSessionsCompleted,
    };
  }

  async createTimerSession(userId: string, session: InsertTimerSession): Promise<TimerSession> {
    const [newSession] = await db.insert(timerSessions).values({
      userId,
      durationMinutes: session.durationMinutes,
      startedAt: new Date().toISOString(),
      completedAt: null,
      taskId: session.taskId || null,
    }).returning();
    
    return newSession;
  }

  async completeTimerSession(userId: string, id: string): Promise<TimerSession | undefined> {
    const [session] = await db.select().from(timerSessions).where(
      and(eq(timerSessions.id, id), eq(timerSessions.userId, userId))
    );
    
    if (!session) return undefined;

    const [completedSession] = await db.update(timerSessions)
      .set({ completedAt: new Date().toISOString() })
      .where(and(eq(timerSessions.id, id), eq(timerSessions.userId, userId)))
      .returning();

    const progress = await this.getProgress(userId);
    await this.updateProgress(userId, {
      timerSessionsCompleted: progress.timerSessionsCompleted + 1,
      totalPoints: progress.totalPoints + session.durationMinutes,
    });

    return completedSession;
  }
}

export const storage = new DatabaseStorage();
