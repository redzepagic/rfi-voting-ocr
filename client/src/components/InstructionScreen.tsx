import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, FoldVertical, ScanLine, AlertTriangle } from "lucide-react";

interface InstructionScreenProps {
  onContinue: () => void;
}

const steps = [
  {
    icon: CheckCircle2,
    title: "Označite vašeg kandidata",
    description: "Koristeći plavu hemijsku olovku, jasno označite jednog kandidata",
  },
  {
    icon: FoldVertical,
    title: "Preklopite glasački listić",
    description: "Pažljivo preklopite listić kako je pokazano",
  },
  {
    icon: ScanLine,
    title: "Ubacite listić u skener",
    description: "Stavite preklopljeni listić u otvor skenera",
  },
];

const warnings = [
  "Označite SAMO JEDNOG kandidata",
  "Koristite samo plavu hemijsku olovku",
  "Ne savijajte ili oštećujte listić",
];

export function InstructionScreen({ onContinue }: InstructionScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center min-h-screen bg-background px-12 py-8"
    >
      <div className="max-w-5xl w-full space-y-10">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold text-center text-foreground"
          data-testid="text-instruction-title"
        >
          UPUTSTVO ZA GLASANJE
        </motion.h1>

        <div className="space-y-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.15 }}
              data-testid={`instruction-step-${index}`}
            >
              <Card className="p-8 border-2 hover-elevate">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center" data-testid={`step-number-${index}`}>
                      <span className="text-2xl font-bold text-primary-foreground">
                        {index + 1}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <step.icon className="w-8 h-8 text-primary" />
                      <h3 className="text-2xl font-semibold text-foreground" data-testid={`step-title-${index}`}>
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-xl text-muted-foreground" data-testid={`step-description-${index}`}>
                      {step.description}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          data-testid="warning-section"
        >
          <Card className="p-8 border-l-4 border-l-destructive bg-destructive/5">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-10 h-10 text-destructive flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-foreground mb-4" data-testid="warning-title">VAŽNO:</h3>
                <ul className="space-y-3">
                  {warnings.map((warning, index) => (
                    <li key={index} className="flex items-center gap-3 text-xl text-foreground" data-testid={`warning-${index}`}>
                      <div className="w-2 h-2 rounded-full bg-destructive" />
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex justify-center pt-6"
        >
          <Button
            size="lg"
            onClick={onContinue}
            className="h-20 px-20 text-2xl font-semibold min-w-[280px]"
            data-testid="button-continue"
          >
            RAZUMIJEM
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
