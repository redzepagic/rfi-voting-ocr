import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";

interface ScannerScreenProps {
  onInsert: () => void;
  onCancel: () => void;
}

export function ScannerScreen({ onInsert, onCancel }: ScannerScreenProps) {
  const arrows = [0, 0.2, 0.4, 0.6, 0.8];

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center min-h-screen bg-background px-12 py-8"
    >
      <div className="max-w-4xl w-full space-y-12">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold text-center text-foreground"
          data-testid="text-scanner-ready-title"
        >
          SKENER JE SPREMAN
        </motion.h1>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center"
        >
          <div className="flex justify-center gap-4 mb-4">
            {arrows.map((delay, index) => (
              <motion.div
                key={index}
                animate={{
                  y: [0, 12, 0],
                  opacity: [1, 0.4, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: delay,
                  ease: "easeInOut",
                }}
              >
                <ChevronDown className="w-10 h-10 text-primary" strokeWidth={3} />
              </motion.div>
            ))}
          </div>

          <Card className="w-full max-w-2xl border-4 border-dashed border-primary min-h-60 flex items-center justify-center p-8 bg-card/50">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto border-4 border-primary rounded-lg flex items-center justify-center">
                <ChevronDown className="w-12 h-12 text-primary" strokeWidth={2} />
              </div>
              <p className="text-3xl font-bold text-foreground">
                UBACITE LISTIĆ
              </p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center space-y-8"
        >
          <p className="text-xl text-muted-foreground">
            Pažljivo ubacite glasački listić u označeni otvor
          </p>

          <div className="flex justify-center gap-6">
            <Button
              size="lg"
              onClick={onInsert}
              className="h-16 px-16 text-xl font-semibold min-w-[240px]"
              data-testid="button-insert-ballot"
            >
              SIMULIRAJ UBACIVANJE
            </Button>
          </div>

          <Button
            variant="ghost"
            onClick={onCancel}
            className="text-destructive hover:text-destructive text-lg h-14"
            data-testid="button-cancel-voting"
          >
            OTKAŽI GLASANJE
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
