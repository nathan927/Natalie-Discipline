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
  imageSrc: string;
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
  { id: "mg-1", name: "魔法公主", imageSrc: "magical_girl_with_wand", category: "magical-girls", requiredPoints: 10 },
  { id: "mg-2", name: "皇冠公主", imageSrc: "princess_magical_girl", category: "magical-girls", requiredPoints: 25 },
  { id: "mg-3", name: "水晶少女", imageSrc: "fortune_teller_girl", category: "magical-girls", requiredPoints: 50 },
  { id: "mg-4", name: "花仙子", imageSrc: "fairy_magical_girl", category: "magical-girls", requiredPoints: 75 },
  { id: "mg-5", name: "獨角獸騎士", imageSrc: "unicorn_rider_girl", category: "magical-girls", requiredPoints: 100 },
  { id: "ca-1", name: "兔兔女孩", imageSrc: "girl_with_bunny", category: "cute-animals", requiredPoints: 10 },
  { id: "ca-2", name: "貓咪女孩", imageSrc: "girl_with_kitten", category: "cute-animals", requiredPoints: 25 },
  { id: "ca-3", name: "狗狗女孩", imageSrc: "girl_with_puppy", category: "cute-animals", requiredPoints: 50 },
  { id: "ca-4", name: "小鳥女孩", imageSrc: "girl_with_bird", category: "cute-animals", requiredPoints: 75 },
  { id: "ca-5", name: "倉鼠女孩", imageSrc: "girl_with_hamster", category: "cute-animals", requiredPoints: 100 },
  { id: "n-1", name: "櫻花少女", imageSrc: "cherry_blossom_girl", category: "nature", requiredPoints: 10 },
  { id: "n-2", name: "雨天女孩", imageSrc: "rainy_day_girl", category: "nature", requiredPoints: 25 },
  { id: "n-3", name: "向日葵女孩", imageSrc: "sunflower_girl", category: "nature", requiredPoints: 50 },
  { id: "n-4", name: "楓葉少女", imageSrc: "autumn_leaves_girl", category: "nature", requiredPoints: 75 },
  { id: "n-5", name: "雪花公主", imageSrc: "winter_snow_girl", category: "nature", requiredPoints: 100 },
  { id: "a-1", name: "冠軍女孩", imageSrc: "trophy_winner_girl", category: "achievements", requiredPoints: 15 },
  { id: "a-2", name: "獎牌少女", imageSrc: "medal_winner_girl", category: "achievements", requiredPoints: 30 },
  { id: "a-3", name: "畢業女孩", imageSrc: "graduate_girl", category: "achievements", requiredPoints: 60 },
  { id: "a-4", name: "超級明星", imageSrc: "super_star_girl", category: "achievements", requiredPoints: 90 },
  { id: "a-5", name: "彩虹愛心", imageSrc: "rainbow_heart_girl", category: "achievements", requiredPoints: 120 },
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
