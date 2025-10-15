import type { ScanResult, VotingStats, VotingLocation } from "@shared/schema";

export const mockLocation: VotingLocation = {
  id: "1",
  municipality: "Centar",
  locationNumber: "1234",
  updatedAt: new Date(),
};

export const mockStats: VotingStats = {
  id: "1",
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

// Generate a random ballot number
function generateBallotNumber(): string {
  const prefix = "GM";
  const number = Math.floor(Math.random() * 100000).toString().padStart(6, '0');
  return `${prefix}-${number}`;
}

// Simulate a scan with random results
export function simulateMockScan(forceResult?: "success" | "error"): ScanResult {
  const processingTime = Math.floor(Math.random() * 500) + 500;

  if (forceResult === "success") {
    return {
      id: Date.now(),
      result: "success",
      ballotNumber: generateBallotNumber(),
      timestamp: new Date(),
      processingTime,
    };
  }

  if (forceResult === "error") {
    const errorTypes: Array<"multiple_selections" | "damaged" | "unreadable"> = [
      "multiple_selections",
      "damaged",
      "unreadable"
    ];
    const errorType = errorTypes[Math.floor(Math.random() * errorTypes.length)];

    const errorMessages = {
      multiple_selections: "Detektirano više od jednog izbora na glasačkom listiću",
      damaged: "Glasački listić je oštećen ili nečitak",
      unreadable: "Nije moguće pročitati glasački listić"
    };

    return {
      id: Date.now(),
      result: "error",
      errorType,
      errorMessage: errorMessages[errorType],
      timestamp: new Date(),
      processingTime,
      canRetry: errorType !== "multiple_selections",
    };
  }

  // Random result with 70% success, 20% error, 10% invalid
  const random = Math.random();

  if (random < 0.7) {
    // Success
    return {
      id: Date.now(),
      result: "success",
      ballotNumber: generateBallotNumber(),
      timestamp: new Date(),
      processingTime,
    };
  } else if (random < 0.9) {
    // Error
    const errorTypes: Array<"multiple_selections" | "damaged" | "unreadable"> = [
      "multiple_selections",
      "damaged",
      "unreadable"
    ];
    const errorType = errorTypes[Math.floor(Math.random() * errorTypes.length)];

    const errorMessages = {
      multiple_selections: "Detektirano više od jednog izbora na glasačkom listiću",
      damaged: "Glasački listić je oštećen ili nečitak",
      unreadable: "Nije moguće pročitati glasački listić"
    };

    return {
      id: Date.now(),
      result: "error",
      errorType,
      errorMessage: errorMessages[errorType],
      timestamp: new Date(),
      processingTime,
      canRetry: errorType !== "multiple_selections",
    };
  } else {
    // Invalid (multiple selections)
    return {
      id: Date.now(),
      result: "invalid",
      reason: "Glasački listić sadrži više od jednog izbora i smatra se nevažećim",
      timestamp: new Date(),
      processingTime,
      canAccept: false,
    };
  }
}
