import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Loader2, CheckCircle2, Clock } from "lucide-react";
import { useEffect, useState } from "react";

interface ScanningProgressProps {
  progress: number;
  currentStep: number;
}

const steps = [
  { text: "Provjera validnosti...", completed: false },
  { text: "Čitanje izbora...", completed: false },
  { text: "Verifikacija...", completed: false },
];

export function ScanningProgress({ progress, currentStep }: ScanningProgressProps) {
  const [displaySteps, setDisplaySteps] = useState(steps);

  useEffect(() => {
    setDisplaySteps(steps.map((step, index) => ({
      ...step,
      completed: index < currentStep,
    })));
  }, [currentStep]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center min-h-screen bg-background px-12 py-8"
    >
      <div className="max-w-3xl w-full space-y-12">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-bold text-center text-foreground"
          data-testid="text-scanning-title"
        >
          SKENIRANJE U TOKU...
        </motion.h1>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center gap-8"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-24 h-24 text-primary" strokeWidth={2} />
          </motion.div>

          <div className="w-full space-y-3">
            <Progress value={progress} className="h-4" data-testid="progress-scanning" />
            <p className="text-center text-2xl font-semibold text-foreground" data-testid="text-progress-percentage">
              {progress}%
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-8">
            <p className="text-xl text-center text-muted-foreground mb-6 font-medium">
              Molimo ne dirajte skener
            </p>

            <div className="space-y-4">
              {displaySteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-4"
                  data-testid={`step-${index}`}
                >
                  {step.completed ? (
                    <CheckCircle2 className="w-7 h-7 text-green-500 flex-shrink-0" />
                  ) : index === currentStep ? (
                    <Loader2 className="w-7 h-7 text-primary animate-spin flex-shrink-0" />
                  ) : (
                    <Clock className="w-7 h-7 text-muted-foreground flex-shrink-0" />
                  )}
                  <p className={`text-xl ${step.completed ? 'text-foreground font-medium' : 'text-muted-foreground'}`} data-testid={`text-step-${index}`}>
                    {step.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
