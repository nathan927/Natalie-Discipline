import { pgTable, text, varchar, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

export const stickerCategories = ["magical-girls", "cute-animals", "nature", "achievements"] as const;
export type StickerCategory = typeof stickerCategories[number];

export const tasks = pgTable("tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  scheduledTime: text("scheduled_time"),
  durationMinutes: integer("duration_minutes"),
  completed: boolean("completed").notNull().default(false),
  completedAt: text("completed_at"),
  stickerId: text("sticker_id"),
  createdAt: text("created_at").notNull(),
  recurring: text("recurring").default("none"),
});

export const insertTaskSchema = createInsertSchema(tasks).pick({
  title: true,
  description: true,
  scheduledTime: true,
  durationMinutes: true,
  recurring: true,
}).extend({
  title: z.string().min(1, "請輸入任務標題"),
  stickerId: z.string().optional(),
});

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;

export const timerSessions = pgTable("timer_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  durationMinutes: integer("duration_minutes").notNull(),
  startedAt: text("started_at").notNull(),
  completedAt: text("completed_at"),
  taskId: text("task_id"),
});

export const insertTimerSessionSchema = createInsertSchema(timerSessions).pick({
  durationMinutes: true,
  taskId: true,
}).extend({
  durationMinutes: z.number().min(1),
});

export type InsertTimerSession = z.infer<typeof insertTimerSessionSchema>;
export type TimerSession = typeof timerSessions.$inferSelect;

export interface Sticker {
  id: string;
  name: string;
  emoji: string;
  category: StickerCategory;
  requiredPoints: number;
}

export interface UserProgress {
  totalPoints: number;
  completedTasks: number;
  currentStreak: number;
  unlockedStickers: string[];
  timerSessionsCompleted: number;
}

export const stickers: Sticker[] = [
  { id: "mg-1", name: "公主星星", emoji: "Princess", category: "magical-girls", requiredPoints: 10 },
  { id: "mg-2", name: "仙女魔杖", emoji: "Fairy", category: "magical-girls", requiredPoints: 25 },
  { id: "mg-3", name: "彩虹愛心", emoji: "Heart", category: "magical-girls", requiredPoints: 50 },
  { id: "mg-4", name: "閃亮皇冠", emoji: "Crown", category: "magical-girls", requiredPoints: 75 },
  { id: "mg-5", name: "魔法蝴蝶", emoji: "Butterfly", category: "magical-girls", requiredPoints: 100 },
  { id: "ca-1", name: "兔兔愛心", emoji: "Bunny", category: "cute-animals", requiredPoints: 10 },
  { id: "ca-2", name: "貓貓抱抱", emoji: "Kitty", category: "cute-animals", requiredPoints: 25 },
  { id: "ca-3", name: "狗狗腳印", emoji: "Puppy", category: "cute-animals", requiredPoints: 50 },
  { id: "ca-4", name: "熊熊擁抱", emoji: "Bear", category: "cute-animals", requiredPoints: 75 },
  { id: "ca-5", name: "獨角獸魔法", emoji: "Unicorn", category: "cute-animals", requiredPoints: 100 },
  { id: "n-1", name: "花花力量", emoji: "Flower", category: "nature", requiredPoints: 10 },
  { id: "n-2", name: "彩虹閃耀", emoji: "Rainbow", category: "nature", requiredPoints: 25 },
  { id: "n-3", name: "星光閃閃", emoji: "Star", category: "nature", requiredPoints: 50 },
  { id: "n-4", name: "陽光燦爛", emoji: "Sun", category: "nature", requiredPoints: 75 },
  { id: "n-5", name: "月光寶貝", emoji: "Moon", category: "nature", requiredPoints: 100 },
  { id: "a-1", name: "超級之星", emoji: "Medal", category: "achievements", requiredPoints: 15 },
  { id: "a-2", name: "冠軍獎盃", emoji: "Trophy", category: "achievements", requiredPoints: 30 },
  { id: "a-3", name: "英雄徽章", emoji: "Shield", category: "achievements", requiredPoints: 60 },
  { id: "a-4", name: "閃亮鑽石", emoji: "Gem", category: "achievements", requiredPoints: 90 },
  { id: "a-5", name: "傳奇之星", emoji: "Crown", category: "achievements", requiredPoints: 120 },
];

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
