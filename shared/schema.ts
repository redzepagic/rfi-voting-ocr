import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Voting Statistics
export const votingStats = pgTable("voting_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  totalScans: integer("total_scans").notNull().default(0),
  successful: integer("successful").notNull().default(0),
  failed: integer("failed").notNull().default(0),
  invalid: integer("invalid").notNull().default(0),
  retries: integer("retries").notNull().default(0),
  multipleSelections: integer("multiple_selections").notNull().default(0),
  damaged: integer("damaged").notNull().default(0),
  unreadable: integer("unreadable").notNull().default(0),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

// Voting Location Configuration
export const votingLocation = pgTable("voting_location", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  municipality: text("municipality").notNull(),
  locationNumber: text("location_number").notNull(),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const insertVotingStatsSchema = createInsertSchema(votingStats).omit({
  id: true,
  updatedAt: true,
});

export const insertVotingLocationSchema = createInsertSchema(votingLocation).omit({
  id: true,
  updatedAt: true,
});

export type InsertVotingStats = z.infer<typeof insertVotingStatsSchema>;
export type VotingStats = typeof votingStats.$inferSelect;
export type InsertVotingLocation = z.infer<typeof insertVotingLocationSchema>;
export type VotingLocation = typeof votingLocation.$inferSelect;

// Scan Result Types (not stored in DB for privacy)
export const scanResultSchema = z.object({
  id: z.number(),
  result: z.enum(["success", "error", "invalid"]),
  ballotNumber: z.string().optional(),
  timestamp: z.date().optional(),
  processingTime: z.number().optional(),
  errorType: z.enum(["multiple_selections", "damaged", "unreadable"]).optional(),
  errorMessage: z.string().optional(),
  reason: z.string().optional(),
  canRetry: z.boolean().optional(),
  canAccept: z.boolean().optional(),
});

export type ScanResult = z.infer<typeof scanResultSchema>;

// Admin Authentication
export const adminAuthSchema = z.object({
  pin: z.string().length(4),
});

export type AdminAuth = z.infer<typeof adminAuthSchema>;
