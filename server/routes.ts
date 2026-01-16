import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTaskSchema, insertTimerSessionSchema } from "@shared/schema";
import { isAuthenticated } from "./replit_integrations/auth";

interface AuthenticatedRequest extends Request {
  user?: {
    claims?: {
      sub: string;
    };
  };
}

function getUserId(req: AuthenticatedRequest): string {
  return req.user?.claims?.sub || "";
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get("/api/tasks", isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = getUserId(req);
      const tasks = await storage.getTasks(userId);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });

  app.get("/api/tasks/:id", isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = getUserId(req);
      const task = await storage.getTask(userId, req.params.id);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch task" });
    }
  });

  app.post("/api/tasks", isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = getUserId(req);
      const result = insertTaskSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: result.error.errors });
      }
      
      const task = await storage.createTask(userId, {
        ...result.data,
        stickerId: req.body.stickerId,
        scheduledDate: req.body.scheduledDate,
      });
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ error: "Failed to create task" });
    }
  });

  app.patch("/api/tasks/:id", isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = getUserId(req);
      const task = await storage.updateTask(userId, req.params.id, req.body);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "Failed to update task" });
    }
  });

  app.delete("/api/tasks/:id", isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = getUserId(req);
      const deleted = await storage.deleteTask(userId, req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete task" });
    }
  });

  app.post("/api/tasks/:id/complete", isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = getUserId(req);
      const task = await storage.completeTask(userId, req.params.id);
      if (!task) {
        return res.status(404).json({ error: "Task not found or already completed" });
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "Failed to complete task" });
    }
  });

  app.get("/api/progress", isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = getUserId(req);
      const progress = await storage.getProgress(userId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch progress" });
    }
  });

  app.post("/api/timer/complete", isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = getUserId(req);
      const result = insertTimerSessionSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: result.error.errors });
      }

      const session = await storage.createTimerSession(userId, result.data);
      const completed = await storage.completeTimerSession(userId, session.id);
      
      res.json({ session: completed, progress: await storage.getProgress(userId) });
    } catch (error) {
      res.status(500).json({ error: "Failed to complete timer session" });
    }
  });

  return httpServer;
}
