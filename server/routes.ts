import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { adminAuthSchema, insertVotingLocationSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch statistics" });
    }
  });

  app.post("/api/stats/update", async (req, res) => {
    try {
      const updates = req.body;
      const stats = await storage.updateStats(updates);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to update statistics" });
    }
  });

  app.post("/api/stats/reset", async (req, res) => {
    try {
      const stats = await storage.resetStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to reset statistics" });
    }
  });

  app.get("/api/location", async (req, res) => {
    try {
      const location = await storage.getLocation();
      res.json(location);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch location" });
    }
  });

  app.post("/api/location", async (req, res) => {
    try {
      const locationData = insertVotingLocationSchema.parse(req.body);
      const location = await storage.updateLocation(locationData);
      res.json(location);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid location data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update location" });
      }
    }
  });

  app.post("/api/admin/auth", async (req, res) => {
    try {
      const { pin } = adminAuthSchema.parse(req.body);
      
      if (pin === "1234") {
        res.json({ authenticated: true });
      } else {
        res.status(401).json({ authenticated: false, error: "Invalid PIN" });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid request", details: error.errors });
      } else {
        res.status(500).json({ error: "Authentication failed" });
      }
    }
  });

  app.post("/api/scan", async (req, res) => {
    try {
      const { forceResult } = req.body;
      
      await new Promise(resolve => setTimeout(resolve, 3500));

      let result;
      
      if (forceResult === "success") {
        result = {
          id: 1,
          result: "success",
          ballotNumber: Math.floor(100000 + Math.random() * 900000).toString(),
          timestamp: new Date(),
          processingTime: 3500,
        };
        
        const stats = await storage.getStats();
        if (stats) {
          await storage.updateStats({
            totalScans: stats.totalScans + 1,
            successful: stats.successful + 1,
          });
        }
      } else if (forceResult === "error") {
        const errorTypes = ["multiple_selections", "damaged", "unreadable"] as const;
        const randomErrorType = errorTypes[Math.floor(Math.random() * errorTypes.length)];
        
        result = {
          id: 2,
          result: "error",
          errorType: randomErrorType,
          errorMessage: randomErrorType === "multiple_selections" 
            ? "Označeno više od jednog kandidata"
            : randomErrorType === "damaged"
            ? "Listić je oštećen ili nečitljiv"
            : "Oznake nisu jasne",
          canRetry: true,
        };
        
        const stats = await storage.getStats();
        if (stats) {
          await storage.updateStats({
            totalScans: stats.totalScans + 1,
            failed: stats.failed + 1,
            [randomErrorType === "multiple_selections" ? "multipleSelections" : randomErrorType]: 
              stats[randomErrorType === "multiple_selections" ? "multipleSelections" : randomErrorType as keyof typeof stats] as number + 1,
          });
        }
      } else {
        const rand = Math.random();
        if (rand < 0.7) {
          result = {
            id: 1,
            result: "success",
            ballotNumber: Math.floor(100000 + Math.random() * 900000).toString(),
            timestamp: new Date(),
            processingTime: 3500,
          };
          
          const stats = await storage.getStats();
          if (stats) {
            await storage.updateStats({
              totalScans: stats.totalScans + 1,
              successful: stats.successful + 1,
            });
          }
        } else if (rand < 0.9) {
          const errorTypes = ["multiple_selections", "damaged", "unreadable"] as const;
          const randomErrorType = errorTypes[Math.floor(Math.random() * errorTypes.length)];
          
          result = {
            id: 2,
            result: "error",
            errorType: randomErrorType,
            errorMessage: randomErrorType === "multiple_selections" 
              ? "Označeno više od jednog kandidata"
              : randomErrorType === "damaged"
              ? "Listić je oštećen ili nečitljiv"
              : "Oznake nisu jasne",
            canRetry: true,
          };
          
          const stats = await storage.getStats();
          if (stats) {
            await storage.updateStats({
              totalScans: stats.totalScans + 1,
              failed: stats.failed + 1,
              [randomErrorType === "multiple_selections" ? "multipleSelections" : randomErrorType]: 
                stats[randomErrorType === "multiple_selections" ? "multipleSelections" : randomErrorType as keyof typeof stats] as number + 1,
            });
          }
        } else {
          result = {
            id: 4,
            result: "invalid",
            reason: "Nedozvoljena oznaka na listiću",
            canAccept: true,
          };
          
          const stats = await storage.getStats();
          if (stats) {
            await storage.updateStats({
              totalScans: stats.totalScans + 1,
              invalid: stats.invalid + 1,
            });
          }
        }
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Scan failed" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
