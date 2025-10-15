import { type VotingStats, type InsertVotingStats, type VotingLocation, type InsertVotingLocation } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getStats(): Promise<VotingStats | undefined>;
  updateStats(stats: Partial<InsertVotingStats>): Promise<VotingStats>;
  resetStats(): Promise<VotingStats>;
  getLocation(): Promise<VotingLocation | undefined>;
  updateLocation(location: InsertVotingLocation): Promise<VotingLocation>;
}

export class MemStorage implements IStorage {
  private stats: VotingStats;
  private location: VotingLocation;

  constructor() {
    this.stats = {
      id: randomUUID(),
      totalScans: 0,
      successful: 0,
      failed: 0,
      invalid: 0,
      retries: 0,
      multipleSelections: 0,
      damaged: 0,
      unreadable: 0,
      updatedAt: new Date(),
    };

    this.location = {
      id: randomUUID(),
      municipality: "Centar",
      locationNumber: "1234",
      updatedAt: new Date(),
    };
  }

  async getStats(): Promise<VotingStats | undefined> {
    return this.stats;
  }

  async updateStats(updates: Partial<InsertVotingStats>): Promise<VotingStats> {
    this.stats = {
      ...this.stats,
      ...updates,
      updatedAt: new Date(),
    };
    return this.stats;
  }

  async resetStats(): Promise<VotingStats> {
    this.stats = {
      id: this.stats.id,
      totalScans: 0,
      successful: 0,
      failed: 0,
      invalid: 0,
      retries: 0,
      multipleSelections: 0,
      damaged: 0,
      unreadable: 0,
      updatedAt: new Date(),
    };
    return this.stats;
  }

  async getLocation(): Promise<VotingLocation | undefined> {
    return this.location;
  }

  async updateLocation(locationData: InsertVotingLocation): Promise<VotingLocation> {
    this.location = {
      ...this.location,
      ...locationData,
      updatedAt: new Date(),
    };
    return this.location;
  }
}

export const storage = new MemStorage();
