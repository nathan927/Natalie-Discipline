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
  title: z.string().min(1, "Task title is required"),
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
  { id: "mg-1", name: "Princess Star", emoji: "Princess", category: "magical-girls", requiredPoints: 10 },
  { id: "mg-2", name: "Fairy Wand", emoji: "Fairy", category: "magical-girls", requiredPoints: 25 },
  { id: "mg-3", name: "Rainbow Heart", emoji: "Heart", category: "magical-girls", requiredPoints: 50 },
  { id: "mg-4", name: "Sparkle Crown", emoji: "Crown", category: "magical-girls", requiredPoints: 75 },
  { id: "mg-5", name: "Magic Butterfly", emoji: "Butterfly", category: "magical-girls", requiredPoints: 100 },
  { id: "ca-1", name: "Bunny Love", emoji: "Bunny", category: "cute-animals", requiredPoints: 10 },
  { id: "ca-2", name: "Kitty Cuddles", emoji: "Kitty", category: "cute-animals", requiredPoints: 25 },
  { id: "ca-3", name: "Puppy Paws", emoji: "Puppy", category: "cute-animals", requiredPoints: 50 },
  { id: "ca-4", name: "Bear Hugs", emoji: "Bear", category: "cute-animals", requiredPoints: 75 },
  { id: "ca-5", name: "Unicorn Magic", emoji: "Unicorn", category: "cute-animals", requiredPoints: 100 },
  { id: "n-1", name: "Flower Power", emoji: "Flower", category: "nature", requiredPoints: 10 },
  { id: "n-2", name: "Rainbow Shine", emoji: "Rainbow", category: "nature", requiredPoints: 25 },
  { id: "n-3", name: "Starlight", emoji: "Star", category: "nature", requiredPoints: 50 },
  { id: "n-4", name: "Sunshine", emoji: "Sun", category: "nature", requiredPoints: 75 },
  { id: "n-5", name: "Moonbeam", emoji: "Moon", category: "nature", requiredPoints: 100 },
  { id: "a-1", name: "Super Star", emoji: "Medal", category: "achievements", requiredPoints: 15 },
  { id: "a-2", name: "Champion", emoji: "Trophy", category: "achievements", requiredPoints: 30 },
  { id: "a-3", name: "Hero Badge", emoji: "Shield", category: "achievements", requiredPoints: 60 },
  { id: "a-4", name: "Diamond", emoji: "Gem", category: "achievements", requiredPoints: 90 },
  { id: "a-5", name: "Legend", emoji: "Crown", category: "achievements", requiredPoints: 120 },
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
