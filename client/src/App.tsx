import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { InstructionScreen } from "@/components/InstructionScreen";
import { ScannerScreen } from "@/components/ScannerScreen";
import { ScanningProgress } from "@/components/ScanningProgress";
import { SuccessScreen } from "@/components/SuccessScreen";
import { ErrorScreen } from "@/components/ErrorScreen";
import { InvalidScreen } from "@/components/InvalidScreen";
import { AdminPanel } from "@/components/AdminPanel";
import type { ScanResult, VotingStats } from "@shared/schema";
import { mockLocation, mockStats, simulateMockScan } from "./lib/mockData";

type Screen = 
  | "welcome" 
  | "instructions" 
  | "scanner" 
  | "scanning" 
  | "success" 
  | "error" 
  | "invalid";

function VotingApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("welcome");
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [scanningStep, setScanningStep] = useState(0);
  const [adminOpen, setAdminOpen] = useState(false);
  const [forcedResult, setForcedResult] = useState<"success" | "error" | null>(null);
  const [stats, setStats] = useState<VotingStats>(mockStats);
  const [location] = useState(mockLocation);

  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<NodeJS.Timeout | null>(null);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    if (currentScreen === "welcome" || currentScreen === "instructions" || currentScreen === "scanner") {
      inactivityTimerRef.current = setTimeout(() => {
        setCurrentScreen("welcome");
      }, 30000);
    }
  }, [currentScreen]);

  useEffect(() => {
    resetInactivityTimer();
    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [resetInactivityTimer]);

  const handleTripleTap = () => {
    tapCountRef.current += 1;

    if (tapTimerRef.current) {
      clearTimeout(tapTimerRef.current);
    }

    if (tapCountRef.current === 3) {
      setAdminOpen(true);
      tapCountRef.current = 0;
    }

    tapTimerRef.current = setTimeout(() => {
      tapCountRef.current = 0;
    }, 500);
  };

  const simulateScan = useCallback(async () => {
    setProgress(0);
    setScanningStep(0);

    const steps = [
      { progress: 33, step: 1, delay: 1000 },
      { progress: 66, step: 2, delay: 1000 },
      { progress: 100, step: 3, delay: 1000 },
    ];

    for (const stepData of steps) {
      await new Promise(resolve => setTimeout(resolve, stepData.delay));
      setProgress(stepData.progress);
      setScanningStep(stepData.step);
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    // Use mock data instead of API call
    const result = simulateMockScan(forcedResult || undefined);

    // Update stats
    setStats(prev => ({
      ...prev,
      totalScans: prev.totalScans + 1,
      successful: result.result === "success" ? prev.successful + 1 : prev.successful,
      failed: result.result === "error" ? prev.failed + 1 : prev.failed,
      invalid: result.result === "invalid" ? prev.invalid + 1 : prev.invalid,
      multipleSelections: result.errorType === "multiple_selections" || result.result === "invalid"
        ? prev.multipleSelections + 1
        : prev.multipleSelections,
      damaged: result.errorType === "damaged" ? prev.damaged + 1 : prev.damaged,
      unreadable: result.errorType === "unreadable" ? prev.unreadable + 1 : prev.unreadable,
      updatedAt: new Date(),
    }));

    setForcedResult(null);

    // Set scan result first, then update screen to avoid race condition
    setScanResult(result);

    // Small delay to ensure state is updated before screen transition
    await new Promise(resolve => setTimeout(resolve, 50));

    if (result.result === "success") {
      setCurrentScreen("success");
    } else if (result.result === "error") {
      setCurrentScreen("error");
    } else {
      setCurrentScreen("invalid");
    }
  }, [forcedResult]);

  const handleStart = () => {
    setCurrentScreen("instructions");
    resetInactivityTimer();
  };

  const handleContinue = () => {
    setCurrentScreen("scanner");
    resetInactivityTimer();
  };

  const handleInsert = () => {
    setCurrentScreen("scanning");
    simulateScan();
  };

  const handleCancel = () => {
    setCurrentScreen("welcome");
  };

  const handleFinish = () => {
    setCurrentScreen("welcome");
    setScanResult(null);
  };

  const handleRetry = () => {
    setStats(prev => ({
      ...prev,
      retries: prev.retries + 1,
      updatedAt: new Date(),
    }));
    setCurrentScreen("scanner");
  };

  const handleNewBallot = () => {
    setCurrentScreen("welcome");
    setScanResult(null);
  };

  const handleCallHelp = () => {
    alert("Pozivanje pomoći... Molimo sačekajte.");
  };

  const handleAcceptInvalid = () => {
    setCurrentScreen("welcome");
    setScanResult(null);
  };

  const handleCallCommission = () => {
    alert("Pozivanje izborne komisije... Molimo sačekajte.");
  };

  const handleForceSuccess = () => {
    setForcedResult("success");
    setAdminOpen(false);
    setCurrentScreen("scanner");
  };

  const handleForceError = () => {
    setForcedResult("error");
    setAdminOpen(false);
    setCurrentScreen("scanner");
  };

  const handleResetStats = () => {
    setStats(mockStats);
  };

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('bs-BA', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  return (
    <div className="w-screen h-screen overflow-y-auto relative">
      <div
        className="absolute top-0 right-0 w-20 h-20 z-50"
        onClick={handleTripleTap}
        data-testid="area-admin-trigger"
      />

      <AnimatePresence mode="wait">
        {currentScreen === "welcome" && (
          <WelcomeScreen
            key="welcome"
            onStart={handleStart}
            municipality={location?.municipality || "Centar"}
            locationNumber={location?.locationNumber || "1234"}
          />
        )}

        {currentScreen === "instructions" && (
          <InstructionScreen
            key="instructions"
            onContinue={handleContinue}
          />
        )}

        {currentScreen === "scanner" && (
          <ScannerScreen
            key="scanner"
            onInsert={handleInsert}
            onCancel={handleCancel}
          />
        )}

        {currentScreen === "scanning" && (
          <ScanningProgress
            key="scanning"
            progress={progress}
            currentStep={scanningStep}
          />
        )}

        {currentScreen === "success" && scanResult && (
          <SuccessScreen
            key="success"
            ballotNumber={scanResult.ballotNumber || ""}
            timestamp={scanResult.timestamp ? formatTime(new Date(scanResult.timestamp)) : ""}
            onFinish={handleFinish}
          />
        )}

        {currentScreen === "error" && scanResult && (
          <ErrorScreen
            key="error"
            errorType={scanResult.errorType || "damaged"}
            errorMessage={scanResult.errorMessage || ""}
            onRetry={handleRetry}
            onNewBallot={handleNewBallot}
            onCallHelp={handleCallHelp}
          />
        )}

        {currentScreen === "invalid" && scanResult && (
          <InvalidScreen
            key="invalid"
            reason={scanResult.reason || ""}
            onAccept={handleAcceptInvalid}
            onNewBallot={handleNewBallot}
            onCallCommission={handleCallCommission}
          />
        )}
      </AnimatePresence>

      <AdminPanel
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
        stats={stats || null}
        onForceSuccess={handleForceSuccess}
        onForceError={handleForceError}
        onReset={handleResetStats}
      />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <VotingApp />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
